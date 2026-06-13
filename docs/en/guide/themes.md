---
title: Color & Typography Themes
---

# Color & Typography Themes

Slidev Theme Scholarly v2.0 introduces customizable color and typography themes to match your institution's branding or personal preferences.

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

Choose from 9 professionally designed color palettes:

### Classic Academic Blue (Default)

The default theme inspired by traditional academic institutions.

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

Clean, professional grayscale theme.

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

Maximum contrast theme for accessibility needs. WCAG AAA compliant.

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

Choose from 8 carefully curated font combinations:

### Classic Palatino (Default)

Traditional academic typography with Palatino serif and Helvetica sans.

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

Clean, modern sans-serif focused design.

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

Sans-serif focused typography for modern presentations.

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
  colorMode: dark    # Optional: header/footer style ('dark' default)
  sectionMode: light  # Optional: set default section appearance
---
```

## Color Mode

Control the appearance of the theme “chrome” (header/footer background + text color) independently from Slidev’s dark mode.

### Global Default

Set it in headmatter:

```yaml
---
theme: scholarly
themeConfig:
  colorMode: light # or 'dark' (default)
---
```

### Priority Chain

```
Global themeConfig.colorMode > 'dark' (default)
```

| Value | Description |
|-------|-------------|
| `dark` | Dark gradient chrome with light text (default) |
| `light` | Light chrome background with dark text |

## Section Mode

Control the appearance of section layout slides independently:

### Global Default

Set a default for all section slides in your headmatter:

```yaml
---
theme: scholarly
themeConfig:
  sectionMode: light  # or 'dark' (default)
---
```

### Per-Slide Override

Override the global setting on individual section slides:

```yaml
---
layout: section
sectionMode: dark  # Override global 'light' setting
---

# This Section Uses Dark Mode
```

### Priority Chain

```
Per-slide sectionMode > Global themeConfig.sectionMode > 'dark' (default)
```

| Value | Description |
|-------|-------------|
| `dark` | Dark gradient background with light text (default) |
| `light` | Light background with dark text |

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

Note: avoid setting `themeConfig.primary` if you want `themeConfig.colorTheme` presets to take effect, as Slidev maps it to `--slidev-theme-primary` on `<body>` and it will override the preset.

## Live Examples

Each color theme has a dedicated example file demonstrating the theme in action:

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

## Implementation Details

Themes are applied using CSS custom properties and data attributes:

- Color themes use `[data-color-theme="theme-name"]`
- Font themes use `[data-font-theme="theme-name"]`
- Color mode uses `[data-color-mode="dark/light"]` (controls header/footer “chrome”)

This allows for seamless theme switching without reloading the presentation.

### Semantic Token Groups

Scholarly keeps readable content colors separate from the theme's identity colors. When creating a new color theme or adjusting light/dark behavior, prefer these token groups instead of hard-coded component colors:

| Token group | Purpose | Examples |
|-------------|---------|----------|
| Chrome tokens | Header, footer, toolbar, and navigation surfaces | `--scholarly-chrome-bg`, `--scholarly-toolbar-hover` |
| Content tokens | Readable slide body surfaces, borders, code, quote, and table colors | `--scholarly-content-surface`, `--scholarly-code-bg`, `--scholarly-quote-fg` |
| Accent tokens | Theme identity colors provided by color presets or `themeColors` | `--slidev-theme-primary`, `--slidev-theme-primary-light`, `--scholarly-accent` |
| Semantic tokens | Variant-specific readable states for highlights, blocks, and theorems | `--scholarly-highlight-warning-bg`, `--scholarly-block-info-border`, `--scholarly-theorem-definition-accent` |
| Interaction tokens | Hover, focus, pinned, active, and muted UI feedback | `--scholarly-toolbar-hover`, `--scholarly-content-fg-muted` |

The key rule is that a background token and its foreground token must move together. For example, `Highlight` uses `--scholarly-highlight-*-bg` and `--scholarly-highlight-*-fg`, so a dark highlight background cannot accidentally inherit dark body text in light mode.

## Regenerate Theme Screenshots

To export the first 4 slides of every theme example into `images/themes/*` (and sync to `docs/public/images/themes/*`), run:

```bash
pnpm run export:theme-images
```
