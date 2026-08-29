---
title: Columns
---

# Columns Component

`Columns` splits content into two, three, or four columns for comparison or grouping.

## Basic Usage

```markdown
<Columns :columns="2">
  
Content for column 1

<template #col2>

Content for column 2

</template>

</Columns>
```

The Markdown directive is equivalent:

```markdown
:::columns{columns="2" gap="2rem"}
First column content
+++
Second column content
:::
```

## Examples

### Two Columns

```markdown
:::columns{columns="2"}
## Method A
- Advantage 1
- Advantage 2
+++
## Method B
- Advantage 1
- Advantage 2
:::
```

### Three Columns

```markdown
:::columns{columns="3" gap="1rem"}
### Step 1
Introduction
+++
### Step 2
Methods
+++
### Step 3
Results
:::
```

### Custom Ratios

```markdown
<Columns :columns="2" ratio="1:2">
  
Narrow sidebar content

<template #col2>

Wide main content area

</template>

</Columns>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `2 \| 3 \| 4` | `2` | Number of columns (alias: `cols`) |
| `gap` | `string \| number` | `'1.5rem'` | Gap between columns. If a number is provided, it is treated as `rem` |
| `ratio` | `string` | - | Column width ratio (e.g., `'1:2'`, `'1:1:2'`) |
| `balanced` | `boolean` | `false` | Balance content height across columns |

## Notes

- Named slots: `col2`, `col3`, `col4`
- Syntax sugar will infer `columns` from the number of `+++` sections (max: 4)
