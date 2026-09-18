---
title: Color & Typography Themes
---

# Color & Typography Themes

Choose a color palette and font pairing independently. Set both in the first YAML block of `slides.md`:

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: oxford-burgundy
  fontTheme: traditional
---
```

The default is `classic-blue` with `classic`. Names such as Oxford and Cambridge identify presets in this theme; they are not official university templates.

## Color Themes

| `colorTheme` | Primary | Accent | Light background |
|---|---|---|---|
| <span id="classic-academic-blue-default"></span>`classic-blue` | `#1e3a5f` | `#b8860b` | `#fdfbf7` |
| <span id="oxford-burgundy"></span>`oxford-burgundy` | `#862633` | `#c5a572` | `#faf8f5` |
| <span id="cambridge-green"></span>`cambridge-green` | `#00543c` | `#d4af37` | `#f8faf7` |
| <span id="yale-blue"></span>`yale-blue` | `#0f4d92` | `#d4af37` | `#f7f9fc` |
| <span id="princeton-orange"></span>`princeton-orange` | `#e87722` | `#1c1c1c` | `#fffbf5` |
| <span id="nordic-blue"></span>`nordic-blue` | `#2e5266` | `#d4a762` | `#f5f8fa` |
| <span id="warm-sepia"></span>`warm-sepia` | `#5d4037` | `#d4a574` | `#faf6f1` |
| <span id="monochrome-professional"></span>`monochrome` | `#2d3748` | `#718096` | `#ffffff` |
| <span id="high-contrast-accessibility"></span>`high-contrast` | `#000000` | `#0066cc` | `#ffffff` |

These are palette values. Content and navigation modes also affect the colors used on a rendered slide. Check figures, links, and text against the final background, including when using `high-contrast`.

## Typography Themes

Each preset defines font stacks. The browser uses the first available font, so output may differ between machines. Choosing a preset does not install every font in its stack; ensure any required fonts are available before exporting.

| `fontTheme` | Body style | Serif stack starts with | Sans-serif stack starts with |
|---|---|---|---|
| <span id="classic-palatino-default"></span>`classic` | Serif | Palatino Linotype, Book Antiqua, Palatino | Helvetica Neue, Helvetica, Arial |
| <span id="modern-academica"></span>`modern` | Sans-serif | Georgia, Cambria | Source Sans Pro, Segoe UI, Roboto |
| <span id="traditional-garamond"></span>`traditional` | Serif | Garamond, Baskerville | Gill Sans, Optima, Helvetica |
| <span id="contemporary-sans"></span>`contemporary` | Sans-serif | Charter, Georgia, Cambria | Inter, SF Pro Display, Segoe UI |
| <span id="humanist"></span>`humanist` | Sans-serif | Crimson Text, Libre Baskerville, Georgia | Open Sans, Noto Sans |
| <span id="technical"></span>`technical` | Sans-serif | Computer Modern, Latin Modern | IBM Plex Sans, Roboto |
| <span id="elegant-serif"></span>`elegant` | Serif | Cormorant Garamond, EB Garamond | Montserrat, Lato |
| <span id="sans-default"></span>`sans-default` | Sans-serif | Georgia, Cambria | Inter, SF Pro Display, system fonts |

## Combining Themes

The CLI also provides four combined presets: `classic`, `oxford`, `cambridge`, and `modern`.

```bash
pnpm exec sch theme preset list
pnpm exec sch theme preset apply oxford --file slides.md
```

To choose colors and fonts separately, edit `themeConfig` as shown above or use `pnpm exec sch theme apply oxford-burgundy --font traditional --file slides.md`.

## Surface modes

`colorTheme` selects the palette. `contentMode`, `chromeMode`, and `sectionMode` control the slide body, headers and controls, and section dividers. See [Theme Mode and Contrast](./theme-mode-contrast) for combinations and per-slide section overrides.

## Custom Colors

Place `themeColors` at the top level, beside `themeConfig`:

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: classic-blue
themeColors:
  primary: '#254b64'
  accent: '#875d20'
