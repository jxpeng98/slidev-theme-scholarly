---
title: Steps
---

# Steps Component

`Steps` presents a process in order and can highlight the current step.

## Basic Usage

```markdown
<Steps :steps="[
  { title: 'Step 1', description: 'First step description' },
  { title: 'Step 2', description: 'Second step description' },
  { title: 'Step 3', description: 'Third step description' }
]" />
```

The Markdown directive is equivalent:

```markdown
:::steps{:steps='[{"title":"Step 1","description":"Description"}]' :activeStep="1"}:::
```

## Examples

### Research Workflow

```markdown
<Steps :steps="[
  { title: 'Data Collection', description: 'Gather and preprocess datasets' },
  { title: 'Model Design', description: 'Design efficient architecture' },
  { title: 'Training', description: 'Train with optimized procedure' },
  { title: 'Evaluation', description: 'Benchmark against baselines' }
]" :activeStep="2" />
```

### Simple Steps

```markdown
<Steps :steps="[
  { title: 'Introduction' },
  { title: 'Methods' },
  { title: 'Results' },
  { title: 'Conclusion' }
]" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `Array<{title: string, description?: string}>` | `[]` | Array of step objects |
| `activeStep` | `number` | - | Active step (1-based). Omit for none |
