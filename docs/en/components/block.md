---
title: Block
---

# Block Component

`Block` gives notes, findings, examples, and warnings a consistent visual hierarchy.

## Basic Usage

```markdown
<Block type="info" title="Important Note">

Add the note here.

</Block>
```

The Markdown directive is equivalent:

```markdown
:::block{type="info" title="Important Note"}
Add the note here.
:::
```

## Available Types

| Type | Color | Use Case |
|------|-------|----------|
| `default` | Gray | General information |
| `info` | Blue | Informational content |
| `success` | Green | Positive results |
| `warning` | Yellow | Cautions |
| `danger` | Red | Critical warnings |
| `example` | Cyan | Examples |
| `alert` | Pink | Alerts |

## Examples

### Information Block

```markdown
:::block{type="info" title="Research Finding"}
Our study shows a significant improvement in accuracy.
:::
```

### Warning Block

```markdown
:::block{type="warning" title="Limitation"}
This method requires large amounts of training data.
:::
```

### Example Block

```markdown
:::block{type="example" title="Case Study"}
Consider the function $f(x) = x^2$...
:::
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'default'` | Block style type |
| `title` | `string` | - | Optional title for the block |
| `compact` | `boolean` | `false` | Reduces the outer margin and inner padding |