---
```

Supported keys are `primary`, `primaryLight`, `accent`, `bgWarm`, `textPrimary`, `headerBg`, `footerLeftBg`, `footerCenterBg`, and `footerRightBg`. These override palette CSS variables on the document root and body. Check the resulting foreground/background combinations in the modes you use.

## Theme Gallery

Each row shows a cover, section, content, and quote slide using the named palette. These previews show one configuration; your content mode and installed fonts also affect the result.

<div class="theme-gallery">
  <div class="theme-section">
    <h3>Classic Blue (Default)</h3>
    <div class="theme-slides">
      <img src="/images/themes/classic-blue/1.png" alt="Classic Blue - Cover" loading="lazy" />
      <img src="/images/themes/classic-blue/2.png" alt="Classic Blue - Section" loading="lazy" />
      <img src="/images/themes/classic-blue/3.png" alt="Classic Blue - Content" loading="lazy" />
      <img src="/images/themes/classic-blue/4.png" alt="Classic Blue - Quote" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Oxford Burgundy</h3>
    <div class="theme-slides">
      <img src="/images/themes/oxford/1.png" alt="Oxford - Cover" loading="lazy" />
      <img src="/images/themes/oxford/2.png" alt="Oxford - Section" loading="lazy" />
      <img src="/images/themes/oxford/3.png" alt="Oxford - Content" loading="lazy" />
      <img src="/images/themes/oxford/4.png" alt="Oxford - Quote" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Cambridge Green</h3>
    <div class="theme-slides">
      <img src="/images/themes/cambridge/1.png" alt="Cambridge - Cover" loading="lazy" />
      <img src="/images/themes/cambridge/2.png" alt="Cambridge - Section" loading="lazy" />
      <img src="/images/themes/cambridge/3.png" alt="Cambridge - Content" loading="lazy" />
      <img src="/images/themes/cambridge/4.png" alt="Cambridge - Quote" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Yale Blue</h3>
    <div class="theme-slides">
      <img src="/images/themes/yale/1.png" alt="Yale - Cover" loading="lazy" />
      <img src="/images/themes/yale/2.png" alt="Yale - Section" loading="lazy" />
      <img src="/images/themes/yale/3.png" alt="Yale - Content" loading="lazy" />
      <img src="/images/themes/yale/4.png" alt="Yale - Quote" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Princeton Orange</h3>
    <div class="theme-slides">
      <img src="/images/themes/princeton/1.png" alt="Princeton - Cover" loading="lazy" />
      <img src="/images/themes/princeton/2.png" alt="Princeton - Section" loading="lazy" />
      <img src="/images/themes/princeton/3.png" alt="Princeton - Content" loading="lazy" />
      <img src="/images/themes/princeton/4.png" alt="Princeton - Quote" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Nordic Blue</h3>
    <div class="theme-slides">
      <img src="/images/themes/nordic/1.png" alt="Nordic - Cover" loading="lazy" />
      <img src="/images/themes/nordic/2.png" alt="Nordic - Section" loading="lazy" />
      <img src="/images/themes/nordic/3.png" alt="Nordic - Content" loading="lazy" />
      <img src="/images/themes/nordic/4.png" alt="Nordic - Quote" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Monochrome</h3>
    <div class="theme-slides">
      <img src="/images/themes/monochrome/1.png" alt="Monochrome - Cover" loading="lazy" />
      <img src="/images/themes/monochrome/2.png" alt="Monochrome - Section" loading="lazy" />
      <img src="/images/themes/monochrome/3.png" alt="Monochrome - Content" loading="lazy" />
      <img src="/images/themes/monochrome/4.png" alt="Monochrome - Quote" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>Warm Sepia</h3>
    <div class="theme-slides">
      <img src="/images/themes/sepia/1.png" alt="Sepia - Cover" loading="lazy" />
      <img src="/images/themes/sepia/2.png" alt="Sepia - Section" loading="lazy" />
      <img src="/images/themes/sepia/3.png" alt="Sepia - Content" loading="lazy" />
      <img src="/images/themes/sepia/4.png" alt="Sepia - Quote" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>High Contrast</h3>
    <div class="theme-slides">
      <img src="/images/themes/high-contrast/1.png" alt="High Contrast - Cover" loading="lazy" />
      <img src="/images/themes/high-contrast/2.png" alt="High Contrast - Section" loading="lazy" />
      <img src="/images/themes/high-contrast/3.png" alt="High Contrast - Content" loading="lazy" />
      <img src="/images/themes/high-contrast/4.png" alt="High Contrast - Quote" loading="lazy" />
    </div>
  </div>
</div>


## Live Examples

After [cloning and installing the repository](../contributing), run a palette example from the repository root:

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
