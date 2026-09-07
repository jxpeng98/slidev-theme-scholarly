import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createRequire } from 'node:module'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { createServer, resolveOptions } from '@slidev/cli'
import { chromium } from 'playwright-chromium'
const root = process.cwd()
const out = process.env.SCHOLARLY_LAYOUT_CONTEXT_OUT || path.join(root, 'artifacts/layout-context-check')
const entry = path.join(root, 'examples/.layout-context-check.md')
const headers = ['results', 'methodology', 'split-image', 'agenda', 'timeline', 'acknowledgments']
const source = `---
theme: ..
title: Review
aspectRatio: 16/9
fonts:
  sans: Arial
  serif: Arial
  mono: monospace
  provider: none
themeConfig:
  colorTheme: classic-blue
  contentMode: light
  sectionMode: dark
---
# Review
` + headers.map(layout => `\n---\nlayout: ${layout}\ntitle: ${layout} title\nsubtitle: Subtitle evidence\n${layout === "split-image" ? "images: []\n" : ""}---\n\nShort body.\n`).join('') + `
---
layout: section
sectionMode: light
---

# Local light section

---
layout: default
title: Single column metrics
---

<MetricGrid :columns="1" :metrics="[{label: 'Accuracy', value: 94}, {label: 'Recall', value: 91}]" />

`
let server, browser
try {
  await mkdir(out, {recursive:true})
  await writeFile(entry, source)
  server = await createServer(await resolveOptions({ entry }, 'dev'), { server: { port: 0 }, clearScreen: false })
  await server.listen()
  const base = `http://localhost:${server.httpServer.address().port}`
  browser = await chromium.launch({headless:true})
  const page = await browser.newPage({viewport:{width:1280,height:800}})
  const errors=[]
  page.on('pageerror', e=>errors.push(e.message))
  await page.addInitScript(()=>localStorage.setItem('slidev-wake-lock','false'))
  const results=[]
  for (let i=0;i<headers.length;i++) {
    await page.goto(`${base}/${i+2}`)
    const el=page.locator(`.slidev-page-${i+2} .${headers[i]}`)
    await el.waitFor()
    assert.equal(await el.locator('.header-container').count(), 1, `${headers[i]}: header must render`)
    assert.match(await el.locator('.header-title').innerText(), new RegExp(headers[i]))
    assert.equal(await el.locator('.header-subtitle').innerText(), 'Subtitle evidence')
    for (const long of [false, true]) {
      if (long) await el.locator('.header-title').evaluate(node => { node.textContent = 'Long research title with context and evidence. '.repeat(4) })
      const bounds = await el.evaluate(node => {
        const header = node.querySelector('.header-container').getBoundingClientRect()
        const main = node.querySelector(':scope > .flex-grow').getBoundingClientRect()
        return {header: header.bottom, main: main.top}
      })
      assert.ok(bounds.main >= bounds.header - 1, `${headers[i]}: body must stay below the header: ${JSON.stringify(bounds)}`)
      if (!long) await el.screenshot({path:path.join(out, `${headers[i]}.png`)})
    }
    results.push({layout:headers[i], header:true, contentBelowHeader:true})
  }
  await page.goto(`${base}/8`)
  const section=page.locator('.slidev-page-8 .section')
  await section.waitFor()
  assert.equal(await section.getAttribute('data-section-mode'), 'light')
  results.push({layout:'section',localMode:'light'})
  await page.screenshot({path:path.join(out,'section-local-light.png'), animations:'disabled'})
  for (const width of [1280,700]) {
    await page.setViewportSize({width,height:800})
    await page.goto(`${base}/9`)
    const grid=page.locator('.slidev-page-9 .scholarly-metric-grid')
    await grid.waitFor()
    assert.equal(await grid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length), 1)
    results.push({layout:'MetricGrid',viewport:width,columns:1})
    await page.screenshot({path:path.join(out,`metric-one-column-${width}.png`), animations:'disabled'})
  }
  assert.deepEqual(errors, [])
  const cli = createRequire(import.meta.url).resolve('@slidev/cli/bin/slidev.mjs')
  const exported = await promisify(execFile)(process.execPath, [cli, 'export', entry, '--range', '2-8', '--format', 'pdf', '--output', path.join(out, 'headers.pdf'), '--wait', '300'], {cwd:root, timeout:120000})
  await writeFile(path.join(out,'export.log'), exported.stdout + exported.stderr)
  console.log(JSON.stringify({results,errors},null,2))
  await writeFile(path.join(out,'browser-results.json'),JSON.stringify({results,errors},null,2))
} finally {await browser?.close(); await server?.close(); await rm(entry,{force:true})}
