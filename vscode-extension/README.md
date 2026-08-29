# Slidev Scholarly

The Slidev Scholarly extension brings the theme's templates, layouts, components, citations, theme controls, and project checks into VS Code.

## Install

Install **Slidev Scholarly** from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets), or build a local VSIX:

```bash
cd vscode-extension
pnpm install
pnpm run compile
pnpm run package
```

In VS Code, run `Extensions: Install from VSIX...` and select the generated file.

## Open the extension

1. Open a Markdown file.
2. Open the Secondary Side Bar.
3. Select **Slidev Scholarly**.

The sidebar follows the order in which you will usually work:

| Stage | View | What to do |
|---|---|---|
| Start | **Start · Templates** | Create a deck from a template |
| Build | **Build · Layouts** | Insert a whole-slide structure |
| Build | **Build · Components** | Insert theorems, metrics, evidence, and other content |
| Build | **Build · Citations & Anchors** | Insert BibTeX keys, paper summaries, and internal links |
| Customize | **Customize · Themes** | Apply presets, colors, fonts, and light or dark modes |
| Reference | **Reference · CLI Actions** | Run setup, build, theme, doctor, and help commands |

Click an item to apply it. Use the eye icon to preview layouts, components, and themes before inserting them.

## 1. Start a deck

Open **Start · Templates** and choose a starting point, or run:

```text
Slidev Scholarly: Create Presentation
```

The template creates regular Slidev Markdown that you can edit directly.

To assemble a first draft visually, run `Slidev Scholarly: Open GUI Builder`. The builder can:

- add, reorder, and remove slides;
- edit titles, body text, bullets, images, and captions;
- choose colors, fonts, and surface modes;
- create a new Markdown file or insert the result into the active editor.

## 2. Build the slides

### Insert from the sidebar

- **Layouts** control the structure of an entire slide.
- **Components** add research content inside a layout.
- **Citations & Anchors** connect the deck to BibTeX entries and internal destinations.

Selecting a layout or component inserts its Markdown at the cursor.

### Use completions as you type

Suggestions change with the current editing context:

| Type | Trigger |
|---|---|
| Layouts | `layout:` |
| Color and font themes | `colorTheme:`, `fontTheme:` |
| Light and dark modes | `contentMode:`, `chromeMode:`, `sectionMode:` |
| Components | `<` |
| Markdown directives | `:::` |
| Internal anchors | `](#`, `href="#`, `to="#` |
| Snippets | `ss-`, `scholarly-` |

Press `Ctrl+Space` to open suggestions manually.

### Use snippets

Type a prefix and press `Tab`. Common examples:

| Prefix | Inserts |
|---|---|
| `ss-cover` | Cover slide |
| `ss-section` | Section divider |
| `ss-figure` | Figure with caption |
| `ss-theorem` | Theorem component |
| `ss-results` | Results layout |
| `ss-cite` | Parenthetical BibTeX citation |
| `ss-anchor` | Internal anchor |
| `ss-frontmatter` | Scholarly frontmatter |

The full catalog is available from the sidebar and completion list.

## 3. Customize the deck

Open **Customize · Themes** to apply:

- theme presets;
- individual color themes;
- individual font themes;
- content, navigation, and section light or dark modes.

Theme actions update the active document's frontmatter. Existing content stays unchanged.

## 4. Check and get help

Open **Reference · CLI Actions**. Its actions are grouped by task:

- **Start:** create a presentation or list templates;
- **Build:** list layouts and components, add snippets, or apply a workflow;
- **Customize:** set a theme or list presets;
- **Check & Help:** run `doctor` or show CLI help.

Citation diagnostics also report missing bibliography settings, missing `.bib` files, duplicate keys, unresolved citations, and missing reference slides. Quick Fix actions can repair the common cases.

## Command Palette

All commands appear under **Slidev Scholarly**, including:

- `Create Presentation`
- `Open GUI Builder`
- `Insert Citation`
- `Insert Internal Anchor`
- `Apply Theme Preset`
- `Open CLI Actions`
- `Toggle Dev Mode`

## Development diagnostics

Enable `Slidev Scholarly: Toggle Dev Mode` while developing the extension. The status bar shows `Scholarly Dev`, and the **Slidev Scholarly** output channel records timings and marks slow operations.

Settings:

- `slidevScholarly.devMode.enabled`
- `slidevScholarly.devMode.slowThresholdMs` (default: `25`)

## Requirements

- VS Code 1.106.0 or newer
- Slidev Theme Scholarly in the presentation project

## License

MIT
