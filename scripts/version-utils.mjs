const THEME_VERSION_RE = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*))?$/
const VSCODE_VERSION_RE = /^\d+\.\d+\.\d+$/

export function validateThemeVersion(version) {
  const match = THEME_VERSION_RE.exec(version)

  if (!match)
    throw new Error(`Invalid theme version "${version}". Expected x.y.z or x.y.z-prerelease.`)

  return {
    baseVersion: `${match[1]}.${match[2]}.${match[3]}`,
    isPrerelease: Boolean(match[4]),
  }
}

export function validateVscodeVersion(version) {
  if (!VSCODE_VERSION_RE.test(version))
    throw new Error(`Invalid VS Code version "${version}". Marketplace versions must be plain x.y.z.`)

  return version
}

export function resolveVscodeSync({
  themeVersion,
  currentVscodeVersion,
  explicitVscodePrereleaseVersion,
}) {
  const theme = validateThemeVersion(themeVersion)

  if (!theme.isPrerelease) {
    return {
      action: 'sync',
      version: themeVersion,
      reason: 'stable-theme-version',
    }
  }

  if (!explicitVscodePrereleaseVersion) {
    return {
      action: 'skip',
      version: currentVscodeVersion,
      reason: 'missing-vscode-prerelease-version',
    }
  }

  const vscodeVersion = validateVscodeVersion(explicitVscodePrereleaseVersion)

  if (vscodeVersion === theme.baseVersion) {
    throw new Error(
      `VS Code prerelease version ${vscodeVersion} would block the stable VS Code release ${theme.baseVersion}. ` +
      'Use a different plain x.y.z version for the Marketplace prerelease channel.',
    )
  }

  return {
    action: 'sync',
    version: vscodeVersion,
    reason: 'explicit-vscode-prerelease-version',
  }
}
