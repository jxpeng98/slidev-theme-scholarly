import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright-chromium'
import { renderGuiBuilderHtml } from '../vscode-extension/out/guiBuilderView.js'
import { renderBuilderSlides } from '../vscode-extension/out/guiBuilderModel.js'
import {
  BUILDER_TEMPLATES, LAYOUT_CATALOG, COLOR_THEMES, FONT_THEMES, CONTENT_MODES, SURFACE_MODES,
} from '../vscode-extension/out/sharedData.js'

const assets = new Map([
  ['/guiBuilderWebview.js', ['../vscode-extension/out/guiBuilderWebview.js', 'text/javascript']],
  ['/gui-builder.css', ['../vscode-extension/media/gui-builder.css', 'text/css']],
])
const hostMock = `<script nonce="ui-check">
  window.__messages = [];
  window.acquireVsCodeApi = () => ({
    getState: () => JSON.parse(localStorage.getItem('builder-state') || 'null'),
    setState: state => localStorage.setItem('builder-state', JSON.stringify(state)),
    postMessage: message => window.__messages.push(message)
  });
</script>`

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost')
    const asset = assets.get(url.pathname)
    if (asset) {
      response.setHeader('Content-Type', asset[1])
      response.end(await readFile(new URL(asset[0], import.meta.url)))
      return
    }
    if (url.pathname !== '/') {
      response.writeHead(404).end()
      return
    }
    const html = renderGuiBuilderHtml({
      nonce: 'ui-check', cspSource: "'self'",
      language: url.searchParams.get('lang') === 'zh-cn' ? 'zh-cn' : 'en',
      styleUri: '/gui-builder.css', scriptUri: '/guiBuilderWebview.js',
      layouts: Object.entries(LAYOUT_CATALOG).map(([id, entry]) => ({
        id, ...entry, description: entry.summary,
      })),
      templates: BUILDER_TEMPLATES,
      colorThemes: COLOR_THEMES, fontThemes: FONT_THEMES,
      contentModes: CONTENT_MODES, surfaceModes: SURFACE_MODES,
    }).replace('<script nonce="ui-check" src=', hostMock + '<script nonce="ui-check" src=')
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.end(html)
  } catch (error) {
    response.writeHead(500).end(String(error))
  }
})
await new Promise((resolve, reject) => {
  server.once('error', reject)
  server.listen(0, '127.0.0.1', resolve)
})
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('dialog', dialog => dialog.accept())
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('builder-state')))
  const selected = async () => {
    const value = await saved()
    return value.state.slides.find(slide => slide.id === value.selectedId)
  }

  // Start with a legacy state (templates have no layout cache), then exercise the UI.
  await page.locator('[data-layout-id="two-cols"]').click()
  await page.locator('#slide-title').fill('Preserved title')
  await page.locator('#slide-body').fill('Shared main content')
  await page.locator('[data-slot-name="left"]').fill('Left: first draft')
  await page.locator('[data-slot-name="right"]').fill('Right: first draft')
  await page.locator('#layout-settings > summary').click()
  await page.locator('[data-config-name="ratio"]').fill('1:2')
  const original = await selected()
  await page.locator('#slide-layout').selectOption('default')
  assert.equal(await page.locator('#slide-title').inputValue(), 'Preserved title')
  assert.equal(await page.locator('#slide-body').inputValue(), 'Shared main content')
  assert.doesNotMatch(renderBuilderSlides([await selected()]), /Left: first draft|Right: first draft|ratio:/)
  await page.locator('#slide-body').fill('Shared content edited in default')
  await page.locator('#slide-layout').selectOption('two-cols')
  assert.equal(await page.locator('[data-slot-name="left"]').inputValue(), 'Left: first draft')
  assert.equal(await page.locator('[data-slot-name="right"]').inputValue(), 'Right: first draft')
  assert.equal(await page.locator('[data-config-name="ratio"]').inputValue(), '1:2')
  assert.equal(await page.locator('#slide-body').inputValue(), 'Shared content edited in default')

  await page.locator('[data-slot-name="left"]').fill('Left: second draft')
  await page.locator('#slide-layout').selectOption('split-image')
  await page.locator('[data-config-name="images"]').fill('["unfinished"')
  await page.locator('#slide-layout').selectOption('two-cols')
  assert.equal(await page.locator('[data-slot-name="left"]').inputValue(), 'Left: second draft')
  await page.reload()
  assert.equal((await selected()).id, original.id)
  assert.equal(await page.locator('[data-slot-name="left"]').inputValue(), 'Left: second draft')
  await page.locator('#slide-layout').selectOption('split-image')
  assert.equal(await page.locator('[data-config-name="images"]').inputValue(), '["unfinished"')
  await page.locator('#slide-layout').selectOption('two-cols')

  await page.locator('[data-layout-id="two-cols"]').click()
  await page.locator('[data-slot-name="left"]').fill('Another page')
  await page.locator(`[data-slide-id="${original.id}"] .slide-copy`).click()
  assert.equal(await page.locator('[data-slot-name="left"]').inputValue(), 'Left: second draft')
  for (const input of ['null', '["a", 2]']) {
    await page.locator('#slide-layout').selectOption('split-image')
    await page.locator('#layout-settings').evaluate(element => { element.open = true })
    await page.locator('[data-config-name="images"]').fill(input)
    await page.locator('#slide-layout').selectOption('two-cols')
    await page.locator('#slide-layout').selectOption('split-image')
    assert.equal(await page.locator('[data-config-name="images"]').inputValue(), input)
  }

  const configured = (await saved()).state.slides.find(slide => slide.configSource)
  assert.ok(configured, 'include an original workflow slide with YAML settings')
  await page.locator(`[data-slide-id="${configured.id}"] .slide-copy`).click()
  await page.locator('#slide-layout').selectOption('default')
  await page.locator('#slide-layout').selectOption(configured.layout)
  const restored = await selected()
  for (const key of ['configSource', 'heading', 'titleKey', 'slots'])
    assert.deepEqual(restored[key], configured[key], `restore workflow ${key}`)
  await page.locator('.deck-settings').evaluate(element => { element.open = true })
  await page.locator('#deck-title').fill('')
  await page.reload()
  assert.equal((await saved()).state.title, '', 'preserve an unfinished title across reload')
  assert.deepEqual(errors, [], 'no unhandled browser errors')
  console.log('Builder browser checks passed: layout drafts, isolation, invalid input, persistence and active-layout output.')
} finally {
  await browser?.close()
  await new Promise(resolve => server.close(resolve))
}
