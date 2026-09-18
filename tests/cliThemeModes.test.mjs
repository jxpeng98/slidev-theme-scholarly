import assert from 'node:assert/strict'
import { copyFileSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const rootDir = path.resolve(import.meta.dirname, '..')
const cliPath = path.join(rootDir, 'cli/scholarly.mjs')
const basicSlidesPath = path.join(rootDir, 'cli/templates/basic/slides.md')
const templatesDir = path.join(rootDir, 'cli/templates')

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

function makeLegacyTempSlides(themeConfigLines, name = 'slides.md') {
  const dir = mkdtempSync(path.join(tmpdir(), 'scholarly-cli-theme-'))
  const file = path.join(dir, name)
  writeFileSync(file, `---
theme: scholarly
themeConfig:
${themeConfigLines}
---

# Legacy Test
`, 'utf8')
  return { dir, file }
}

test('starter templates let content mode follow Slidev by default', () => {
  const templateSlides = readdirSync(templatesDir)
    .map(template => path.join(templatesDir, template, 'slides.md'))
    .filter(file => statSync(file, { throwIfNoEntry: false })?.isFile())

  assert.ok(templateSlides.length > 0, 'Expected at least one starter template')

  for (const file of templateSlides) {
    const slides = readFileSync(file, 'utf8')
    assert.doesNotMatch(
      slides,
      /^\s*contentMode:\s*(?:light|dark)\s*$/m,
      `${path.relative(rootDir, file)} should not pin contentMode`,
    )
  }
})

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

test('--mode=value maps to contentMode and removes existing colorMode', () => {
  const { file } = makeTempSlides()
  let slides = readFileSync(file, 'utf8')
  slides = slides.replace('themeConfig:\n', 'themeConfig:\n  colorMode: light\n')
  writeFileSync(file, slides, 'utf8')

  const result = runCli([
    'theme',
    'apply',
    'classic-blue',
    '--mode=dark',
    '--file',
    file,
  ])

  assert.equal(result.status, 0, result.stderr)

  const updated = readFileSync(file, 'utf8')
  assert.match(updated, /contentMode: dark/)
  assert.doesNotMatch(updated, /colorMode:/)
})

test('theme apply migrates existing colorMode when no mode flags are supplied', () => {
  const { file } = makeLegacyTempSlides('  colorMode: dark\n')

  const result = runCli([
    'theme',
    'apply',
    'classic-blue',
    '--file',
    file,
  ])

  assert.equal(result.status, 0, result.stderr)

  const updated = readFileSync(file, 'utf8')
  assert.match(updated, /contentMode: dark/)
  assert.doesNotMatch(updated, /colorMode:/)
})

test('theme apply migrates existing colorMode when only chrome mode is supplied', () => {
  const { file } = makeLegacyTempSlides('  colorMode: dark\n')

  const result = runCli([
    'theme',
    'apply',
    'classic-blue',
    '--chrome-mode',
    'inverse',
    '--file',
    file,
  ])

  assert.equal(result.status, 0, result.stderr)

  const updated = readFileSync(file, 'utf8')
  assert.match(updated, /contentMode: dark/)
  assert.match(updated, /chromeMode: inverse/)
  assert.doesNotMatch(updated, /colorMode:/)
})

test('theme apply removes invalid existing colorMode without migrating it', () => {
  const { file } = makeLegacyTempSlides('  colorMode: dim\n')

  const result = runCli([
    'theme',
    'apply',
    'classic-blue',
    '--file',
    file,
  ])

  assert.equal(result.status, 0, result.stderr)

  const updated = readFileSync(file, 'utf8')
  assert.doesNotMatch(updated, /contentMode:/)
  assert.doesNotMatch(updated, /colorMode:/)
})

test('theme apply replaces invalid contentMode with valid legacy colorMode', () => {
  const { file } = makeLegacyTempSlides('  contentMode: dim\n  colorMode: dark\n')

  const result = runCli([
    'theme',
    'apply',
    'classic-blue',
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

test('doctor accepts normalized case-insensitive mode values', () => {
  const { dir, file } = makeTempSlides()
  writeFileSync(file, `---
theme: scholarly
themeConfig:
  contentMode: Dark
  chromeMode: INVERSE
  colorMode: LIGHT
  sectionMode: MATCH
---

# Test
`, 'utf8')

  const result = runCli(['doctor', '--json'], { cwd: dir })

  assert.equal(result.status, 0, result.stderr)

  const report = JSON.parse(result.stdout)
  const checks = Object.fromEntries(report.checks.map(check => [check.id, check]))
  assert.equal(checks['theme-config-content-mode'].severity, 'ok')
  assert.equal(checks['theme-config-content-mode'].summary, 'Dark')
  assert.equal(checks['theme-config-chrome-mode'].severity, 'ok')
  assert.equal(checks['theme-config-chrome-mode'].summary, 'INVERSE')
  assert.equal(checks['theme-config-color-mode'].severity, 'ok')
  assert.equal(checks['theme-config-color-mode'].summary, 'LIGHT')
  assert.equal(checks['theme-config-section-mode'].severity, 'ok')
  assert.equal(checks['theme-config-section-mode'].summary, 'MATCH')
})

test('theme apply preserves YAML mappings and refuses invalid settings without writing', async () => {
  const { default: yaml } = await import('js-yaml')
  const { file } = makeTempSlides()
  for (const themeConfig of [
    'themeConfig: # palette\n  fontTheme: traditional\n  outlineToc: false\n  custom: {colorMode: light, nested: [1, 2]}',
    'themeConfig: {fontTheme: traditional, outlineToc: false, custom: {colorMode: light, nested: [1, 2]}}',
  ]) {
    const original = `---\ntheme: scholarly\n${themeConfig}\nother: {keep: true}\n---\n\n# Body\n`
    writeFileSync(file, original)
    const result = runCli(['theme', 'apply', 'yale-blue', '--file', file])
    assert.equal(result.status, 0, result.stderr)
    const updated = readFileSync(file, 'utf8')
    if (themeConfig.includes('# palette')) assert.match(updated, /# palette/)
    const head = yaml.load(updated.match(/^---\n([\s\S]*?)\n---/)[1])
    assert.deepEqual(head.themeConfig, { fontTheme: 'traditional', outlineToc: false, custom: { colorMode: 'light', nested: [1, 2] }, colorTheme: 'yale-blue' })
    assert.deepEqual(head.other, { keep: true })
    assert.ok(updated.endsWith('\n\n# Body\n'))
  }
  for (const invalid of ['themeConfig: {}\nthemeConfig: {}', 'themeConfig: []', 'themeConfig: broken', 'themeConfig: [']) {
    const original = `---\n${invalid}\n---\n\n# Untouched\n`
    writeFileSync(file, original)
    assert.notEqual(runCli(['theme', 'apply', 'yale-blue', '--file', file]).status, 0)
    assert.equal(readFileSync(file, 'utf8'), original)
  }
})


test('theme editing preserves comments, quotes, aliases, and CRLF slide bodies', async () => {
  const { default: yaml } = await import('js-yaml')
  const { file } = makeTempSlides()
  const source = '# Author notes\ndefaults: &palette {colorTheme: classic-blue} # reusable\ntitle: "Quoted title" # keep title\nthemeConfig: *palette # local override\n'
  writeFileSync(file, '---\r\n' + source.replace(/\n/g, '\r\n') + '---\r\n# Body\r\n')
  const result = runCli(['theme', 'apply', 'yale-blue', '--file', file])
  assert.equal(result.status, 0, result.stderr)
  const updated = readFileSync(file, 'utf8')
  for (const text of ['# Author notes', '# reusable', '# local override', '"Quoted title" # keep title']) assert.ok(updated.includes(text), text)
  assert.ok(updated.endsWith('---\r\n# Body\r\n'))
  assert.doesNotMatch(updated, /(?<!\r)\n/)
  const data = yaml.load(updated.split('---')[1])
  assert.equal(data.defaults.colorTheme, 'classic-blue')
  assert.equal(data.themeConfig.colorTheme, 'yale-blue')
})

test('doctor enforces the supported Vite Node version boundaries', () => {
  for (const [version, severity] of [['20.18.9','error'], ['20.19.0','ok'], ['21.7.0','error'], ['22.11.0','error'], ['22.12.0','ok'], ['24.0.0','ok']]) {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
      Object.defineProperty(process.versions, 'node', {value: ${JSON.stringify(version)}});
      process.argv = [process.execPath, ${JSON.stringify(cliPath)}, 'doctor', '--json'];
      await import(${JSON.stringify(cliPath)});
    `], {cwd: rootDir, encoding: 'utf8'})
    const check = JSON.parse(result.stdout).checks.find(check => check.id === 'node-version')
    assert.equal(check.severity, severity, version)
    assert.equal(check.required, '^20.19.0 || >=22.12.0')
  }
})


test('theme apply creates mappings for absent and comment-only frontmatter', () => {
  const { file } = makeTempSlides()
  for (const original of ['', '# Body\n', '---\n# Keep comment\n---\n# Body\n']) {
    writeFileSync(file, original)
    const result = runCli(['theme', 'apply', 'yale-blue', '--file', file])
    assert.equal(result.status, 0, result.stderr)
    const updated = readFileSync(file, 'utf8')
    assert.match(updated, /colorTheme: yale-blue/)
    if (original.includes('# Body')) assert.ok(updated.endsWith('# Body\n'))
    if (original.includes('# Keep comment')) assert.ok(updated.includes('# Keep comment'))
  }
})
