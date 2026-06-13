---
title: DatasetCard
---

# DatasetCard

`DatasetCard` summarizes a dataset's task, scale, split, source, and license. Use it when introducing benchmarks or explaining experimental setup.

![DatasetCard example](/images/components/dataset-card.png)

## Basic Usage

```markdown
<DatasetCard
  name="AcademicBench"
  description="Curated benchmark for efficient scientific model adaptation."
  task="Classification"
  samples="12k"
  features="128"
  split="70 / 15 / 15"
  source="Internal benchmark"
  license="Research use"
/>
```

## With Notes

```markdown
<DatasetCard name="RobustBench-Shift" task="Domain shift" samples="8.4k" split="5 folds">
All examples use the same preprocessing pipeline as the main benchmark.
</DatasetCard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | Dataset name |
| `label` | `string` | `'Dataset'` | Small label above the name |
| `description` | `string` | - | Short dataset description |
| `task` | `string` | - | Dataset task or modality |
| `samples` | `string \| number` | - | Sample count or scale marker |
| `features` | `string \| number` | - | Feature, modality, or field count |
| `split` | `string` | - | Train/validation/test split |
| `source` | `string` | - | Source benchmark or repository |
| `license` | `string` | - | License or access constraint |
| `variant` | `string` | `'primary'` | `primary`, `success`, `warning`, `danger`, or `info` |
| `compact` | `boolean` | `false` | Reduce spacing |
