---
title: Paper Talk Workflow
---

# Paper Talk Workflow

For a conference talk, lab meeting, or reading session about one paper, start
with the `paper-talk` template:

```bash
npx -y slidev-theme-scholarly init paper-session --template paper-talk
```

## Recommended layouts

- [paper-summary](../../layouts/academic#paper-summary) for the paper snapshot.
- [method-pipeline](../../layouts/academic#method-pipeline) for the approach.
- [result-highlight](../../layouts/academic#result-highlight) for the primary result.
- [limitation](../../layouts/academic#limitation) when you need a balanced caveat.
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

The VS Code sidebar previews can help you decide whether a section needs a full
layout or only a component.

## Theme mode and contrast

Paper talks often mix dense text, equations, and result highlights. Prefer
`contentMode: light` with `chromeMode: match` for citation-heavy slides, use
`sectionMode: dark` only for section breaks, and check
[theme mode and contrast](../theme-mode-contrast) before using quote or
Highlight blocks on light slides.
