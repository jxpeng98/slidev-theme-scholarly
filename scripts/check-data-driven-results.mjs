import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { transformWithEsbuild } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const failures = []

const chartingOrCsvDeps = [
  'chart.js',
  'echarts',
  'recharts',
  'd3',
  'vega',
  'papaparse',
  'csv-parse',
  'fast-csv',
]

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

const expectEqual = (name, actual, expected) => {
  const actualJson = JSON.stringify(actual)
  const expectedJson = JSON.stringify(expected)
  if (actualJson !== expectedJson)
    failures.push(`${name} expected ${expectedJson}, got ${actualJson}`)
}

const importDataHelpers = async () => {
  const source = await readText('utils/data.ts')
  if (!source) return {}

  const transformed = await transformWithEsbuild(source, 'utils/data.ts', {
    loader: 'ts',
    format: 'esm',
    target: 'es2020',
  })
  const tempDir = await mkdtemp(path.join(tmpdir(), 'scholarly-data-check-'))
  const tempFile = path.join(tempDir, 'data.mjs')
  await writeFile(tempFile, transformed.code, 'utf8')

  try {
    return await import(pathToFileURL(tempFile).href)
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}

const packageJson = JSON.parse(await readText('package.json') || '{}')
const allDeps = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
  ...(packageJson.peerDependencies || {}),
  ...(packageJson.optionalDependencies || {}),
}

for (const dependency of chartingOrCsvDeps) {
  if (dependency in allDeps)
    failures.push(`package.json should not add ${dependency}`)
}

expectContains('package.json scripts', JSON.stringify(packageJson.scripts || {}), 'check:data')
expectContains('package.json exports', JSON.stringify(packageJson.exports || {}), './utils/data')

const releaseReady = await readText('scripts/release-ready.mjs')
expectContains('scripts/release-ready.mjs', releaseReady, 'scripts/check-data-driven-results.mjs')

const resultTable = await readText('components/ResultTable.vue')
for (const token of [
  '--scholarly-content-surface',
  '--scholarly-content-border',
  '--scholarly-content-fg-muted',
  '--slidev-theme-primary',
]) {
  expectContains('components/ResultTable.vue', resultTable, token)
}
for (const forbidden of ['bg-white', 'bg-gray', 'text-gray', '#fff', '#ffffff']) {
  expectNotContains('components/ResultTable.vue', resultTable, forbidden)
}
if (/#[0-9a-fA-F]{3,8}\b/.test(resultTable))
  failures.push('components/ResultTable.vue should not contain raw hex colors')

for (const [name, file, markdownTable, chartingDependency] of [
  ['English features', 'docs/en/guide/features.md', 'Markdown table', 'charting dependency'],
  ['Chinese features', 'docs/zh/guide/features.md', 'Markdown 表格', '图表依赖'],
]) {
  const text = await readText(file)
  expectContains(name, text, "import rows from './results.json'")
  expectContains(name, text, "import csv from './results.csv?raw'")
  expectContains(name, text, "slidev-theme-scholarly/utils/data")
  expectContains(name, text, 'parseCsvTable')
  expectContains(name, text, 'ResultTable')
  expectContains(name, text, 'MetricGrid')
  expectContains(name, text, markdownTable)
  expectContains(name, text, chartingDependency)
}

const academicExample = await readText('examples/example-academic.md')
expectContains('examples/example-academic.md', academicExample, '<ResultTable')
expectContains('examples/example-academic.md', academicExample, 'parseCsvTable')
expectContains('examples/example-academic.md', academicExample, 'toMetricItems')
expectContains('components/ResultTable.vue', resultTable, 'No result rows available')

const evidenceSlideStart = academicExample.indexOf('title: Evidence Table')
const evidenceSlideEnd = academicExample.indexOf('\n---\nlayout:', evidenceSlideStart + 1)
const evidenceSlide = academicExample.slice(evidenceSlideStart, evidenceSlideEnd)
expectContains('Evidence Table slide', evidenceSlide, '<script setup>')

const helpers = await importDataHelpers()
for (const name of ['parseCsvRows', 'parseCsvTable', 'normalizeResultRows', 'toMetricItems']) {
  if (typeof helpers[name] !== 'function')
    failures.push(`utils/data.ts should export ${name}`)
}

if (typeof helpers.parseCsvRows === 'function') {
  expectEqual('parseCsvRows quoted cells', helpers.parseCsvRows('method,score,note\n"Base, tuned",0.91,"line 1\nline 2"\n"Ours",0.94,"said ""ok"""'), [
    ['method', 'score', 'note'],
    ['Base, tuned', '0.91', 'line 1\nline 2'],
    ['Ours', '0.94', 'said "ok"'],
  ])
}

if (typeof helpers.parseCsvTable === 'function') {
  expectEqual('parseCsvTable records', helpers.parseCsvTable('method,accuracy,latency\nBaseline,91.5,21\nOurs,94.7,18'), [
    { method: 'Baseline', accuracy: '91.5', latency: '21' },
    { method: 'Ours', accuracy: '94.7', latency: '18' },
  ])
}

if (typeof helpers.normalizeResultRows === 'function') {
  expectEqual('normalizeResultRows arrays', helpers.normalizeResultRows([
    ['Method', 'Accuracy'],
    ['Baseline', '91.5'],
    ['Ours', '94.7'],
  ]), [
    { Method: 'Baseline', Accuracy: '91.5' },
    { Method: 'Ours', Accuracy: '94.7' },
  ])
}

if (typeof helpers.toMetricItems === 'function') {
  expectEqual('toMetricItems objects', helpers.toMetricItems([
    { label: 'Accuracy', value: 94.7, unit: '%', delta: '+3.2', variant: 'success' },
    { metric: 'Latency', value: 18, unit: 'ms', trend: 'down' },
  ]), [
    { label: 'Accuracy', value: 94.7, unit: '%', delta: '+3.2', variant: 'success' },
    { label: 'Latency', value: 18, unit: 'ms', trend: 'down' },
  ])
}

if (failures.length) {
  console.error('Data-driven result checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Data-driven result checks passed.')
