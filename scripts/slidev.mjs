import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'

const DEFAULT_ENTRY = 'examples/example.md'
const require = createRequire(import.meta.url)
const slidevCliPath = require.resolve('@slidev/cli/bin/slidev.mjs')

const [, , mode, ...args] = process.argv

if (!mode) {
  console.error('Usage: node scripts/slidev.mjs <dev|build|export> [args] [entry.md]')
  process.exit(1)
}

const entryIndex = args.findIndex(arg => arg.endsWith('.md'))
const entry = entryIndex >= 0 ? args[entryIndex] : DEFAULT_ENTRY
const passthroughArgs = entryIndex >= 0 ? args.filter((_, i) => i !== entryIndex) : args

const slidevArgs = mode === 'dev'
  ? [entry, ...passthroughArgs]
  : [mode, entry, ...passthroughArgs]

const child = spawn(process.execPath, [slidevCliPath, ...slidevArgs], { stdio: 'inherit' })
child.on('exit', code => process.exit(code ?? 0))
child.on('error', () => process.exit(1))
