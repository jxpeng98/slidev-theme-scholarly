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
      for (const route of ['guide/quick-start', 'guide/themes', 'guide/vscode-extension', 'guide/data-driven', 'components/cite', 'layouts/academic']) {
        for (const width of [390, 1280]) {
          await page.setViewportSize({ width, height: 900 })
          await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${lang}/${route}`)
          await page.locator('.VPDoc h1').waitFor()
          await page.evaluate(() => document.fonts.ready)
          const contentWidth = await page.evaluate(() => document.documentElement.scrollWidth)
          assert.ok(contentWidth <= width + 1, `${lang}/${route}: page overflows at ${width}px (${contentWidth})`)
          assert.equal(await page.locator('.VPDoc h1').count(), 1, `${route}: one page title`)
          if (route === 'guide/themes') {
            await page.locator('.theme-gallery').scrollIntoViewIfNeeded()
            const images = page.locator('.theme-gallery img')
            assert.equal(await images.count(), 36, 'all nine palette previews remain available')
            await images.first().evaluate(image => image.decode())
          }
          await page.screenshot({ path: path.join(output, `docs-${lang}-${theme}-${route.replaceAll('/', '-')}-${width}.png`) })
          if (width === 390 && route === 'guide/quick-start') {
            const menu = page.locator('.VPLocalNav .menu')
            await menu.click()
            assert.equal(await menu.getAttribute('aria-expanded'), 'true', 'mobile documentation menu opens')
            const link = page.locator(`.VPSidebar a[href="/${lang}/guide/data-driven"]`)
            await link.click()
            await page.waitForURL(`**/${lang}/guide/data-driven`)
            await page.waitForFunction(() => document.querySelector('.VPLocalNav .menu')?.getAttribute('aria-expanded') === 'false')
            assert.equal(await menu.getAttribute('aria-expanded'), 'false', 'choosing a guide closes the mobile menu')
          }
          console.log(`${lang}/${theme}/${route}/${width}: content fits; navigation and previews checked`)
        }
      }
      await page.locator('.VPNavBarSearch button').click()
      const search = page.locator('#localsearch-input')
      await search.fill('parseCsvTable')
      await page.locator(`.VPLocalSearchBox a[href^="/${lang}/guide/data-driven"]`).first().waitFor()
      assert.equal(await search.getAttribute('placeholder'), lang === 'zh' ? '搜索文档' : 'Search')
      await page.keyboard.press('Escape')
      console.log(`${lang}/${theme}: search finds the localized data guide`)
    }
  }
  assert.deepEqual(errors, [], 'no documentation browser errors')
} finally {
  await browser?.close()
  await server.close()
}
