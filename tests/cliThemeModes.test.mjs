import assert from 'node:assert/strict'
import { copyFileSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const rootDir = path.resolve(import.meta.dirname, '..')
const cliPath = path.join(rootDir, 'cli/scholarly.mjs')
const basicSlidesPath = path.join(rootDir, 'cli/templates/basic/slides.md')

function runCli(args, options = {}) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd || rootDir,
    encoding: 'utf8',
  })
}

function makeTempSlides(name = 'slides.md') {
  const dir = mkdtempSync(path.join(tmpdir(), 'scholarly-cli-theme-'))
  const file = path.join(dir, name)
  copyFileSync(basicSlidesPath, file)
  return { dir, file }
}

test('theme apply writes explicit content, chrome, and section modes without colorMode', () => {
  const { file } = makeTempSlides()

  const result = runCli([
    'theme',
    'apply',
    'classic-blue',
    '--content-mode',
    'light',
    '--chrome-mode',
    'dark',
    '--section-mode',
    'inverse',
    '--file',
    file,
  ])

  assert.equal(result.status, 0, result.stderr)

  const slides = readFileSync(file, 'utf8')
  assert.match(slides, /contentMode: light/)
  assert.match(slides, /chromeMode: dark/)
  assert.match(slides, /sectionMode: inverse/)
  assert.doesNotMatch(slides, /colorMode:/)
})

test('legacy --mode maps to contentMode and removes existing colorMode', () => {
  const { file } = makeTempSlides()
  let slides = readFileSync(file, 'utf8')
  slides = slides.replace('themeConfig:\n', 'themeConfig:\n  colorMode: light\n')
  writeFileSync(file, slides, 'utf8')

  const result = runCli([
    'theme',
    'apply',
    'classic-blue',
    '--mode',
    'dark',
    '--file',
    file,
  ])

  assert.equal(result.status, 0, result.stderr)

  const updated = readFileSync(file, 'utf8')
  assert.match(updated, /contentMode: dark/)
  assert.doesNotMatch(updated, /colorMode:/)
})

test('explicit content mode wins over legacy mode', () => {
  const { file } = makeTempSlides()

  const result = runCli([
    'theme',
    'apply',
    'classic-blue',
    '--mode',
    'dark',
    '--content-mode',
    'light',
    '--file',
    file,
  ])

  assert.equal(result.status, 0, result.stderr)

  const slides = readFileSync(file, 'utf8')
  assert.match(slides, /contentMode: light/)
  assert.doesNotMatch(slides, /colorMode:/)
})

test('doctor validates explicit and legacy mode values', () => {
  const { dir, file } = makeTempSlides()
  writeFileSync(file, `---
theme: scholarly
themeConfig:
  contentMode: dim
  chromeMode: inverse
  colorMode: bright
  sectionMode: match
---

# Test
`, 'utf8')

  const result = runCli(['doctor', '--json'], { cwd: dir })

  assert.equal(result.status, 0, result.stderr)

  const report = JSON.parse(result.stdout)
  const checks = Object.fromEntries(report.checks.map(check => [check.id, check]))
  assert.equal(checks['theme-config-content-mode'].severity, 'warn')
  assert.match(checks['theme-config-content-mode'].action, /light/)
  assert.equal(checks['theme-config-chrome-mode'].severity, 'ok')
  assert.equal(checks['theme-config-color-mode'].severity, 'warn')
  assert.match(checks['theme-config-color-mode'].label, /legacy/)
  assert.equal(checks['theme-config-section-mode'].severity, 'ok')
})
