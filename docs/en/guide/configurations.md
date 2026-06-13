---
title: Configuration Guide
---

# Configuration Guide

## Setting Up Your Presentation

At the very top of your `slides.md` file, add a configuration section:

```yaml
---
theme: scholarly
lang: en  # or 'zh' for Chinese
footerMiddle: Conference Name 2025
authors:
  - name: Jane Smith
    institution: MIT
    email: jane@mit.edu
  - name: John Doe
    institution: Stanford
    email: john@stanford.edu
---
```

## Configuration Options

### Basic Settings

| Option | What it does | Example |
|--------|-------------|---------|
| `theme` | Tells Slidev to use this theme | `scholarly` |
| `lang` | Language for theorems | `en` or `zh` |
| `aspectRatio` | Slide dimensions | `16/9` or `4/3` |

### Author Information

**Single author:**

```yaml
author: Jane Smith
```

**Multiple authors (recommended):**

```yaml
authors:
  - name: Jane Smith
    institution: MIT
    email: jane@mit.edu
  - name: John Doe
    institution: Stanford
```

### Footer Configuration

| Option | What it controls | Example |
|--------|-----------------|---------|
| `footerLeft` | Left side of footer | `Custom text` |
| `footerMiddle` | Middle of footer | `Conference 2025` |
| `footerRight` | Right side (auto) | Page numbers |

**Default behavior (if not specified):**

- Left: Shows author name(s)
- Middle: Empty (or your custom text)
- Right: Page numbers (automatic)

### Theme Configuration

Use `themeConfig` for theme-level behavior:

```yaml
themeConfig:
  colorTheme: oxford-burgundy
  fontTheme: traditional
  colorMode: light
  sectionMode: dark
  beamerNav: false  # hide footer navigation buttons
  outlineToc: true
  outlineTocOpen: false
```

| Option | What it controls | Default |
|--------|------------------|---------|
| `themeConfig.colorTheme` | Scholarly color preset id, such as `classic-blue`, `oxford-burgundy`, or `high-contrast` | `classic-blue` |
| `themeConfig.fontTheme` | Scholarly font preset id, such as `classic`, `traditional`, or `technical` | `classic` |
| `themeConfig.colorMode` | Scholarly chrome/content token mode for header, footer, highlights, quotes, code, blocks, and theorem states | follows Slidev dark mode, defaulting to `dark` chrome |
| `themeConfig.sectionMode` | Default appearance for `layout: section` slides | `dark` |
| `themeConfig.beamerNav` | Show beamer-style footer navigation buttons in live play mode | `true` |
| `themeConfig.outlineToc` | Show a compact TOC button in the footer that opens an outline panel | `false` |
| `themeConfig.outlineTocOpen` | Start with the outline panel expanded | `false` |
| `themeConfig.footnoteDisplay` | Static and hover behavior for footnotes: `both`, `hover-only`, or `notes-only` | `both` |

Notes:

- The buttons appear only in the live slide player.
- They are automatically hidden in overview, embedded, and print/export views.
- The TOC panel is grouped by `layout: section` and lists jump targets inside each section.
- In desktop play mode, if the device supports hover and the viewport is wide enough, hovering or keyboard-focusing a TOC item shows a slide preview card to the left of the panel.
- When the TOC opens, it previews the current slide by default. If the current slide is hidden with `hideInToc: true`, it falls back to the first visible TOC item.
- Slides with `hideInToc: true` are hidden automatically.
- The legacy `outlineSidebar` / `outlineSidebarOpen` keys still work, but `outlineToc` / `outlineTocOpen` are the preferred names now.

### Slidev Color Schema vs Scholarly Color Mode

Slidev's `colorSchema` controls the built-in Slidev light/dark toggle and whether the player can switch modes. Scholarly's `themeConfig.colorMode` controls this theme's semantic CSS tokens, including chrome, highlights, blockquotes, code, tables, blocks, and theorem surfaces.

Use `colorSchema: both` when you want Slidev's UI to support both modes. Use `themeConfig.colorMode` when you want a deck to pin Scholarly's readable token set.

```yaml
---
theme: scholarly
colorSchema: both
themeConfig:
  colorTheme: high-contrast
  colorMode: light
  sectionMode: dark
---
```

