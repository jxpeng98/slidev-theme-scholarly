import fs from 'node:fs'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const cliPath = path.join(root, 'cli', 'scholarly.mjs')
const failures = []

function runDoctor(cwd, args = []) {
  const result = spawnSync(process.execPath, [cliPath, 'doctor', ...args], {
    cwd,
    encoding: 'utf8',
  })

  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  }
}

function withProject(files, fn) {
  const dir = mkdtempSync(path.join('/private/tmp', 'scholarly-doctor-actionable-'))
  try {
    for (const [name, content] of Object.entries(files)) {
      const target = path.join(dir, name)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, content, 'utf8')
    }
    return fn(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function expect(condition, message) {
  if (!condition)
    failures.push(message)
}

function expectIncludes(name, text, needle) {
  expect(text.includes(needle), `${name} should include "${needle}"`)
}

function parseJson(name, text) {
  try {
    return JSON.parse(text)
  } catch (err) {
    failures.push(`${name} should be valid JSON: ${err.message}`)
    return null
  }
}

function findCheck(report, id) {
  return report?.checks?.find(check => check.id === id)
}

function expectCheck(report, id, severity, actionNeedle) {
  const check = findCheck(report, id)
  expect(Boolean(check), `JSON report should include check "${id}"`)
  if (!check)
    return

  expect(check.severity === severity, `${id} severity should be "${severity}", got "${check.severity}"`)
  expect(typeof check.label === 'string' && check.label.length > 0, `${id} should include a label`)
  expect(typeof check.summary === 'string' && check.summary.length > 0, `${id} should include a summary`)
  expect(typeof check.action === 'string' && check.action.includes(actionNeedle), `${id} action should include "${actionNeedle}"`)
}

const brokenProject = {
  'package.json': JSON.stringify({
    name: 'broken-talk',
    private: true,
    devDependencies: {
      '@slidev/cli': '^52.11.3',
    },
  }, null, 2),
  'slides.md': `---
theme: scholarly
themeConfig:
  colorTheme: mystery-blue
  fontTheme: fantasy
  colorMode: sepia
  sectionMode: neon
---

Citation without bibliography setup @missing2026.
`,
}

withProject(brokenProject, (dir) => {
  const jsonResult = runDoctor(dir, ['--json'])
  expect(jsonResult.status === 0, `doctor --json should exit 0, got ${jsonResult.status}: ${jsonResult.stderr}`)
  const report = parseJson('doctor --json', jsonResult.stdout)

  expect(report?.status === 'warn', `report.status should be warn, got ${report?.status}`)
  expect(Array.isArray(report?.checks), 'report.checks should be an array')
  expectCheck(report, 'slides-file', 'ok', 'Open slides.md')
  expectCheck(report, 'theme-dependency', 'warn', 'npm i -D slidev-theme-scholarly')
  expectCheck(report, 'theme-config-color-theme', 'warn', 'Use one of')
  expectCheck(report, 'theme-config-font-theme', 'warn', 'Use one of')
  expectCheck(report, 'theme-config-color-mode', 'warn', 'light')
  expectCheck(report, 'theme-config-section-mode', 'warn', 'light')
  expectCheck(report, 'citation-setup', 'warn', 'bibFile')
  expectCheck(report, 'references-slide', 'warn', 'layout: references')

  const textResult = runDoctor(dir)
  expect(textResult.status === 0, `doctor text should exit 0, got ${textResult.status}: ${textResult.stderr}`)
  expectIncludes('doctor text', textResult.stdout, '- themeConfig.colorTheme: [WARN]')
  expectIncludes('doctor text', textResult.stdout, 'Action: Use one of')
  expectIncludes('doctor text', textResult.stdout, '- Citation setup: [WARN]')
})

withProject({
  'package.json': JSON.stringify({
    name: 'missing-slides',
    private: true,
    devDependencies: {
      'slidev-theme-scholarly': '^1.4.0-beta.1',
    },
  }, null, 2),
}, (dir) => {
  const report = parseJson('missing slides report', runDoctor(dir, ['--json']).stdout)
  expect(report?.status === 'warn', `missing slides report.status should be warn, got ${report?.status}`)
  expectCheck(report, 'slides-file', 'warn', 'Create slides.md')
  expectCheck(report, 'citation-setup', 'ok', 'Add citations')
})

const themeRepoReport = parseJson('theme repo report', runDoctor(root, ['--json']).stdout)
expect(themeRepoReport?.package?.name === 'slidev-theme-scholarly', 'theme repo report should include package metadata')
expectCheck(themeRepoReport, 'node-version', 'ok', 'Use Node.js')
expectCheck(themeRepoReport, 'theme-dependency', 'ok', 'Add slidev-theme-scholarly')

if (failures.length) {
  console.error('Doctor actionability checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Doctor actionability checks passed.')
