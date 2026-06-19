import test from 'node:test'
import assert from 'node:assert/strict'

import {
  resolveVscodeSync,
  validateThemeVersion,
  validateVscodeVersion,
} from '../scripts/version-utils.mjs'

test('stable theme versions sync directly to the VS Code extension', () => {
  assert.deepEqual(resolveVscodeSync({
    themeVersion: '1.4.0',
    currentVscodeVersion: '1.3.2',
  }), {
    action: 'sync',
    version: '1.4.0',
    reason: 'stable-theme-version',
  })
})

test('theme prereleases require an explicit VS Code prerelease mapping', () => {
  assert.deepEqual(resolveVscodeSync({
    themeVersion: '1.4.0-beta.1',
    currentVscodeVersion: '1.3.2',
  }), {
    action: 'skip',
    version: '1.3.2',
    reason: 'missing-vscode-prerelease-version',
  })
})

test('theme prereleases can map to an explicit Marketplace-compatible version', () => {
  assert.deepEqual(resolveVscodeSync({
    themeVersion: '1.4.0-beta.1',
    currentVscodeVersion: '1.3.2',
    explicitVscodePrereleaseVersion: '1.3.3',
  }), {
    action: 'sync',
    version: '1.3.3',
    reason: 'explicit-vscode-prerelease-version',
  })
})

test('theme prerelease mappings cannot reuse the eventual stable base version', () => {
  assert.throws(
    () => resolveVscodeSync({
      themeVersion: '1.4.0-beta.1',
      currentVscodeVersion: '1.3.2',
      explicitVscodePrereleaseVersion: '1.4.0',
    }),
    /would block the stable VS Code release/,
  )
})

test('theme versions must be semver with optional prerelease suffix', () => {
  assert.deepEqual(validateThemeVersion('1.4.0-beta.1'), {
    baseVersion: '1.4.0',
    isPrerelease: true,
  })

  assert.throws(() => validateThemeVersion('1.4'), /Invalid theme version/)
})

test('VS Code versions must be plain x.y.z', () => {
  assert.equal(validateVscodeVersion('1.3.3'), '1.3.3')
  assert.throws(() => validateVscodeVersion('1.4.0-beta.1'), /plain x.y.z/)
})
