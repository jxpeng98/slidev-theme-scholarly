import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { chromium } from 'playwright-chromium'
import { createServer, resolveOptions } from '@slidev/cli'
import { renderBuilderMarkdown } from '../vscode-extension/out/guiBuilderModel.js'

const root = path.resolve(import.meta.dirname, '..')
const output = process.env.SCHOLARLY_CONTENT_CHECK_OUT || path.join(tmpdir(), 'scholarly-content-check')
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
try {
  for (const title of [undefined, 'Custom outline', false]) {
    const id = title === undefined ? 'default' : title === false ? 'hidden' : 'custom'
    const entry = path.join(root, 'examples', `.toc-check-${randomUUID()}.md`)
    const outline = value => ({ layout: 'toc', heading: false, config: { title: value, sections: ['Introduction', 'Results'] } })
    const state = { title: 'Research deck', slides: [outline(title), outline(undefined), outline('Agenda'), outline(false)] }
    let server
    try {
      await writeFile(entry, renderBuilderMarkdown(state).replace('theme: scholarly', 'theme: ../'))
      const options = await resolveOptions({ entry }, 'dev')
      assert.equal(options.data.slides.length, 4)
      assert.equal(typeof options.data.config.title, 'string')
      server = await createServer(options, { server: { port: 0 }, clearScreen: false })
      await server.listen()
      const page = await browser.newPage()
      await page.addInitScript(() => localStorage.setItem('slidev-wake-lock', 'false'))
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      for (const [index, expected] of [title ?? 'Outline', 'Outline', 'Agenda', false].entries()) {
        await page.goto(`http://localhost:${server.httpServer.address().port}/${index + 1}`)
        const slide = page.locator(`.slidev-page-${index + 1} .toc`)
        await slide.waitFor()
        await page.evaluate(() => document.fonts.ready)
        assert.equal(await slide.locator('.toc-section-title').count(), 2)
        assert.equal(await slide.locator('.toc-number').count(), 2, 'numbering defaults to true')
        assert.equal(await slide.locator('.is-inactive').count(), 0, 'do not dim the entire outline when no section is active')
        if (expected === false) assert.equal(await slide.locator('.toc-title').count(), 0)
        else assert.equal(await slide.locator('.toc-title').innerText(), expected)
        assert.match(await page.title(), /Research deck/)
        await slide.screenshot({ path: path.join(output, `toc-${id}-${index + 1}.png`) })
      }
      assert.deepEqual(errors, [])
      await page.close()
      await server.close()
      server = undefined
      if (title === false) {
        const cli = createRequire(import.meta.url).resolve('@slidev/cli/bin/slidev.mjs')
        for (const format of ['png', 'pdf']) {
          const destination = path.join(output, `toc-hidden-export${format === 'pdf' ? '.pdf' : ''}`)
          await rm(destination, { recursive: true, force: true })
          const { stdout, stderr } = await promisify(execFile)(process.execPath, [cli, 'export', entry,
            '--format', format, '--output', destination, '--wait', '300'], { cwd: root, timeout: 120000 })
          await writeFile(path.join(output, `toc-hidden-${format}.log`), stdout + stderr)
        }
      }
      console.log(`TOC ${id}: first-page and later-page titles passed; no extra page or browser error.`)
    } finally {
      await server?.close()
      await rm(entry, { force: true })
    }
  }
} finally {
  await browser.close()
}
