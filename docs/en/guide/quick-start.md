---
title: Quick Start
description: Create a Scholarly project, write your first slides, and export or build the deck.
---

# Quick Start

This guide takes you from a new folder to a working presentation. If you already have a Slidev project, skip to [adding the theme](#add-scholarly-to-an-existing-slidev-project). For an editor-based workflow, see the [VS Code extension](./vscode-extension).

## 1. Prepare the environment

Use **Node.js 24 LTS** and **pnpm 10**. Check your versions:

```bash
node --version
pnpm --version
```

Install pnpm if needed:

```bash
npm install -g pnpm@10
```

The current Slidev/Vite toolchain requires Node.js `^20.19.0 || >=22.12.0`; an early Node 20 or 22 release is not enough. Node 24 is the recommended starting point. See the [Vite requirements](https://vite.dev/guide/) and [Node.js release schedule](https://nodejs.org/en/about/previous-releases).

## 2. Create the project

Start with the `academic` template, which includes a bibliography:

```bash
npx -y slidev-theme-scholarly init my-talk --template academic
cd my-talk
pnpm install
```

The CLI creates `slides.md`, `package.json`, a README, and, for citation templates, `references.bib`. It refuses to overwrite a nonempty folder.

To choose another template, run `npx -y slidev-theme-scholarly template list`. [Academic Workflows](./workflows/) explains which templates suit paper talks, defenses, reviews, results talks, and lectures.

## 3. Preview and write

```bash
pnpm run dev
```

Keep this terminal running. The browser opens automatically and updates when you save `slides.md`.

The first YAML block contains deck settings. Later blocks set options for individual slides; `---` separates pages:

```markdown
---
theme: scholarly
lang: en
---

# Presentation title

The main idea

---
layout: section
---

# Methods
```

A [layout](../layouts/) arranges a whole slide. A [component](../components/) adds content such as a theorem or metric inside that layout. Keep blank lines around Markdown inside Vue component tags.

## 4. Add content

Use the CLI to browse the available building blocks:

```bash
pnpm exec sch layout list
pnpm exec sch component list
pnpm exec sch snippet list
```

Append a theorem snippet to the end of `slides.md`:

```bash
pnpm exec sch snippet append theorem --file slides.md
```

`snippet append` adds content at the end of the file; it does not target the editor cursor or necessarily create a new slide. `workflow apply` appends a sequence of snippets to the deck. Inspect the result before adding another workflow:

```bash
pnpm exec sch workflow list
pnpm exec sch workflow apply paper --file slides.md
```

Theme commands update the first YAML block:

```bash
pnpm exec sch theme preset apply oxford --file slides.md
```

## 5. Check and export {#check-and-export}

Run the project check and review its suggested fixes:

```bash
pnpm exec sch doctor
```

Fix `ERROR` items and review relevant `WARN` items. The doctor checks setup and citation metadata; inspect the rendered slides for overflow, missing images, and readable text.

### Export a PDF

CLI export needs Playwright and Chromium. Install them once in the presentation project, then export:

```bash
pnpm add -D playwright-chromium
pnpm exec playwright install chromium
pnpm run export
```

The terminal prints the PDF path. If installing a browser is inconvenient, use Slidev's **Export** page in a Chromium-based browser. See [Slidev exporting](https://sli.dev/guide/exporting) for PNG, PPTX, ranges, and export options.

### Build a website

```bash
pnpm run build
```

This writes a static site to `dist/`. Upload that directory to a static host to publish it. When hosting under a subpath, set Slidev's `--base` option as described in [Slidev hosting](https://sli.dev/guide/hosting).

## Add Scholarly to an existing Slidev project

```bash
pnpm add -D slidev-theme-scholarly
```

Set `theme: scholarly` in the first YAML block of `slides.md`, preserving its other settings. Continue using your project's preview and build commands. Check the [upgrade notes](./upgrade) when updating Slidev at the same time.

Citations are loaded by the theme, so no project-level `vite.config.ts` is needed. Follow [Citations](../components/cite) to add a BibTeX file and reference page.

## Optional global CLI

Inside a project, `pnpm exec sch` uses that project's installed theme version. For use outside a project, either use the `npx -y slidev-theme-scholarly` form above or install globally:

```bash
npm i -g slidev-theme-scholarly
sch help
```
