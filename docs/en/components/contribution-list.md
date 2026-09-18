---
title: ContributionList
---

# ContributionList

`ContributionList` breaks a paper's contributions into numbered claims and can attach evidence to each one.

![ContributionList example](/images/components/contribution-list.png)

## Basic Usage

```markdown
<ContributionList title="Main Contributions" :items="[
  { title: 'Efficient adaptation', description: 'Adds a lightweight routing stage before fine-tuning.', evidence: '+3.2 accuracy points' },
  { title: 'Stable deployment cost', description: 'Keeps the base representation fixed at inference time.', evidence: 'Same throughput budget' },
  { title: 'Reproducible evaluation', description: 'Reports five-seed averages across all experiments.', evidence: 'Appendix B' }
]" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Section title |
| `label` | `string` | `'Contributions'` | Small label above the title |
| `items` | `ContributionItem[]` | `[]` | Contribution items |
| `ordered` | `boolean` | `true` | Render numeric markers |
| `variant` | `string` | `'primary'` | `primary`, `success`, `warning`, `danger`, or `info` |
| `compact` | `boolean` | `false` | Reduce spacing |

`ContributionItem` supports `title`, `description`, and `evidence`.
