---
title: Theme Mode and Contrast
---

# Theme Mode and Contrast

Scholarly separates palette choice from readable foreground/background tokens.
Use `colorTheme` for identity, `colorMode` for the normal slide surface, and
`sectionMode` for section dividers.

## Recommended defaults

```yaml
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  colorMode: light
  sectionMode: dark
```

- Use `colorMode: light` for citation-heavy, text-heavy, or figure-heavy slides.
- Use `sectionMode: dark` for chapter breaks where large text dominates.
- Use `high-contrast` when the deck will be projected in bright rooms.
- Use `monochrome` when screenshots, charts, or code should dominate the palette.

## Quote and Highlight safety

The risky combination is dark semantic backgrounds with dark body text. The P0
token model maps quote, Highlight, Block, and component surfaces through
mode-aware semantic tokens, but slide authors should still avoid long dark
highlight regions on light slides.

Prefer:

- Short inline [Highlight](../components/highlight) spans over full paragraph highlights.
- [Block](../components/block) or [EvidenceBlock](../components/evidence-block) when the content needs a title and body.
- `type="warning"` only for actual warnings; use `type="info"` or `type="primary"` for neutral emphasis.
- `high-contrast` for accessibility review before export.

## Quick check

Run the doctor and a visual export before sharing:

```bash
sch doctor
pnpm run theme:matrix
```

For a faster local check without Playwright export:

```bash
node scripts/check-theme-matrix.mjs --dry-run
```
