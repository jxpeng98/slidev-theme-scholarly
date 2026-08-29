---
title: Color & Typography Themes
---

# Color & Typography Themes

Scholarly provides color and typography themes that can be combined to match an institution or presentation style.

## Theme Gallery

<div class="theme-gallery">
  <div class="theme-section">
    <h3>Classic Blue (Default)</h3>
    <div class="theme-slides">
      <img src="/images/themes/classic-blue/1.png" alt="Classic Blue - Cover" />
      <img src="/images/themes/classic-blue/2.png" alt="Classic Blue - Section" />
      <img src="/images/themes/classic-blue/3.png" alt="Classic Blue - Content" />
      <img src="/images/themes/classic-blue/4.png" alt="Classic Blue - Quote" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Oxford Burgundy</h3>
    <div class="theme-slides">
      <img src="/images/themes/oxford/1.png" alt="Oxford - Cover" />
      <img src="/images/themes/oxford/2.png" alt="Oxford - Section" />
      <img src="/images/themes/oxford/3.png" alt="Oxford - Content" />
      <img src="/images/themes/oxford/4.png" alt="Oxford - Quote" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Cambridge Green</h3>
    <div class="theme-slides">
      <img src="/images/themes/cambridge/1.png" alt="Cambridge - Cover" />
      <img src="/images/themes/cambridge/2.png" alt="Cambridge - Section" />
      <img src="/images/themes/cambridge/3.png" alt="Cambridge - Content" />
      <img src="/images/themes/cambridge/4.png" alt="Cambridge - Quote" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Yale Blue</h3>
    <div class="theme-slides">
      <img src="/images/themes/yale/1.png" alt="Yale - Cover" />
      <img src="/images/themes/yale/2.png" alt="Yale - Section" />
      <img src="/images/themes/yale/3.png" alt="Yale - Content" />
      <img src="/images/themes/yale/4.png" alt="Yale - Quote" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Princeton Orange</h3>
    <div class="theme-slides">
      <img src="/images/themes/princeton/1.png" alt="Princeton - Cover" />
      <img src="/images/themes/princeton/2.png" alt="Princeton - Section" />
      <img src="/images/themes/princeton/3.png" alt="Princeton - Content" />
      <img src="/images/themes/princeton/4.png" alt="Princeton - Quote" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Nordic Blue</h3>
    <div class="theme-slides">
      <img src="/images/themes/nordic/1.png" alt="Nordic - Cover" />
      <img src="/images/themes/nordic/2.png" alt="Nordic - Section" />
      <img src="/images/themes/nordic/3.png" alt="Nordic - Content" />
      <img src="/images/themes/nordic/4.png" alt="Nordic - Quote" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Monochrome</h3>
    <div class="theme-slides">
      <img src="/images/themes/monochrome/1.png" alt="Monochrome - Cover" />
      <img src="/images/themes/monochrome/2.png" alt="Monochrome - Section" />
      <img src="/images/themes/monochrome/3.png" alt="Monochrome - Content" />
      <img src="/images/themes/monochrome/4.png" alt="Monochrome - Quote" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Warm Sepia</h3>
    <div class="theme-slides">
      <img src="/images/themes/sepia/1.png" alt="Sepia - Cover" />
      <img src="/images/themes/sepia/2.png" alt="Sepia - Section" />
      <img src="/images/themes/sepia/3.png" alt="Sepia - Content" />
      <img src="/images/themes/sepia/4.png" alt="Sepia - Quote" />
    </div>
  </div>

  <div class="theme-section">
    <h3>High Contrast</h3>
    <div class="theme-slides">
      <img src="/images/themes/high-contrast/1.png" alt="High Contrast - Cover" />
      <img src="/images/themes/high-contrast/2.png" alt="High Contrast - Section" />
      <img src="/images/themes/high-contrast/3.png" alt="High Contrast - Content" />
      <img src="/images/themes/high-contrast/4.png" alt="High Contrast - Quote" />
    </div>
  </div>
</div>

