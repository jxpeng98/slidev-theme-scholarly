---
title: EvidenceBlock
---

# EvidenceBlock

`EvidenceBlock` groups a claim with its supporting evidence, source marker, and confidence note. It is designed for dense paper and defense slides where readers need to see the basis for a claim quickly.

![EvidenceBlock example](/images/components/evidence-block.png)

## Basic Usage

```markdown
<EvidenceBlock
  title="Ablation supports the routing module"
  label="Evidence"
  source="Table 3"
  confidence="5 seeds"
  variant="success"
>

- Removing routing reduces accuracy by 2.1 points.
- Throughput remains within the same deployment budget.

</EvidenceBlock>
```

## Footer Slot

```markdown
<EvidenceBlock title="Robust under moderate shift" source="Appendix B">
Macro F1 remains above the baseline on all shifted domains.

<template #footer>
Scope: labeled adaptation tasks with the same preprocessing pipeline.
</template>
</EvidenceBlock>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `'Evidence'` | Small label above the title |
| `title` | `string` | - | Evidence title or claim |
| `source` | `string` | - | Table, figure, appendix, or dataset source |
| `confidence` | `string` | - | Seed count, interval, or scope note |
| `variant` | `string` | `'primary'` | `primary`, `success`, `warning`, `danger`, or `info` |
| `compact` | `boolean` | `false` | Reduce spacing for dense slides |
