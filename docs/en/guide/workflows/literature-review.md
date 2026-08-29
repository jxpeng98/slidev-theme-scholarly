---
title: Literature Review Workflow
---

# Literature Review Workflow

For a reading group, survey talk, or seminar on prior work, start with the
`reading-group` template:

```bash
npx -y slidev-theme-scholarly init reading-session --template reading-group
```

## Recommended layouts

- [paper-summary](../../layouts/academic#paper-summary) for each focal paper.
- [related-work-matrix](../../layouts/academic#related-work-matrix) for comparison.
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
pnpm exec sch snippet append cite --file slides.md
pnpm exec sch workflow apply seminar --file slides.md
```

Add the bibliography slide early in the draft so unresolved citation keys are
visible well before export.

## Theme mode and contrast

Literature reviews often contain many citations. Prefer `contentMode: light` with
`chromeMode: match`, avoid dark backgrounds behind long quote blocks, and use
muted Highlight variants sparingly. See
[theme mode and contrast](../theme-mode-contrast).
