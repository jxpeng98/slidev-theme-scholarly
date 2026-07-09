import { readdir, readFile } from 'node:fs/promises'

const readStyleBearingFiles = async (baseUrl, prefix) => {
  const entries = await readdir(baseUrl, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const childUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, baseUrl)
    const childName = `${prefix}/${entry.name}`

    if (entry.isDirectory()) {
      files.push(...await readStyleBearingFiles(childUrl, childName))
      continue
    }

    if (entry.isFile() && /\.(?:vue|css)$/.test(entry.name))
      files.push({ name: childName, text: await readFile(childUrl, 'utf8') })
  }

  return files
}

const files = {
  block: await readFile(new URL('../components/Block.vue', import.meta.url), 'utf8'),
  footerToc: await readFile(new URL('../components/FooterTocControl.vue', import.meta.url), 'utf8'),
  footerTocPreview: await readFile(new URL('../components/FooterTocPreviewCard.vue', import.meta.url), 'utf8'),
  highlight: await readFile(new URL('../components/Highlight.vue', import.meta.url), 'utf8'),
  theorem: await readFile(new URL('../components/Theorem.vue', import.meta.url), 'utf8'),
  themePreview: await readFile(new URL('../components/ThemePreview.vue', import.meta.url), 'utf8'),
  appendixIndex: await readFile(new URL('../layouts/appendix-index.vue', import.meta.url), 'utf8'),
  experimentGrid: await readFile(new URL('../layouts/experiment-grid.vue', import.meta.url), 'utf8'),
  fact: await readFile(new URL('../layouts/fact.vue', import.meta.url), 'utf8'),
  methodPipeline: await readFile(new URL('../layouts/method-pipeline.vue', import.meta.url), 'utf8'),
  mode: await readFile(new URL('../styles/themes/mode.css', import.meta.url), 'utf8'),
  contentMode: await readFile(new URL('../styles/themes/content-mode.css', import.meta.url), 'utf8'),
  chromeMode: await readFile(new URL('../styles/themes/chrome-mode.css', import.meta.url), 'utf8'),
  sectionMode: await readFile(new URL('../styles/themes/section-mode.css', import.meta.url), 'utf8'),
  layout: await readFile(new URL('../styles/layout.css', import.meta.url), 'utf8'),
}
const themes = JSON.parse(await readFile(new URL('../shared/themes.json', import.meta.url), 'utf8'))

const styleBearingFiles = [
  ...await readStyleBearingFiles(new URL('../components/', import.meta.url), 'components'),
  ...await readStyleBearingFiles(new URL('../layouts/', import.meta.url), 'layouts'),
  ...await readStyleBearingFiles(new URL('../styles/', import.meta.url), 'styles'),
]

const failures = []

const expectContains = (name, text, needle) => {
  if (!text.includes(needle))
    failures.push(`${name} should contain ${needle}`)
}

const expectNotContains = (name, text, needle) => {
  if (text.includes(needle))
    failures.push(`${name} should not contain ${needle}`)
}

const expectNotMatch = (name, text, pattern, description) => {
  if (pattern.test(text))
    failures.push(`${name} should not contain ${description}`)
}

const expectTokenInBlock = (name, block, token) => {
  if (!block.includes(token))
    failures.push(`${name} should define ${token}`)
}

const hexToRgb = (hex) => {
  const normalized = hex.replace(/^#/, '')
  return [0, 2, 4].map(offset => Number.parseInt(normalized.slice(offset, offset + 2), 16))
}

const mixRgb = (foreground, background, foregroundWeight) => foreground.map(
  (channel, index) => channel * foregroundWeight + background[index] * (1 - foregroundWeight),
)

const relativeLuminance = rgb => rgb
  .map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)

const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

const expectContrast = (name, foreground, background, minimum = 4.5) => {
  const ratio = contrastRatio(foreground, background)
  if (ratio < minimum)
    failures.push(`${name} should have at least ${minimum}:1 contrast (received ${ratio.toFixed(2)}:1)`)
}

const expectCssBlockContains = (name, text, selector, needle) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = text.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'))
  if (!match) {
    failures.push(`${name} should contain selector ${selector}`)
    return
  }

  if (!match[1].includes(needle))
    failures.push(`${name} selector ${selector} should contain ${needle}`)
}

