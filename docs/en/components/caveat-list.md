---
title: CaveatList
---

# CaveatList

`CaveatList` presents limitations with optional mitigation notes. It is intended for scoped claims, defense questions, and result slides where boundaries need to be explicit.

![CaveatList example](/images/components/caveat-list.png)

## Basic Usage

```markdown
<CaveatList title="Boundary Conditions" :items="[
  { title: 'Labeled tasks required', description: 'The method assumes labeled target examples are available.', mitigation: 'Report few-shot sensitivity separately.' },
  { title: 'Severe shift remains hard', description: 'Large distribution shift still needs calibration.', mitigation: 'Use shifted-domain evaluation as a separate claim.' }
]" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Section title |
| `label` | `string` | `'Caveats'` | Small label above the title |
| `items` | `CaveatItem[]` | `[]` | Caveat items |
| `mitigationLabel` | `string` | `'Mitigation'` | Label before mitigation text |
| `variant` | `string` | `'warning'` | `primary`, `success`, `warning`, `danger`, or `info` |
| `compact` | `boolean` | `false` | Reduce spacing |

`CaveatItem` supports `title`, `description`, and `mitigation`.
