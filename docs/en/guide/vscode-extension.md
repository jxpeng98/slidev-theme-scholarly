---
title: VS Code Extension
---

# VS Code Extension

We provide a VS Code extension to boost your productivity when creating Slidev presentations with this theme.

## Features

- 🎯 **Secondary Side Bar Panel** - Quick access to layouts, components, templates, themes, references, and CLI actions
- ✨ **Code Snippets** - Type `ss-` or `scholarly-` to trigger snippets for layouts and components
- ⚡ **Smart Completion** - Context-aware candidates for `layout:`, `themeConfig`, components (`<...>`), and directives (`:::`)
- 📝 **One-Click Insert** - Click any item in the panel to insert code at cursor position
- 🚀 **New Presentation** - Create a new presentation with pre-configured template
- 🎨 **Theme Presets** - Apply `themeConfig.colorTheme` / `themeConfig.fontTheme` from the Themes view
- 📚 **References & Anchors** - BibTeX completion/hover, internal-anchor completion, a unified References view, and command-palette insertion for both anchor definitions and references
- 🧭 **Citation Diagnostics** - Inline warnings and quick fixes for missing bibliography setup, unresolved cite keys, duplicate BibTeX keys, and missing references slides
- 🧪 **Dev Mode** - Built-in performance diagnostics with timing logs and slow-operation markers

## Installation

### From VSIX File

