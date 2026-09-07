---
title: Key Features
---

# Key Features

Scholarly builds on Slidev with the pieces academic presentations usually need:
research layouts and components, BibTeX citations, theme presets, and editor tools.

## Academic Deck Structure

- 34 layouts covering covers, sections, content slides, figures,
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

Import JSON or CSV into `ResultTable` and `MetricGrid`, using the theme's small data helpers where needed. There is no charting dependency. For a few values on one page, a Markdown table is usually simpler.

[Data-Driven Slides](./data-driven) shows complete examples, including where to place the files and imports.

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

- CLI templates create complete projects; workflows append a sequence of slide snippets.
- `pnpm exec sch doctor` reports setup problems with actionable fixes.
- VS Code snippets insert layouts and components.
- VS Code previews show the same generated screenshots used by the docs.

See [VS Code Extension](./vscode-extension.md) for editor setup.

## Working offline

BibTeX citations, manual notes, reference slides, and local data imports do not require a remote service. Install dependencies and download any fonts, images, or other remote assets before presenting offline. Verify the deck with the network disconnected.
