---
title: Results-Heavy Presentation Workflow
---

# Results-Heavy Presentation Workflow

Use this path when the main story is driven by metrics, ablations, datasets, and
experimental comparisons.

```bash
sch init results-talk --template conference-lightning
```

## Recommended layouts

- [result-highlight](../../layouts/academic#result-highlight---result-highlight) for the headline finding.
- [experiment-grid](../../layouts/academic#experiment-grid---experiment-grid) for grouped studies.
- [results](../../layouts/academic#results) for dashboard-style summaries.
- [fact](../../layouts/emphasis#fact) for one decisive number.
- [figure](../../layouts/content#figure) for chart-focused slides.

## Recommended components

- [MetricCard](../../components/metric-card) for a single key number.
- [MetricGrid](../../components/metric-grid) for several comparable metrics.
- [DatasetCard](../../components/dataset-card) for benchmark details.
- [EvidenceBlock](../../components/evidence-block) for result interpretation.
- [EquationBlock](../../components/equation-block) when metrics need formulas.

## Useful snippets

```bash
sch snippet append results --file slides.md
sch snippet append block --file slides.md
```

Turn repeated result claims into a MetricGrid or EvidenceBlock instead of
duplicating ad-hoc boxes.

## Theme mode and contrast

Results slides need high figure and table contrast. Prefer `contentMode: light`
with `chromeMode: match`, test charts against the chosen color theme, and use
`high-contrast` when projected charts lose detail. See
[theme mode and contrast](../theme-mode-contrast).
