import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

test('VS Code preview screenshots match snippet and generator prompts', () => {
  const result = spawnSync(process.execPath, ['scripts/check-vscode-preview-prompts.mjs'], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, result.stderr || result.stdout)
})