Common patterns:

| Pattern | Configuration |
|---------|---------------|
| Light academic content with dark section dividers | `themeConfig.colorMode: light` and `themeConfig.sectionMode: dark` |
| Dark chrome with readable content accents | `themeConfig.colorMode: dark` |
| Accessibility-first deck | `themeConfig.colorTheme: high-contrast` and explicit `themeConfig.colorMode` |

### Theorem Number Format

Customize how theorem numbers appear:

```yaml
theoremNumberFormat: '{number}'      # 1, 2, 3 (default)
theoremNumberFormat: '({number})'    # (1), (2), (3)
theoremNumberFormat: '[{number}]'    # [1], [2], [3]
theoremNumberFormat: '{number}.'     # 1., 2., 3.
```

### Font Size Configuration

You can customize font sizes globally or per-slide for the body text and headings (h1, h2, h3).

**Global font size (applies to all slides):**

```yaml
---
theme: scholarly
fontsize:
  body: 18px    # Base font size for body text
  h1: 48px      # Font size for h1 headings
  h2: 36px      # Font size for h2 headings
  h3: 28px      # Font size for h3 headings
---
```

**Per-slide font size override:**

You can override font sizes for individual slides by adding the `fontsize` configuration to that slide's frontmatter:

```markdown
---
fontsize:
  body: 20px
  h1: 50px
  h2: 40px
  h3: 30px
---

# This slide has custom font sizes

## Subtitle with custom h2 size

### Sub-subtitle with custom h3 size

Body text will be 20px on this slide.
```

**Changing font size for the cover slide only:**

Since the first slide automatically uses the cover layout and settings in the global frontmatter apply to all slides, the best way to customize only the cover slide's font size is to use inline CSS styles.

Add a `<style>` tag in the cover slide's comment section:

```markdown
---
theme: scholarly
authors:
  - name: Your Name
    institution: Your University
---

# Your Presentation Title
Subtitle text

<style>
.slidev-layout.cover h1 {
  font-size: 64px;
}

.slidev-layout.cover h2 {
  font-size: 40px;
}
</style>

---

# Introduction

This slide uses default font sizes.
```

You can customize any CSS property for the cover slide this way:

```markdown
<style>
.slidev-layout.cover h1 {
  font-size: 72px;
  color: #5d8392;
  font-weight: bold;
}

.slidev-layout.cover .author-name {
  font-size: 24px;
}

.slidev-layout.cover .author-institution {
  font-size: 20px;
}
</style>
```

**Alternative: Use fontsize for content slides:**

If you want most slides to have custom font sizes but keep the cover at default size, set `fontsize` on each content slide:

```markdown
---
theme: scholarly
---

# Cover Slide (Default large fonts)

---
fontsize:
  body: 16px
  h1: 36px
---

# Slide 2 (Custom fonts)

---
fontsize:
  body: 16px
  h1: 36px
---

# Slide 3 (Custom fonts)
```

**Flexible format:**

Font sizes accept multiple formats:

```yaml
fontsize:
  body: 18px      # pixels
  h1: 3rem        # rem units
  h2: 2.5em       # em units
  h3: 32          # number (treated as pixels)
```

**Font size notes:**

- All font size options are optional - you can set any combination
- Per-slide settings override global settings
- If not specified, the theme uses default font sizes optimized for each layout
- Font sizes are applied using CSS variables for maximum compatibility

### Footnote Display Configuration

You can set a global footnote display mode in the headmatter, and override it for individual slides when needed.

**Global footnote display (applies to all slides by default):**

```yaml
---
theme: scholarly
footnoteDisplay: hover-only
---
```

**Per-slide footnote display override:**

```markdown
---
footnoteDisplay: notes-only
---
```

Priority order:

- Per-slide `footnoteDisplay`
- Global headmatter `footnoteDisplay`
- Legacy `themeConfig.footnoteDisplay`
- Default `both`

Available values:

- `both`: keep the bottom footnotes and the inline hover/click preview
- `hover-only`: hide the bottom footnotes and keep only the inline preview
- `notes-only`: keep the bottom footnotes and disable the hover/click popover

## Per-Slide Settings

You can override settings for individual slides:

```markdown
---
title: Special Slide
subtitle: With custom header
---

# Content here
```
