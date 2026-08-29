---
title: ThemePreview
---

# ThemePreview Component

`ThemePreview` shows a Scholarly color theme inside one block without changing the rest of the deck.

![ThemePreview example](/images/components/theme-preview.png)

## Basic Usage

```markdown
<ThemePreview colorTheme="classic-blue">

## Preview Title

This content is rendered using the preview palette.

</ThemePreview>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorTheme` | `string` | `'classic-blue'` | Color theme id: `classic-blue`, `oxford-burgundy`, `cambridge-green`, `princeton-orange`, `yale-blue`, `nordic-blue`, `warm-sepia`, `monochrome`, `high-contrast` |

## Notes

- `ThemePreview` does not change your global theme; it only affects its own children.
