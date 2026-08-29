---
title: Contributing
---

# Contributing

Fixes and improvements are welcome. Install the repository dependencies first:

```bash
pnpm install
```

Start the example deck while you work:

```bash
pnpm run dev
```

After stopping the development server, run the repository checks:

```bash
pnpm run check
```

If the change affects rendered slides or preview images, also regenerate the
exports and screenshots:

```bash
pnpm run export
pnpm run screenshot
```

Edit `examples/example.md` or `examples/example-zh.md`, then check the change in a real deck.

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
