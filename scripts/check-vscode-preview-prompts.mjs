import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const extensionRoot = path.join(root, 'vscode-extension')
const failures = []

const componentAliases = {
  Theorem: ['Theorem (Vue)', 'Theorem (Syntax Sugar)', 'Definition', 'Lemma', 'Proof', 'Corollary', 'Example Theorem', 'Note', 'Theorem Compact'],
  Block: ['Block (Vue)', 'Block (Syntax Sugar)'],
  Cite: ['Cite (Vue)', 'Cite (Syntax Sugar)'],
  Steps: ['Steps', 'Steps (Syntax Sugar)'],
  Keywords: ['Keywords', 'Keywords (Syntax Sugar)'],
  Columns: ['Columns', 'Columns (Syntax Sugar)'],
  Highlight: ['Highlight (Vue)', 'Highlight (Syntax Sugar)'],
  ThemePreview: ['Theme Preview'],
}

const colorThemePreviewDirs = {
  'classic-blue': 'classic-blue',
  'oxford-burgundy': 'oxford',
  'cambridge-green': 'cambridge',
  'yale-blue': 'yale',
  'princeton-orange': 'princeton',
  'nordic-blue': 'nordic',
  'warm-sepia': 'sepia',
  monochrome: 'monochrome',
  'high-contrast': 'high-contrast',
}

async function readText(file) {
  try {
    return await fs.readFile(file, 'utf8')
  } catch {
    failures.push(`Missing expected file: ${path.relative(root, file)}`)
    return ''
  }
}

async function readJson(file) {
  const text = await readText(file)
  if (!text)
    return null

  try {
    return JSON.parse(text)
  } catch (error) {
    failures.push(`${path.relative(root, file)} should contain valid JSON: ${error.message}`)
    return null
  }
}

async function fileExists(file) {
  try {
    await fs.stat(file)
    return true
  } catch {
    return false
  }
}