const expectCssBlockNotContains = (name, text, selector, needle) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = text.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'))
  if (!match)
    return

  if (match[1].includes(needle))
    failures.push(`${name} selector ${selector} should not contain ${needle}`)
}

const expectRootBlocksDoNotSetSlidevThemeSurface = (name, text) => {
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g
  for (const match of text.matchAll(rulePattern)) {
    const selector = match[1].trim()
    const body = match[2]
    if (!selector.includes(':root'))
      continue

    for (const token of ['--slidev-theme-background', '--slidev-theme-text']) {
      if (body.includes(token))
        failures.push(`${name} root selector should not set ${token}`)
    }
  }
}

const backgroundSurfaceColorTokenPattern = /--scholarly-(?:(?:[\w-]+-)?bg|[\w-]+-surface(?:-muted)?|highlight-[\w-]+-bg|block-[\w-]+-(?:header|content)-bg|theorem-[\w-]+-bg)\b/

const expectNoBackgroundSurfaceColorDeclarations = (name, text) => {
  const declarationPattern = /(^|[;{\n])\s*color\s*:\s*([^;{}]+?)(?=;|}|$)/gm
  for (const match of text.matchAll(declarationPattern)) {
    const value = match[2].trim()
    if (backgroundSurfaceColorTokenPattern.test(value))
      failures.push(`${name} should not use background or surface tokens in color declarations: color: ${value}`)
  }
}

const expectBackgroundSurfaceColorFixture = (name, text, shouldFail) => {
  const before = failures.length
  expectNoBackgroundSurfaceColorDeclarations(name, text)
  const failed = failures.length > before

  if (shouldFail && !failed)
    failures.push(`${name} fixture should catch a background or surface token used as color`)
  if (shouldFail && failed)
    failures.length = before
  if (!shouldFail && failed)
    failures.push(`${name} fixture should allow non-color declarations and foreground tokens`)
}

expectBackgroundSurfaceColorFixture('fixture background-color allowed', '.x{ background-color: var(--scholarly-content-surface); }', false)
expectBackgroundSurfaceColorFixture('fixture same-line forbidden color', '.x{ background: red; color: var(--scholarly-content-surface); }', true)
expectBackgroundSurfaceColorFixture('fixture final forbidden color', '.x{ color: var(--scholarly-content-surface) }', true)
expectBackgroundSurfaceColorFixture('fixture code background token as color', '.x{ color: var(--scholarly-code-bg); }', true)
expectBackgroundSurfaceColorFixture('fixture highlight background token as color', '.x{ color: var(--scholarly-highlight-warning-bg); }', true)
expectBackgroundSurfaceColorFixture('fixture code foreground token as color', '.x{ color: var(--scholarly-code-fg); }', false)

for (const [name, text] of Object.entries({
  block: files.block,
  footerToc: files.footerToc,
  footerTocPreview: files.footerTocPreview,
  highlight: files.highlight,
  theorem: files.theorem,
  themePreview: files.themePreview,
  appendixIndex: files.appendixIndex,
  experimentGrid: files.experimentGrid,
  methodPipeline: files.methodPipeline,
  layout: files.layout,
})) {
  expectNotContains(name, text, ':root.dark')
  expectNotContains(name, text, 'html.dark')
}

for (const { name, text } of styleBearingFiles)
  expectNoBackgroundSurfaceColorDeclarations(name, text)

