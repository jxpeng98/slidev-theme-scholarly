import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

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

function expectIncludes(name, text, needle) {
  if (!text.includes(needle))
    failures.push(`${name} should include "${needle}"`)
}

function expectEqual(name, actual, expected) {
  if (actual !== expected)
    failures.push(`${name} should match shared citation parser source`)
}

const sharedSourcePath = path.join(root, 'shared', 'citations.mjs')
const extensionSharedPath = path.join(extensionRoot, 'shared', 'citations.mjs')
const diagnosticsSourcePath = path.join(extensionRoot, 'src', 'citationDiagnostics.ts')
const extensionSourcePath = path.join(extensionRoot, 'src', 'extension.ts')

const sharedSource = await readText(sharedSourcePath)
const extensionShared = await readText(extensionSharedPath)
const diagnosticsSource = await readText(diagnosticsSourcePath)
const extensionSource = await readText(extensionSourcePath)

expectIncludes('shared/citations.mjs', sharedSource, 'export function collectCitationReferences')
expectEqual('vscode-extension/shared/citations.mjs', extensionShared, sharedSource)

if (extensionShared) {
  const citations = await import(`${pathToFileURL(extensionSharedPath).href}?check=${Date.now()}`)
  const refs = citations.collectCitationReferences?.(`Resolved @smith2026 and !@lee2025.

<button @click="run" @keyup.enter="submit">Run</button>

Ignore escaped \\@literal2026, emails person@example.com, URLs https://example.com/@handle, and \`@inlineCode\`.
`)

  if (!Array.isArray(refs) || refs.length !== 2)
    failures.push('collectCitationReferences should return only real citation markers')
  else {
    if (refs[0].key !== 'smith2026' || refs[0].marker !== '@smith2026')
      failures.push('collectCitationReferences should preserve the parenthetical citation marker')
    if (refs[1].key !== 'lee2025' || refs[1].marker !== '!@lee2025')
      failures.push('collectCitationReferences should preserve the narrative citation marker')
    if (typeof refs[0].index !== 'number' || refs[0].index < 0)
      failures.push('collectCitationReferences should expose source indexes for diagnostics')
  }
}

expectIncludes('citationDiagnostics.ts', diagnosticsSource, 'export class CitationDiagnosticsController')
expectIncludes('citationDiagnostics.ts', diagnosticsSource, "createDiagnosticCollection('slidev-scholarly-citations')")
expectIncludes('citationDiagnostics.ts', diagnosticsSource, 'export class CitationCodeActionProvider')
expectIncludes('citationDiagnostics.ts', diagnosticsSource, 'Add bibFile: ./references.bib')
expectIncludes('citationDiagnostics.ts', diagnosticsSource, 'Add references slide')
expectIncludes('extension.ts', extensionSource, "from './citationDiagnostics'")
expectIncludes('extension.ts', extensionSource, 'registerCitationDiagnostics(context')

if (failures.length) {
  console.error('VS Code citation diagnostics checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('VS Code citation diagnostics checks passed.')
