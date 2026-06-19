# Versioning & Release Tags

本仓库包含两个可发布产物，但现在采用同一条 release train：

1. **Slidev 主题（npm）**：`slidev-theme-scholarly`
2. **VS Code 插件（Marketplace / VSIX）**：`slidev-scholarly-snippets`

The repo contains two deliverables on one release train:

1. **Slidev Theme (npm)**: `slidev-theme-scholarly`
2. **VS Code Extension (Marketplace / VSIX)**: `slidev-scholarly-snippets`

## Policy

- **唯一版本真源 / Source of truth**: root `package.json`
- `docs/package.json` always follows the root theme version.
- Stable releases use the same `X.Y.Z` version for the theme and VS Code extension.
- Theme pre-releases may use npm semver suffixes such as `1.4.0-beta.1`.
- VS Code Marketplace versions must be plain `X.Y.Z`; pre-release channel builds use an explicit mapped version and must not reuse the future stable base version.

Example:

| Release | Theme version | VS Code extension version | Channel |
| --- | --- | --- | --- |
| Beta | `1.4.0-beta.1` | `1.3.3` | npm `next`, VS Code pre-release |
| Stable | `1.4.0` | `1.4.0` | npm `latest`, VS Code stable |

The beta mapping is intentionally not a literal version match. It avoids consuming `1.4.0` in the VS Code Marketplace before the stable extension release.

## Commands

### Stable release preparation

```bash
pnpm bump patch
pnpm bump minor
pnpm bump major
pnpm bump 1.4.0
```

Stable bumps update:

- `package.json`
- `docs/package.json`
- `vscode-extension/package.json`

### Theme pre-release preparation

For npm-only theme pre-releases:

```bash
pnpm bump 1.4.0-beta.1
```

This updates the root theme and docs versions, but keeps `vscode-extension/package.json` unchanged.

For a paired VS Code Marketplace pre-release:

```bash
pnpm bump 1.4.0-beta.1 -- --vscode-prerelease-version 1.3.3
```

The mapped VS Code version must be plain `X.Y.Z` and must not equal the future stable base version (`1.4.0` in this example).

### Sync after manual edits

```bash
pnpm version:sync
pnpm version:sync -- --vscode-prerelease-version 1.3.3
```

`pnpm version:sync` copies the root version to docs and, for stable root versions, to the VS Code extension. For root pre-release versions, pass `--vscode-prerelease-version` only when intentionally preparing a VS Code pre-release build.

## Tags

### Theme tags

- Stable npm release: `vX.Y.Z`
- npm pre-release: `vX.Y.Z-beta.N`

Theme tags trigger `.github/workflows/release.yml`:

- Stable tags publish npm `latest`.
- Pre-release tags publish npm `next`.

### VS Code tags

- Stable VSIX release: `vscode-vX.Y.Z`
- Pre-release VSIX release: `vscode-pre-vX.Y.Z`

VS Code tags trigger `.github/workflows/vscode-release.yml`.

Use the VS Code package version for these tags:

```bash
pnpm run tag:vscode
pnpm run tag:vscode:pre
```

## Release Checklist

Before creating release tags:

1. Run `pnpm run check`.
2. If the release changes styles, layouts, components, screenshots, or color tokens, run `pnpm run check:visual`.
3. Inspect generated visual output under `/private/tmp/scholarly-theme-matrix/` when visual checks are enabled.
4. Run `pnpm version:sync` after manual root version edits.
5. For theme pre-releases, decide whether this is npm-only or paired with a VS Code pre-release.
6. For paired VS Code pre-releases, choose a plain mapped version that does not equal the future stable base version.

There is no separate `bump:vscode` workflow anymore. Stable VS Code versions move with the root theme version; pre-release VS Code versions are explicit mappings in the shared release process.
