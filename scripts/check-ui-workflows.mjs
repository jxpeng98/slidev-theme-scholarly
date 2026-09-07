import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
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
for (const id of Object.keys(LAYOUT_CATALOG))
  assets.set(`/previews/${id}.png`, [`../vscode-extension/media/previews/layouts/${id}.png`, 'image/png'])

// Representative host tokens; native VS Code theme checks remain a separate
// acceptance step. The actual Webview and packaged previews are used below.
function hostTheme(dark) {
  const tokens = {
    'editor-background': dark ? '#1f1f1f' : '#ffffff',
    'editor-foreground': dark ? '#cccccc' : '#333333',
    'sideBar-background': dark ? '#181818' : '#f8f8f8',
    'editorWidget-background': dark ? '#252526' : '#f3f3f3',
    'descriptionForeground': dark ? '#a8a8a8' : '#616161',
    'panel-border': dark ? '#454545' : '#d4d4d4',
    'focusBorder': dark ? '#007fd4' : '#005fb8',
    'button-background': dark ? '#0078d4' : '#005fb8',
    'button-foreground': '#ffffff',
    'button-secondaryBackground': dark ? '#3a3d41' : '#e5e5e5',
    'input-background': dark ? '#313131' : '#ffffff',
    'list-hoverBackground': dark ? '#2a2d2e' : '#e8e8e8',
    'list-activeSelectionBackground': dark ? '#094771' : '#cce8ff',
    'list-activeSelectionForeground': dark ? '#ffffff' : '#003b66',
    'textLink-foreground': dark ? '#4daafc' : '#005fb8',
    'textCodeBlock-background': dark ? '#252526' : '#f3f3f3',
    'badge-background': dark ? '#4d4d4d' : '#e5e5e5',
    'badge-foreground': dark ? '#ffffff' : '#333333',
    'errorForeground': dark ? '#f48771' : '#a1260d',
  }
  return `<style nonce="ui-check">:root {${Object.entries(tokens).map(([key, value]) => `--vscode-${key}:${value};`).join('')}}</style>`
}
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
        id, ...entry, description: entry.summary, image: `/previews/${id}.png`,
      })),
      templates: BUILDER_TEMPLATES,
      colorThemes: COLOR_THEMES, fontThemes: FONT_THEMES,
      contentModes: CONTENT_MODES, surfaceModes: SURFACE_MODES,
    }).replace('<script nonce="ui-check" src=', hostMock + '<script nonce="ui-check" src=')
      .replace('</head>', hostTheme(url.searchParams.get('theme') === 'dark') + '</head>')
      .replace('<body>', `<body class="vscode-${url.searchParams.get('theme') === 'dark' ? 'dark' : 'light'}">`)
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
  const output = process.env.SCHOLARLY_UI_CHECK_OUT || path.join(tmpdir(), 'scholarly-ui-check')
  await mkdir(output, { recursive: true })
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  let acceptDialogs = true
  page.on('dialog', dialog => acceptDialogs ? dialog.accept() : dialog.dismiss())
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  for (const lang of ['en', 'zh-cn']) {
   for (const theme of ['light', 'dark']) {
    for (const [width, height] of [[1280, 800], [980, 800], [1024, 576], [700, 800], [520, 800]]) {
    await page.setViewportSize({ width, height })
    await page.goto(`http://127.0.0.1:${server.address().port}/?lang=${lang}&theme=${theme}`)
    await page.locator('#slide-title').waitFor()
    await page.locator('#selected-layout-image').evaluate(image => image.decode())
    await page.screenshot({ path: path.join(output, `builder-${lang}-${theme}-${width}.png`) })
    const geometry = await page.evaluate(() => ({
      width: innerWidth, height: innerHeight, contentWidth: document.documentElement.scrollWidth,
      fields: ['slide-title', 'slide-body', 'create-markdown'].map(id => {
        const rect = document.getElementById(id).getBoundingClientRect()
        return { id, top: rect.top, left: rect.left, right: rect.right }
      }),
    }))
    assert.ok(geometry.contentWidth <= width + 1, `horizontal overflow: ${JSON.stringify(geometry)}`)
    for (const field of geometry.fields)
      assert.ok(field.top >= 0 && field.top < height - 24 && field.left >= 0 && field.right <= width + 1,
        `editing must start in the viewport: ${JSON.stringify(geometry)}`)
    console.log(`${lang}/${theme}/${width}x${height}: editor and actions in view, no horizontal overflow`)
    }
   }
  }
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('builder-state')))
  const selected = async () => {
    const value = await saved()
    return value.state.slides.find(slide => slide.id === value.selectedId)
  }

  await page.locator('.deck-settings').evaluate(element => { element.open = true })
  await page.locator('#slide-body').fill('Author\n\nInstitution\n\nFunding')
  await page.locator('#deck-subtitle').fill('Updated subtitle')
  assert.equal((await selected()).body, 'Author\n\nInstitution\n\nFunding', 'subtitle changes must preserve custom cover content')
  await page.locator('[data-layout-id="result-highlight"]').click()
  await page.locator('#slide-title').fill('One title source')
  assert.equal(await page.locator('[data-config-name="title"]').count(), 0)
  assert.match(renderBuilderSlides([await selected()]), /title: One title source/)
  await page.locator('[data-layout-id="toc"]').click()
  await page.locator('#layout-settings').evaluate(element => { element.open = true })
  await page.locator('[data-title-visibility]').selectOption('hide')
  assert.match(renderBuilderSlides([await selected()]), /title: false/)
  await page.locator('#slide-title').fill('Hidden title remains available')
  assert.match(renderBuilderSlides([await selected()]), /title: false/)
  await page.locator('[data-title-visibility]').selectOption('show')
  assert.match(renderBuilderSlides([await selected()]), /title: Hidden title remains available/)

  await page.evaluate(() => localStorage.clear())
  await page.reload()

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
  assert.equal(await page.locator('#deck-title').getAttribute('aria-invalid'), 'true')
  assert.equal(await page.locator('#deck-title').getAttribute('aria-describedby'), 'deck-title-error')
  // The transient status message expires; the actionable field error must stay.
  await page.waitForTimeout(7100)
  assert.equal(await page.locator('#deck-title-error').isVisible(), true)
  assert.match(await page.locator('#deck-title-error').innerText(), /presentation title/)
  await page.locator('#deck-title').fill('Validated deck')
  assert.equal(await page.locator('#deck-title').getAttribute('aria-invalid'), 'false')
  assert.equal(await page.locator('#deck-title-error').isVisible(), false)
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

  // Continuous keyboard work must survive DOM replacement in the outline.
  await page.evaluate(() => localStorage.removeItem('builder-state'))
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  const activeSlide = () => page.evaluate(() => document.activeElement.closest('[data-slide-id]')?.dataset.slideId)
  const secondId = await page.locator('.slide-item').nth(1).getAttribute('data-slide-id')
  await page.locator('.slide-item').nth(1).focus()
  for (const key of ['Enter', 'Space']) {
    await page.keyboard.press(key)
    assert.equal((await selected()).id, secondId)
    assert.equal(await activeSlide(), secondId)
  }
  await page.locator(`[data-slide-id="${secondId}"] [data-action="up"]`).focus()
  await page.keyboard.press('Enter')
  assert.equal(await page.locator('.slide-item').first().getAttribute('data-slide-id'), secondId)
  assert.equal(await activeSlide(), secondId, 'focus remains on the moved page at the boundary')
  await page.locator(`[data-slide-id="${secondId}"] [data-action="down"]`).focus()
  await page.keyboard.press('Space')
  assert.equal(await page.locator('.slide-item').nth(1).getAttribute('data-slide-id'), secondId)
  assert.equal(await activeSlide(), secondId)
  await page.locator(`[data-slide-id="${secondId}"] [data-action="delete"]`).focus()
  await page.keyboard.press('Enter')
  assert.equal(await activeSlide(), (await selected()).id, 'deletion focuses the adjacent page')
  while (await page.locator('.slide-item').count()) {
    await page.locator('.slide-item').last().locator('[data-action="delete"]').focus()
    await page.keyboard.press('Enter')
  }
  assert.equal(await page.evaluate(() => document.activeElement.id), 'layout-search')
  assert.equal(await page.locator('#layout-library').getAttribute('open'), '')

  const beforeCancel = await saved()
  await page.locator('input[name="workflow"]:checked').focus()
  acceptDialogs = false
  await page.keyboard.press('ArrowRight')
  assert.deepEqual(await saved(), beforeCancel, 'canceling workflow replacement preserves the deck')
  assert.equal(await page.evaluate(() => document.activeElement.value), beforeCancel.state.templateId)
  acceptDialogs = true
  await page.keyboard.press('ArrowRight')
  assert.notEqual((await saved()).state.templateId, beforeCancel.state.templateId)
  assert.equal(await page.evaluate(() => document.activeElement.checked), true)
  await page.keyboard.press('Tab')
  assert.notEqual(await page.evaluate(() => document.activeElement.getAttribute('name')), 'workflow', 'radio group takes one Tab stop')
  await page.keyboard.press('Shift+Tab')
  assert.equal(await page.evaluate(() => document.activeElement.checked), true)

  for (const [width, height] of [[1024, 576], [520, 800]]) {
    await page.setViewportSize({ width, height })
    await page.reload()
    await page.locator('#layout-library > summary').click()
    await page.locator('[data-layout-id="default"]').click()
    assert.equal(await page.locator('#layout-library').getAttribute('open'), null)
    assert.equal(await page.evaluate(() => document.activeElement.id), 'slide-title')
    await page.locator('#slide-title').fill('Narrow view draft')
    await page.locator('#slide-body').fill('Preserved after a narrow-view reload')
    const added = await selected()
    await page.reload()
    assert.equal((await selected()).id, added.id)
    assert.equal(await page.locator('#slide-body').inputValue(), added.body)
    if (width <= 700) await page.locator('#outline-panel > summary').click()
    await page.locator('.slide-copy').first().click()
    await page.locator(`[data-slide-id="${added.id}"] [data-action="delete"]`).click()
    assert.equal(await activeSlide(), (await selected()).id)
    const visible = await page.evaluate(() => ['slide-title', 'slide-body', 'create-markdown'].every(id => {
      const r = document.getElementById(id).getBoundingClientRect()
      return r.top >= 0 && r.top < innerHeight - 24 && r.left >= 0 && r.right <= innerWidth
    }))
    assert.ok(visible, `${width}: editing remains reachable after adding, restoring, selecting and deleting`)
    assert.ok(await page.locator('#outline-panel > summary').evaluate(element => {
      const r = element.getBoundingClientRect(), pane = element.parentElement.getBoundingClientRect()
      return r.top >= pane.top - 1 && r.bottom <= pane.bottom + 1
    }), 'outline toggle stays reachable while scrolling the page list')
    await page.screenshot({ path: path.join(output, `builder-narrow-workflow-${width}.png`) })
  }
  assert.deepEqual(errors, [], 'no unhandled browser errors')
  console.log('Builder browser checks passed: responsive views, keyboard focus, native workflow radios, drafts, persistence, validation and bilingual feedback.')
} finally {
  await browser?.close()
  await new Promise(resolve => server.close(resolve))
}
