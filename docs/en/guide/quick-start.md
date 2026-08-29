---
title: Quick Start
description: Create, write, check, and export a Scholarly presentation.
---

# Quick Start

Follow these five steps to create a deck you can preview and export. You will need Node.js 20 or newer.

## 1. Prepare the environment

```bash
node --version
pnpm --version
```

If `pnpm` is missing, install it with `npm install -g pnpm`.

## 2. Create the project

### Choose a template

```bash
npx -y slidev-theme-scholarly template list
```

The `academic` template is a good default. The other templates cover paper talks, seminars, thesis defenses, reading groups, lightning talks, and Chinese decks. See [Academic Workflows](./workflows/) for help choosing one.

### Generate the project

```bash
npx -y slidev-theme-scholarly init my-talk --template academic
cd my-talk
pnpm install
```

## 3. Preview and write

### Start the preview

```bash
pnpm run dev
```

The browser opens automatically and refreshes whenever you save `slides.md`.

### Edit slides.md

Edit `slides.md` and separate slides with `---`:

```markdown
---
theme: scholarly
---

# Presentation title

The main idea

---
layout: section
---

# Methods
```

## 4. Add structure and content

### List layouts, components, and snippets

```bash
pnpm exec sch layout list
pnpm exec sch component list
pnpm exec sch snippet list
```

[Layouts](../layouts/) define the whole slide; [Components](../components/) add structured content within it.

### Apply a snippet, workflow, or theme

```bash
pnpm exec sch snippet append theorem --file slides.md
pnpm exec sch workflow apply paper --file slides.md
pnpm exec sch theme preset apply oxford --file slides.md
```

Each command edits `slides.md`, so run only the one you need.

## 5. Check and export

### Check the project

```bash
pnpm exec sch doctor
```

Resolve every `ERROR` before presenting. Review `WARN` items and act on those that apply.

### Export a PDF or website

```bash
pnpm run export  # PDF
pnpm run build   # website in dist/
```

## Add Scholarly to an existing Slidev project

```bash
pnpm add -D slidev-theme-scholarly
```

Add the theme to `slides.md`, then use the existing project commands:

```markdown
---
theme: scholarly
---
```

Scholarly loads citation support from the theme package. A project-level `vite.config.ts` is not required.

## Optional global CLI

You only need a global install if you want to run `sch` outside a project:

```bash
npm i -g slidev-theme-scholarly
sch help
```
