import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packagePath = path.join(root, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
const failures = []

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

if (failures.length) {
  console.error('Package contract checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Package export and CLI bin contract checks passed.')
