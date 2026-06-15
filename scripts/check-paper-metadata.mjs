import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const cliPath = path.join(root, 'cli', 'scholarly.mjs')
const failures = []

const fixture = `@string{conf = "Conference on Scholarly Tools"}

@article{nested2026,
  title = {A {Nested {Brace}} Paper},
  author = {Doe, Jane and Smith, John and Wang, Mei},
  year = {2026},
  journal = {Journal of Testable Research},
  doi = {10.1234/example.2026},
  url = {https://example.org/paper}
}

@inproceedings{quoted2025,
  title = "Quoted " # {Metadata},
  author = "Ada Lovelace and Alan Turing",
  year = 2025,
  booktitle = conf # " Workshop",
  url = "https://example.org/quoted"
}

@phdthesis{missing2024,
  title = {Sparse Entry},
  author = {Solo, Sam},
  year = {2024}
}
`

function expect(condition, message) {
  if (!condition)
    failures.push(message)
}

function expectIncludes(name, text, needle) {
  expect(text.includes(needle), `${name} should include "${needle}"`)
}

function expectEqual(name, actual, expected) {
  const actualJson = JSON.stringify(actual)
  const expectedJson = JSON.stringify(expected)
  expect(actualJson === expectedJson, `${name} expected ${expectedJson}, got ${actualJson}`)
}

function runCli(args, cwd) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
  })
}

async function readText(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), 'utf8')
  } catch {
    failures.push(`${relativePath} should exist`)
    return ''
  }
}

async function importBibtex() {
  const modulePath = path.join(root, 'shared', 'bibtex.mjs')
  expect(existsSync(modulePath), 'shared/bibtex.mjs should exist')
  if (!existsSync(modulePath))
    return {}
  return import(pathToFileURL(modulePath).href)
}

const bibtex = await importBibtex()
for (const exportName of [
  'parseBibEntries',
  'findBibEntry',
  'extractPaperMetadata',
  'buildPaperMetadataWarnings',
  'renderPaperMarkdown',
]) {
  expect(typeof bibtex[exportName] === 'function', `shared/bibtex.mjs should export ${exportName}`)
}

if (typeof bibtex.parseBibEntries === 'function') {
  const entries = bibtex.parseBibEntries(fixture)
  expect(entries.length === 3, `parseBibEntries should return 3 real entries, got ${entries.length}`)
  const nested = entries.find(entry => entry.key === 'nested2026')
  expect(nested?.type === 'article', 'nested2026 should keep the entry type')
  expectEqual('nested2026 fields', nested?.fields, {
    title: 'A Nested Brace Paper',
    author: 'Doe, Jane and Smith, John and Wang, Mei',
    year: '2026',
    journal: 'Journal of Testable Research',
    doi: '10.1234/example.2026',
    url: 'https://example.org/paper',
  })

  const quoted = entries.find(entry => entry.key === 'quoted2025')
  expect(quoted?.fields?.title === 'Quoted Metadata', 'quoted title should combine # concatenation')
  expect(quoted?.fields?.booktitle === 'Conference on Scholarly Tools Workshop', 'booktitle should resolve simple @string concatenation')
}

if (typeof bibtex.findBibEntry === 'function' && typeof bibtex.extractPaperMetadata === 'function') {
  const entries = bibtex.parseBibEntries(fixture)
  const metadata = bibtex.extractPaperMetadata(bibtex.findBibEntry(entries, 'nested2026'))
  expectEqual('metadata shape', metadata, {
    key: 'nested2026',
    type: 'article',
    title: 'A Nested Brace Paper',
    authors: ['Jane Doe', 'John Smith', 'Mei Wang'],
    year: '2026',
    venue: 'Journal of Testable Research',
    doi: '10.1234/example.2026',
    url: 'https://example.org/paper',
  })

  const missing = bibtex.extractPaperMetadata(bibtex.findBibEntry(entries, 'missing2024'))
  const warnings = bibtex.buildPaperMetadataWarnings(missing)
  expect(warnings.some(warning => warning.includes('venue')), 'missing venue should produce a warning')
}

