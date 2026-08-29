# Preview and Release Scripts

[中文说明](./README-zh.md)

Run all commands from the repository root.

## Install the tools

```bash
pnpm install
pnpm exec playwright install chromium
```

The browser install is required only for PNG and PDF export.

## Generate preview images

| Command | Output |
|---|---|
| `pnpm run export:layout-screenshots` | 34 layout images in `docs/public/images/layouts/` |
| `pnpm run export:component-screenshots` | Component images in `docs/public/images/components/` |
| `pnpm run export:theme-images` | Theme images in `docs/public/images/themes/` |
| `pnpm run export:all-screenshots` | All three sets above |

The layout exporter reads `generate-layout-screenshots.md`, maps each slide to
its layout name, and replaces the published images only after a complete export.
For a browser-based fallback, see the [manual layout guide](./SCREENSHOT-GUIDE.md).

## Check theme combinations

```bash
pnpm run theme:matrix
```

This creates light and dark previews under
`/private/tmp/scholarly-theme-matrix/<color-theme>/<color-mode>/`. To validate
the matrix without opening Playwright, run:

```bash
node scripts/check-theme-matrix.mjs --dry-run
```

## Check a deck

```bash
node cli/scholarly.mjs doctor
node cli/scholarly.mjs doctor --json
```

The text form explains warnings and suggested actions. The JSON form is for
automation and editor integrations. Warnings do not fail the command; errors do.

## Sync VS Code previews

After changing layouts, components, themes, templates, or source screenshots:

```bash
node vscode-extension/scripts/sync-shared-data.mjs
node vscode-extension/scripts/sync-snippets.mjs
node vscode-extension/scripts/sync-previews.mjs
node scripts/check-vscode-metadata-previews.mjs
```

To check for stale previews without changing files, run this in CI or before a release:

```bash
node vscode-extension/scripts/sync-previews.mjs --check
```

## Troubleshooting

- `Cannot find module 'playwright'`: run `pnpm install`.
- Chromium is missing: run `pnpm exec playwright install chromium`.
- A preview is hard to read: edit its source deck, regenerate the relevant set,
  and inspect the output before committing it.
