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
const sharedThemes = await readJson(path.join(root, 'shared', 'themes.json'))
const sharedTemplates = await readJson(path.join(root, 'shared', 'templates.json'))
const colorThemeSource = await readText(path.join(root, 'styles', 'themes', 'colors.css'))
const providersSource = await readText(path.join(extensionRoot, 'src', 'providers.ts'))
const commandsSource = await readText(path.join(extensionRoot, 'src', 'commands.ts'))
const completionSource = await readText(path.join(extensionRoot, 'src', 'snippetCompletion.ts'))
const endLayoutSource = await readText(path.join(root, 'layouts', 'end.vue'))
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
const layoutCatalog = sharedLayouts?.layoutCatalog ?? {}
const componentCatalog = sharedLayouts?.componentCatalog ?? {}
const componentGroups = sharedLayouts?.componentGroups ?? []
for (const id of ['paper-summary', 'related-work-matrix', 'method-pipeline', 'result-highlight', 'experiment-grid', 'limitation', 'defense-question', 'appendix-index'])
  expect(layoutIds.includes(id), `shared/layouts.json should include layout "${id}"`)
for (const name of ['MetricCard', 'MetricGrid', 'EvidenceBlock', 'EquationBlock', 'DatasetCard', 'PaperCard', 'ContributionList', 'CaveatList'])
  expect(componentNames.includes(name), `shared/layouts.json should include component "${name}"`)

expectSameMembers('layout catalog', layoutIds, Object.keys(layoutCatalog))
expectSameMembers('component catalog', componentNames, Object.keys(componentCatalog))
expectSameMembers(
  'component groups',
  componentNames,
  componentGroups.flatMap(group => group.items ?? []),
)

for (const id of layoutIds) {
  const entry = layoutCatalog[id]
  expectCatalogEntry(`layoutCatalog.${id}`, entry, ['label', 'summary', 'useFor'])
  expect(Array.isArray(entry?.features) && entry.features.length > 0, `layoutCatalog.${id}.features should be non-empty`)
  expect(Array.isArray(entry?.tags) && entry.tags.length > 0, `layoutCatalog.${id}.tags should be non-empty`)
  expectCatalogConfiguration(`layoutCatalog.${id}`, entry)
}

for (const id of ['image-left', 'image-right', 'methodology']) {
  const names = layoutCatalog[id]?.config?.map(item => item.name) ?? []
  expect(names.includes('title'), `layoutCatalog.${id}.config should document the shared header title`)
  expect(names.includes('subtitle'), `layoutCatalog.${id}.config should document the shared header subtitle`)
}

for (const id of ['default', 'intro', 'section', 'center', 'toc']) {
  const fontConfig = layoutCatalog[id]?.config?.find(item => item.name === 'fontsize')
  expect(Boolean(fontConfig), `layoutCatalog.${id}.config should document fontsize`)
  for (const field of ['body', 'base', 'default', 'h1', 'h2', 'h3'])
    expect(fontConfig?.type?.includes(field), `layoutCatalog.${id}.fontsize should document ${field}`)
}

expect(
  !layoutCatalog.figure?.features?.some(feature => /fill mode/i.test(feature)),
  'layoutCatalog.figure.features should only advertise implemented fit modes',
)
expect(
  /v-if="\$slots\.default \|\| subtitle \|\| email \|\| website"/.test(endLayoutSource),
  'end layout should render a configured subtitle without requiring contact fields',
)

for (const name of componentNames) {
  const entry = componentCatalog[name]
  expectCatalogEntry(`componentCatalog.${name}`, entry, ['label', 'category', 'summary', 'useFor'])
  expect(Array.isArray(entry?.features) && entry.features.length > 0, `componentCatalog.${name}.features should be non-empty`)
  expect(Array.isArray(entry?.aliases) && entry.aliases.length > 0, `componentCatalog.${name}.aliases should be non-empty`)
  expectCatalogConfiguration(`componentCatalog.${name}`, entry)

  const group = componentGroups.find(candidate => candidate.name === entry?.category)
  expect(Boolean(group), `componentCatalog.${name}.category should reference a component group`)
  expect(group?.items?.includes(name), `component group "${entry?.category}" should include ${name}`)
}

const paletteVariables = {
  primary: '--slidev-theme-primary',
  primaryLight: '--slidev-theme-primary-light',
  accent: '--scholarly-accent',
  background: '--scholarly-bg-warm',
  foreground: '--scholarly-text-primary',
}

for (const theme of sharedThemes?.colorThemes ?? []) {
  expectCatalogEntry(`colorThemes.${theme.id}.palette`, theme.palette, Object.keys(paletteVariables))
  const escapedId = theme.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const block = colorThemeSource.match(new RegExp(`:root\\[data-color-theme="${escapedId}"\\]\\s*\\{([\\s\\S]*?)\\}`))?.[1] ?? ''
  expect(Boolean(block), `styles/themes/colors.css should define ${theme.id}`)
  for (const [role, variable] of Object.entries(paletteVariables)) {
    expect(
      block.includes(`${variable}: ${theme.palette?.[role]}`),
      `colorThemes.${theme.id}.palette.${role} should match ${variable} in colors.css`,
    )
  }
}

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

function expectSameMembers(label, expectedValues, actualValues) {
  const expected = [...new Set(expectedValues)].sort()
  const actual = [...new Set(actualValues)].sort()
  expect(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label} should cover exactly: ${expected.join(', ')}`,
  )
  expect(actualValues.length === actual.length, `${label} should not contain duplicates`)
}

function expectCatalogEntry(label, entry, fields) {
  expect(Boolean(entry) && typeof entry === 'object', `${label} should exist`)
  for (const field of fields)
    expect(typeof entry?.[field] === 'string' && entry[field].trim().length > 0, `${label}.${field} should be non-empty`)
}

function expectCatalogConfiguration(label, entry) {
  expect(Array.isArray(entry?.config), `${label}.config should be an array`)
  expect(Array.isArray(entry?.slots), `${label}.slots should be an array`)

  const configNames = entry?.config?.map(item => item.name) ?? []
  const slotNames = entry?.slots?.map(item => item.name) ?? []
  expect(new Set(configNames).size === configNames.length, `${label}.config should not repeat names`)
  expect(new Set(slotNames).size === slotNames.length, `${label}.slots should not repeat names`)

  for (const item of entry?.config ?? []) {
    expectCatalogEntry(`${label}.config.${item.name || '<unnamed>'}`, item, ['name', 'type', 'description'])
    expect(typeof item.required === 'boolean', `${label}.config.${item.name}.required should be boolean`)
    if (item.default !== undefined)
      expect(typeof item.default === 'string', `${label}.config.${item.name}.default should be a display string`)
    if (item.options !== undefined) {
      expect(Array.isArray(item.options) && item.options.length > 0, `${label}.config.${item.name}.options should be non-empty when present`)
      expect(item.options.every(value => typeof value === 'string' && value.length > 0), `${label}.config.${item.name}.options should contain strings`)
    }
  }

  for (const slot of entry?.slots ?? [])
    expectCatalogEntry(`${label}.slots.${slot.name || '<unnamed>'}`, slot, ['name', 'description'])
}
