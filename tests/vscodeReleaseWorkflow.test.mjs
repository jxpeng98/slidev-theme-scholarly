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

test('VS Code release workflow publishes with Entra ID OIDC instead of PAT', () => {
  assert.match(
    jobSection('build', 'release'),
    /pnpm exec vsce package --pre-release/,
    'Pre-release tags must build a pre-release VSIX asset',
  )

  for (const [name, section] of [
    ['release', jobSection('release', 'prerelease')],
    ['prerelease', jobSection('prerelease')],
  ]) {
    assert.match(section, /environment:\s*vscode-marketplace/, `${name} job must use the Marketplace environment`)
    assert.match(section, /id-token:\s*write/, `${name} job must allow GitHub OIDC token minting`)
    assert.match(section, /uses:\s*azure\/login@v3/, `${name} job must login to Azure`)
    assert.match(section, /secrets\.AZURE_CLIENT_ID/, `${name} job must use the Azure client ID secret`)
    assert.match(section, /secrets\.AZURE_TENANT_ID/, `${name} job must use the Azure tenant ID secret`)
    assert.match(section, /secrets\.AZURE_SUBSCRIPTION_ID/, `${name} job must use the Azure subscription ID secret`)
    assert.match(section, /--azure-credential/, `${name} job must publish with Entra ID credentials`)
    assert.doesNotMatch(section, /VSCE_PAT|--pat\b/, `${name} job must not use PAT authentication`)
  }
})

test('VS Code publish scripts use local vsce with Entra ID credentials', () => {
  assert.equal(packageJson.devDependencies['@vscode/vsce'], '3.9.2')
  assert.equal(packageJson.scripts.package, 'vsce package')
  assert.equal(packageJson.scripts.publish, 'vsce publish --azure-credential')
  assert.equal(packageJson.scripts['publish:pre'], 'vsce publish --azure-credential --pre-release')
})
