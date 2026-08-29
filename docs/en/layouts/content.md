---
title: Content Layouts
---

# Content Layouts

These layouts arrange images, columns, and lists.

## two-cols - Two Columns {#two-cols}

**Use for:** Comparing two groups or showing related material side by side

![Two Columns Layout Example](/images/layouts/two-cols.png)

```markdown
---
layout: two-cols
ratio: "2:3"
title: Two Columns Layout
---

## Left Column (2fr)

The left column takes two fifths of the available width.

- Point 1
- Point 2

::right::

## Right Column (3fr)

The right column takes three fifths of the available width.
```

**Props:**
- `ratio`: Column width ratio, e.g., "1:1", "2:3" (default: "1:1")
- `gap`: CSS gap between the two columns (default: `1rem`)
- `title`, `subtitle`: Optional header content

**What it shows:**

- Left column content (before `::right::`)
- Right column content (after `::right::`)
- Configurable width ratio

---

## image-left - Image on Left {#image-left}

**Use for:** Explaining visuals with text

![Image Left Layout Example](/images/layouts/image-left.png)

```markdown
---
layout: image-left
image: ./path/to/image.png
ratio: "1:2"
title: Image Left Layout
---

## Content on Right (2fr)

- Equipment A
- Equipment B
- Equipment C

Add a short description of the setup.
```

**Props:**
- `image`: Image URL or path
- `ratio`: Image:content ratio (default: "1:1")
- `fit`: `cover`, `contain`, `fill` (default: `cover`)
- `position`: CSS image position (default: `center`)
- `title`, `subtitle`: Optional header content

**What it shows:**

- Full-height image on the left
- Your content on the right

---

## image-right - Image on Right {#image-right}

**Use for:** Text with supporting visual

![Image Right Layout Example](/images/layouts/image-right.png)

```markdown
---
layout: image-right
image: https://example.com/image.jpg
ratio: "3:2"
fit: contain
title: Image Right Layout
---

## Content on Left (3fr)

Summarize the main finding here.

- Finding 1
- Finding 2
```

**Props:**
- `image`: Image URL or path
- `ratio`: Content:image ratio (default: "1:1")
- `fit`: `cover`, `contain`, `fill` (default: `cover`)
- `position`: CSS image position (default: `center`)
- `title`, `subtitle`: Optional header content

**What it shows:**

- Your content on the left
- Full-height image on the right

---

## bullets - Enhanced List {#bullets}

**Use for:** A clear list with custom markers

![Bullets Layout Example](/images/layouts/bullets.png)

```markdown
---
layout: bullets
title: Key Points
subtitle: Summary
icon: "→"
---

## Main Findings

- **Point 1:** Description
- **Point 2:** Description
- **Point 3:** Description
```

**Props:**
- `title`: Slide title
- `subtitle`: Optional subtitle
- `icon`: Custom bullet character (default: `▸`)

**Features:**
- Custom bullet markers
- Numbered lists with circular badges
- Nested list support

---

## figure - Academic Figure {#figure}

**Use for:** A figure with a number and caption

![Figure Layout Example](/images/layouts/figure.png)

```markdown
---
layout: figure
image: ./images/architecture.png
caption: Overview of our proposed system architecture.
label: "Figure 1:"
title: System Architecture
height: 60%
---

Additional description below the figure.
```

Use `image` instead of `src` in Slidev frontmatter. `src` is reserved by Slidev for external slide sources and can cause the figure slide to disappear from builds and exports.

**Props:**
- `image`: Image URL or path
- `caption`: Figure caption
- `label`: Label prefix (e.g., "Figure 1:")
- `title`: Slide title
- `subtitle`: Optional subtitle
- `height`: Image height (default: `60%`)
- `fit`: `contain`, `cover`, `fill` (default: `contain`)

---

## split-image - Image Comparison {#split-image}

**Use for:** Comparing several captioned images side by side

![Split Image Layout Example](/images/layouts/split-image.png)

```markdown
---
layout: split-image
images:
  - ./before.png
  - ./after.png
captions:
  - Before optimization
  - After optimization
title: Visual Comparison
---
```

**Props:**
- `images`: Array of image URLs
- `captions`: Array of caption strings
- `title`, `subtitle`: Header content
