---
title: Quick Start
---

# Quick Start

## Requirements

Install Node.js 20 or newer. The generated projects use `pnpm`.

## Create A Deck

Use the CLI without a global install:

```bash
npx -y slidev-theme-scholarly init my-talk
cd my-talk
pnpm install
pnpm run dev
```

The browser opens with a live Slidev preview. Edit `slides.md` to start writing.

The first `npx` run may need to download Scholarly before it can execute the
CLI. npm stores that temporary installation in its cache rather than adding it
to your project or global packages. The `-y` flag accepts the cache installation
without prompting.

## Pick A Template

List available templates:

```bash
npx -y slidev-theme-scholarly template list
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
npx -y slidev-theme-scholarly init paper-session --template paper-talk
npx -y slidev-theme-scholarly init defense --template thesis-defense
```

If you are unsure, start with the [academic workflow guide](./workflows/).

## Useful CLI Commands

After `pnpm install`, run the project-local `sch` binary with `pnpm exec`.
This keeps the CLI version aligned with the version declared by the project.

Discover what the theme provides:

```bash
pnpm exec sch theme list
pnpm exec sch layout list
pnpm exec sch component list
pnpm exec sch snippet list
```

Apply a theme preset or append common content:

```bash
pnpm exec sch theme preset apply cambridge --file slides.md
pnpm exec sch snippet append theorem --file slides.md
pnpm exec sch workflow apply paper --file slides.md
```

Check the project setup:

```bash
pnpm exec sch doctor
pnpm exec sch doctor --json
```

`sch doctor` reports `OK`, `WARN`, and `ERROR` items with concrete next actions.
Use `--json` for CI, scripts, or editor integrations.

With npm, install `slidev-theme-scholarly` locally and use `npx sch`. A global
install is optional:

```bash
npm i -g slidev-theme-scholarly
sch template list
```

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
