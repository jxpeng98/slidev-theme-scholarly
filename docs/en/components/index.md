---
title: Components
description: Add structured research content inside a Scholarly slide.
---

# Components

Components add structured content inside a layout. Use them when ordinary Markdown is not enough.

## Choose by content

| Content | Components |
|---|---|
| Claims and formal statements | [Theorem](./theorem), [Block](./block), [Highlight](./highlight) |
| Sources and papers | [Citations](./cite), [PaperCard](./paper-card) |
| Results and evidence | [MetricCard](./metric-card), [MetricGrid](./metric-grid), [EvidenceBlock](./evidence-block), [ResultTable](./result-table) |
| Methods and data | [EquationBlock](./equation-block), [DatasetCard](./dataset-card), [Steps](./steps) |
| Contributions and limits | [ContributionList](./contribution-list), [CaveatList](./caveat-list) |
| Page composition | [Columns](./columns), [Keywords](./keywords), [ThemePreview](./theme-preview) |

## Use a component

Components can wrap Markdown content:

```markdown
<Theorem type="theorem" title="Pythagorean theorem">

For a right triangle, $a^2 + b^2 = c^2$.

</Theorem>
```

Or accept data through props:

```markdown
<MetricCard label="Accuracy" value="94.7" unit="%" />
```

Open a component page for its props and complete examples. For shorter authoring syntax, see [syntax sugar](../syntax-sugar).