const tempDir = await mkdtemp(path.join(tmpdir(), 'scholarly-paper-metadata-'))
try {
  await writeFile(path.join(tempDir, 'references.bib'), fixture, 'utf8')

  const summary = runCli(['paper', 'summary', '--bib', 'references.bib', '--key', 'nested2026'], tempDir)
  expect(summary.status === 0, `paper summary should exit 0, got ${summary.status}: ${summary.stderr}`)
  expectIncludes('paper-summary markdown', summary.stdout, 'layout: paper-summary')
  expectIncludes('paper-summary markdown', summary.stdout, 'paperTitle: A Nested Brace Paper')
  expectIncludes('paper-summary markdown', summary.stdout, 'authors:')
  expectIncludes('paper-summary markdown', summary.stdout, '- Jane Doe')
  expectIncludes('paper-summary markdown', summary.stdout, 'venue: Journal of Testable Research')
  expectIncludes('paper-summary markdown', summary.stdout, 'doi: 10.1234/example.2026')

  const card = runCli(['paper', 'summary', '--bib', 'references.bib', '--key', 'quoted2025', '--layout', 'paper-card'], tempDir)
  expect(card.status === 0, `paper-card should exit 0, got ${card.status}: ${card.stderr}`)
  expectIncludes('paper-card markdown', card.stdout, '<PaperCard')
  expectIncludes('paper-card markdown', card.stdout, 'title="Quoted Metadata"')
  expectIncludes('paper-card markdown', card.stdout, 'venue="Conference on Scholarly Tools Workshop"')

  const json = runCli(['paper', 'summary', '--bib', 'references.bib', '--key', 'missing2024', '--json'], tempDir)
  expect(json.status === 0, `paper summary --json should exit 0, got ${json.status}: ${json.stderr}`)
  try {
    const parsed = JSON.parse(json.stdout)
    expect(parsed.metadata.key === 'missing2024', 'JSON output should include metadata.key')
    expect(Array.isArray(parsed.warnings), 'JSON output should include warnings array')
    expect(parsed.warnings.some(warning => warning.includes('venue')), 'JSON warnings should include missing venue')
    expect(parsed.markdown.includes('layout: paper-summary'), 'JSON output should include generated markdown')
  } catch (error) {
    failures.push(`paper summary --json should output valid JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
  expectIncludes('missing field stderr', json.stderr, 'Warning:')

  const unknown = runCli(['paper', 'summary', '--bib', 'references.bib', '--key', 'unknown2026'], tempDir)
  expect(unknown.status !== 0, 'unknown key should exit non-zero')
  expectIncludes('unknown key stderr', unknown.stderr, 'unknown2026')

  const unreadable = runCli(['paper', 'summary', '--bib', 'missing.bib', '--key', 'nested2026'], tempDir)
  expect(unreadable.status !== 0, 'missing bib file should exit non-zero')
  expectIncludes('missing bib stderr', unreadable.stderr, 'missing.bib')
} finally {
  await rm(tempDir, { recursive: true, force: true })
}

const packageJson = JSON.parse(await readText('package.json') || '{}')
expectIncludes('package.json scripts', JSON.stringify(packageJson.scripts || {}), 'check:paper-metadata')

const releaseReady = await readText('scripts/release-ready.mjs')
expectIncludes('scripts/release-ready.mjs', releaseReady, 'scripts/check-paper-metadata.mjs')

const citations = await readText('shared/citations.mjs')
expectIncludes('shared/citations.mjs', citations, "from './bibtex.mjs'")
const extensionSync = await readText('vscode-extension/scripts/sync-shared-data.mjs')
expectIncludes('vscode-extension/scripts/sync-shared-data.mjs', extensionSync, 'bibtex.mjs')
const extensionBibtex = await readText('vscode-extension/shared/bibtex.mjs')
expectIncludes('vscode-extension/shared/bibtex.mjs', extensionBibtex, 'export function parseBibEntries')

const extensionPackage = await readText('vscode-extension/package.json')
expectIncludes('vscode-extension/package.json', extensionPackage, 'slidev-scholarly.insertPaperSummary')
expectIncludes('vscode-extension/package.json', extensionPackage, 'referenceCitation')

const extensionCommands = await readText('vscode-extension/src/commands.ts')
expectIncludes('vscode-extension/src/commands.ts', extensionCommands, 'insertPaperSummary')
const extensionBibtexSource = await readText('vscode-extension/src/bibtex.ts')
expectIncludes('vscode-extension/src/bibtex.ts', extensionBibtexSource, 'parseStringMacro')
expectIncludes('vscode-extension/src/bibtex.ts', extensionBibtexSource, 'macros.get')

for (const [name, file] of [
  ['English features', 'docs/en/guide/features.md'],
  ['Chinese features', 'docs/zh/guide/features.md'],
]) {
  const text = await readText(file)
  expectIncludes(name, text, 'paper summary --bib references.bib --key sample2026')
  expectIncludes(name, text, '--layout paper-card')
  expectIncludes(name, text, '--json')
  expectIncludes(name, text, 'warnings')
  expectIncludes(name, text, 'PaperCard')
  expectIncludes(name, text, 'paper-summary')
}

if (failures.length) {
  console.error('Paper metadata checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Paper metadata checks passed.')
