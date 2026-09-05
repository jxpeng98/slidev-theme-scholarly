import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright-chromium'
import { renderGuiBuilderHtml } from '../vscode-extension/out/guiBuilderView.js'
import { renderBuilderMarkdown, renderBuilderSlides } from '../vscode-extension/out/guiBuilderModel.js'
import {
  BUILDER_TEMPLATES, LAYOUT_CATALOG, COLOR_THEMES, FONT_THEMES, CONTENT_MODES, SURFACE_MODES,
} from '../vscode-extension/out/sharedData.js'

const assets = new Map([
  ['/guiBuilderValidation.js', ['../vscode-extension/out/guiBuilderValidation.js', 'text/javascript']],
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
      validationScriptUri: '/guiBuilderValidation.js',
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

  // Insertion is scoped to the selected page, even with an unfinished deck title
  // and another page whose images are invalid.
  const messages = () => page.evaluate(() => window.__messages)
  await page.evaluate(() => { window.__messages = [] })
  await page.locator('#insert-selected').click()
  const insertion = (await messages()).find(message => message.type === 'insertSelectedSlide')
  assert.ok(insertion, 'a valid selected page can be inserted independently')
  assert.equal(insertion.state.slides.length, 1)
  assert.equal(insertion.state.slides[0].id, configured.id)
  assert.doesNotThrow(() => renderBuilderSlides(insertion.state.slides, insertion.state.lang))

  await page.locator('#create-markdown').click()
  assert.equal(await page.locator('.deck-settings').getAttribute('open'), '')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'deck-title')
  await page.locator('#deck-title').fill('Validated deck')
  await page.locator('#create-markdown').click()
  assert.equal((await selected()).id, original.id, 'whole-deck validation selects the invalid page')
  assert.equal(await page.evaluate(() => document.activeElement.dataset.configName), 'images')
  assert.ok(!(await messages()).some(message => message.type === 'generateNewDocument'))
  for (const input of ['{}', 'null', '["a.png", 2]', '["unfinished"', '[]']) {
    await page.locator('[data-config-name="images"]').fill(input)
    assert.equal(await page.locator('[data-config-name="images"]').getAttribute('aria-invalid'), 'true')
    assert.ok(await page.locator('#config-error-images').isVisible())
    await page.evaluate(() => { window.__messages = [] })
    await page.locator('#insert-selected').click()
    assert.ok(!(await messages()).some(message => message.type === 'insertSelectedSlide'))
    assert.equal(await page.locator('[data-config-name="images"]').inputValue(), input)
  }
  await page.waitForFunction(() => document.querySelector('#markdown-preview').textContent.includes('required'))
  assert.ok(!(await messages()).some(message => message.type === 'previewSelectedSlide'))
  await page.locator('[data-config-name="images"]').fill('["a.png", "b.png"]')
  assert.equal(await page.locator('[data-config-name="images"]').getAttribute('aria-invalid'), 'false')
  await page.locator('#insert-selected').click()
  const validInsertion = (await messages()).find(message => message.type === 'insertSelectedSlide')
  assert.ok(validInsertion)
  assert.doesNotThrow(() => renderBuilderSlides(validInsertion.state.slides))
  await page.locator('#create-markdown').click()
  const fullDeck = (await messages()).find(message => message.type === 'generateNewDocument')
  assert.ok(fullDeck)
  assert.doesNotThrow(() => renderBuilderMarkdown(fullDeck.state))
  await page.goto(`http://127.0.0.1:${server.address().port}/?lang=zh-cn`)
  await page.locator('#layout-settings').evaluate(element => { element.open = true })
  await page.locator('[data-config-name="images"]').fill('{}')
  assert.match(await page.locator('#config-error-images').textContent(), /只包含文本/)
  assert.deepEqual(errors, [], 'no unhandled browser errors')
  console.log('Builder browser checks passed: drafts, persistence, scoped insertion, whole-deck validation, errors and bilingual feedback.')
} finally {
  await browser?.close()
  await new Promise(resolve => server.close(resolve))
}
