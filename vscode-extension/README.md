# Slidev Scholarly Snippets

VS Code extension for quickly inserting Slidev Theme Scholarly layouts and components.

## Features

### 🎯 Secondary Side Bar Panel

The extension adds a dedicated panel in the VS Code Secondary Side Bar with six sections:

- **Layouts** - Slide layouts organized by category:
  - *Structure* - cover, default, intro, section, center, auto-center, auto-size, toc, end
  - *Content* - two-cols, image-left/right, bullets, figure, split-image
  - *Emphasis* - quote, fact, statement, focus
  - *Academic* - compare, methodology, results, timeline, agenda, acknowledgments, references
- **Components** - Vue components and syntax sugar
- **Templates** - Quick-start presentation templates
- **Themes** - Apply `themeConfig` presets (colorTheme / fontTheme)
- **References** - Browse BibTeX citations and internal anchors, then insert cite keys or `#anchor-id`
- **CLI** - Run Scholarly CLI actions directly from sidebar:
  - *Create* - `init` and template list
  - *Theme* - apply/list themes, apply preset combos, list layouts/components
  - *Snippets* - append/show/list Scholarly snippets and append workflows
  - *Tools* - `doctor` and `help`
- **Preview** - Click the 👁️ icon on any layout, component, or theme to see a visual preview

Click any item to insert content at the cursor or update frontmatter.

### ⌨️ Snippets

Type the prefix and press `Tab` to expand snippets:

### ⚡ Smart Completion (New)

In Markdown files, Scholarly-specific suggestions now appear while typing (without memorizing all prefixes):

- `layout:` -> layout candidates such as `cover`, `default`, `methodology`
- `colorTheme:` / `fontTheme:` / `colorMode:` -> themeConfig value candidates
- `<` -> component candidates such as `Theorem`, `Block`, `Steps`
- `:::` -> syntax sugar directive candidates such as `theorem`, `block`, `columns`
- `](#` / `href="#` / `to="#` -> internal anchor ids from the current Markdown document
- `ss-` / `scholarly-` -> snippet candidates from built-in snippet library

If suggestions do not pop up automatically, press `Ctrl+Space` (`Cmd+Space` on macOS if available) to trigger completion.

### 🔗 Internal Anchors

The Command Palette now includes:

- `Insert Internal Anchor` to create a new anchor using `::anchor{#id}`, `{#id}`, or `id="id"`
- `Insert Internal Anchor Reference` to pick an existing anchor from the current Markdown file and insert `#anchor-id`

You can also type `ss-anchor` to insert a standalone anchor snippet.

### 👁️ Visual Previews (New)

The extension now features a dedicated Preview panel. Simply click the eye icon (👁️) next to any Layout, Component, or Theme in the sidebar to view a high-quality visualization of how it looks in the rendered slides.

### 🧩 GUI Builder (New)

For users who prefer a low-code workflow, run `Open GUI Builder` from the Command Palette or from the Templates view title. The builder opens a VS Code webview where you can:

- drag Scholarly layouts into a slide list
- reorder or delete generated slides
- edit common fields such as title, body, bullets, image path, and caption
- choose color and font themes
- generate a new Markdown deck or insert the generated Markdown into the active editor

The builder intentionally outputs regular Slidev Markdown, so advanced users can continue refining the deck in VS Code after the GUI creates the first draft.

### 🧪 Dev Mode (Performance Testing)

For extension performance diagnostics, enable dev mode:

- Command Palette: `Slidev Scholarly: Toggle Dev Mode`
- Settings:
  - `slidevScholarly.devMode.enabled` (boolean)
  - `slidevScholarly.devMode.slowThresholdMs` (number, default: `25`)

When enabled:

- A `Scholarly Dev` status-bar indicator appears
- The `Slidev Scholarly` output channel prints timing logs
- Slow operations are marked as `SLOW` when exceeding your threshold

For local extension-host debugging, use `.vscode/launch.json` -> `Run Extension (Dev Mode)`.

#### Layout Snippets

Layouts are organized into four categories. Use category-specific prefixes (`ss-structure-*`, `ss-content-*`, `ss-emphasis-*`, `ss-academic-*`) or the shorter `ss-*` prefix.

The `ss-*` prefixes are the canonical snippet names shown in completion. Legacy `scholarly-*` aliases are still accepted by the extension's smart completion for compatibility.

**Structure Layouts**

