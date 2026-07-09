---
title: Configuration Guide
---

# Configuration Guide

Most decks only need a small frontmatter block. Add it at the top of
`slides.md`:

```yaml
---
theme: scholarly
lang: en
footerMiddle: Conference Name 2026
authors:
  - name: Jane Smith
    institution: MIT
    email: jane@mit.edu
  - name: John Doe
    institution: Stanford
    email: john@stanford.edu
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  chromeMode: dark
  sectionMode: dark
---
```

## Essential Options

| Option | Purpose | Example |
| --- | --- | --- |
| `theme` | Enable the theme | `scholarly` |
| `lang` | Theorem and proof labels | `en`, `zh` |
| `aspectRatio` | Slide dimensions | `16/9`, `4/3` |
| `bibFile` | BibTeX source | `./references.bib` |
| `bibStyle` | Bibliography style | `apa`, `ieee`, `chicago` |

## Authors And Footer

Use `author` for a single name, or `authors` for structured multi-author decks:

```yaml
authors:
  - name: Jane Smith
    institution: MIT
    email: jane@mit.edu
  - name: John Doe
    institution: Stanford
```

Footer defaults:

| Position | Default |
| --- | --- |
| Left | Author name(s) |
| Middle | Empty unless `footerMiddle` is set |
| Right | Page number |

Override text with `footerLeft`, `footerMiddle`, or `footerRight`.

## Theme Config

Use `themeConfig` for visual and player behavior:

```yaml
themeConfig:
  colorTheme: oxford-burgundy
  fontTheme: traditional
  chromeMode: dark
  sectionMode: dark
  beamerNav: false
  outlineToc: true
  outlineTocOpen: false
```

| Option | Purpose | Default |
| --- | --- | --- |
| `fontTheme` | Font preset id | `classic` |
| `beamerNav` | Footer navigation buttons in play mode | `true` |
| `outlineToc` | Footer TOC button and outline panel | `false` |
| `outlineTocOpen` | Open the outline panel on load | `false` |
| `footnoteDisplay` | `both`, `hover-only`, or `notes-only` | `both` |

Color and surface controls:

| Option | Controls | Default |
| --- | --- | --- |
| `colorTheme` | Brand palette: primary, accent, paper tone, and base text color | `classic-blue` |
| `contentMode` | Ordinary slide canvas, readable content surfaces, quote, code, table, footnotes, Highlight, Block, and Theorem | Follows `colorMode`, then Slidev dark state |
| `chromeMode` | Header, footer, page number, navigation buttons, TOC, and toolbar surfaces | `dark` |
| `sectionMode` | Default appearance for `layout: section` slides | `dark` |
| `colorMode` | Legacy alias for `contentMode` | Deprecated |
| `themeColors` | Advanced CSS variable overrides for brand and footer colors | unset |

Notes:

- Navigation buttons are hidden in overview, embedded, and print/export views.
- The footer TOC groups slides by `layout: section`.
- Long decks switch the TOC to a compact section-first view.
- Slides with `hideInToc: true` are hidden from the TOC.
- Legacy `outlineSidebar` and `outlineSidebarOpen` still work; prefer
  `outlineToc` and `outlineTocOpen` for new decks.

## Color Surface Modes

Slidev `colorSchema` controls the player-level light/dark toggle. Scholarly
splits theme surfaces into explicit controls:

- `contentMode` controls the ordinary slide canvas and readable content surfaces.
- `chromeMode` controls headers, footers, page numbers, navigation, TOC, and toolbar surfaces.
- `sectionMode` controls `layout: section` slides and accepts `light`, `dark`, `match`, and `inverse`.

`contentMode` accepts `light` and `dark`. `chromeMode` accepts `light`, `dark`,
`match`, and `inverse`. Legacy `colorMode` is still supported as an alias for
`contentMode`, and also preserves old chrome behavior when neither
`contentMode` nor `chromeMode` is set, but new decks should use `contentMode`
and `chromeMode`.

```yaml
colorSchema: both
themeConfig:
  colorTheme: high-contrast
  contentMode: light
  chromeMode: dark
  sectionMode: dark
```

Common patterns:

| Goal | Configuration |
| --- | --- |
| Light academic content with dark chrome and section dividers | `contentMode: light`, `chromeMode: dark`, `sectionMode: dark` |
| All-light deck | `contentMode: light`, `chromeMode: match`, `sectionMode: match` |
| All-dark deck | `contentMode: dark`, `chromeMode: match`, `sectionMode: match` |
| Accessibility-first deck | `colorTheme: high-contrast` and explicit surface modes |

## Theorem Numbering

Customize automatic theorem numbers:

```yaml
theoremNumberFormat: '{number}'      # 1, 2, 3
theoremNumberFormat: '({number})'    # (1), (2), (3)
theoremNumberFormat: '[{number}]'    # [1], [2], [3]
theoremNumberFormat: '{number}.'     # 1., 2., 3.
```

Use the `number` prop for one manual number, or `:autoNumber="false"` for an
unnumbered statement.

## Font Sizes

Set global font sizes:

```yaml
fontsize:
  body: 18px
  h1: 48px
  h2: 36px
  h3: 28px
```

Override on one slide:

```markdown
---
fontsize:
  body: 20px
  h1: 50px
---

# Custom Sized Slide
```

Accepted values include `px`, `rem`, `em`, and numbers. Numbers are treated as
pixels. Per-slide settings override global settings.

For cover-only typography, use scoped CSS on the cover slide:

```markdown
<style>
.slidev-layout.cover h1 {
  font-size: 64px;
}
</style>
```

## Footnotes

Set a global footnote display mode:

```yaml
footnoteDisplay: hover-only
```

Override one slide:

```markdown
---
footnoteDisplay: notes-only
---
```

Priority order:

1. Per-slide `footnoteDisplay`
2. Global headmatter `footnoteDisplay`
3. Legacy `themeConfig.footnoteDisplay`
4. Default `both`

Modes:

| Mode | Behavior |
| --- | --- |
| `both` | Bottom notes plus inline hover/click preview |
| `hover-only` | Inline preview only |
| `notes-only` | Bottom notes only |

## Per-Slide Metadata

Set title, subtitle, layout options, or local overrides in slide frontmatter:

```markdown
---
layout: figure
title: Model Overview
subtitle: Encoder and adapter path
hideInToc: true
---
```

Use [Layouts](../layouts/) and [Components](../components/) for page-specific
props and examples.
