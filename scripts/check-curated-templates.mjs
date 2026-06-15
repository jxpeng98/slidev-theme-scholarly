import fs from 'node:fs'
import { mkdtempSync, rmSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { analyzeCitationProject } from '../shared/citations.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const cliPath = path.join(root, 'cli', 'scholarly.mjs')
const failures = []

const expectedTemplates = [
  {
    name: 'paper-talk',
    requiredLayouts: ['paper-summary', 'method-pipeline', 'result-highlight', 'references'],
  },
  {
    name: 'seminar',
    requiredLayouts: ['agenda', 'related-work-matrix', 'method-pipeline', 'references'],
  },
  {
    name: 'thesis-defense',
    requiredLayouts: ['paper-summary', 'experiment-grid', 'limitation', 'defense-question', 'appendix-index', 'references'],
  },
  {
    name: 'reading-group',
    requiredLayouts: ['paper-summary', 'related-work-matrix', 'limitation', 'references'],
  },
  {
    name: 'conference-lightning',
    requiredLayouts: ['result-highlight', 'references'],
  },
]

const expectedAliases = {
  paper: 'paper-talk',
  talk: 'paper-talk',
  defense: 'thesis-defense',
  thesis: 'thesis-defense',
  reading: 'reading-group',
  lightning: 'conference-lightning',
}

function runCli(args, cwd = root) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
  })
}

function expect(condition, message) {
  if (!condition)
    failures.push(message)
}

function expectIncludes(name, text, needle) {
  expect(text.includes(needle), `${name} should include "${needle}"`)
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
}

const listResult = runCli(['template', 'list', '--json'])
expect(listResult.status === 0, `template list --json should exit 0, got ${listResult.status}`)

let listedTemplates = []
try {
  listedTemplates = JSON.parse(listResult.stdout || '[]')
} catch {
  failures.push('template list --json should return valid JSON')
}

for (const template of expectedTemplates) {
  const item = listedTemplates.find(entry => entry.name === template.name)
  expect(Boolean(item), `template list should include ${template.name}`)
  expect(Boolean(item?.description), `${template.name} should have a description`)
}

const tempRoot = mkdtempSync(path.join('/private/tmp', 'scholarly-curated-templates-'))

try {
  for (const template of expectedTemplates) {
    const target = path.join(tempRoot, template.name)
    const result = runCli(['init', target, '--template', template.name, '--force'])

    expect(result.status === 0, `${template.name} init should exit 0, got ${result.status}: ${result.stderr}`)

    const slidesPath = path.join(target, 'slides.md')
    const packagePath = path.join(target, 'package.json')
    const readmePath = path.join(target, 'README.md')
    const gitignorePath = path.join(target, '.gitignore')
    const slides = readText(slidesPath)
    const packageJson = readText(packagePath)

    expect(fs.existsSync(slidesPath), `${template.name} should create slides.md`)
    expect(fs.existsSync(packagePath), `${template.name} should create package.json`)
    expect(fs.existsSync(readmePath), `${template.name} should create README.md`)
    expect(fs.existsSync(gitignorePath), `${template.name} should create .gitignore`)
    expectIncludes(`${template.name} slides.md`, slides, 'theme: scholarly')
    expectIncludes(`${template.name} package.json`, packageJson, `"name": "${template.name}"`)
    expectIncludes(`${template.name} package.json`, packageJson, 'slidev-theme-scholarly')
    expect(!slides.includes('__PROJECT_NAME__'), `${template.name} slides.md should not contain replacement tokens`)
    expect(!packageJson.includes('__SCHOLARLY_VERSION__'), `${template.name} package.json should not contain replacement tokens`)

    for (const layout of template.requiredLayouts)
      expectIncludes(`${template.name} slides.md`, slides, `layout: ${layout}`)

    const citation = analyzeCitationProject(target)
    if (citation.citationKeys.length > 0) {
      expect(!citation.missingSetup, `${template.name} should configure a bibliography when citations are present`)
      expect(citation.bibFileExists, `${template.name} should create ${citation.bibFile}`)
      expect(citation.hasReferencesSlide, `${template.name} should include a references slide`)
      expect(citation.duplicateKeys.length === 0, `${template.name} should not include duplicate BibTeX keys`)
      expect(citation.unresolvedKeys.length === 0, `${template.name} should resolve all citation keys`)
    }
  }

  for (const [alias, canonical] of Object.entries(expectedAliases)) {
    const target = path.join(tempRoot, `alias-${alias}`)
    const result = runCli(['init', target, '--template', alias, '--force'])
    expect(result.status === 0, `${alias} alias should init ${canonical}, got ${result.status}: ${result.stderr}`)
    expectIncludes(`alias ${alias} output`, result.stdout, `Created "${canonical}" template`)
  }
} finally {
  rmSync(tempRoot, { recursive: true, force: true })
}

if (failures.length) {
  console.error('Curated template checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Curated template checks passed.')
