import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const workflow = readFileSync(new URL('../.github/workflows/vscode-release.yml', import.meta.url), 'utf8')
const packageJson = JSON.parse(readFileSync(new URL('../vscode-extension/package.json', import.meta.url), 'utf8'))

function jobSection(name, nextName) {
  const start = workflow.indexOf(`  ${name}:`)
  assert.notEqual(start, -1, `Missing ${name} job`)

  if (!nextName) {
    return workflow.slice(start)
  }

  const end = workflow.indexOf(`  ${nextName}:`, start + 1)
  assert.notEqual(end, -1, `Missing ${nextName} job`)
  return workflow.slice(start, end)
}

test('VS Code release workflow creates VSIX GitHub releases without Azure publishing', () => {
  assert.match(
    jobSection('build', 'release'),
    /pnpm exec vsce package --pre-release/,
    'Pre-release tags must build a pre-release VSIX asset',
  )

  for (const [name, section] of [
    ['release', jobSection('release', 'prerelease')],
    ['prerelease', jobSection('prerelease')],
  ]) {
    assert.match(section, /contents:\s*write/, `${name} job must be able to create GitHub releases`)
    assert.match(section, /uses:\s*actions\/download-artifact@v4/, `${name} job must download the VSIX artifact`)
    assert.match(section, /uses:\s*softprops\/action-gh-release@v1/, `${name} job must create a GitHub release`)
    assert.match(section, /files:\s*\.\/vsix\/\*\.vsix/, `${name} job must attach the VSIX asset`)
    assert.doesNotMatch(section, /environment:\s*vscode-marketplace/, `${name} job must not require Marketplace environment secrets`)
    assert.doesNotMatch(section, /id-token:\s*write/, `${name} job must not require GitHub OIDC token minting`)
    assert.doesNotMatch(section, /uses:\s*azure\/login@v3/, `${name} job must not login to Azure`)
    assert.doesNotMatch(section, /secrets\.AZURE_/, `${name} job must not require Azure secrets`)
    assert.doesNotMatch(section, /--azure-credential/, `${name} job must not publish with Entra ID credentials`)
    assert.doesNotMatch(section, /VSCE_PAT|--pat\b/, `${name} job must not require PAT authentication`)
  }
})

test('VS Code publish scripts use local vsce without Azure-only flags', () => {
  assert.equal(packageJson.devDependencies['@vscode/vsce'], '3.9.2')
  assert.equal(packageJson.scripts.package, 'vsce package')
  assert.equal(packageJson.scripts.publish, 'vsce publish')
  assert.equal(packageJson.scripts['publish:pre'], 'vsce publish --pre-release')
})
