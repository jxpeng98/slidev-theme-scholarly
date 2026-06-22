---
title: Literature Review Workflow
---

# Literature Review Workflow

Use this path for a reading group, survey talk, or seminar section comparing
prior work.

```bash
sch init reading-session --template reading-group
```

## Recommended layouts

- [paper-summary](../../layouts/academic#paper-summary---paper-reading-summary) for each focal paper.
- [related-work-matrix](../../layouts/academic#related-work-matrix---related-work-matrix) for comparison.
- [compare](../../layouts/academic#compare) for two competing approaches.
- [timeline](../../layouts/academic#timeline) for field history.
- [references](../../layouts/academic#references) for sources.

## Recommended components

- [PaperCard](../../components/paper-card) for compact paper metadata.
- [ContributionList](../../components/contribution-list) for what each paper adds.
- [CaveatList](../../components/caveat-list) for gaps and limitations.
- [Keywords](../../components/keywords) for taxonomy terms.
- [Cite](../../components/cite) for explanatory citation notes.

## Useful snippets

```bash
sch snippet append cite --file slides.md
sch workflow apply seminar --file slides.md
```

Use the bibliography slide early while drafting so unresolved citation keys are
visible before export.

## Theme mode and contrast

Literature reviews are citation dense. Prefer `contentMode: light` with
`chromeMode: match`, avoid dark backgrounds behind long quote blocks, and use
muted Highlight variants sparingly. See
[theme mode and contrast](../theme-mode-contrast).
