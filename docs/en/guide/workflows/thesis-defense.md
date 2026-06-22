---
title: Thesis Defense Workflow
---

# Thesis Defense Workflow

Use this path when the deck must defend a thesis with evidence, limitations,
questions, and appendix navigation.

```bash
sch init defense --template thesis-defense
```

## Recommended layouts

- [paper-summary](../../layouts/academic#paper-summary---paper-reading-summary) for thesis positioning.
- [experiment-grid](../../layouts/academic#experiment-grid---experiment-grid) for multi-experiment evidence.
- [result-highlight](../../layouts/academic#result-highlight---result-highlight) for the strongest result.
- [limitation](../../layouts/academic#limitation---limitation) for known constraints.
- [defense-question](../../layouts/academic#defense-question---defense-question) for anticipated committee questions.
- [appendix-index](../../layouts/academic#appendix-index---appendix-index) for backup navigation.

## Recommended components

- [EvidenceBlock](../../components/evidence-block) for claim-evidence-source grouping.
- [MetricGrid](../../components/metric-grid) for experiment summaries.
- [CaveatList](../../components/caveat-list) for limitations and threats to validity.
- [EquationBlock](../../components/equation-block) for objectives or key derivations.
- [DatasetCard](../../components/dataset-card) for benchmark context.

## Useful snippets

```bash
sch snippet append methodology --file slides.md
sch snippet append results --file slides.md
sch snippet append references --file slides.md
```

Keep appendix slides short and link them from the main deck with clear labels.

## Theme mode and contrast

Defense decks are usually viewed in rooms with unpredictable lighting. Use
`high-contrast` or `classic-blue` when readability matters more than branding,
keep dense evidence slides in `contentMode: light` with `chromeMode: match`,
and reserve `sectionMode: dark` for chapter transitions. See
[theme mode and contrast](../theme-mode-contrast).