1. Download the `.vsix` file from the [release page](https://github.com/jxpeng98/slidev-theme-scholarly/releases)
2. In VS Code, press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "Extensions: Install from VSIX" and select the downloaded file
4. Reload VS Code

## Usage

### Using Code Snippets

Type the prefix in any Markdown file to trigger auto-completion:

```markdown
ss-cover      # Insert cover layout
ss-theorem    # Insert theorem component
ss-block      # Insert block component
scholarly-cite # Insert citation
```

Press `Tab` to move between placeholders in the inserted snippet.

### Smart Completion While Typing

The extension also provides context-aware completion suggestions:

- `layout:` -> layout names (`cover`, `section`, `results`, ...)
- `colorTheme:` / `fontTheme:` / `colorMode:` -> theme values
- `<` -> Scholarly components (`Theorem`, `Block`, `Columns`, ...)
- `:::` -> Markdown syntax sugar directives (`theorem`, `block`, `keywords`, ...)
- `](#` / `href="#` / `to="#` -> internal anchor ids from the current document
- `ss-` / `scholarly-` -> built-in snippet candidates

If suggestions are not shown automatically, use `Ctrl+Space` (or `Cmd+Space` on macOS if available).

### Citation Diagnostics And Quick Fixes

When a Markdown deck contains `@citekey` or `!@citekey`, the extension checks the active file for:

- missing `bibFile` frontmatter or default `references.bib`
- missing `.bib` files
- duplicate BibTeX keys
- unresolved citation keys
- missing `layout: references` slide

Quick Fix actions can add `bibFile: ./references.bib`, create the missing bibliography file, append a BibTeX stub for an unresolved key, or add a references slide. The diagnostics reuse the same shared citation parser as `sch doctor`, so Vue event handlers, emails, URLs, inline code, and fenced code blocks are ignored.

### Insert Internal Anchors

The Command Palette now includes two dedicated anchor commands:

- `Insert Internal Anchor` -> create a new anchor at the cursor using `::anchor{#anchor-id}`, `{#anchor-id}`, or `id="anchor-id"`
- `Insert Internal Anchor Reference` -> pick an existing anchor from the current Markdown document and insert `#anchor-id`

If you prefer snippets, type `ss-anchor` to insert a standalone anchor marker quickly.

### Dev Mode For Performance Testing

Enable dev mode when you need to profile extension behavior:

- Command Palette: `Slidev Scholarly: Toggle Dev Mode`
- Settings:
  - `slidevScholarly.devMode.enabled`
  - `slidevScholarly.devMode.slowThresholdMs` (default `25`)

After enabling:

- You will see a `Scholarly Dev` indicator in the status bar
- Performance logs are printed to the `Slidev Scholarly` output channel
- Operations slower than your threshold are tagged as `SLOW`

If you develop the extension locally, use the debug target `Run Extension (Dev Mode)` in `vscode-extension/.vscode/launch.json`.

### Using Secondary Side Bar

1. Open the **Secondary Side Bar** on the right and select **Slidev Scholarly**
2. Browse through six sections:
   - **Layouts** - Slide layouts organized by category:
     - *Structure* - cover, default, intro, section, center, auto-center, auto-size, toc, end
     - *Content* - two-cols, image-left/right, bullets, figure, split-image
     - *Emphasis* - quote, fact, statement, focus
     - *Academic* - compare, methodology, results, timeline, agenda, acknowledgments, references
   - **Components** - Built-in Vue components
   - **Templates** - Pre-made presentation templates
   - **Themes** - Apply theme presets (updates frontmatter)
   - **References** - Browse both BibTeX citations and internal anchors, then insert cite keys or `#anchor-id` targets
   - **CLI** - Run Scholarly CLI actions from sidebar:
     - *Create* - new presentation and template list
     - *Theme* - apply/list themes, apply preset combos, list layouts/components
     - *Snippets* - append/show/list snippets, append workflows
     - *Tools* - doctor and help
3. Click an item (or the `+` button where available) to insert/apply

### Creating New Presentation

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type "Slidev Scholarly: New Presentation"
3. Choose a location and filename
4. A new file will be created with the basic template

## Available Snippets

### Layout Snippets

Layouts are organized into four categories. You can use category-specific prefixes (`ss-structure-*`, `ss-content-*`, `ss-emphasis-*`, `ss-academic-*`) or the shorter `ss-*` prefix.

The `ss-*` prefixes are the canonical snippet labels shown in completion. Legacy `scholarly-*` aliases remain available through the extension's smart completion for compatibility.

#### Structure Layouts

| Prefix | Description |
|--------|-------------|
| `ss-cover` | Cover/title slide |
| `ss-default` | Default content slide |
| `ss-intro` | Section introduction |
| `ss-section` | Section divider (supports `sectionMode: dark/light`) |
| `ss-center` | Centered content |
| `ss-auto-center` | Auto-adjusting centered content |
| `ss-auto-size` | Default flow with `autoSizeGrow`, `autoSizeAlign`, and `autoSizePadding` controls |
| `ss-toc` | Auto-generated table of contents grouped by sections |
| `ss-end` | Thank you/closing slide |

Note: if you enable `themeConfig.outlineToc: true` in frontmatter, the footer TOC in play mode uses the same section grouping. On desktop play mode, hovering or focusing TOC items also shows a slide preview.

#### Content Layouts

| Prefix | Description |
|--------|-------------|
| `ss-two-cols` | Two-column layout |
| `ss-image-left` | Image on left, text on right |
| `ss-image-right` | Image on right, text on left |
| `ss-bullets` | Enhanced bullet list |
| `ss-figure` | Academic figure with caption |
| `ss-split-image` | Side-by-side image comparison |

#### Emphasis Layouts

| Prefix | Description |
|--------|-------------|
| `ss-quote` | Quote with author attribution |
| `ss-fact` | Single fact/statistic |
| `ss-statement` | Important statement |
| `ss-focus` | Focused statement with icon |

#### Academic Layouts

| Prefix | Description |
|--------|-------------|
| `ss-compare` | Side-by-side comparison |
| `ss-methodology` | Research methodology |
| `ss-results` | Results dashboard |
| `ss-timeline` | Research timeline |
| `ss-agenda` | Agenda/overview |
| `ss-acknowledgments` | Acknowledgments slide |
| `ss-references` | Bibliography slide |

### Component Snippets

| Prefix | Description |
|--------|-------------|
| `ss-theorem` | Theorem/lemma/definition |
| `ss-block` | Beamer-style colored block |
| `ss-steps` | Workflow/process steps |
| `ss-steps-md` | Workflow/process steps (Markdown syntax sugar) |
| `ss-keywords` | Keyword tags |
| `ss-keywords-md` | Keyword tags (Markdown syntax sugar) |
| `ss-columns` | Multi-column layout |
| `ss-columns-md` | Multi-column layout (Markdown syntax sugar) |
| `ss-highlight` | Text highlighting |
| `ss-highlight-md` | Text highlighting (Markdown syntax sugar) |
| `ss-cite` | BibTeX citation `@citekey` |
| `ss-cite-multi` | Grouped BibTeX citations |
| `ss-cite-note` | Footnote-like manual citation note |
| `ss-anchor` | Standalone internal anchor `::anchor{#anchor-id}` |
| `ss-cite-comp` | Cite component (non-BibTeX) |
| `ss-cite-md` | Cite component (Markdown syntax sugar) |
| `ss-theme-preview` | ThemePreview component |
| `ss-bibliography` | Bibliography placeholder |
| `ss-references-slide` | References slide |

### Theme Preset Snippets

| Prefix | Description |
|--------|-------------|
| `ss-theme-classic` | Classic Blue + Classic fonts |
| `ss-theme-oxford` | Oxford Burgundy + Traditional fonts |
| `ss-theme-cambridge` | Cambridge Green + Elegant fonts |
| `ss-theme-modern` | Monochrome + Sans-default fonts |

### Utility Snippets

| Prefix | Description |
|--------|-------------|
| `ss-frontmatter` | Full frontmatter configuration |
| `ss-slide` / `---` | Slide divider |

## Tips

### Quick Layout Selection

When you need a specific layout, just type `ss-` and browse through the autocomplete suggestions. Each snippet includes helpful placeholders for common options.

### Combining with Markdown Syntax Sugar

The extension works great with the [Markdown Syntax Sugar](../syntax-sugar.md) feature. You can use either:

```markdown
<!-- Using Vue component (from snippet) -->
<Theorem type="theorem" title="Main Result">
Content here
</Theorem>

<!-- Using Markdown directive -->
:::theorem{type="theorem" title="Main Result"}
Content here
:::
```

### Customizing Snippets

If you want to modify the snippets, you can:

1. Open VS Code Settings
2. Search for "Configure User Snippets"
3. Select "markdown.json"
4. Add your custom snippets

## Troubleshooting

### Snippets Not Showing

1. Make sure the extension is installed and enabled
2. Check that you're editing a `.md` file
3. Try pressing `Ctrl+Space` to manually trigger suggestions

### Slidev Scholarly View Missing

1. Run `View: Toggle Secondary Side Bar`
2. If the view is still not on the right, run `View: Reset View Locations`

## Feedback

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/jxpeng98/slidev-theme-scholarly/issues).
