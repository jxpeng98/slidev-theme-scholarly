---
title: Keywords
---

# Keywords Component

`Keywords` turns research topics or key concepts into a short set of tags.

## Basic Usage

```markdown
<Keywords :keywords="['Machine Learning', 'Deep Learning', 'Neural Networks']" />
```

The Markdown directive is equivalent:

```markdown
:::keywords{:keywords='["Machine Learning", "Deep Learning"]' color="blue"}:::
```

## Examples

### Research Keywords

```markdown
<Keywords 
  :keywords="['Computer Vision', 'Object Detection', 'CNN', 'Transfer Learning']" 
  color="blue" 
/>
```

### Topic Tags

```markdown
<Keywords 
  :keywords="['Optimization', 'Convergence', 'Gradient Descent']" 
  color="green" 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `keywords` | `string[]` | `[]` | Array of keyword strings (alias: `items`) |
| `color` | `string` | `'primary'` | Color theme: `primary`, `blue`, `green`, `purple`, `gray` |
