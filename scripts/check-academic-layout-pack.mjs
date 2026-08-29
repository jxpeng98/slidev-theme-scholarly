import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const layoutIds = [
  'paper-summary',
  'related-work-matrix',
  'method-pipeline',
  'result-highlight',
  'experiment-grid',
  'limitation',
  'defense-question',
  'appendix-index',
]

const failures = []

const readText = async (relativePath) => {
  try {
    return await readFile(path.join(root, relativePath), 'utf8')
  } catch (error) {
    failures.push(`${relativePath} should exist`)
    return ''
  }
}

const expectContains = (name, text, needle) => {
  if (!text.includes(needle))
    failures.push(`${name} should contain ${needle}`)
}

const expectNotContains = (name, text, needle) => {
  if (text.includes(needle))
    failures.push(`${name} should not contain ${needle}`)
}

const expectNotMatch = (name, text, pattern, label) => {
  if (pattern.test(text))
    failures.push(`${name} should not contain ${label}`)
}

const sharedLayouts = JSON.parse(await readText('shared/layouts.json') || '{}')
const extensionLayouts = JSON.parse(await readText('vscode-extension/shared/layouts.json') || '{}')
const layoutSnippets = await readText('vscode-extension/snippets/layouts.json')
const vscodeLayoutSnippets = await readText('vscode-extension/snippets/layouts.vscode.json')
const englishDocs = await readText('docs/en/layouts/academic.md')
const chineseDocs = await readText('docs/zh/layouts/academic.md')
const academicGallery = await readText('examples/example-academic-gallery.md')

const sharedAcademicItems = sharedLayouts.layoutGroups
  ?.find(group => group.name === 'academic')
  ?.items || []
const extensionAcademicItems = extensionLayouts.layoutGroups
  ?.find(group => group.name === 'academic')
  ?.items || []

for (const layoutId of layoutIds) {
  const layoutFile = `layouts/${layoutId}.vue`
  const layoutText = await readText(layoutFile)
  const snippetName = layoutId
    .split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ')

  expectContains('shared/layouts.json academic group', sharedAcademicItems.join('\n'), layoutId)
  expectContains('vscode-extension/shared/layouts.json academic group', extensionAcademicItems.join('\n'), layoutId)
  expectContains('vscode-extension/snippets/layouts.json', layoutSnippets, `layout: ${layoutId}`)
  expectContains('vscode-extension/snippets/layouts.vscode.json', vscodeLayoutSnippets, `layout: ${layoutId}`)
  expectContains('vscode-extension/snippets/layouts.json', layoutSnippets, `Slidev Scholarly: ${snippetName} Layout`)
  expectContains('docs/en/layouts/academic.md', englishDocs, `## ${layoutId}`)
  expectContains('docs/zh/layouts/academic.md', chineseDocs, `## ${layoutId}`)
  expectContains('examples/example-academic-gallery.md', academicGallery, `layout: ${layoutId}`)

  expectContains(layoutFile, layoutText, 'ScholarlyHeader')
  expectContains(layoutFile, layoutText, 'ScholarlyFooter')
  expectContains(layoutFile, layoutText, 'useFontSizeStyles')
  expectContains(layoutFile, layoutText, '--scholarly-content-surface')
  expectContains(layoutFile, layoutText, '--scholarly-content-border')
  expectContains(layoutFile, layoutText, '--scholarly-content-fg-muted')
  expectContains(layoutFile, layoutText, '--slidev-theme-primary')
  expectNotContains(layoutFile, layoutText, 'bg-white')
  expectNotContains(layoutFile, layoutText, 'bg-gray')
  expectNotContains(layoutFile, layoutText, 'text-gray')
  expectNotMatch(layoutFile, layoutText, /#[0-9a-fA-F]{3,8}\b/, 'raw hex colors')
}

if (failures.length) {
  console.error('Academic layout pack checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Academic layout pack checks passed.')
