---
title: Paper Talk Workflow
---

# Paper Talk Workflow

Use this path for a conference presentation, lab meeting, or reading-session
talk centered on one paper and its contribution.

```bash
npx -y slidev-theme-scholarly init paper-session --template paper-talk
```

## Recommended layouts

- [paper-summary](../../layouts/academic#paper-summary---paper-reading-summary) for the paper snapshot.
- [method-pipeline](../../layouts/academic#method-pipeline---method-pipeline) for the approach.
- [result-highlight](../../layouts/academic#result-highlight---result-highlight) for the primary result.
- [limitation](../../layouts/academic#limitation---limitation) when you need a balanced caveat.
- [references](../../layouts/academic#references) for the bibliography.

## Recommended components

- [PaperCard](../../components/paper-card) to show title, authors, venue, and contribution.
- [ContributionList](../../components/contribution-list) to separate claimed contributions.
- [EvidenceBlock](../../components/evidence-block) to connect one claim to supporting evidence.
- [MetricCard](../../components/metric-card) or [MetricGrid](../../components/metric-grid) for headline numbers.
- [Cite](../../components/cite) and BibTeX markers for citations.

## Useful snippets

```bash
pnpm exec sch snippet append cite --file slides.md
pnpm exec sch snippet append methodology --file slides.md
pnpm exec sch snippet append results --file slides.md
```

Use the VS Code sidebar previews when deciding whether a paper section needs a
layout or a component.

## Theme mode and contrast

Paper talks often mix dense text, equations, and result highlights. Prefer
`contentMode: light` with `chromeMode: match` for citation-heavy slides, use
`sectionMode: dark` only for section breaks, and check
[theme mode and contrast](../theme-mode-contrast) before using quote or
Highlight blocks on light slides.