async function hashFile(file) {
  const buffer = await fs.readFile(file)
  return createHash('sha256').update(buffer).digest('hex')
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function snippetBodyToString(body) {
  return Array.isArray(body) ? body.join('\n') : String(body ?? '')
}

function stripSnippetName(name) {
  return name.replace(/^Slidev Scholarly:\s*/, '')
}

function parseSlidePromptIds(markdown) {
  return [...markdown.matchAll(/<!--\s*Slide\s+(\d+):\s*([a-z0-9-]+)\s*-->/g)]
    .map(match => ({ slide: Number(match[1]), id: match[2] }))
}

async function expectFile(file, message) {
  if (!(await fileExists(file)))
    failures.push(`${message}: ${path.relative(root, file)}`)
}

function expect(condition, message) {
  if (!condition)
    failures.push(message)
}

function getSnippetByPrompt(snippets, promptLabel) {
  return snippets[`Slidev Scholarly: ${promptLabel}`]
}

const layoutsData = await readJson(path.join(root, 'shared', 'layouts.json'))
const themesData = await readJson(path.join(root, 'shared', 'themes.json'))
const layoutSnippets = await readJson(path.join(extensionRoot, 'snippets', 'layouts.json')) ?? {}
const componentSnippets = await readJson(path.join(extensionRoot, 'snippets', 'components.json')) ?? {}
const manifest = await readJson(path.join(extensionRoot, 'media', 'previews', 'manifest.json'))

const manifestBySource = new Map((manifest?.entries ?? []).map(entry => [entry.source, entry]))

async function expectManifestEntry(sourceRelative, outputRelative) {
  const entry = manifestBySource.get(sourceRelative)
  if (!entry) {
    failures.push(`Preview manifest missing source ${sourceRelative}`)
    return
  }

  expect(entry.output === outputRelative, `Preview manifest output for ${sourceRelative} should be ${outputRelative}`)

  const source = path.join(root, sourceRelative)
  const output = path.join(root, outputRelative)
  if (await fileExists(source))
    expect(entry.sourceSha256 === await hashFile(source), `Preview manifest source hash drifted for ${sourceRelative}`)
  if (await fileExists(output))
    expect(entry.outputSha256 === await hashFile(output), `Preview manifest output hash drifted for ${outputRelative}`)
}

const layoutPromptIds = parseSlidePromptIds(await readText(path.join(root, 'scripts', 'generate-layout-screenshots.md')))
const componentPromptIds = parseSlidePromptIds(await readText(path.join(root, 'scripts', 'generate-component-screenshots.md')))
const layoutPromptSet = new Set(layoutPromptIds.map(item => item.id))
const componentPromptSet = new Set(componentPromptIds.map(item => item.id))

const layoutIds = layoutsData?.layoutGroups?.flatMap(group => group.items) ?? []
for (const layoutId of layoutIds) {
  expect(layoutPromptSet.has(layoutId), `Layout screenshot generator should include prompt slide for "${layoutId}"`)

  const snippetEntry = Object.entries(layoutSnippets)
    .filter(([, value]) => value && typeof value === 'object')
    .find(([, value]) => snippetBodyToString(value.body).match(new RegExp(`^layout:\\s*${layoutId}$`, 'm')))
  expect(Boolean(snippetEntry), `VS Code layout snippets should include prompt body for layout "${layoutId}"`)

  await expectFile(path.join(root, 'docs', 'public', 'images', 'layouts', `${layoutId}.png`), `Missing source layout preview for "${layoutId}"`)
  await expectFile(path.join(extensionRoot, 'media', 'previews', 'layouts', `${layoutId}.png`), `Missing VS Code layout preview for "${layoutId}"`)
  await expectManifestEntry(
    `docs/public/images/layouts/${layoutId}.png`,
    `vscode-extension/media/previews/layouts/${layoutId}.png`,
  )
}

for (const componentName of layoutsData?.componentNames ?? []) {
  const previewId = toKebabCase(componentName)
  expect(componentPromptSet.has(previewId), `Component screenshot generator should include prompt slide for "${previewId}"`)

  const promptLabels = componentAliases[componentName] ?? [componentName]
  for (const promptLabel of promptLabels) {
    const snippet = getSnippetByPrompt(componentSnippets, promptLabel)
    expect(Boolean(snippet), `VS Code component snippets should include "${promptLabel}"`)
    if (!snippet)
      continue

    const body = snippetBodyToString(snippet.body)
    const componentToken = componentName === 'ThemePreview' ? 'ThemePreview' : componentName
    expect(
      body.includes(componentToken) || body.toLowerCase().includes(previewId),
      `Component snippet "${promptLabel}" should reference ${componentToken} or ${previewId}`,
    )
  }

  await expectFile(path.join(root, 'docs', 'public', 'images', 'components', `${previewId}.png`), `Missing source component preview for "${componentName}"`)
  await expectFile(path.join(extensionRoot, 'media', 'previews', 'components', `${previewId}.png`), `Missing VS Code component preview for "${componentName}"`)
  await expectManifestEntry(
    `docs/public/images/components/${previewId}.png`,
    `vscode-extension/media/previews/components/${previewId}.png`,
  )
}

for (const theme of themesData?.colorThemes ?? []) {
  const dir = colorThemePreviewDirs[theme.id]
  expect(Boolean(dir), `VS Code preview dir mapping missing for color theme "${theme.id}"`)
  if (!dir)
    continue

  for (const index of [1, 2, 3, 4]) {
    await expectFile(path.join(root, 'docs', 'public', 'images', 'themes', dir, `${index}.png`), `Missing source theme preview for "${theme.id}"`)
    await expectFile(path.join(extensionRoot, 'media', 'previews', 'themes', dir, `${index}.png`), `Missing VS Code theme preview for "${theme.id}"`)
    await expectManifestEntry(
      `docs/public/images/themes/${dir}/${index}.png`,
      `vscode-extension/media/previews/themes/${dir}/${index}.png`,
    )
  }
}

for (const preset of themesData?.themePresets ?? []) {
  expect(Boolean(colorThemePreviewDirs[preset.colorTheme]), `Theme preset "${preset.id}" should map to previewable colorTheme "${preset.colorTheme}"`)
}

const componentSnippetPromptsWithPreview = new Set(
  Object.values(componentAliases).flatMap(labels => labels)
    .concat((layoutsData?.componentNames ?? []).filter(name => !componentAliases[name])),
)
for (const name of Object.keys(componentSnippets).filter(name => !name.startsWith('_'))) {
  const promptLabel = stripSnippetName(name)
  if (!componentSnippetPromptsWithPreview.has(promptLabel))
    continue

  const previewId = Object.entries(componentAliases)
    .find(([, labels]) => labels.includes(promptLabel))?.[0] ?? promptLabel
  const previewFile = toKebabCase(previewId)
  expect(componentPromptSet.has(previewFile), `Component prompt "${promptLabel}" should resolve to generated screenshot "${previewFile}"`)
}

if (failures.length) {
  console.error('VS Code preview prompt checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`VS Code preview prompt checks passed (${layoutIds.length} layouts, ${layoutsData?.componentNames?.length ?? 0} components, ${themesData?.colorThemes?.length ?? 0} themes).`)
