---
title: Structure Layouts
---

# Structure Layouts

These layouts shape the deck as a whole: its opening, sections, outline, and closing.

## cover - Title Slide {#cover}

**Use for:** The first slide in a deck

![Cover Layout Example](/images/layouts/cover.png)

```markdown
---
layout: cover
authors:
  - name: Your Name
    institution: Your University
    email: you@example.edu
footerMiddle: Conference Name 2025
---

# Your Presentation Title
Subtitle or description
```

**What it shows:**

- Large title in the center
- Authors, institutions, and email addresses
- A footer with the author, conference, page number, and presentation controls

**Props:**

- `authors`: Array of `{ name, institution?, email? }`; falls back to global `authors`
- `footerLeft`: Text at the left side of the footer
- `footerMiddle`: Text at the center of the footer

---

## default - Standard Content {#default}

**Use for:** Most content slides; this is the default layout

![Default Layout Example](/images/layouts/default.png)

```markdown
---
title: My Slide Title
subtitle: Optional subtitle
---

# Main Content

- Bullet point 1
- Bullet point 2

Add text, images, code, or equations here.
```

**What it shows:**

- Optional header with title and subtitle
- The slide content
- A footer with the page number and presentation controls

**Props:**

- `title`, `subtitle`: Optional header content
- `density`: `auto`, `compact`, `normal`, or `relaxed`

---

## intro - Section Introduction {#intro}

**Use for:** Starting a new section of your talk

![Intro Layout Example](/images/layouts/intro.png)

```markdown
---
layout: intro
---

# Part 2: Methodology

Next, we explain the method
```

**What it shows:**

- Large, centered text
- No header (more space for the title)
- Footer at the bottom

**Props:**

- `align`: `left` or `center` (default: `left`)
- `density`: `auto`, `compact`, `normal`, or `relaxed`

---

## section - Chapter Divider {#section}

**Use for:** Separating the main sections of a deck

![Section Layout Example](/images/layouts/section.png)

```markdown
---
layout: section
sectionMode: dark  # dark, light, match, or inverse (optional, default: dark)
---

# Results
```

**What it shows:**

- Large, centered title
- No header
- Footer at the bottom
- A clear visual break between sections

**sectionMode Options:**

| Value | Description |
|-------|-------------|
| `dark` | Dark background with light text (default) |
| `light` | Light background with dark text |
| `match` | Match the current global `contentMode` |
| `inverse` | Use the opposite of the current global `contentMode` |

**Global vs Per-slide Configuration:**

Set the global default in the headmatter:

```yaml
---
theme: scholarly
themeConfig:
  contentMode: light
  sectionMode: match  # All sections match the global content mode
---
```

Then override on specific slides:

```yaml
---
layout: section
sectionMode: inverse  # Override global setting for this slide
---

# This Section Uses the Inverse Mode
```

---

## toc - Table of Contents {#toc}

**Use for:** Outline/agenda slide (auto-generated from your `layout: section` slides)

![TOC Layout Example](/images/layouts/toc.png)

```markdown
---
layout: toc
title: Outline        # set to false to hide
showNumbers: true     # optional, default: true
highlightCurrent: true # optional, default: true
---
```

**What it shows:**

- A title (defaults to `Outline` or `目录` based on `lang`)
- A list of all `layout: section` slides (click to navigate)

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string \| false` | `Outline` | Title text, set to `false` to hide |
| `showNumbers` | `boolean` | `true` | Show numbered badges |
| `highlightCurrent` | `boolean` | `true` | Highlight the current section |
| `sections` | `string[]` | - | Manually specify section titles (overrides auto-extraction) |

---

## center - Centered Content {#center}

**Use for:** Short messages or key points

![Center Layout Example](/images/layouts/center.png)

```markdown
---
layout: center
---

# Key Takeaway

This is the most important point
```

**What it shows:**

- All content centered horizontally and vertically
- Makes a short message the focus of the slide

---

## auto-center - Auto-Adjusting Content {#auto-center}

**Use for:** Content that needs automatic font size adjustment

![Auto-Center Layout Example](/images/layouts/auto-center.png)

```markdown
---
layout: auto-center
title: Title
subtitle: Subtitle
---

## Auto-Centered Content

This layout automatically adjusts font size to fit content.
```

**What it shows:**

- Automatically adjusts font size based on content length
- Centers content vertically
- Keeps text left-aligned within the centered block

**Props:**

- `title`, `subtitle`: Optional header content
- `minFontSize`, `maxFontSize`: Font-size limits in pixels

---

## auto-size - Fit-to-Page Default Layout {#auto-size}

**Use for:** Slides with variable amounts of content that should keep the default reading order

```markdown
---
layout: auto-size
title: Title
subtitle: Subtitle
autoSizeGrow: true
autoSizeAlign: top
autoSizePadding: normal
minFontSize: 14
maxFontSize: 30
---

## Auto-Sized Main Matter

This layout keeps the default reading flow while adjusting the body text to fit the page.
```

**What it shows:**

- Keeps the default header and footer structure
- Fits the main matter to the available width and height
- Keeps content top-aligned instead of vertically centered
- Supports `minFontSize` and `maxFontSize` frontmatter overrides

**Props:**

- `title`, `subtitle`: Optional header content
- `density`: `auto`, `compact`, `normal`, or `relaxed`
- `minFontSize`, `maxFontSize`: Font-size limits in pixels
- `autoSizeGrow`: Allow sparse slides to grow, or only shrink when needed
- `autoSizeAlign`: `top` or `center`
- `autoSizePadding`: `compact` or `normal`

---

## end - Thank You Slide {#end}

**Use for:** A closing slide with contact information

![End Layout Example](/images/layouts/end.png)

```markdown
---
layout: end
email: jane@stanford.edu
website: https://example.com/project
subtitle: Questions?
qrcode: https://example.com/qr.png
qrcodeLabel: Scan for paper
---

Thank you for your attention!
```

**Props:**
- `thankYou`: Custom thank you text (default: "Thank You!")
- `subtitle`: Subtitle text
- `email`: Contact email
- `website`: Project/personal website
- `qrcode`: QR code image URL
- `qrcodeLabel`: Label for QR code
