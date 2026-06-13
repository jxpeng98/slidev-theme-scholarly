import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const componentIds = [
  {
    name: 'MetricCard',
    file: 'MetricCard.vue',
    slug: 'metric-card',
    snippet: 'Slidev Scholarly: MetricCard',
  },
  {
    name: 'MetricGrid',
    file: 'MetricGrid.vue',
    slug: 'metric-grid',
    snippet: 'Slidev Scholarly: MetricGrid',
  },
  {
    name: 'EvidenceBlock',
    file: 'EvidenceBlock.vue',
    slug: 'evidence-block',
    snippet: 'Slidev Scholarly: EvidenceBlock',
  },
  {
    name: 'EquationBlock',
    file: 'EquationBlock.vue',
    slug: 'equation-block',
    snippet: 'Slidev Scholarly: EquationBlock',
  },
]

const requiredTokens = [
  '--scholarly-content-surface',
  '--scholarly-content-border',
  '--scholarly-content-fg-muted',
  '--slidev-theme-primary',
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

const expectFile = async (relativePath) => {
  try {
    await access(path.join(root, relativePath))
  } catch (error) {
    failures.push(`${relativePath} should exist`)
  }
}

const sharedLayouts = JSON.parse(await readText('shared/layouts.json') || '{}')
const extensionLayouts = JSON.parse(await readText('vscode-extension/shared/layouts.json') || '{}')
const componentSnippets = await readText('vscode-extension/snippets/components.json')
const vscodeComponentSnippets = await readText('vscode-extension/snippets/components.vscode.json')
const academicExample = await readText('examples/example-academic.md')
const screenshotSource = await readText('scripts/generate-component-screenshots.md')
const screenshotExport = await readText('scripts/export-component-screenshots.mjs')
const englishIndex = await readText('docs/en/components/index.md')
const chineseIndex = await readText('docs/zh/components/index.md')
const docsConfig = await readText('docs/.vitepress/config.ts')

const sharedComponentNames = sharedLayouts.componentNames || []
const extensionComponentNames = extensionLayouts.componentNames || []

for (const component of componentIds) {
  const componentFile = `components/${component.file}`
  const componentText = await readText(componentFile)
  const englishDocs = await readText(`docs/en/components/${component.slug}.md`)
  const chineseDocs = await readText(`docs/zh/components/${component.slug}.md`)

  expectContains('shared/layouts.json componentNames', sharedComponentNames.join('\n'), component.name)
  expectContains('vscode-extension/shared/layouts.json componentNames', extensionComponentNames.join('\n'), component.name)
  expectContains('vscode-extension/snippets/components.json', componentSnippets, component.snippet)
  expectContains('vscode-extension/snippets/components.vscode.json', vscodeComponentSnippets, component.snippet)
  expectContains('docs/en/components/index.md', englishIndex, `./${component.slug}`)
  expectContains('docs/zh/components/index.md', chineseIndex, `./${component.slug}`)
  expectContains('docs/.vitepress/config.ts', docsConfig, `/en/components/${component.slug}`)
  expectContains('docs/.vitepress/config.ts', docsConfig, `/zh/components/${component.slug}`)
  expectContains('examples/example-academic.md', academicExample, `<${component.name}`)
  expectContains('scripts/generate-component-screenshots.md', screenshotSource, `<${component.name}`)
  expectContains('scripts/export-component-screenshots.mjs', screenshotExport, `'${component.slug}'`)
  await expectFile(`docs/public/images/components/${component.slug}.png`)

  for (const token of requiredTokens)
    expectContains(componentFile, componentText, token)

  expectNotContains(componentFile, componentText, 'bg-white')
  expectNotContains(componentFile, componentText, 'bg-gray')
  expectNotContains(componentFile, componentText, 'text-gray')
  expectNotMatch(componentFile, componentText, /#[0-9a-fA-F]{3,8}\b/, 'raw hex colors')
  expectNotMatch(`docs/en/components/${component.slug}.md`, englishDocs, /TODO|placeholder/i, 'placeholder docs')
  expectNotMatch(`docs/zh/components/${component.slug}.md`, chineseDocs, /TODO|placeholder/i, 'placeholder docs')
}

if (failures.length) {
  console.error('Academic component checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Academic component checks passed.')
