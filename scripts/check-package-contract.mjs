import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packagePath = path.join(root, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
const failures = []
const MAX_PACKED_BYTES = 150_000
const MAX_UNPACKED_BYTES = 750_000

function expect(condition, message) {
  if (!condition)
    failures.push(message)
}

function checkTarget(label, target) {
  expect(typeof target === 'string' && target.startsWith('./'), `${label} should be a relative package target`)
  if (typeof target !== 'string' || !target.startsWith('./'))
    return

  const relativeTarget = target.slice(2)
  expect(fs.existsSync(path.join(root, relativeTarget)), `${label} target should exist: ${target}`)
  const isIncluded = packageJson.files?.some(entry =>
    relativeTarget === entry || relativeTarget.startsWith(`${entry}/`),
  )
  expect(isIncluded, `${label} target should be included in package.json files: ${relativeTarget}`)
}

for (const [name, target] of Object.entries(packageJson.bin || {}))
  checkTarget(`bin.${name}`, target)

for (const [subpath, conditions] of Object.entries(packageJson.exports || {})) {
  if (typeof conditions === 'string') {
    checkTarget(`exports.${subpath}`, conditions)
    continue
  }

  for (const [condition, target] of Object.entries(conditions || {}))
    checkTarget(`exports.${subpath}.${condition}`, target)
}

const binTargets = new Set(Object.values(packageJson.bin || {}))
expect(binTargets.size === 1, 'scholarly, sch, and sts should remain aliases of one CLI entry')

const packResult = spawnSync(
  'npm',
  ['pack', '--dry-run', '--json', '--cache', path.join(tmpdir(), 'scholarly-npm-cache')],
  { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' },
)

let packSummary
if (packResult.status !== 0) {
  failures.push(`npm pack --dry-run should succeed: ${packResult.error?.message || packResult.stderr?.trim() || `exit ${packResult.status}`}`)
} else {
  try {
    packSummary = JSON.parse(packResult.stdout)[0]
    expect(Number.isFinite(packSummary?.size), 'npm pack should report a packed size')
    expect(Number.isFinite(packSummary?.unpackedSize), 'npm pack should report an unpacked size')
    expect(packSummary?.size <= MAX_PACKED_BYTES, `packed package should stay at or below ${MAX_PACKED_BYTES} bytes`)
    expect(packSummary?.unpackedSize <= MAX_UNPACKED_BYTES, `unpacked package should stay at or below ${MAX_UNPACKED_BYTES} bytes`)
  } catch (error) {
    failures.push(`npm pack --dry-run should return JSON: ${error.message}`)
  }
}

if (failures.length) {
  console.error('Package contract checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Package export, CLI bin, and size contract checks passed (${packSummary.size} bytes packed, ${packSummary.unpackedSize} bytes unpacked).`)
