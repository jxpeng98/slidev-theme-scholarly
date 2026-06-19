import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const providersSource = await readFile(
  new URL('../vscode-extension/src/providers.ts', import.meta.url),
  'utf8',
)

test('VS Code providers initialize shared data before module-level usage', () => {
  const sharedDataImportIndex = providersSource.indexOf("from './sharedData'")
  assert.notEqual(sharedDataImportIndex, -1)

  const firstModuleScopeUsageIndex = Math.min(
    providersSource.indexOf('function createComponentSnippetItem'),
    providersSource.indexOf('export const layoutCategories'),
    providersSource.indexOf('export class TemplatesProvider'),
  )

  assert.ok(
    sharedDataImportIndex < firstModuleScopeUsageIndex,
    'sharedData must be imported before constants are used at module scope',
  )
})
