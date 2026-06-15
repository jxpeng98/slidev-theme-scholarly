---
title: Quick Start
---

# Quick Start

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

## Step 1: Create a presentation with CLI (Recommended)

```bash
# One-time usage (no global install needed)
npx -y --package slidev-theme-scholarly sch init my-talk

# Alternative short alias
npx -y --package slidev-theme-scholarly sts init my-talk
```

Available templates:

```bash
npx -y --package slidev-theme-scholarly sch template list
```

Curated academic workflows:

| Template | Best for |
|----------|----------|
| `basic` | Minimal English starter |
| `academic` | General academic deck with BibTeX |
| `paper-talk` | Paper presentations with summary, method, results, and references |
| `seminar` | Research seminars with agenda, related work, method, and discussion |
| `thesis-defense` | Defense decks with experiments, limitations, Q&A, and appendix map |
| `reading-group` | Paper critique and group discussion |
| `conference-lightning` | Short conference talks focused on one result |
| `zh` | Minimal Chinese starter |

Use a specific template:

```bash
npx -y --package slidev-theme-scholarly sch init my-talk --template academic
npx -y --package slidev-theme-scholarly sch init paper-session --template paper-talk
npx -y --package slidev-theme-scholarly sch init defense --template thesis-defense
```

Useful CLI commands:

```bash
# help
npx sch help
npx sch help theme

# theme-specific discovery
npx sch theme list
npx sch layout list
npx sch component list
npx sch snippet list

# apply a Scholarly preset to frontmatter
npx sch theme apply cambridge-green --font elegant --file slides.md
npx sch theme preset apply cambridge --file slides.md

# insert Scholarly snippet blocks
npx sch snippet append theorem --file slides.md
npx sch snippet append methodology --file slides.md

# append a full academic workflow skeleton
npx sch workflow list
npx sch workflow apply paper --file slides.md

# environment checker (with Scholarly checks)
npx sch doctor
```

## Step 2: Install dependencies and run

```bash
cd my-talk
pnpm install
pnpm run dev
```

Your browser will open automatically with live preview.

## Step 3: Edit `slides.md`

The generated project already includes a ready-to-use `slides.md`.

## Manual setup (if you already have a Slidev project)

Install theme dependency:

```bash
npm i -D slidev-theme-scholarly
```

Set your Slidev frontmatter:

```markdown
---
theme: scholarly
bibFile: references.bib
bibStyle: apa
---
```

Then run:

```bash
npx slidev
```

Scholarly registers its citation hooks from the theme package itself, so normal usage does not need a project-level `vite.config.ts`.

Add a bibliography slide with the built-in references layout:

```markdown
---
layout: references
---
```

If you need custom placement inside that slide, add `[[bibliography]]` explicitly where the list should appear.
