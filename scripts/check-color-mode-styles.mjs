import { readFile } from 'node:fs/promises'

const files = {
  highlight: await readFile(new URL('../components/Highlight.vue', import.meta.url), 'utf8'),
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

expectNotContains('Highlight.vue', files.highlight, ':root.dark .highlight-')
expectContains('Highlight.vue', files.highlight, ':global(:root[data-color-mode="dark"]) .highlight-primary')

for (const token of [
  '--scholarly-content-surface',
  '--scholarly-content-surface-muted',
  '--scholarly-content-border',
  '--scholarly-content-fg-muted',
  '--scholarly-code-bg',
  '--scholarly-inline-code-bg',
  '--scholarly-quote-fg',
]) {
  expectContains('mode.css', files.mode, token)
  expectContains('layout.css', files.layout, token)
}

if (failures.length) {
  console.error('Color mode style checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Color mode style checks passed.')
