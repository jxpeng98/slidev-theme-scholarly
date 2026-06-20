---
title: Quick Start
---

# Quick Start

## Requirements

Install Node.js 20 or newer. The generated projects use `pnpm`.

## Create A Deck

Use the CLI without a global install:

```bash
npx -y --package slidev-theme-scholarly sch init my-talk
cd my-talk
pnpm install
pnpm run dev
```

The browser opens with a live Slidev preview. Edit `slides.md` to start writing.

## Pick A Template

List available templates:

```bash
npx -y --package slidev-theme-scholarly sch template list
```

Common choices:

| Template | Use it for |
| --- | --- |
| `basic` | Minimal English starter |
| `academic` | General academic deck with BibTeX |
| `paper-talk` | Paper presentations with summary, method, results, and references |
| `seminar` | Research seminars with agenda, related work, method, and discussion |
| `thesis-defense` | Defense decks with experiments, limitations, Q&A, and appendix map |
| `reading-group` | Paper critique and group discussion |
| `conference-lightning` | Short talks focused on one result |
| `zh` | Minimal Chinese starter |

Create from a specific template:

```bash
npx -y --package slidev-theme-scholarly sch init paper-session --template paper-talk
npx -y --package slidev-theme-scholarly sch init defense --template thesis-defense
```

If you are unsure, start with the [academic workflow guide](./workflows/).

## Useful CLI Commands

Discover what the theme provides:

```bash
npx sch theme list
npx sch layout list
npx sch component list
npx sch snippet list
```

Apply a theme preset or append common content:

```bash
npx sch theme preset apply cambridge --file slides.md
npx sch snippet append theorem --file slides.md
npx sch workflow apply paper --file slides.md
```

Check the project setup:

```bash
npx sch doctor
npx sch doctor --json
```

`sch doctor` reports `OK`, `WARN`, and `ERROR` items with concrete next actions.
Use `--json` for CI, scripts, or editor integrations.

## Manual Setup For An Existing Slidev Project

Install the theme:

```bash
npm i -D slidev-theme-scholarly
```

Set the frontmatter in `slides.md`:

```markdown
---
theme: scholarly
bibFile: references.bib
bibStyle: apa
---
```

Run Slidev:

```bash
npx slidev
```

Scholarly registers its citation hooks from the theme package. Normal usage does
not require a project-level `vite.config.ts`.

Add a references slide:

```markdown
---
layout: references
---
```

Use `[[bibliography]]` only when you need to choose the exact bibliography
position inside that slide.
