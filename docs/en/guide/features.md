---
title: Key Features
---

# Key Features

Scholarly turns Slidev into an academic deck authoring environment: structured
layouts, reusable research components, BibTeX citations, readable theme presets,
and editor tooling.

## Academic Deck Structure

- 34 layout previews covering covers, sections, content slides, figures,
  comparisons, methods, results, timelines, appendices, defenses, and references.
- Automatic header and footer styling with author names, conference text, page
  numbers, and optional beamer-style navigation.
- Footer outline TOC for long decks, grouped by `layout: section`.

Start with [Layouts](../layouts/) when you know the slide shape you need.

## Research Components

Use components for recurring academic content instead of rebuilding styles on
each slide:

| Component area | Components |
| --- | --- |
| Statements | `Theorem`, `Block`, `Highlight`, `Keywords` |
| Structure | `Steps`, `Columns` |
| Evidence | `MetricCard`, `MetricGrid`, `EvidenceBlock`, `EquationBlock`, `ResultTable` |
| Paper context | `DatasetCard`, `PaperCard`, `ContributionList`, `CaveatList` |
| References | `Cite`, references layout, footnote previews |

Theorem-like statements support English and Chinese labels, automatic numbering,
manual numbers, and custom number formats.

## Citations And Footnotes

- Use `@citekey` for parenthetical citations.
- Use `!@citekey` for narrative citations.
- Use standard Markdown footnotes with Scholarly styling.
- Hover footnote markers on desktop to preview notes, or click to pin them.
- Generate references from BibTeX with APA, Harvard, Vancouver, IEEE, MLA, or
  Chicago styles.

Normal citation usage needs only `bibFile` and `bibStyle` in frontmatter.

## Data-Driven Result Slides

Small result summaries can live in JSON or CSV and render through theme
components. Scholarly uses Vite and Slidev imports directly; there is no runtime
fetch loader or charting dependency.

```ts
import rows from './results.json'
import { toMetricItems } from 'slidev-theme-scholarly/utils/data'

const metrics = toMetricItems(rows)
```

```markdown
<MetricGrid :metrics="metrics" compact />
```

CSV works with `?raw`:

```ts
import csv from './results.csv?raw'
import { parseCsvTable } from 'slidev-theme-scholarly/utils/data'

const rows = parseCsvTable(csv)
```

Use static Markdown tables for one-off slides where a data file would be heavier
than the content.

## Paper Metadata Scaffolding

Generate a paper summary from a BibTeX key:

```bash
sch paper summary --bib references.bib --key sample2026
```

The command reads title, authors, year, DOI, URL, and venue fields, then emits a
`paper-summary` slide. Use `--layout paper-card` for a component snippet, or
`--json` when scripts need structured output.
When required fields are missing, the CLI reports `warnings` and still emits
renderable fallback Markdown.

## Theme Presets

Scholarly ships readable color and font presets for academic decks, including
classic blue, Oxford burgundy, Cambridge green, Yale blue, Princeton orange,
Nordic blue, warm sepia, monochrome, and high contrast.

Use [Color & Typography Themes](./themes.md) for visual selection, then tune
mode and contrast in [Theme Mode and Contrast](./theme-mode-contrast.md).

## Authoring Tools

- CLI templates and workflows create complete starter decks.
- `sch doctor` reports setup problems with actionable fixes.
- VS Code snippets insert layouts and components.
- VS Code previews show the same generated screenshots used by the docs.

See [VS Code Extension](./vscode-extension.md) for editor setup.

## Base Theme Boundary

Scholarly keeps no-network academic helpers in the base theme: citations,
footnote previews, references slides, lightweight data imports, and BibTeX
summary scaffolding. Features that need network access, large parsers, charting
engines, large assets, or broad integration APIs should stay in optional addons.
