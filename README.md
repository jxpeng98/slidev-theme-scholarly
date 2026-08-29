# Slidev Theme Scholarly

[Slidev Theme Scholarly](https://scholarly-docs.jxpeng.dev/en/) brings academic layouts, research components, BibTeX citations, and editor tools to Slidev. Presentations stay in Markdown and can be edited from the command line or VS Code.

[![npm](https://img.shields.io/npm/v/slidev-theme-scholarly?label=npm&color=1F4E79)](https://www.npmjs.com/package/slidev-theme-scholarly)
[![VS Code](https://img.shields.io/visual-studio-marketplace/v/jxpeng98.slidev-scholarly-snippets?label=VS%20Code&color=2E5A88)](https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets)
[![license](https://img.shields.io/github/license/jxpeng98/slidev-theme-scholarly?color=4B5563)](./LICENSE)

[Documentation](https://scholarly-docs.jxpeng.dev/en/) | [Live demo](https://scholarly.jxpeng.dev/) | [中文](./README-zh.md)

![A research presentation using Slidev Theme Scholarly](./docs/public/images/themes/classic-blue/1.png)

## Included

- Templates and layouts for paper talks, defenses, lectures, and research updates
- Components for theorems, metrics, evidence, figures, and paper summaries
- BibTeX citations and reference slides
- Color, typography, and light or dark theme controls
- CLI and VS Code tools for creating, editing, checking, and exporting decks

> Upgrading an existing deck? Read the [upgrade notes](https://scholarly-docs.jxpeng.dev/en/guide/upgrade) first.

## Quick start

### 1. Create the project

Make sure you have Node.js 20 or newer, then run:

```bash
npx -y slidev-theme-scholarly init my-talk --template academic
cd my-talk
pnpm install
```

The `academic` template is a good default. To compare the other options, run:

```bash
npx -y slidev-theme-scholarly template list
```

### 2. Preview and write

```bash
pnpm run dev
```

The browser opens automatically and refreshes whenever you save `slides.md`.

Separate slides with `---`:

```markdown
---
theme: scholarly
authors:
  - name: Your Name
    institution: Your University
---

# Presentation title

The main idea

---
layout: section
---

# Methods
```

### 3. Add structure and content

To see which layouts, components, and snippets are available, run:

```bash
pnpm exec sch layout list
pnpm exec sch component list
pnpm exec sch snippet list
```

For example, insert a theorem block:

```bash
pnpm exec sch snippet append theorem --file slides.md
```

See the [layout guide](https://scholarly-docs.jxpeng.dev/en/layouts/) and [component guide](https://scholarly-docs.jxpeng.dev/en/components/) for examples.

### 4. Check and export

```bash
pnpm exec sch doctor
pnpm run export
```

When the export finishes, the terminal prints the PDF path. To publish a website instead, run `pnpm run build`.

## Add Scholarly to an existing Slidev project

```bash
pnpm add -D slidev-theme-scholarly
```

Then add `theme: scholarly` at the top of `slides.md`. Citations work without a project-level `vite.config.ts`.

## Work in VS Code

Install [Slidev Scholarly for VS Code](https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets), open a Markdown file, then open the Secondary Side Bar and select **Slidev Scholarly**.

The sidebar covers templates, layouts, components, citations, themes, and project checks. These commands are also available from the Command Palette:

- `Slidev Scholarly: Create Presentation`
- `Slidev Scholarly: Open GUI Builder`
- `Slidev Scholarly: Insert Citation`

The [VS Code extension guide](https://scholarly-docs.jxpeng.dev/en/guide/vscode-extension) covers the rest.

## Continue with the documentation

| Goal | Read |
|---|---|
| Prepare a paper talk, defense, review, results talk, or lecture | [Academic workflows](https://scholarly-docs.jxpeng.dev/en/guide/workflows/) |
| Choose a slide structure | [Layouts](https://scholarly-docs.jxpeng.dev/en/layouts/) |
| Add theorems, metrics, or evidence | [Components](https://scholarly-docs.jxpeng.dev/en/components/) |
| Add BibTeX references | [Citations](https://scholarly-docs.jxpeng.dev/en/components/cite) |
| Change colors, typography, or light and dark modes | [Configuration](https://scholarly-docs.jxpeng.dev/en/guide/configurations) |
| Copy a complete deck | [Examples](https://scholarly-docs.jxpeng.dev/en/examples) |
| Inspect the source | [Model research talk](./examples/example-academic.md) and [layout gallery](./examples/example-academic-gallery.md) |

Run `pnpm exec sch help` to list every CLI command. Install the CLI globally only if you need `sch` outside a project: `npm i -g slidev-theme-scholarly`.

## Contributing

```bash
pnpm install
pnpm run dev
pnpm run check
```

See the [contributing guide](https://scholarly-docs.jxpeng.dev/en/contributing). Licensed under [MIT](./LICENSE).
