---
theme: ../
footerMiddle: All Themes Gallery
aspectRatio: 4/3
lang: en
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  contentMode: light
  chromeMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
authors:
  - name: Theme Designer
    institution: Slidev Theme Scholarly
---

# All Themes Gallery

All 9 color themes in one presentation

---
layout: section
---

# Color Theme Comparison

## Visual preview of each theme's color palette

---
layout: default
title: Classic Academic Blue
subtitle: Default Theme
---

## Classic Academic Blue

<ThemePreview colorTheme="classic-blue">

### Sample Content

This is the **default theme** with deep academic blue and warm ivory background.

- Primary: `#1e3a5f` (Deep Blue)
- Accent: `#b8860b` (Gold)

</ThemePreview>

```yaml
themeConfig:
  colorTheme: classic-blue
```

---
layout: default
title: Oxford Burgundy
---

## Oxford Burgundy

<ThemePreview colorTheme="oxford-burgundy">

### Sample Content

Rich **burgundy tones** inspired by Oxford University's distinguished heritage.

- Primary: `#862633` (Burgundy)
- Accent: `#c5a572` (Antique Gold)

</ThemePreview>

```yaml
themeConfig:
  colorTheme: oxford-burgundy
```

---
layout: default
title: Cambridge Green
---

## Cambridge Green

<ThemePreview colorTheme="cambridge-green">

### Sample Content

Classic **green palette** reminiscent of Cambridge University's academic tradition.

- Primary: `#00543c` (Cambridge Green)
- Accent: `#d4af37` (Gold)

</ThemePreview>

```yaml
themeConfig:
  colorTheme: cambridge-green
```

---
layout: default
title: Princeton Orange
---

## Princeton Orange

<ThemePreview colorTheme="princeton-orange">

### Sample Content

Vibrant **orange energy** from Princeton University for bold presentations.

- Primary: `#e87722` (Orange)
- Accent: `#1c1c1c` (Black)

</ThemePreview>

```yaml
themeConfig:
  colorTheme: princeton-orange
```

---
layout: default
title: Yale Blue
---

## Yale Blue

<ThemePreview colorTheme="yale-blue">

### Sample Content

Traditional **Yale blue** for a polished, professional appearance.

- Primary: `#0f4d92` (Yale Blue)
- Accent: `#d4af37` (Gold)

</ThemePreview>

```yaml
themeConfig:
  colorTheme: yale-blue
```

---
layout: default
title: Nordic Blue
---

## Nordic Blue

<ThemePreview colorTheme="nordic-blue">

### Sample Content

Cool **Scandinavian tones** for clean, modern presentations.

- Primary: `#2e5266` (Nordic Blue)
- Accent: `#d4a762` (Warm Gold)

</ThemePreview>

```yaml
themeConfig:
  colorTheme: nordic-blue
```

---
layout: default
title: Monochrome
---

## Monochrome Professional

<ThemePreview colorTheme="monochrome">

### Sample Content

Clean **grayscale palette** for minimalist, professional contexts.

- Primary: `#2d3748` (Dark Gray)
- Accent: `#718096` (Medium Gray)

</ThemePreview>

```yaml
themeConfig:
  colorTheme: monochrome
```

---
layout: default
title: Warm Sepia
---

## Warm Sepia

<ThemePreview colorTheme="warm-sepia">

### Sample Content

**Vintage warmth** with sepia tones for humanities and literature.

- Primary: `#5d4037` (Sepia Brown)
- Accent: `#d4a574` (Warm Tan)

</ThemePreview>

```yaml
themeConfig:
  colorTheme: warm-sepia
```

---
layout: default
title: High Contrast
---

## High Contrast (Accessibility)

<ThemePreview colorTheme="high-contrast">

### Sample Content

A high-contrast starting point for accessibility-sensitive decks; verify every final text and background pair.

- Primary: `#000000` (Black)
- Accent: `#0066cc` (Blue)

</ThemePreview>

```yaml
themeConfig:
  colorTheme: high-contrast
```

---
layout: section
---

# Side-by-Side Comparison

## Multiple themes on a single slide

---
layout: two-cols
ratio: "1:1"
title: University Themes
---

## Ivy League Colors

<ThemePreview colorTheme="oxford-burgundy" class="mb-4">

**Oxford Burgundy**

Distinguished and timeless

</ThemePreview>

<ThemePreview colorTheme="cambridge-green">

**Cambridge Green**

Natural and scholarly

</ThemePreview>

::right::

<ThemePreview colorTheme="yale-blue" class="mb-4">

**Yale Blue**

Professional and trustworthy

</ThemePreview>

<ThemePreview colorTheme="princeton-orange">

**Princeton Orange**

Bold and innovative

</ThemePreview>

---
layout: two-cols
ratio: "1:1"
title: Style Themes
---

## Design Approaches

<ThemePreview colorTheme="classic-blue" class="mb-4">

**Classic Blue**

Traditional academic

</ThemePreview>

<ThemePreview colorTheme="nordic-blue">

**Nordic Blue**

Modern Scandinavian

</ThemePreview>

::right::

<ThemePreview colorTheme="monochrome" class="mb-4">

**Monochrome**

Minimalist professional

</ThemePreview>

<ThemePreview colorTheme="warm-sepia">

**Warm Sepia**

Vintage humanities

</ThemePreview>

---
layout: default
title: All Nine Themes
---

## Complete Theme Gallery

<div class="grid grid-cols-3 gap-3">

<ThemePreview colorTheme="classic-blue">

**Classic Blue**

</ThemePreview>

<ThemePreview colorTheme="oxford-burgundy">

**Oxford**

</ThemePreview>

<ThemePreview colorTheme="cambridge-green">

**Cambridge**

</ThemePreview>

<ThemePreview colorTheme="princeton-orange">

**Princeton**

</ThemePreview>

<ThemePreview colorTheme="yale-blue">

**Yale**

</ThemePreview>

<ThemePreview colorTheme="nordic-blue">

**Nordic**

</ThemePreview>

<ThemePreview colorTheme="monochrome">

**Monochrome**

</ThemePreview>

<ThemePreview colorTheme="warm-sepia">

**Sepia**

</ThemePreview>

<ThemePreview colorTheme="high-contrast">

**High Contrast**

</ThemePreview>

</div>

---
layout: center
---

## Using Individual Theme Examples

For full presentations with each theme, run:

```bash
pnpm run dev -- examples/example-oxford.md
pnpm run dev -- examples/example-cambridge.md
pnpm run dev -- examples/example-princeton.md
# ... etc
```

<Keywords :keywords="['Theme Gallery', 'Color Themes', 'Academic Design', 'Slidev']" />
