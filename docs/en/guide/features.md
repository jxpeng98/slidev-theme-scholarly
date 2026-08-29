---
title: Key Features
---

# Key Features

Scholarly builds on Slidev with the pieces academic presentations usually need:
research layouts and components, BibTeX citations, theme presets, and editor tools.

## Academic Deck Structure

- 34 layout previews covering covers, sections, content slides, figures,
  comparisons, methods, results, timelines, appendices, defenses, and references.
- Headers and footers with author names, conference text, page numbers, and
  optional Beamer-style navigation.
- A footer outline for long decks, grouped by `layout: section`.

If you know what the next slide needs to say, start with [Layouts](../layouts/).

## Research Components

Components keep recurring academic content consistent from slide to slide:

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

For most decks, `bibFile` and `bibStyle` are the only citation settings you need.

## Data-Driven Result Slides

Store small result summaries in JSON or CSV, then render them with theme
components. Scholarly uses Vite and Slidev imports directly, without a runtime
data loader or charting dependency.

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

For data used on one slide, a Markdown table is usually simpler.

## Paper Metadata Scaffolding

Generate a paper summary from a BibTeX key:

```bash
pnpm exec sch paper summary --bib references.bib --key sample2026
```

The command reads the title, authors, year, DOI, URL, and venue, then creates a
`paper-summary` slide. Add `--layout paper-card` for a component snippet or
`--json` for structured output. If required fields are missing, the CLI prints
warnings and still creates editable Markdown.

## Theme Presets

Scholarly includes color and font presets for academic decks, including
classic blue, Oxford burgundy, Cambridge green, Yale blue, Princeton orange,
Nordic blue, warm sepia, monochrome, and high contrast.

Choose a palette in [Color & Typography Themes](./themes.md), then adjust its
light and dark modes in [Theme Mode and Contrast](./theme-mode-contrast.md).

## Authoring Tools

- CLI templates and workflows create complete starter decks.
- `sch doctor` reports setup problems with actionable fixes.
- VS Code snippets insert layouts and components.
- VS Code previews show the same generated screenshots used by the docs.

See [VS Code Extension](./vscode-extension.md) for editor setup.

## Base Theme Boundary

The base theme includes only tools that work offline: citations, footnote previews,
reference slides, lightweight data imports, and BibTeX summary generation.
Anything that needs a network connection, a large parser, a charting engine, or
a third-party API belongs in an optional add-on.
