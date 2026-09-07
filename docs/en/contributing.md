---
title: Contributing
---

# Contributing

## Set up the repository

Clone the repository and run the following from its root. Use Node.js 24 LTS and pnpm 10, matching the main CI quality gate:

```bash
git clone https://github.com/jxpeng98/slidev-theme-scholarly.git
cd slidev-theme-scholarly
pnpm install --frozen-lockfile
pnpm --dir vscode-extension install --frozen-lockfile
```

The theme and extension have separate dependency installs. The repository check includes both.

## Work on the relevant surface

| Change | Preview | Verify |
|---|---|---|
| Theme layouts, components, or styles | `pnpm run dev` | Inspect an example deck, then run `pnpm run check` |
| Documentation | `pnpm run docs:dev` | `pnpm run check:docs-workflows` and `pnpm run docs:build` |
| VS Code extension | `pnpm run vscode:compile`, then launch the extension development host | `pnpm --dir vscode-extension run test` and `pnpm run check` |

Use the root `docs:*` commands for documentation development and CI parity. English pages live in `docs/en/`; Simplified Chinese pages live in `docs/zh/`. Update both versions, preserve existing URLs and explicit anchors, and keep code examples runnable. Historical plans under `docs/superpowers/` are excluded from the website.

Stop development servers before running browser checks. For rendered changes, install Chromium and run the visual gate:

```bash
pnpm exec playwright install chromium
pnpm run check:visual
```

`check` runs package, catalog, CLI, example parsing, docs build, and unit checks. `check:visual` also checks browser workflows and exported slides. Use the [script guide](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/scripts/README.md) to regenerate only the previews affected by your change.

## Theme and preview changes {#theme-and-preview-changes}

Theme selection is exposed through data attributes:

- `[data-color-theme="..."]` and `[data-font-theme="..."]` select presets.
- `[data-content-mode="..."]`, `[data-chrome-mode="..."]`, and
  `[data-section-mode="..."]` select resolved surface modes.
- `data-color-mode` remains only as a legacy mirror of `data-content-mode`.

Use the existing chrome, content, accent, semantic, and interaction CSS tokens;
do not hard-code component colors. Change a background token and its foreground
token together so the combination stays readable.

After changing a theme, regenerate its first four preview slides:

```bash
pnpm run export:theme-images
```

The repository [script guide](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/scripts/README.md)
lists the layout, component, theme-matrix, and VS Code preview workflows.

## License

The project uses the MIT License. See [LICENSE](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/LICENSE).

## Support

- **Documentation:** [Slidev documentation](https://sli.dev)
- **Issues:** [GitHub Issues](https://github.com/jxpeng98/slidev-theme-scholarly/issues)
- **Discussions:** [GitHub Discussions](https://github.com/slidevjs/slidev/discussions)
