import { readFile } from 'node:fs/promises'

const files = {
  block: await readFile(new URL('../components/Block.vue', import.meta.url), 'utf8'),
  highlight: await readFile(new URL('../components/Highlight.vue', import.meta.url), 'utf8'),
  theorem: await readFile(new URL('../components/Theorem.vue', import.meta.url), 'utf8'),
  mode: await readFile(new URL('../styles/themes/mode.css', import.meta.url), 'utf8'),
  layout: await readFile(new URL('../styles/layout.css', import.meta.url), 'utf8'),
}

const failures = []

const expectContains = (name, text, needle) => {
  if (!text.includes(needle))
    failures.push(`${name} should contain ${needle}`)
}

const expectNotContains = (name, text, needle) => {
  if (text.includes(needle))
    failures.push(`${name} should not contain ${needle}`)
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

for (const [name, text] of Object.entries(files)) {
  expectNotContains(name, text, ':root.dark')
  expectNotContains(name, text, 'html.dark')
}

expectContains('Highlight.vue', files.highlight, ':global(:root[data-color-mode="dark"]) .highlight-primary')

const darkModeBlockMatch = files.mode.match(/:root,\s*\n:root\[data-color-mode="dark"\]\s*\{([\s\S]*?)\n\}/)
const lightModeBlockMatch = files.mode.match(/:root\[data-color-mode="light"\]\s*\{([\s\S]*?)\n\}/)
const darkModeBlock = darkModeBlockMatch?.[1] || ''
const lightModeBlock = lightModeBlockMatch?.[1] || ''

if (!darkModeBlockMatch)
  failures.push('mode.css should contain the default dark color-mode token block')
if (!lightModeBlockMatch)
  failures.push('mode.css should contain the light color-mode token block')

for (const label of ['Chrome tokens', 'Content tokens', 'Accent tokens', 'Semantic tokens', 'Interaction tokens']) {
  expectContains('mode.css', files.mode, label)
}

const requiredLayoutTokens = [
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
]
const requiredModeTokens = [...requiredLayoutTokens]

const highlightTypes = ['primary', 'success', 'warning', 'danger', 'info']
for (const type of highlightTypes) {
  requiredModeTokens.push(`--scholarly-highlight-${type}-bg`)
  requiredModeTokens.push(`--scholarly-highlight-${type}-fg`)
  expectCssBlockContains('Highlight.vue', files.highlight, `.highlight-${type}`, `--scholarly-highlight-bg: var(--scholarly-highlight-${type}-bg`)
  expectCssBlockContains('Highlight.vue', files.highlight, `.highlight-${type}`, `--scholarly-highlight-fg: var(--scholarly-highlight-${type}-fg`)
  expectCssBlockNotContains('Highlight.vue', files.highlight, `.highlight-${type}`, 'color-mix(')
}

const blockTypes = ['default', 'info', 'success', 'warning', 'danger', 'example', 'alert']
for (const type of blockTypes) {
  requiredModeTokens.push(`--scholarly-block-${type}-header-bg`)
  requiredModeTokens.push(`--scholarly-block-${type}-header-fg`)
  requiredModeTokens.push(`--scholarly-block-${type}-content-bg`)
  requiredModeTokens.push(`--scholarly-block-${type}-border`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type} .block-header`, `var(--scholarly-block-${type}-header-bg`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type} .block-header`, `var(--scholarly-block-${type}-header-fg`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type} .block-content`, `var(--scholarly-block-${type}-content-bg`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type} .block-content`, `var(--scholarly-block-${type}-border`)
  expectCssBlockContains('Block.vue', files.block, `.block-${type}:not(:has(.block-header)) .block-content`, `var(--scholarly-block-${type}-border`)
}

const theoremTypes = ['theorem', 'lemma', 'proposition', 'corollary', 'definition', 'example', 'remark', 'proof', 'note', 'claim']
for (const type of theoremTypes) {
  requiredModeTokens.push(`--scholarly-theorem-${type}-accent`)
  requiredModeTokens.push(`--scholarly-theorem-${type}-bg`)
  expectCssBlockContains('Theorem.vue', files.theorem, `.theorem-${type}`, `var(--scholarly-theorem-${type}-accent`)
  expectCssBlockContains('Theorem.vue', files.theorem, `.theorem-${type}`, `var(--scholarly-theorem-${type}-bg`)
  expectCssBlockContains('Theorem.vue', files.theorem, `.theorem-${type} .theorem-type`, `var(--scholarly-theorem-${type}-accent`)
}

for (const token of requiredModeTokens) {
  expectTokenInBlock('mode.css dark mode block', darkModeBlock, token)
  expectTokenInBlock('mode.css light mode block', lightModeBlock, token)
}

for (const token of requiredLayoutTokens) {
  expectContains('layout.css', files.layout, token)
}

if (failures.length) {
  console.error('Color mode style checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Color mode style checks passed.')
