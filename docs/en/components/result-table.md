---
title: ResultTable
---

# ResultTable

Use `ResultTable` for a small benchmark or ablation table where exact values
matter more than a chart.

![ResultTable component example](/images/components/result-table.png)

## Basic usage

```markdown
<ResultTable
  caption="Five-seed benchmark results"
  :columns="[
    { key: 'model', label: 'Model' },
    { key: 'accuracy', label: 'Accuracy (%)', align: 'right' },
    { key: 'latency', label: 'Latency (ms)', align: 'right' }
  ]"
  :rows="[
    { model: 'Baseline', accuracy: 91.5, latency: 24 },
    { model: 'Ours', accuracy: 94.7, latency: 18 }
  ]"
  highlightColumn="accuracy"
/>
```

If `columns` is omitted, object keys or array positions determine the columns.
For array rows, provide `columns` when you need meaningful labels. An empty
table displays a data-source warning instead of an unlabelled blank area.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` | `Array<object \| array>` | `[]` | Object rows or positional array rows |
| `columns` | `Array<string \| object>` | inferred | Column order and configuration |
| `caption` | `string` | - | Short caption above the table |
| `compact` | `boolean` | `false` | Reduces margins, text size, and cell padding |
| `highlightColumn` | `string \| number` | - | Column key or zero-based index to emphasize |

A column object accepts `key`, optional `label`, `align` (`left`, `center`, or
`right`), and an optional `format(value, row)` function.
