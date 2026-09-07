---
title: Theme Mode and Contrast
---

# Theme Mode and Contrast

`colorTheme` selects the palette. Use `contentMode` for content slides,
`chromeMode` for headers, footers, navigation, and toolbars, and `sectionMode`
for section dividers.

| Setting | Values |
|---|---|
| `contentMode` | `light`, `dark` |
| `chromeMode` | `light`, `dark`, `match`, `inverse` |
| `sectionMode` | `light`, `dark`, `match`, `inverse` |

## Recommended defaults

Starter templates leave `contentMode` unset, so the deck follows Slidev's current light or dark state. If the display conditions are uncertain, fix the modes explicitly:

```yaml
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  contentMode: light
  chromeMode: dark
  sectionMode: dark
```

- Use `contentMode: light` for citation-heavy, text-heavy, or figure-heavy slides.
- Use `chromeMode: dark` for clearer navigation and footers.
- Use `sectionMode: dark` for chapter breaks where large text dominates.
- Use `sectionMode: match` for all-light or all-dark decks, and `sectionMode: inverse` for contrast against the content surface.
- Use `high-contrast` when the deck will be projected in bright rooms.
- Use `monochrome` when screenshots, charts, or code should dominate the palette.

## Legacy decks and precedence

`colorMode` is a deprecated alias for `contentMode`. Migrate it by setting the
content and chrome surfaces explicitly:

```yaml
# Before
themeConfig:
  colorMode: dark
```

```yaml
# After
themeConfig:
  contentMode: dark
  chromeMode: match
```

Modes are resolved in this order:

```text
contentMode > legacy colorMode > Slidev light/dark state
chromeMode > legacy colorMode when contentMode is absent > dark
per-slide sectionMode > global sectionMode > dark
```

`match` follows `contentMode`; `inverse` uses its opposite. Override a single
section slide in that slide's frontmatter:

```yaml
---
layout: section
sectionMode: inverse
---
```

## Avoid low contrast

The easiest way to lose contrast is to place dark body text on a dark quote,
Highlight, or content-block background. The theme handles common combinations,
but long dark highlights can still be hard to read on light slides.

Prefer:

- Short inline [Highlight](../components/highlight) spans over full paragraph highlights.
- [Block](../components/block) or [EvidenceBlock](../components/evidence-block) when the content needs a title and body.
- `type="warning"` only for actual warnings; use `type="info"` for a neutral Block, or `type="primary"` for a neutral Highlight.
- `high-contrast` for a final readability check before export.

## Quick check

Run these commands from your presentation project after [setting up PDF export](./quick-start#check-and-export):

```bash
pnpm exec sch doctor
pnpm run export
```

Inspect the exported slides at presentation size. Check quote slides, inline Highlight text, figures, tables, and footnotes in the mode you will use. A high-contrast preset cannot compensate for text that is too small or a chart with indistinguishable series.

Maintainers can check all theme combinations with the repository's `theme:matrix` script; see [Contributing](../contributing#theme-and-preview-changes).
