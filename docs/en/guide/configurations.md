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
  colorMode: light
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
  colorMode: light
  sectionMode: dark
  beamerNav: false
  outlineToc: true
  outlineTocOpen: false
```

| Option | Purpose | Default |
| --- | --- | --- |
| `colorTheme` | Color preset id | `classic-blue` |
| `fontTheme` | Font preset id | `classic` |
| `colorMode` | Scholarly semantic token mode for content and chrome | follows Slidev dark mode, defaulting to dark chrome |
| `sectionMode` | Default mode for `layout: section` slides | `dark` |
| `beamerNav` | Footer navigation buttons in play mode | `true` |
| `outlineToc` | Footer TOC button and outline panel | `false` |
| `outlineTocOpen` | Open the outline panel on load | `false` |
| `footnoteDisplay` | `both`, `hover-only`, or `notes-only` | `both` |

Notes:

- Navigation buttons are hidden in overview, embedded, and print/export views.
- The footer TOC groups slides by `layout: section`.
- Long decks switch the TOC to a compact section-first view.
- Slides with `hideInToc: true` are hidden from the TOC.
- Legacy `outlineSidebar` and `outlineSidebarOpen` still work; prefer
  `outlineToc` and `outlineTocOpen` for new decks.

## Color Mode

Slidev `colorSchema` controls the player-level light/dark toggle. Scholarly
`themeConfig.colorMode` controls this theme's semantic tokens: header, footer,
highlights, quotes, code, tables, blocks, and theorem surfaces.

When `themeConfig.colorMode` is set explicitly, it is authoritative: Scholarly
syncs Slidev's `html.dark` class and browser `color-scheme` to the configured
mode so system dark mode cannot mix dark player styles with light theme tokens.
When it is omitted, Scholarly follows Slidev's current light/dark state.

```yaml
colorSchema: both
themeConfig:
  colorTheme: high-contrast
  colorMode: light
  sectionMode: dark
```

Common patterns:

| Goal | Configuration |
| --- | --- |
| Light academic content with dark section dividers | `colorMode: light`, `sectionMode: dark` |
| Dark chrome with readable content accents | `colorMode: dark` |
| Accessibility-first deck | `colorTheme: high-contrast` and explicit `colorMode` |

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