| Prefix | Description |
|--------|-------------|
| `ss-cover` | Cover slide |
| `ss-default` | Default content slide |
| `ss-intro` | Introduction slide |
| `ss-section` | Section divider |
| `ss-center` | Centered content |
| `ss-auto-center` | Auto-adjusting centered content |
| `ss-auto-size` | Default flow with fit-to-page sizing |
| `ss-toc` | Auto-generated table of contents |
| `ss-end` | Closing slide |

**Content Layouts**

| Prefix | Description |
|--------|-------------|
| `ss-two-cols` | Two column layout |
| `ss-image-left` | Image on left |
| `ss-image-right` | Image on right |
| `ss-bullets` | Bullet point list |
| `ss-figure` | Image with caption |
| `ss-split-image` | Side-by-side images |

**Emphasis Layouts**

| Prefix | Description |
|--------|-------------|
| `ss-quote` | Quote display |
| `ss-fact` | Single statistic |
| `ss-statement` | Bold statement |
| `ss-focus` | Focused message |

**Academic Layouts**

| Prefix | Description |
|--------|-------------|
| `ss-compare` | Side-by-side comparison |
| `ss-methodology` | Research methodology |
| `ss-results` | Results dashboard |
| `ss-timeline` | Research timeline |
| `ss-agenda` | Agenda overview |
| `ss-acknowledgments` | Acknowledgments slide |
| `ss-references` | Bibliography |

**Utility**

| Prefix | Description |
|--------|-------------|
| `ss-frontmatter` | Full frontmatter config |
| `ss-slide` | Slide divider |

#### Component Snippets

| Prefix | Description |
|--------|-------------|
| `ss-block` | Block component (Vue) |
| `ss-block-md` | Block component (Markdown) |
| `ss-theorem` | Theorem component (Vue) |
| `ss-theorem-md` | Theorem component (Markdown) |
| `ss-definition` | Definition block |
| `ss-lemma` | Lemma block |
| `ss-proof` | Proof block |
| `ss-corollary` | Corollary block |
| `ss-highlight` | Inline highlight |
| `ss-highlight-md` | Inline highlight (Markdown syntax sugar) |
| `ss-cite-comp` | Cite component (non-BibTeX) |
| `ss-cite-md` | Cite component (Markdown syntax sugar) |
| `ss-steps` | Steps component |
| `ss-steps-md` | Steps component (Markdown syntax sugar) |
| `ss-columns` | Columns component |
| `ss-columns-md` | Columns component (Markdown syntax sugar) |
| `ss-keywords` | Keywords component |
| `ss-keywords-md` | Keywords component (Markdown syntax sugar) |
| `ss-cite` | Parenthetical citation `@citekey` |
| `ss-cite-n` | Narrative citation `!@citekey` |
| `ss-anchor` | Standalone internal anchor `::anchor{#anchor-id}` |
| `ss-bibliography` | Bibliography marker |
| `ss-math-i` | Inline math |
| `ss-math-b` | Math block |
| `ss-fontsize` | Font size config |
| `ss-comment` | Slide documentation comment |
| `ss-theme-preview` | ThemePreview component |

## Installation

### From VSIX (Local)

1. Build the extension:
   ```bash
   cd vscode-extension
   npm install
   npm run compile
   npx vsce package
   ```

2. Install in VS Code:
   - Open VS Code
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Install from VSIX"
   - Select the generated `.vsix` file

### From Marketplace (Coming Soon)

Search for "Slidev Scholarly Snippets" in the VS Code Extensions marketplace.

## Usage

1. Open a Markdown file (`.md`)
2. Use one of these methods:
  - **Secondary Side Bar**: Click the Slidev Scholarly view in the right sidebar
   - **Snippets**: Type `ss-` and select from autocomplete
   - **Command Palette**: `Cmd+Shift+P` → "Slidev Scholarly"

## Example

Start a new presentation by typing `ss-frontmatter`:

```markdown
---
theme: scholarly
footerMiddle: Conference Name
lang: en
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  outlineToc: true
  outlineTocOpen: false
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: Author Name
    institution: Institution
    email: email@example.com
---

# Presentation Title

Subtitle
```

Then add slides with `ss-section`, `ss-default`, etc.

If `outlineToc` is enabled, the footer TOC in live play mode uses the same section grouping as the `toc` layout. On desktop play mode, hovering or focusing a TOC item also shows a slide preview.

## Requirements

- VS Code 1.106.0 or higher
- [Slidev Theme Scholarly](https://github.com/jxpeng98/slidev-theme-scholarly) installed in your project

## License

MIT