<style>
.theme-gallery {
  margin: 2rem 0;
}
.theme-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
.theme-section h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}
.theme-slides {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.theme-slides img {
  width: 100%;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: transform 0.2s, box-shadow 0.2s;
}
.theme-slides img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
@media (max-width: 768px) {
  .theme-slides {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .theme-slides {
    grid-template-columns: 1fr;
  }
}
</style>

## Color Themes

Choose from nine color palettes:

### Classic Academic Blue (Default)

The default palette draws on traditional academic colors.

```yaml
---
theme: scholarly
# Classic Blue is the default, no additional configuration needed
---
```

**Colors:**
- Primary: `#1e3a5f` (Deep Academic Blue)
- Accent: `#b8860b` (Academic Gold)
- Background: `#fdfbf7` (Warm Ivory)

### Oxford Burgundy

Rich burgundy inspired by Oxford University.

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: oxford-burgundy
---
```

**Colors:**
- Primary: `#862633` (Oxford Burgundy)
- Accent: `#c5a572` (Antique Gold)
- Background: `#faf8f5` (Off-white)

### Cambridge Green

Classic green reminiscent of Cambridge University.

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: cambridge-green
---
```

**Colors:**
- Primary: `#00543c` (Cambridge Green)
- Accent: `#d4af37` (Gold)

### Yale Blue

Traditional Yale blue for a distinguished look.

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: yale-blue
---
```

**Colors:**
- Primary: `#0f4d92` (Yale Blue)
- Accent: `#d4af37` (Gold)

### Princeton Orange

Vibrant orange for energetic presentations.

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: princeton-orange
---
```

**Colors:**
- Primary: `#e87722` (Princeton Orange)
- Accent: `#1c1c1c` (Black)

### Monochrome Professional

A grayscale palette for figures, screenshots, and text-heavy slides.

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: monochrome
---
```

### Warm Sepia

Warm, vintage-inspired sepia tones.

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: warm-sepia
---
```

### Nordic Blue

Cool, Scandinavian-inspired blue palette.

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: nordic-blue
---
```

### High Contrast (Accessibility)

A high-contrast palette for accessibility-sensitive decks. Check the final
text, accent, and background combinations against the WCAG level you need.

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: high-contrast
---
```

**Colors:**
- Primary: `#000000` (Black)
- Accent: `#0066cc` (Blue)
- Background: `#ffffff` (White)

## Typography Themes

Choose from eight font pairings:

### Classic Palatino (Default)

Traditional academic typography pairing Palatino serif with Helvetica sans serif.

```yaml
---
theme: scholarly
# Classic is the default
---
```

**Fonts:**
- Serif: Palatino Linotype, Book Antiqua, Palatino
- Sans: Helvetica Neue, Helvetica, Arial

### Modern Academica

Contemporary academic styling with Georgia and Source Sans Pro.

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: modern
---
```

**Fonts:**
- Serif: Georgia, Cambria
- Sans: Source Sans Pro, Segoe UI, Roboto

### Traditional Garamond

Classic book typography with Garamond.

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: traditional
---
```

**Fonts:**
- Serif: Garamond, Baskerville
- Sans: Gill Sans, Optima, Helvetica

### Contemporary Sans

A clean, modern design led by sans serif type.

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: contemporary
---
```

**Fonts:**
- Serif: Charter, Georgia, Cambria
- Sans: Inter, SF Pro Display, Segoe UI

### Humanist

Warm, readable humanist typefaces.

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: humanist
---
```

**Fonts:**
- Serif: Crimson Text, Libre Baskerville, Georgia
- Sans: Open Sans, Noto Sans

### Technical

LaTeX-inspired technical typography.

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: technical
---
```

**Fonts:**
- Serif: Computer Modern, Latin Modern
- Sans: IBM Plex Sans, Roboto

### Elegant Serif

Refined, elegant serif typography.

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: elegant
---
```

**Fonts:**
- Serif: Cormorant Garamond, EB Garamond
- Sans: Montserrat, Lato

### Sans Default

Sans serif typography for clean, modern presentations.

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: sans-default
---
```

**Fonts:**
- Sans: Inter, SF Pro Display, system-ui
- Serif: Georgia, Cambria (for fallback)

## Combining Themes

You can combine color and typography themes:

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: oxford-burgundy
  fontTheme: traditional
  contentMode: light # Ordinary slide and readable content surfaces
  chromeMode: dark   # Header, footer, TOC, and toolbar surfaces
  sectionMode: dark  # Section slide appearance
---
```

## Surface modes

`colorTheme` selects the palette. `contentMode`, `chromeMode`, and
`sectionMode` independently control content, presentation controls, and section
dividers. See [Theme Mode and Contrast](./theme-mode-contrast) for recommended
combinations, legacy `colorMode` migration, precedence, and per-slide overrides.

## Custom Colors

Override specific colors while using a theme:

```yaml
---
theme: scholarly
themeColors:
  primary: '#your-custom-color'
  accent: '#your-accent-color'
---
```

Preset values come from the CSS rule selected by `themeConfig.colorTheme`. Values set in `themeColors` are applied to both `<html>` and `<body>`, so they take precedence across Slidev surfaces.

## Live Examples

Run any color theme locally with its example file:

| Theme | Command |
|-------|---------|
| Classic Blue | `pnpm run dev -- examples/example-classic-blue.md` |
| Oxford Burgundy | `pnpm run dev -- examples/example-oxford.md` |
| Cambridge Green | `pnpm run dev -- examples/example-cambridge.md` |
| Yale Blue | `pnpm run dev -- examples/example-yale.md` |
| Princeton Orange | `pnpm run dev -- examples/example-princeton.md` |
| Nordic Blue | `pnpm run dev -- examples/example-nordic.md` |
| Monochrome | `pnpm run dev -- examples/example-monochrome.md` |
| Warm Sepia | `pnpm run dev -- examples/example-sepia.md` |
| High Contrast | `pnpm run dev -- examples/example-high-contrast.md` |

The decks in `examples/` use `theme: ../` so they work when running Slidev from this repository. If you installed the theme from npm, change it to `theme: scholarly`.

Theme implementation and preview regeneration are documented in
[Contributing](../contributing#theme-and-preview-changes).