for (const { name, text } of styleBearingFiles.filter(file => /^(?:components|layouts)\//.test(file.name))) {
  expectNotMatch(
    name,
    text,
    /(^|[;{\n])\s*color\s*:\s*var\(--(?:slidev-theme-primary(?:-light)?|scholarly-text-primary)\b/m,
    'raw palette tokens in text color declarations; use content foreground semantics',
  )
  expectNotMatch(
    name,
    text,
    /--[\w-]+\s*:\s*var\(--(?:slidev-theme-primary(?:-light)?|scholarly-text-primary)\b/m,
    'raw palette aliases; component-local foreground aliases must use content semantics',
  )
}

for (const { name, text } of styleBearingFiles.filter(file => /^layouts\//.test(file.name))) {
  expectNotMatch(
    name,
    text,
    /\b(?:text|bg|border)-(?:gray|slate|black|white)(?:-[0-9]+)?\b/,
    'fixed neutral utility colors; use content surface and foreground tokens',
  )
  expectNotMatch(
    name,
    text,
    /(^|[;{\n])\s*color\s*:\s*(?:white|#fff(?:fff)?)(?:\s*!important)?\s*(?=;|}|$)/im,
    'fixed white text colors; use a semantic foreground token',
  )
}

for (const [name, text] of Object.entries({
  'FooterTocControl.vue': files.footerToc,
  'FooterTocPreviewCard.vue': files.footerTocPreview,
})) {
  expectNotContains(name, text, '--scholarly-content-border')
  expectNotContains(name, text, '--scholarly-bg-warm')
  expectNotContains(name, text, '--scholarly-text-primary')
  expectNotContains(name, text, '--scholarly-chrome-border')
}

for (const [name, text] of Object.entries({
  'FooterTocControl.vue': files.footerToc,
  'FooterTocPreviewCard.vue': files.footerTocPreview,
  'ThemePreview.vue': files.themePreview,
})) {
  expectNotMatch(
    name,
    text,
    /(^|[;{\n])\s*color\s*:\s*(?:white|#fff(?:fff)?)(?:\s*!important)?\s*(?=;|}|$)/im,
    'fixed white text colors in theme-sensitive preview or TOC badges',
  )
}

for (const [name, text] of Object.entries({
  'appendix-index.vue': files.appendixIndex,
  'experiment-grid.vue': files.experimentGrid,
  'method-pipeline.vue': files.methodPipeline,
})) {
  expectNotMatch(name, text, /--scholarly-footer-(?!height\b)[a-z-]+/, 'footer chrome tokens')
  expectNotMatch(name, text, /--scholarly-chrome-[a-z-]+/, 'chrome tokens')
}

expectCssBlockContains('appendix-index.vue', files.appendixIndex, '.appendix-index-code', 'color: var(--scholarly-content-on-primary)')
expectCssBlockContains('experiment-grid.vue', files.experimentGrid, '.experiment-grid-card-header span', 'color: var(--scholarly-content-on-primary)')
expectCssBlockContains('method-pipeline.vue', files.methodPipeline, '.method-pipeline-number', 'color: var(--scholarly-content-on-primary)')
expectCssBlockContains('FooterTocControl.vue', files.footerToc, '.footer-toc-slide-title', 'color: var(--scholarly-toc-slide-fg')
expectCssBlockContains('FooterTocControl.vue', files.footerToc, '.footer-toc-section-index', 'background: var(--scholarly-toc-badge-bg')
expectCssBlockContains('FooterTocControl.vue', files.footerToc, '.footer-toc-section-index', 'color: var(--scholarly-toc-badge-fg')
expectCssBlockContains('FooterTocControl.vue', files.footerToc, '.footer-toc-slide.is-active .footer-toc-slide-index', 'background: var(--scholarly-toc-badge-bg')
expectCssBlockContains('FooterTocControl.vue', files.footerToc, '.footer-toc-slide.is-active .footer-toc-slide-index', 'color: var(--scholarly-toc-badge-fg')
expectCssBlockContains('FooterTocPreviewCard.vue', files.footerTocPreview, '.footer-toc-preview-badge', 'background: var(--scholarly-toc-badge-bg')
expectCssBlockContains('FooterTocPreviewCard.vue', files.footerTocPreview, '.footer-toc-preview-badge', 'color: var(--scholarly-toc-badge-fg')
expectCssBlockContains('ThemePreview.vue', files.themePreview, '.theme-preview :deep(.theorem-title)', 'color: var(--preview-on-primary)')
expectContains('ThemePreview.vue semantic preview accent', files.themePreview, '--preview-content-accent')

expectContains('mode.css', files.mode, "@import './content-mode.css';")
expectContains('mode.css', files.mode, "@import './chrome-mode.css';")
expectContains('content-mode.css accent token', files.contentMode, '--scholarly-content-accent-fg')
expectContains('content-mode.css light Shiki override', files.contentMode, ':root[data-content-mode="light"] .shiki')
expectContains('content-mode.css dark Shiki override', files.contentMode, ':root[data-content-mode="dark"] .shiki')
expectContains('content-mode.css light Shiki token', files.contentMode, '--shiki-light')
expectContains('content-mode.css dark Shiki token', files.contentMode, '--shiki-dark')
expectContains('content-mode.css Princeton readable accent', files.contentMode, ':root[data-content-mode="light"][data-color-theme="princeton-orange"]')
expectRootBlocksDoNotSetSlidevThemeSurface('section-mode.css', files.sectionMode)
expectContains('section-mode.css section blocks', files.sectionMode, '.slidev-layout.section')
expectContains('section-mode.css section blocks', files.sectionMode, '--slidev-theme-background')
expectContains('section-mode.css section blocks', files.sectionMode, '--slidev-theme-text')

const lightContentBlockMatch = files.contentMode.match(/:root,\s*\n:root\[data-content-mode="light"\]\s*\{([\s\S]*?)\n\}/)
const darkContentBlockMatch = files.contentMode.match(/:root\[data-content-mode="dark"\]\s*\{([\s\S]*?)\n\}/)
const darkChromeBlockMatch = files.chromeMode.match(/:root,\s*\n:root\[data-chrome-mode="dark"\]\s*\{([\s\S]*?)\n\}/)
const lightChromeBlockMatch = files.chromeMode.match(/:root\[data-chrome-mode="light"\]\s*\{([\s\S]*?)\n\}/)
const lightContentBlock = lightContentBlockMatch?.[1] || ''
const darkContentBlock = darkContentBlockMatch?.[1] || ''
const darkChromeBlock = darkChromeBlockMatch?.[1] || ''
const lightChromeBlock = lightChromeBlockMatch?.[1] || ''

if (!lightContentBlockMatch)
  failures.push('content-mode.css should contain the default/light content-mode token block')
if (!darkContentBlockMatch)
  failures.push('content-mode.css should contain the dark content-mode token block')
if (!darkChromeBlockMatch)
  failures.push('chrome-mode.css should contain the default/dark chrome-mode token block')
if (!lightChromeBlockMatch)
  failures.push('chrome-mode.css should contain the light chrome-mode token block')

expectContains('chrome-mode.css light chrome block', lightChromeBlock, '--scholarly-toc-slide-index-fg: color-mix(in srgb, var(--scholarly-chrome-fg, #2d3748) 72%')
expectContains('chrome-mode.css default/dark chrome block', darkChromeBlock, '--scholarly-toc-slide-index-fg: rgba(255, 255, 255, 0.66)')
expectContains('chrome-mode.css Princeton ink foreground', files.chromeMode, ':root[data-color-theme="princeton-orange"]:not([data-chrome-mode="light"])')
expectContains('chrome-mode.css Princeton toolbar foreground', files.chromeMode, '--scholarly-toolbar-fg: #1c1c1c')
expectContains('chrome-mode.css Princeton toolbar surface', files.chromeMode, 'var(--slidev-theme-primary-light, #f08f42) 0%')
expectContains('section-mode.css Princeton ink foreground', files.sectionMode, ':root[data-color-theme="princeton-orange"] .slidev-layout.section:not([data-section-mode="light"])')

const requiredContentTokens = [
  '--scholarly-canvas-bg',
  '--scholarly-canvas-fg',
  '--scholarly-content-surface',
  '--scholarly-content-surface-muted',
  '--scholarly-content-border',
  '--scholarly-content-fg',
  '--scholarly-content-accent-fg',
  '--scholarly-content-purple-fg',
  '--scholarly-content-fg-muted',
  '--scholarly-content-on-primary',
  '--scholarly-footnote-fg',
  '--scholarly-footnote-link-fg',
  '--scholarly-footnote-backref-fg',
  '--scholarly-footnote-sep',
  '--scholarly-footnote-popover-bg',
  '--scholarly-footnote-popover-fg',
  '--scholarly-footnote-popover-border',
  '--scholarly-footnote-popover-shadow',
  '--scholarly-footnote-label-bg',
  '--scholarly-footnote-label-fg',
  '--scholarly-code-bg',
  '--scholarly-code-fg',
  '--scholarly-inline-code-bg',
  '--scholarly-quote-fg',
  '--scholarly-quote-border',
  '--scholarly-table-rule',
]

const requiredSlidevCodeTokens = [
  '--slidev-code-background',
  '--slidev-code-foreground',
  '--slidev-code-tab-divider',
  '--slidev-code-tab-text-color',
  '--slidev-code-tab-active-text-color',
]

const requiredChromeTokens = [
  '--scholarly-chrome-bg',
  '--scholarly-chrome-fg',
  '--scholarly-chrome-fg-muted',
  '--scholarly-chrome-border',
  '--scholarly-footer-fg',
  '--scholarly-footer-fg-muted',
  '--scholarly-footer-border',
  '--scholarly-toc-surface',
  '--scholarly-toc-surface-muted',
  '--scholarly-toc-fg',
  '--scholarly-toc-fg-muted',
  '--scholarly-toc-slide-fg',
  '--scholarly-toc-slide-index-fg',
  '--scholarly-toc-badge-bg',
  '--scholarly-toc-badge-fg',
  '--scholarly-toc-border',
  '--scholarly-toc-rule',
  '--scholarly-toc-section-border',
  '--scholarly-toc-active-border',
  '--scholarly-toc-preview-border',
  '--scholarly-toc-shadow',
  '--scholarly-toc-hover',
  '--scholarly-toc-control-hover',
  '--scholarly-toc-scrollbar',
  '--scholarly-toolbar-surface',
  '--scholarly-toolbar-fg',
  '--scholarly-toolbar-border',
  '--scholarly-toolbar-hover',
  '--scholarly-toolbar-divider',
  '--scholarly-toolbar-chip',
]

const highlightTypes = ['primary', 'success', 'warning', 'danger', 'info']
for (const type of highlightTypes) {
  requiredContentTokens.push(`--scholarly-highlight-${type}-bg`)
  requiredContentTokens.push(`--scholarly-highlight-${type}-fg`)
  expectCssBlockContains('Highlight.vue', files.highlight, `.highlight-${type}`, `--scholarly-highlight-bg: var(--scholarly-highlight-${type}-bg`)
  expectCssBlockContains('Highlight.vue', files.highlight, `.highlight-${type}`, `--scholarly-highlight-fg: var(--scholarly-highlight-${type}-fg`)
  expectCssBlockNotContains('Highlight.vue', files.highlight, `.highlight-${type}`, 'color-mix(')
}

const blockTypes = ['default', 'info', 'success', 'warning', 'danger', 'example', 'alert']
for (const type of blockTypes) {
  requiredContentTokens.push(`--scholarly-block-${type}-header-bg`)
  requiredContentTokens.push(`--scholarly-block-${type}-header-fg`)
  requiredContentTokens.push(`--scholarly-block-${type}-content-bg`)
  requiredContentTokens.push(`--scholarly-block-${type}-border`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type} .block-header`, `var(--scholarly-block-${type}-header-bg`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type} .block-header`, `var(--scholarly-block-${type}-header-fg`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type} .block-content`, `var(--scholarly-block-${type}-content-bg`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type} .block-content`, `var(--scholarly-block-${type}-border`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type}:not(:has(.block-header)) .block-content`, `var(--scholarly-block-${type}-border`)
}

for (const [blockName, block] of [
  ['default/light', lightContentBlock],
  ['dark', darkContentBlock],
]) {
  expectContains(
    `content-mode.css ${blockName} default block header`,
    block,
    '--scholarly-block-default-header-fg: var(--scholarly-content-on-primary)',
  )

  for (const type of ['info', 'success', 'warning', 'danger', 'example', 'alert']) {
    const backgroundMatch = block.match(new RegExp(`--scholarly-block-${type}-header-bg:\\s*linear-gradient\\(to right,\\s*(#[0-9a-f]{6}),\\s*(#[0-9a-f]{6})\\)`, 'i'))
    const foregroundMatch = block.match(new RegExp(`--scholarly-block-${type}-header-fg:\\s*(#[0-9a-f]{6})`, 'i'))

    if (!backgroundMatch || !foregroundMatch) {
      failures.push(`content-mode.css ${blockName} ${type} block header should use testable hex foreground and gradient endpoints`)
      continue
    }

    const foreground = hexToRgb(foregroundMatch[1])
    expectContrast(`${blockName} ${type} block header start`, foreground, hexToRgb(backgroundMatch[1]))
    expectContrast(`${blockName} ${type} block header end`, foreground, hexToRgb(backgroundMatch[2]))
  }
}

const theoremTypes = ['theorem', 'lemma', 'proposition', 'corollary', 'definition', 'example', 'remark', 'proof', 'note', 'claim']
for (const type of theoremTypes) {
  requiredContentTokens.push(`--scholarly-theorem-${type}-accent`)
  requiredContentTokens.push(`--scholarly-theorem-${type}-bg`)
  expectCssBlockContains('Theorem.vue', files.theorem, `.theorem-${type}`, `var(--scholarly-theorem-${type}-accent`)
  expectCssBlockContains('Theorem.vue', files.theorem, `.theorem-${type}`, `var(--scholarly-theorem-${type}-bg`)
  expectCssBlockContains('Theorem.vue', files.theorem, `.theorem-${type} .theorem-type`, `var(--scholarly-theorem-${type}-accent`)

  const accentToken = `--scholarly-theorem-${type}-accent`
  const backgroundToken = `--scholarly-theorem-${type}-bg`
  const lightAccentMatch = lightContentBlock.match(new RegExp(`${accentToken}:\\s*(#[0-9a-f]{6})`, 'i'))
  const lightBackgroundMatch = lightContentBlock.match(new RegExp(`${backgroundToken}:\\s*color-mix\\(in srgb,\\s*(#[0-9a-f]{6})\\s+10%,\\s*transparent\\)`, 'i'))
  const darkAccentMatch = darkContentBlock.match(new RegExp(`${accentToken}:\\s*(#[0-9a-f]{6})`, 'i'))
  const darkBackgroundMatch = darkContentBlock.match(new RegExp(`${backgroundToken}:\\s*color-mix\\(in srgb,\\s*(#[0-9a-f]{6})\\s+12%,\\s*transparent\\)`, 'i'))

  if (!lightAccentMatch || !lightBackgroundMatch) {
    failures.push(`content-mode.css light content block should define testable ${type} theorem colors`)
  }
  else {
    for (const theme of themes.colorThemes) {
      const compositedBackground = mixRgb(
        hexToRgb(lightBackgroundMatch[1]),
        hexToRgb(theme.palette.background),
        0.1,
      )
      expectContrast(`light ${theme.id} ${type} theorem accent`, hexToRgb(lightAccentMatch[1]), compositedBackground)
    }
  }

  if (!darkAccentMatch || !darkBackgroundMatch) {
    failures.push(`content-mode.css dark content block should define testable ${type} theorem colors`)
  }
  else {
    const compositedBackground = mixRgb(hexToRgb(darkBackgroundMatch[1]), hexToRgb('#0f172a'), 0.12)
    expectContrast(`dark ${type} theorem accent`, hexToRgb(darkAccentMatch[1]), compositedBackground)
  }
}

const factVariants = {
  primary: '--scholarly-content-accent-fg',
  blue: '--scholarly-highlight-info-fg',
  green: '--scholarly-highlight-success-fg',
  amber: '--scholarly-highlight-warning-fg',
  red: '--scholarly-highlight-danger-fg',
  purple: '--scholarly-content-purple-fg',
}
for (const [variant, token] of Object.entries(factVariants)) {
  expectCssBlockContains('fact.vue', files.fact, `.fact-${variant}`, `--fact-color-start: var(${token})`)
  expectCssBlockContains('fact.vue', files.fact, `.fact-${variant}`, '--fact-color-end: color-mix(')
}

for (const token of requiredContentTokens) {
  expectTokenInBlock('content-mode.css default/light content block', lightContentBlock, token)
  expectTokenInBlock('content-mode.css dark content block', darkContentBlock, token)
}

for (const token of requiredSlidevCodeTokens) {
  expectTokenInBlock('content-mode.css default/light content block', lightContentBlock, token)
  expectTokenInBlock('content-mode.css dark content block', darkContentBlock, token)
}

for (const theme of themes.colorThemes) {
  const background = hexToRgb(theme.palette.background)
  const primary = hexToRgb(theme.palette.primary)
  const accent = theme.id === 'princeton-orange'
    ? mixRgb(primary, hexToRgb(theme.palette.foreground), 0.6)
    : primary
  expectContrast(`light ${theme.id} content accent`, accent, background)
  const mutedForeground = mixRgb(hexToRgb(theme.palette.foreground), hexToRgb('#ffffff'), 0.72)
  expectContrast(`light ${theme.id} muted content`, mutedForeground, background)

  const defaultHeaderForeground = hexToRgb(theme.id === 'princeton-orange' ? '#1c1c1c' : '#ffffff')
  expectContrast(`light ${theme.id} default block header start`, defaultHeaderForeground, primary)
  expectContrast(`light ${theme.id} default block header end`, defaultHeaderForeground, hexToRgb(theme.palette.primaryLight))

  const badgeBackground = mixRgb(primary, hexToRgb(theme.palette.accent), 0.88)
  expectContrast(`${theme.id} TOC badge`, defaultHeaderForeground, badgeBackground)

  expectContrast(`${theme.id} dark chrome start`, defaultHeaderForeground, primary)
  expectContrast(`${theme.id} dark chrome end`, defaultHeaderForeground, hexToRgb(theme.palette.primaryLight))
  expectContrast(`${theme.id} dark section start`, defaultHeaderForeground, primary)
  expectContrast(`${theme.id} dark section end`, defaultHeaderForeground, hexToRgb(theme.palette.primaryLight))

  if (theme.id === 'princeton-orange') {
    const mutedSurfaceForeground = mixRgb(defaultHeaderForeground, primary, 0.88)
    const mutedSurfaceForegroundEnd = mixRgb(defaultHeaderForeground, hexToRgb(theme.palette.primaryLight), 0.88)
    expectContrast('princeton-orange muted chrome/section start', mutedSurfaceForeground, primary)
    expectContrast('princeton-orange muted chrome/section end', mutedSurfaceForegroundEnd, hexToRgb(theme.palette.primaryLight))
  }
}

for (const token of requiredChromeTokens) {
  expectTokenInBlock('chrome-mode.css default/dark chrome block', darkChromeBlock, token)
  expectTokenInBlock('chrome-mode.css light chrome block', lightChromeBlock, token)
}

const requiredLayoutTokens = [
  '--scholarly-canvas-bg',
  '--scholarly-canvas-fg',
  '--scholarly-content-surface',
  '--scholarly-content-surface-muted',
  '--scholarly-content-border',
  '--scholarly-content-fg-muted',
  '--scholarly-code-bg',
  '--scholarly-code-fg',
  '--scholarly-inline-code-bg',
  '--scholarly-quote-fg',
  '--scholarly-quote-border',
  '--scholarly-table-rule',
  '--scholarly-footer-fg',
  '--scholarly-footer-fg-muted',
  '--scholarly-footer-border',
]

for (const token of requiredLayoutTokens)
  expectContains('layout.css', files.layout, token)

expectCssBlockContains('layout.css', files.layout, '.beamer-footer-left', 'var(--scholarly-footer-fg')
expectCssBlockContains('layout.css', files.layout, '.beamer-footer-center', 'var(--scholarly-footer-fg-muted')
expectCssBlockContains('layout.css', files.layout, '.beamer-footer-right', 'var(--scholarly-footer-fg')

const forbiddenContentTokenPattern = /--scholarly-(chrome|toolbar|footer|toc)/
const forbiddenChromeTokenPattern = /--scholarly-(content|code|quote|highlight|block|theorem)/

if (forbiddenContentTokenPattern.test(files.contentMode))
  failures.push('content-mode.css should not contain chrome, toolbar, footer, or TOC tokens')
if (forbiddenChromeTokenPattern.test(files.chromeMode))
  failures.push('chrome-mode.css should not contain content, code, quote, highlight, block, or theorem tokens')

if (failures.length) {
  console.error('Color mode style checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Color mode style checks passed.')
