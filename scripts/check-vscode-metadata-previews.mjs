import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const extensionRoot = path.join(root, 'vscode-extension')
const failures = []

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

async function listFiles(dir, ext = '.png') {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath, ext))
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath)
    }
  }
  return files
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

function expect(condition, message) {
  if (!condition)
    failures.push(message)
}

function expectIncludes(name, text, needle) {
  expect(text.includes(needle), `${name} should include "${needle}"`)
}

function expectNotIncludes(name, text, needle) {
  expect(!text.includes(needle), `${name} should not include "${needle}"`)
}

async function expectSameFile(source, dest) {
  const sourceText = await readText(source)
  const destText = await readText(dest)
  if (sourceText && destText)
    expect(sourceText === destText, `${path.relative(root, dest)} should match ${path.relative(root, source)}`)
}

const sharedLayouts = await readJson(path.join(root, 'shared', 'layouts.json'))
const sharedTemplates = await readJson(path.join(root, 'shared', 'templates.json'))
const providersSource = await readText(path.join(extensionRoot, 'src', 'providers.ts'))
const commandsSource = await readText(path.join(extensionRoot, 'src', 'commands.ts'))
const completionSource = await readText(path.join(extensionRoot, 'src', 'snippetCompletion.ts'))
const previewSource = await readText(path.join(extensionRoot, 'src', 'preview.ts'))
const sharedDataSource = await readText(path.join(extensionRoot, 'src', 'sharedData.ts'))
const syncSharedSource = await readText(path.join(extensionRoot, 'scripts', 'sync-shared-data.mjs'))
const syncPreviewsSource = await readText(path.join(extensionRoot, 'scripts', 'sync-previews.mjs'))

await expectSameFile(
  path.join(root, 'shared', 'themes.json'),
  path.join(extensionRoot, 'shared', 'themes.json'),
)
await expectSameFile(
  path.join(root, 'shared', 'layouts.json'),
  path.join(extensionRoot, 'shared', 'layouts.json'),
)
await expectSameFile(
  path.join(root, 'shared', 'templates.json'),
  path.join(extensionRoot, 'shared', 'templates.json'),
)

expectIncludes('sync-shared-data.mjs', syncSharedSource, 'templates.json')
expectIncludes('providers.ts', providersSource, 'LAYOUT_GROUPS')
expectIncludes('providers.ts', providersSource, 'COMPONENT_NAMES')
expectIncludes('providers.ts', providersSource, 'TEMPLATES')
expectNotIncludes('providers.ts', providersSource, 'export const layoutCategories = {')
expectNotIncludes('providers.ts', providersSource, 'export const components: SnippetItem[] = [')

expectIncludes('commands.ts', commandsSource, 'TEMPLATE_IDS')
expectIncludes('commands.ts', commandsSource, 'TEMPLATES')
expectNotIncludes('commands.ts', commandsSource, 'const CLI_TEMPLATES = [')

expectIncludes('snippetCompletion.ts', completionSource, 'componentCompletions')
expectNotIncludes('snippetCompletion.ts', completionSource, 'const COMPONENT_SNIPPETS')
expectNotIncludes('snippetCompletion.ts', completionSource, 'const DIRECTIVE_SNIPPETS')

expectIncludes('sharedData.ts', sharedDataSource, 'TEMPLATE_IDS')
expectIncludes('sharedData.ts', sharedDataSource, 'COMPONENT_PREVIEW_FILES')
expectIncludes('sharedData.ts', sharedDataSource, 'COLOR_THEME_PREVIEW_DIRS')
expectIncludes('preview.ts', previewSource, 'COMPONENT_PREVIEW_FILES')
expectIncludes('preview.ts', previewSource, 'COLOR_THEME_PREVIEW_DIRS')
expectNotIncludes('preview.ts', previewSource, 'const COMPONENT_ID_TO_FILE')
expectNotIncludes('preview.ts', previewSource, 'const COLOR_THEME_TO_DIR')

const expectedTemplates = ['basic', 'academic', 'paper-talk', 'seminar', 'thesis-defense', 'reading-group', 'conference-lightning', 'zh']
const templateIds = sharedTemplates?.templates?.map(template => template.id) ?? []
for (const id of expectedTemplates)
  expect(templateIds.includes(id), `shared/templates.json should include template "${id}"`)

const layoutIds = sharedLayouts?.layoutGroups?.flatMap(group => group.items) ?? []
const componentNames = sharedLayouts?.componentNames ?? []
for (const id of ['paper-summary', 'related-work-matrix', 'method-pipeline', 'result-highlight', 'experiment-grid', 'limitation', 'defense-question', 'appendix-index'])
  expect(layoutIds.includes(id), `shared/layouts.json should include layout "${id}"`)
for (const name of ['MetricCard', 'MetricGrid', 'EvidenceBlock', 'EquationBlock', 'DatasetCard', 'PaperCard', 'ContributionList', 'CaveatList'])
  expect(componentNames.includes(name), `shared/layouts.json should include component "${name}"`)

const sourceImageRoot = path.join(root, 'docs', 'public', 'images')
const previewRoot = path.join(extensionRoot, 'media', 'previews')
const sourceImages = await listFiles(sourceImageRoot)
for (const source of sourceImages) {
  const relative = path.relative(sourceImageRoot, source)
  const dest = path.join(previewRoot, relative)
  expect(await fileExists(dest), `Missing VS Code preview image: ${path.relative(root, dest)}`)
}

const manifestPath = path.join(previewRoot, 'manifest.json')
const manifest = await readJson(manifestPath)
const manifestEntries = manifest?.entries ?? []
expect(manifest?.version === 1, 'preview manifest should use version 1')
expect(manifestEntries.length === sourceImages.length, `preview manifest should list ${sourceImages.length} images`)

const manifestBySource = new Map(manifestEntries.map(entry => [entry.source, entry]))
for (const source of sourceImages) {
  const relative = path.relative(root, source)
  const entry = manifestBySource.get(relative)
  expect(Boolean(entry), `preview manifest should include source ${relative}`)
  if (!entry)
    continue

  const dest = path.join(root, entry.output)
  if (!(await fileExists(dest))) {
    failures.push(`preview manifest output missing: ${entry.output}`)
    continue
  }

  const sourceHash = await hashFile(source)
  const outputHash = await hashFile(dest)
  expect(entry.sourceSha256 === sourceHash, `preview manifest source hash drifted for ${relative}`)
  expect(entry.outputSha256 === outputHash, `preview manifest output hash drifted for ${entry.output}`)
}

if (syncPreviewsSource.includes('--check')) {
  const result = spawnSync(process.execPath, [path.join(extensionRoot, 'scripts', 'sync-previews.mjs'), '--check'], {
    cwd: extensionRoot,
    encoding: 'utf8',
  })
  expect(result.status === 0, `sync-previews --check should pass: ${result.stderr || result.stdout}`)
} else {
  failures.push('sync-previews.mjs should support --check')
}

if (failures.length) {
  console.error('VS Code metadata/preview synchronization checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('VS Code metadata/preview synchronization checks passed.')
