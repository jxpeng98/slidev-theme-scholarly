---
title: Highlight
---

# Highlight Component

`Highlight` draws attention to a phrase or number inside a sentence. Do not use it for full paragraphs.

## Basic Usage

```markdown
This is <Highlight>important text</Highlight> in your slide.
```

The Markdown directive is equivalent:

```markdown
:::highlight{type="warning"}
Important text to highlight
:::
```

## Examples

### Different Types

```markdown
<Highlight type="primary">Primary highlight</Highlight>

<Highlight type="success">Success highlight</Highlight>

<Highlight type="warning">Warning highlight</Highlight>

<Highlight type="danger">Danger highlight</Highlight>

<Highlight type="info">Info highlight</Highlight>
```

### In Context

```markdown
Our method achieves <Highlight type="success">94.7% accuracy</Highlight>, 
which is <Highlight type="warning">significantly better</Highlight> than 
the baseline.
```

### Legacy `color` Alias

`color` is supported for backwards compatibility and maps to `type`:

- `yellow` -> `warning`
- `green` -> `success`
- `blue` -> `info`
- `pink` -> `danger`
- `purple` -> `primary`

```markdown
<Highlight color="yellow">Yellow highlight</Highlight>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'primary'` | Highlight type: `primary`, `success`, `warning`, `danger`, `info` |
| `color` | `string` | - | Legacy alias of `type`: `yellow`, `green`, `blue`, `pink`, `purple` |
