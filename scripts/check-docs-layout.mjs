import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { createServer } from 'vitepress'
import { chromium } from 'playwright-chromium'

const output = process.env.SCHOLARLY_UI_CHECK_OUT || path.join(tmpdir(), 'scholarly-ui-check')
await mkdir(output, { recursive: true })
const server = await createServer(path.resolve(import.meta.dirname, '../docs'), { port: 0, host: '127.0.0.1', base: '/' })
let browser
try {
  await server.listen()
  browser = await chromium.launch()
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const lang of ['en', 'zh']) {
    for (const theme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: theme })
      for (const width of [390, 960, 1024, 1152, 1200]) {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
        await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${lang}/`)
        await page.locator('.VPHomeHero .image-src').evaluate(image => image.decode())
        await page.evaluate(() => document.fonts.ready)
        await page.evaluate(async () => {
          window.scrollTo(0, 0)
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        })
        await page.screenshot({ path: path.join(output, `docs-${lang}-${theme}-${width}.png`) })
        const geometry = await page.evaluate(() => {
          const image = document.querySelector('.VPHomeHero .image-src').getBoundingClientRect()
          const column = document.querySelector('.VPHomeHero .image').getBoundingClientRect()
          return { width: innerWidth, content: document.documentElement.scrollWidth,
            imageLeft: image.left, imageRight: image.right, columnLeft: column.left, columnRight: column.right,
            imageTop: image.top, navBottom: document.querySelector('.VPNav').getBoundingClientRect().bottom }
        })
        assert.ok(geometry.content <= width + 1, `document overflow: ${JSON.stringify(geometry)}`)
        assert.ok(geometry.imageLeft >= -1 && geometry.imageRight <= width + 1, `hero outside viewport: ${JSON.stringify(geometry)}`)
        assert.ok(geometry.imageTop >= geometry.navBottom - 1, `navigation covers the hero: ${JSON.stringify(geometry)}`)
        if (width >= 960) assert.ok(geometry.imageLeft >= geometry.columnLeft - 1 && geometry.imageRight <= geometry.columnRight + 1,
          `hero exceeds its column: ${JSON.stringify(geometry)}`)
        console.log(`${lang}/${theme}/${width}: hero fits its column; no horizontal overflow`)
      }
    }
  }
  assert.deepEqual(errors, [], 'no documentation browser errors')
} finally {
  await browser?.close()
  await server.close()
}
