---
title: VS Code Extension
---

# VS Code Extension

The extension brings Scholarly's templates, layouts, components, citations, theme controls, and project checks into VS Code. Its sidebar follows the usual workflow: start, build, customize, then check.

The interface follows the VS Code display language. English and Simplified Chinese are included.

## Install

Install **Slidev Scholarly** from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets).

## Open the extension

1. Open a Markdown file.
2. Open the Secondary Side Bar.
3. Select **Slidev Scholarly**.

The sidebar is ordered by task:

| Stage | View | Purpose |
|---|---|---|
| Start | **Start · Templates** | Create a deck from a template |
| Build | **Build · Layouts** | Insert a whole-slide structure |
| Build | **Build · Components** | Insert theorems, metrics, evidence, and other content |
| Build | **Build · Citations & Anchors** | Insert BibTeX keys, summaries, and internal links |
| Customize | **Customize · Themes** | Set presets, colors, fonts, and light or dark modes |
| Reference | **Reference · CLI Actions** | Run CLI tasks, the doctor, and help |

<figure class="docs-screenshot docs-screenshot--narrow">
  <img src="/images/vscode/sidebar-overview.png" alt="Slidev Scholarly sidebar in VS Code with templates, layouts, components, citations, and theme sections" loading="lazy">
  <figcaption>Keep the sidebar beside your Markdown and work through it from top to bottom.</figcaption>
</figure>

## 1. Start a deck

Choose a template from **Start · Templates**, or run:

```text
Slidev Scholarly: Create Presentation
```

The template creates a regular Markdown file that you can edit directly.

### Build an outline with Deck Builder

Run `Slidev Scholarly: Open Deck Builder`, then follow the three columns:

1. Choose a workflow, such as a paper talk or thesis defense.
2. Check each layout thumbnail, then add or reorder slides.
3. Select a slide and write its content.

Create the Markdown deck when the outline is ready, or insert only the selected slide into the active file. Continue editing and previewing in Slidev.

<figure class="docs-screenshot">
  <img src="/images/vscode/gui-builder.png" alt="Slidev Scholarly Deck Builder showing workflow choices, a slide outline, and the selected layout content fields" loading="lazy">
  <figcaption>Choose a workflow, understand the layouts, then write the first draft.</figcaption>
</figure>

## 2. Build the slides

### Insert layouts and components

Choose a layout or component from the sidebar. Selecting an item inserts its Markdown at the cursor; the eye icon opens a visual preview first.

Use:

- [Layouts](../layouts/) for whole-slide structure;
- [Components](../components/) for theorems, metrics, evidence, and other content;
- [Citations](../components/cite) for BibTeX references and footnotes.

### Use completions as you type

| Trigger | Suggestions |
|---|---|
| `layout:` | Layout names |
| `colorTheme:`, `fontTheme:` | Theme values |
| `contentMode:`, `chromeMode:`, `sectionMode:` | Light and dark modes |
| `<` | Scholarly components |
| `:::` | Markdown directives |
| `](#`, `href="#`, `to="#` | Internal anchors |
| `ss-`, `scholarly-` | Built-in snippets |

Press `Ctrl+Space` if suggestions do not open automatically.

### Insert citations and anchors

**Build · Citations & Anchors** lists BibTeX entries and internal anchors from the active document.

Available commands include:

- `Slidev Scholarly: Insert Citation`
- `Slidev Scholarly: Insert Internal Anchor`
- `Slidev Scholarly: Insert Internal Anchor Reference`
- `Slidev Scholarly: Insert Paper Summary`

### Use snippets

Type a prefix and press `Tab`:

| Prefix | Inserts |
|---|---|
| `ss-cover` | Cover slide |
| `ss-section` | Section divider |
| `ss-figure` | Figure with caption |
| `ss-theorem` | Theorem component |
| `ss-results` | Results layout |
| `ss-cite` | BibTeX citation |
| `ss-anchor` | Internal anchor |
| `ss-frontmatter` | Scholarly frontmatter |

Browse the full catalog from the completion list or sidebar. Legacy `scholarly-*` prefixes still work.

## 3. Customize the deck

**Customize · Themes** contains four groups:

- **Presets**
- **Color Themes**
- **Font Themes**
- **Light & Dark Modes**

Theme actions update frontmatter in the active Markdown file. They do not rewrite slide content.

<figure class="docs-screenshot">
  <img src="/images/vscode/theme-controls.png" alt="Slidev Scholarly color theme picker open in VS Code" loading="lazy">
  <figcaption>Choose a theme in the sidebar or Command Palette. The extension writes the change to frontmatter.</figcaption>
</figure>

## 4. Check and get help

**Reference · CLI Actions** groups commands by task:

| Group | Actions |
|---|---|
| Start | Create a presentation or list templates |
| Build | List layouts and components, add snippets, or apply workflows |
| Customize | Set a theme or list presets |
| Check & Help | Run `doctor` or show CLI help |

### Citation diagnostics

When a deck contains `@citekey` or `!@citekey`, the extension checks for:

- missing `bibFile` configuration;
- missing `.bib` files;
- duplicate or unresolved keys;
- a missing `layout: references` slide.

Quick Fix can repair the common cases.

## Troubleshooting

### Suggestions or snippets do not appear

1. Confirm that the extension is installed and enabled.
2. Open a `.md` file.
3. Press `Ctrl+Space`.

### The sidebar is missing

1. Run `View: Toggle Secondary Side Bar`.
2. Run `View: Reset View Locations` if the view is still missing.

## Extension development

<details>
<summary>Install a local VSIX</summary>

1. Download or build the `.vsix` file.
2. Open the Command Palette with `Cmd+Shift+P` or `Ctrl+Shift+P`.
3. Run `Extensions: Install from VSIX...`.
4. Select the file and reload VS Code.

</details>

<details>
<summary>Turn on developer diagnostics</summary>

Run `Slidev Scholarly: Toggle Dev Mode`. The status bar shows `Scholarly Dev`, and the **Slidev Scholarly** output channel records timing logs.

Settings:

- `slidevScholarly.devMode.enabled`
- `slidevScholarly.devMode.slowThresholdMs` (default: `25`)

</details>

Report bugs and feature requests on [GitHub](https://github.com/jxpeng98/slidev-theme-scholarly/issues).
