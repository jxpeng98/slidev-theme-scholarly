import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { chromium } from 'playwright-chromium'
import { createServer, parser, resolveOptions } from '@slidev/cli'

const root = path.resolve(import.meta.dirname, '..')
const output = process.env.SCHOLARLY_CONTENT_CHECK_OUT || path.join(tmpdir(), 'scholarly-content-check')
const cli = createRequire(import.meta.url).resolve('@slidev/cli/bin/slidev.mjs')
const source = await readFile(path.join(root, 'examples/example-academic.md'), 'utf8')
const slides = (await parser.parse(source)).slides
assert.equal(slides.length, 13, 'preserve the model talk narrative')
const targets = ['result-highlight', 'experiment-grid', 'references'].map(layout => {
  const index = slides.findIndex(slide => slide.frontmatter.layout === layout)
  assert.ok(index >= 0, `Missing example layout: ${layout}`)
  return { layout, number: index + 1, title: slides[index].frontmatter.title || layout }
})

// Limit geometry checks to these evidence layouts; scrollable editors and tables
// elsewhere in the product have different capacity rules.
function contentOverflows(root) {
  const canvas = root.getBoundingClientRect()
  const scale = canvas.width / root.offsetWidth
  const header = root.querySelector('.beamer-header')?.getBoundingClientRect()
  const footer = root.querySelector('.beamer-footer')?.getBoundingClientRect()
  const failures = []
  for (const element of root.querySelectorAll('main *, .references-content *')) {
    if (!element.textContent.trim() || getComputedStyle(element).visibility === 'hidden') continue
    const rect = element.getBoundingClientRect()
    if (!rect.width || !rect.height) continue
    let left = canvas.left, right = canvas.right
    let top = header?.bottom ?? canvas.top, bottom = footer?.top ?? canvas.bottom
    for (let parent = element.parentElement; parent && parent !== root; parent = parent.parentElement) {
      const style = getComputedStyle(parent)
      const bounds = parent.getBoundingClientRect()
      // Card/section bounds are also presentation boundaries: overflow must not
      // cover an adjacent card even when CSS overflow is visible.
      if (/auto|scroll|hidden|clip/.test(style.overflow) || parent.matches('section, article')) {
        left = Math.max(left, bounds.left + parent.clientLeft * scale)
        right = Math.min(right, bounds.left + (parent.clientLeft + parent.clientWidth) * scale)
        top = Math.max(top, bounds.top + parent.clientTop * scale)
        bottom = Math.min(bottom, bounds.top + (parent.clientTop + parent.clientHeight) * scale)
      }
    }
    const overflow = Math.max(left - rect.left, rect.right - right, top - rect.top, rect.bottom - bottom) / scale
    if (overflow > 1) failures.push({
      element: element.className || element.tagName.toLowerCase(),
      text: element.textContent.trim().slice(0, 70),
      overflow: Math.round(overflow * 10) / 10,
    })
  }
  return failures
}

await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
try {
  for (const ratio of ['16/9', '4/3']) {
    for (const mode of ['light', 'dark']) {
      const id = `${ratio.replace('/', '-')}-${mode}`
      const entry = path.join(root, 'examples', `.content-check-${randomUUID()}.md`)
      let server
      try {
        await writeFile(entry, source.replace('aspectRatio: 16/9', `aspectRatio: ${ratio}`)
          .replace('contentMode: light', `contentMode: ${mode}`))
        const options = await resolveOptions({ entry }, 'dev')
        server = await createServer(options, { server: { port: 0 }, clearScreen: false })
        await server.listen()
        const port = server.httpServer.address().port
        const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
        // Headless sessions cannot keep a physical display awake. Use Slidev's
        // existing preference instead of ignoring unrelated browser errors.
        await page.addInitScript(() => localStorage.setItem('slidev-wake-lock', 'false'))
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        for (const target of targets) {
          for (const print of [false, true]) {
            await page.goto(`http://localhost:${port}/${target.number}?clicks=999${print ? '&print=true' : ''}`)
            const slide = page.locator(`.slidev-page-${target.number} .${target.layout}`)
            await slide.waitFor()
            await page.evaluate(async () => {
              await document.fonts.ready
              await Promise.all([...document.images].map(image => image.decode()))
              await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
            })
            const failures = await slide.evaluate(contentOverflows)
            assert.deepEqual(failures, [], `${id} / ${target.title} / ${print ? 'print' : 'play'}: reduce content or split the slide. ${JSON.stringify(failures)}`)
            if (target.layout === 'references') {
              assert.equal(await slide.locator('.csl-entry').count(), 2, 'bibliography must contain both cited works')
              assert.match(await slide.locator('#ref-lecun2015deep').innerText(), /Deep Learning/)
              assert.match(await slide.locator('#ref-vaswani2017attention').innerText(), /Attention Is All You Need/)
            }
            await slide.screenshot({ path: path.join(output, `${id}-${target.layout}-${print ? 'print' : 'play'}.png`) })
            if (!print && target.layout === 'experiment-grid') {
              assert.equal(await slide.locator('article').count(), 4)
              // Prove the same check rejects oversized author content, rather
              // than merely accepting a successful render/export process.
              await slide.locator('dd').first().evaluate(element => { element.textContent = 'Oversized experiment note. '.repeat(150) })
              const excess = await slide.evaluate(contentOverflows)
              assert.ok(excess.some(item => item.overflow > 1), 'oversized content must produce a located diagnostic')
              console.log(`${id}: overflow negative control detected ${excess[0].element}, ${excess[0].overflow}px; reduce content or split the slide.`)
            }
          }
        }
        for (const key of ['lecun2015deep', 'vaswani2017attention']) {
          const citingPage = slides.findIndex(slide => slide.content.includes(`@${key}`)) + 1
          assert.ok(citingPage > 0, `missing narrative citation: ${key}`)
          await page.goto(`http://localhost:${port}/${citingPage}`)
          await page.locator(`.slidev-page-${citingPage} a[href="#ref-${key}"]`).click()
          const bibliographyPage = targets.find(target => target.layout === 'references').number
          await page.waitForURL(url => url.pathname === `/${bibliographyPage}`)
          await page.locator(`.slidev-page-${bibliographyPage} #ref-${key}`).waitFor({ state: 'visible' })
        }
        assert.deepEqual(errors, [], `${id}: browser errors`)
        await page.close()
        await server.close()
        server = undefined
        for (const format of ['png', 'pdf']) {
          const destination = path.join(output, `${id}-export${format === 'pdf' ? '.pdf' : ''}`)
          if (format === 'png') await rm(destination, { recursive: true, force: true })
          const { stdout, stderr } = await promisify(execFile)(process.execPath, [cli, 'export', entry,
            '--format', format, '--range', targets.map(target => target.number).join(','),
            '--output', destination, '--wait', '300'], { cwd: root, timeout: 120000 })
          await writeFile(path.join(output, `${id}-${format}.log`), stdout + stderr)
        }
        console.log(`${id}: playback, print geometry, PNG and PDF exports passed.`)
      } finally {
        await server?.close()
        await rm(entry, { force: true })
      }
    }
  }
} finally {
  await browser.close()
}
console.log(`Research content checks passed. Evidence: ${output}`)
