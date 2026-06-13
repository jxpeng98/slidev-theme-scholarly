---
title: Components
---

# Components

This theme provides several components for academic presentations.

## Available Components

| Component | Purpose |
|-----------|---------|
| [Theorem](./theorem) | Theorems, lemmas, definitions with auto-numbering |
| [Block](./block) | Beamer-style colored blocks |
| [Steps](./steps) | Workflow/process visualization |
| [Keywords](./keywords) | Keyword tags |
| [Columns](./columns) | Multi-column layouts |
| [Highlight](./highlight) | Text highlighting |
| [MetricCard](./metric-card) | Single key metric with delta and caption |
| [MetricGrid](./metric-grid) | Compact grid of result metrics |
| [EvidenceBlock](./evidence-block) | Claim evidence, source, and confidence notes |
| [EquationBlock](./equation-block) | Numbered equations with title and caption |
| [DatasetCard](./dataset-card) | Dataset scale, split, task, and source summary |
| [PaperCard](./paper-card) | Paper metadata and contribution summary |
| [ContributionList](./contribution-list) | Numbered contribution claims with evidence |
| [CaveatList](./caveat-list) | Limitations and mitigations |
| [Cite](./cite) | Academic citations |
| [ThemePreview](./theme-preview) | Preview a color theme inside a block |

## Quick Example

```markdown
<Theorem type="theorem" title="Pythagorean Theorem">

For a right triangle: $a^2 + b^2 = c^2$

</Theorem>

<Block type="info" title="Note">

Important information here.

</Block>

<MetricCard label="Accuracy" value="94.7" unit="%" delta="+3.2" variant="success" />
```

See individual component pages for detailed documentation.
