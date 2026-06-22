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
  appendixIndex: await readFile(new URL('../layouts/appendix-index.vue', import.meta.url), 'utf8'),
  experimentGrid: await readFile(new URL('../layouts/experiment-grid.vue', import.meta.url), 'utf8'),
  methodPipeline: await readFile(new URL('../layouts/method-pipeline.vue', import.meta.url), 'utf8'),
  mode: await readFile(new URL('../styles/themes/mode.css', import.meta.url), 'utf8'),
  contentMode: await readFile(new URL('../styles/themes/content-mode.css', import.meta.url), 'utf8'),
  chromeMode: await readFile(new URL('../styles/themes/chrome-mode.css', import.meta.url), 'utf8'),
  layout: await readFile(new URL('../styles/layout.css', import.meta.url), 'utf8'),
}

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

const backgroundSurfaceColorTokenPattern = /--scholarly-(?:canvas-bg|content-surface(?:-muted)?|chrome-bg|toc-surface(?:-muted)?|toolbar-surface)\b/

const expectNoBackgroundSurfaceColorDeclarations = (name, text) => {
  const declarationPattern = /(^|[;{\n])\s*([-\w]+)\s*:\s*([^;{}]+);/gm
  for (const match of text.matchAll(declarationPattern)) {
    const property = match[2].trim()
    const value = match[3].trim()
    if (property === 'color' && backgroundSurfaceColorTokenPattern.test(value))
      failures.push(`${name} should not use background or surface tokens in color declarations: color: ${value}`)
  }
}

for (const [name, text] of Object.entries({
  block: files.block,
  footerToc: files.footerToc,
  footerTocPreview: files.footerTocPreview,
  highlight: files.highlight,
  theorem: files.theorem,
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

expectContains('mode.css', files.mode, "@import './content-mode.css';")
expectContains('mode.css', files.mode, "@import './chrome-mode.css';")

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

const requiredContentTokens = [
  '--scholarly-canvas-bg',
  '--scholarly-canvas-fg',
  '--scholarly-content-surface',
  '--scholarly-content-surface-muted',
  '--scholarly-content-border',
  '--scholarly-content-fg',
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

const theoremTypes = ['theorem', 'lemma', 'proposition', 'corollary', 'definition', 'example', 'remark', 'proof', 'note', 'claim']
for (const type of theoremTypes) {
  requiredContentTokens.push(`--scholarly-theorem-${type}-accent`)
  requiredContentTokens.push(`--scholarly-theorem-${type}-bg`)
  expectCssBlockContains('Theorem.vue', files.theorem, `.theorem-${type}`, `var(--scholarly-theorem-${type}-accent`)
  expectCssBlockContains('Theorem.vue', files.theorem, `.theorem-${type}`, `var(--scholarly-theorem-${type}-bg`)
  expectCssBlockContains('Theorem.vue', files.theorem, `.theorem-${type} .theorem-type`, `var(--scholarly-theorem-${type}-accent`)
}

for (const token of requiredContentTokens) {
  expectTokenInBlock('content-mode.css default/light content block', lightContentBlock, token)
  expectTokenInBlock('content-mode.css dark content block', darkContentBlock, token)
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
