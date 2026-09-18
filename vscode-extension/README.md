# Slidev Scholarly

Create and edit academic Slidev decks in VS Code with templates, layout previews, components, citations, and theme controls. The extension follows VS Code's display language and includes English and Simplified Chinese.

[User guide](https://scholarly-docs.jxpeng.dev/en/guide/vscode-extension) · [中文指南](https://scholarly-docs.jxpeng.dev/zh/guide/vscode-extension) · [Theme documentation](https://scholarly-docs.jxpeng.dev/en/)

## Install and open

Install **Slidev Scholarly** from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets). Requires VS Code 1.106.0 or newer.

Open a Markdown file, run `Slidev Scholarly: Open Sidebar`, and find the views in the Secondary Side Bar. The presentation project needs Slidev and `slidev-theme-scholarly` for preview, build, and export; the extension provides editing tools.

## Choose how to start

| Action | Result |
|---|---|
| Choose a template in **Start · Templates** | Creates a complete project through the Scholarly CLI. Choose a new or empty folder, install dependencies, then run `pnpm run dev`. |
| Run **Slidev Scholarly: Open Deck Builder** | Drafts an outline, then creates an untitled Markdown document or appends the selected slide to the active Markdown file. |
| Run **Slidev Scholarly: Create Presentation** from the Command Palette | Creates a starter Markdown file in the workspace, or an untitled document when no workspace is open. |

Deck Builder does not create `package.json` or a bibliography. For a workflow with citations, choose **Create template project** in the generation notification, then save the generated outline in that project beside `references.bib`.

## Build and customize

- **Build · Layouts** inserts a whole-slide snippet at the cursor. Use the eye icon to preview it.
- **Build · Components** inserts theorems, metrics, evidence, and other content within a slide.
- **Build · Citations & Anchors** lists BibTeX entries and internal destinations.
- **Customize · Themes** updates the active document's frontmatter with a preset, font, palette, or surface mode.
- **Reference · CLI Actions** runs project setup, snippet, workflow, theme, and diagnostic commands.

The sidebar inserts snippets at the cursor; Deck Builder's **Append selected slide** adds a page at the end of the file. Check the page boundary when inserting a whole-slide snippet manually.

### Completions and snippets

| Trigger | Suggestions |
|---|---|
| `layout:` | Layout names |
| `colorTheme:`, `fontTheme:` | Palettes and fonts |
| `contentMode:`, `chromeMode:`, `sectionMode:` | Surface modes |
| `<` or `:::` | Components or Markdown directives |
| `](#`, `href="#`, `to="#` | Internal anchors |
| `ss-` or `scholarly-` | Snippets such as `ss-cover`, `ss-theorem`, and `ss-cite` |

Press `Ctrl+Space` for suggestions. Use Slidev's browser preview to check the rendered deck.

## Check citations

Citation diagnostics report missing bibliography configuration or files, duplicate keys, unresolved citations, and missing reference slides. Quick Fix actions handle common repairs. Use `Slidev Scholarly: Insert Citation` to select a BibTeX entry.

For troubleshooting, Deck Builder details, and theme settings, see the [user guide](https://scholarly-docs.jxpeng.dev/en/guide/vscode-extension).

## Develop the extension

From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm --dir vscode-extension install --frozen-lockfile
pnpm --dir vscode-extension run compile
pnpm --dir vscode-extension run test
pnpm --dir vscode-extension run package
```

Install the generated `.vsix` with `Extensions: Install from VSIX...`.

`Slidev Scholarly: Toggle Dev Mode` enables timing logs in the **Slidev Scholarly** output channel. Settings are `slidevScholarly.devMode.enabled` and `slidevScholarly.devMode.slowThresholdMs` (default: `25`). See [Contributing](https://scholarly-docs.jxpeng.dev/en/contributing) for the repository workflow.

## Publish locally

Extension release tags do not run a GitHub Actions publishing job. Build and
check each VSIX locally, then publish that exact file with an authenticated
`vsce` session:

```bash
cd vscode-extension
pnpm exec vsce package --out /tmp/scholarly-stable.vsix
node scripts/check-vsix.mjs /tmp/scholarly-stable.vsix
pnpm exec vsce publish --packagePath /tmp/scholarly-stable.vsix
```

For a Beta package, add `--pre-release` to both the package and publish commands.
Keep channel-specific filenames. GitHub Releases can distribute stable and Beta
VSIX files with the same manifest version; Marketplace rejects a second upload
of the same extension version and target platform, even for a different channel.
A separate Marketplace Beta release therefore needs a distinct version number.

## License

MIT
