# Slidev Theme Scholarly

[![NPM version](https://img.shields.io/npm/v/slidev-theme-scholarly?color=3AB9D4&label=)](https://www.npmjs.com/package/slidev-theme-scholarly)
[中文版](./README-zh.md)

A professional presentation theme for [Slidev](https://github.com/slidevjs/slidev), designed specifically for academic presentations with LaTeX Beamer-inspired styling.

---

## 📖 Table of Contents

- [What is this?](#what-is-this)
- [Who should use this?](#who-should-use-this)
- [Quick Start](#quick-start)
- [Key Features](#key-features)
- [Understanding Layouts](#understanding-layouts)
- [Theorem Components](#theorem-components)
- [Configuration Guide](#configuration-guide)
- [Examples](#examples)
- [Contributing](#contributing)

---

## What is this?

This is a **theme** (a design template) for [Slidev](https://sli.dev), which is a tool for creating presentation slides using simple text files. Think of it like PowerPoint, but instead of clicking and dragging, you write your content in a simple format called Markdown.

**Why use this theme?**

- � It looks professional and academic (inspired by LaTeX Beamer)
- 🎯 Perfect for research presentations, lectures, and conference talks
- ✨ Handles complex content like mathematical formulas and theorems
- 🚀 Much faster than PowerPoint once you learn the basics

**No coding experience required!** If you can write an email, you can create presentations with this theme.

---

## Who should use this?

This theme is designed for:

- 👨‍🎓 **PhD students** presenting their research
- 👩‍🏫 **Professors** creating lecture slides
- 🔬 **Researchers** preparing conference talks
- 📊 **Anyone** who needs professional-looking academic presentations

**You don't need to be a programmer!** The learning curve is gentle, and you'll be creating beautiful slides in minutes.

---

## Quick Start

### Step 1: Install Slidev

First, make sure you have [Node.js](https://nodejs.org/) installed (download from nodejs.org). Then open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
npm install -g @slidev/cli
```

> **What does this do?** It installs Slidev on your computer so you can use it anywhere.

### Step 2: Create Your First Presentation

```bash
# Create a new folder for your presentation
mkdir my-talk
cd my-talk

# Create your slides file
echo "---
theme: scholarly
---

# My First Academic Talk

Your name here

---

# Introduction

- Point 1
- Point 2
- Point 3
" > slides.md
```

### Step 3: Preview Your Presentation

```bash
slidev slides.md
```

Your browser will open automatically showing your presentation! Press the right arrow key to move between slides.

> **Tip:** Keep the terminal running. Any changes you make to `slides.md` will show up immediately in your browser!

---

## Key Features

### 🎨 Professional Design

- Clean, academic aesthetic inspired by LaTeX Beamer
- Automatic header and footer on all slides
- Consistent styling throughout your presentation

### 👥 Multi-Author Support

Display one author, two authors, or entire research teams elegantly:

- 1 author: "Jane Smith"
- 2 authors: "Jane Smith & John Doe"  
- 3 authors: "Jane Smith, John Doe, Alice Brown"
- 4+ authors: "Jane Smith et al."

### 🔢 Smart Theorem Numbering

Insert theorems, lemmas, definitions with automatic numbering:

- Each type (theorem, lemma, etc.) has its own counter
- Supports both English and Chinese
- Customizable number format

### 📐 11 Layout Options

Different layouts for different needs:

- Title slides
- Content slides
- Section dividers
- Image + text combinations
- And more!

### 🌍 Multi-Language

Supports English and Chinese (中文) for mathematical content.

---

## Understanding Layouts

**What is a layout?**
A layout is like a slide template in PowerPoint. It determines how content is arranged on the slide.

### How to Choose a Layout

At the top of each slide, add:

```yaml
---
layout: layout-name
---
```

If you don't specify a layout, Slidev uses the `default` layout automatically.

### Available Layouts

#### 1️⃣ **cover** - Title Slide

**Use for:** The first slide of your presentation

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
- Author(s) with institution and email
- Footer with author, conference, and page number

---

#### 2️⃣ **default** - Standard Content

**Use for:** Most of your slides (this is automatic!)

```markdown
---
title: My Slide Title
subtitle: Optional subtitle
---

# Main Content

- Bullet point 1
- Bullet point 2

You can add text, images, code, math formulas, etc.
```

**What it shows:**

- Optional header with title and subtitle
- Your content in the middle
- Footer at the bottom

---

#### 3️⃣ **intro** - Section Introduction

**Use for:** Starting a new section of your talk

```markdown
---
layout: intro
---

# Part 2: Methodology

Let's discuss our approach
```

**What it shows:**

- Large, centered text
- No header (more space for the title)
- Footer at the bottom

---

#### 4️⃣ **section** - Chapter Divider

**Use for:** Major transitions in your presentation

```markdown
---
layout: section
---

# Results
```

**What it shows:**

- Very large, centered title
- No header
- Footer at the bottom
- Perfect for dramatic section breaks

---

#### 5️⃣ **center** - Centered Content

**Use for:** Short messages or key points

```markdown
---
layout: center
---

# Key Takeaway

This is the most important point
```

**What it shows:**

- All content centered horizontally and vertically
- Great for emphasis

---

#### 6️⃣ **quote** - Quotations

**Use for:** Highlighting quotes

```markdown
---
layout: quote
---

> "The only way to do great work is to love what you do."
> 
> — Steve Jobs
```

**What it shows:**

- Large, styled quote
- Attribution below

---

#### 7️⃣ **fact** - Single Fact/Statistic

**Use for:** Highlighting important numbers or facts

```markdown
---
layout: fact
---

# 95%

Success rate of our method
```

**What it shows:**

- Very large number or short text
- Smaller description below

---

#### 8️⃣ **statement** - Important Statement

**Use for:** Highlighting key statements

```markdown
---
layout: statement
---

# Our method achieves state-of-the-art results

Outperforming all previous approaches
```

**What it shows:**

- Large statement text, centered
- Medium width for readability

---

#### 9️⃣ **image-left** - Image on Left, Text on Right

**Use for:** Explaining visuals with text

```markdown
---
layout: image-left
image: ./path/to/image.png
---

# Experimental Setup

- Equipment A
- Equipment B  
- Equipment C

Description of the setup...
```

**What it shows:**

- Full-height image on the left half
- Your content on the right half

---

#### 🔟 **image-right** - Image on Right, Text on Left

**Use for:** Text with supporting visual

```markdown
---
layout: image-right
image: https://example.com/image.jpg
---

# Results Analysis

Our findings show...

- Finding 1
- Finding 2
```

**What it shows:**

- Your content on the left half
- Full-height image on the right half

---

#### 1️⃣1️⃣ **two-cols** - Two Columns

**Use for:** Comparing or showing parallel content

```markdown
---
layout: two-cols
---

# Method A

- Advantage 1
- Advantage 2
- Advantage 3

::right::

# Method B

- Advantage 1
- Advantage 2
- Advantage 3
```

**What it shows:**

- Left column content (before `::right::`)
- Right column content (after `::right::`)
- Equal width columns

---

## Theorem Components

### What are Theorem Components?

In academic presentations, you often need to present formal statements like theorems, lemmas, or definitions. This theme provides a special component that:

- Automatically numbers your theorems
- Styles them professionally
- Supports multiple languages

### Basic Usage

```markdown
<Theorem type="theorem" title="Pythagorean Theorem">

For a right triangle with legs $a$ and $b$, and hypotenuse $c$:

$$a^2 + b^2 = c^2$$

</Theorem>
```

**Result:** A nicely formatted box with "Theorem 1 (Pythagorean Theorem)" as the header and your content inside.

### Available Types

Each type has a different color:

| Type | English | Chinese | Color |
|------|---------|---------|-------|
| `theorem` | Theorem | 定理 | Blue |
| `lemma` | Lemma | 引理 | Purple |
| `proposition` | Proposition | 命题 | Cyan |
| `corollary` | Corollary | 推论 | Green |
| `definition` | Definition | 定义 | Amber |
| `example` | Example | 例 | Pink |
| `remark` | Remark | 注 | Gray |

### Examples

**Simple theorem:**

```markdown
<Theorem type="theorem">

Every bounded sequence has a convergent subsequence.

</Theorem>
```

**Theorem with title:**

```markdown
<Theorem type="definition" title="Continuity">

A function $f$ is continuous at $x = a$ if...

</Theorem>
```

**Manual numbering:**

```markdown
<Theorem type="lemma" number="3.2">

This will be numbered as "Lemma 3.2" instead of auto-numbering.

</Theorem>
```

**No numbering:**

```markdown
<Theorem type="remark" :autoNumber="false">

This remark has no number.

</Theorem>
```

---

## Configuration Guide

### Setting Up Your Presentation

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

### Configuration Options

#### Basic Settings

| Option | What it does | Example |
|--------|-------------|---------|
| `theme` | Tells Slidev to use this theme | `scholarly` |
| `lang` | Language for theorems | `en` or `zh` |
| `aspectRatio` | Slide dimensions | `16/9` or `4/3` |

#### Author Information

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

#### Footer Configuration

| Option | What it controls | Example |
|--------|-----------------|---------|
| `footerLeft` | Left side of footer | `Custom text` |
| `footerMiddle` | Middle of footer | `Conference 2025` |
| `footerRight` | Right side (auto) | Page numbers |

**Default behavior (if not specified):**

- Left: Shows author name(s)
- Middle: Empty (or your custom text)
- Right: Page numbers (automatic)

#### Theorem Number Format

Customize how theorem numbers appear:

```yaml
theoremNumberFormat: '{number}'      # 1, 2, 3 (default)
theoremNumberFormat: '({number})'    # (1), (2), (3)
theoremNumberFormat: '[{number}]'    # [1], [2], [3]
theoremNumberFormat: '{number}.'     # 1., 2., 3.
```

### Per-Slide Settings

You can override settings for individual slides:

```markdown
---
title: Special Slide
subtitle: With custom header
---

# Content here
```

---

## Examples

### Complete Minimal Example

```markdown
---
theme: scholarly
author: Your Name
footerMiddle: My Talk 2025
---

# My Research

A brief overview

---

# Introduction

This is my research about...

- Point 1
- Point 2

---
layout: section
---

# Methods

---

# Our Approach

<Theorem type="theorem">

We prove that our algorithm runs in $O(n \log n)$ time.

</Theorem>

---

# Thank You

Questions?
```

### Example with All Features

See [`example.md`](./example.md) for a complete demonstration of all layouts and features.

### Chinese Example

See [`example-zh.md`](./example-zh.md) for a complete example in Chinese (中文示例).

---

## Contributing

We welcome contributions! To develop this theme:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Export presentation as PDF
npm run export

# Generate preview screenshots
npm run screenshot
```

Edit `example.md` to test your changes.

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Support

- 📖 **Documentation**: [Slidev Documentation](https://sli.dev)
- 🐛 **Issues**: [GitHub Issues](https://github.com/jxpeng98/slidev-theme-scholarly/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/slidevjs/slidev/discussions)

---

**Made with ❤️ for academics around the world**

The cover layout is designed for the title slide of your presentation. It supports:

- Centered title and subtitle
- Multiple authors with name, institution, and email
- Beamer-style footer with color gradients
- Customizable footer sections

**Usage with multiple authors (authors array):**

```yaml
---
theme: scholarly
footerMiddle: Conference Name
authors:
  - name: First Author
    institution: University One
    email: first@example.edu
  - name: Second Author
    institution: University Two
    email: second@example.edu
  - name: Third Author
    institution: University Three
    email: third@example.edu
---

# Your Presentation Title

Your subtitle or description
```

**Usage with single author:**

```yaml
---
theme: scholarly
author: Your Name
footerMiddle: Conference or Event Name
---

# Your Presentation Title

Your subtitle or description
```

**Footer Configuration:**

The footer is divided into three sections:

- **Left**: Author information (automatically generated or customizable)
- **Middle**: Custom text (e.g., conference name, event name)
- **Right**: Page numbers (automatically generated)

**Footer configuration options:**

```yaml
---
theme: scholarly
footerLeft: Custom Author Text    # Optional: Override author display
footerMiddle: Conference Name      # Optional: Middle section text
authors:
  - name: First Author
    institution: University One
  - name: Second Author
    institution: University Two
---
```

**Important Notes:**

- **Global Configuration**: All frontmatter fields (authors, footerLeft, footerMiddle, etc.) defined at the beginning of your slides.md file are available globally across all slides
- **Default Layout**: If no layout is specified for a slide, it will use the `default` layout automatically
- Use either `author` (for single author) or `authors` array (for multiple authors)
- Do not use both `author` and `authors` at the same time
- When using `authors` array, each author can have `name`, `institution`, and `email` fields
- The author information will be displayed in the center of the cover slide
- **Footer configuration is global**: Footer settings (footerLeft, footerMiddle, authors) defined in the frontmatter at the top of your presentation will be used on all slides
- **Footer left section display rules:**
  - 1 author: Shows the author's name
  - 2 authors: Shows "Author1 & Author2"
  - 3 authors: Shows "Author1, Author2, Author3"
  - 4+ authors: Shows "First Author et al."
- You can override the footer left section by setting `footerLeft` in frontmatter
- `conference` field is deprecated, use `footerMiddle` instead (backward compatible)

**Example of a complete presentation:**

```markdown
---
theme: academic
footerMiddle: "My Conference 2025"
authors:
  - name: First Author
    institution: University One
    email: first@example.edu
  - name: Second Author
    institution: University Two
    email: second@example.edu
---

# My Presentation Title

Subtitle text

---

# Second Slide

This slide will automatically use the default layout and show the footer with author information.

---
layout: intro
---

# Section Introduction

All layouts (cover, default, intro) will show the same footer configured at the top.
```

### Other Layouts

All layouts in this theme include the Beamer-style footer with author and conference information.

- **`default`** - Default slide layout with content and footer
- **`intro`** - Introduction slide layout with larger text
- **`center`** - Centered content layout
- **`section`** - Section divider with large title
- **`quote`** - Quote layout with styled blockquote
- **`fact`** - Single fact or number with large text
- **`statement`** - Statement layout with medium-large text
- **`image-left`** - Two-column layout with image on the left
- **`image-right`** - Two-column layout with image on the right
- **`two-cols`** - Two-column layout for general content

**Usage example:**

```markdown
---
layout: section
---

# Section Title

---
layout: image-right
image: https://example.com/image.jpg
---

# Content Title

Content goes here

---
layout: quote
---

> "This is a quote"

---
layout: two-cols
---

# Left Column

Content for the left side

::right::

# Right Column

Content for the right side
```

**Important**: All layouts automatically include the footer. You don't need to add it manually.

### Creating Custom Layouts

If you need to create a custom layout in your presentation, make sure to include the `<AcademicFooter />` component to maintain consistency:

```vue
<template>
  <div class="slidev-layout my-custom-layout">
    <!-- Your custom content -->
    <slot />
    
    <!-- Import the footer component -->
    <AcademicFooter />
  </div>
</template>

<script setup lang="ts">
import ScholarlyFooter from '@slidev-theme-scholarly/components/ScholarlyFooter.vue'
</script>
```

This ensures that all slides, regardless of layout, display the unified footer with author and conference information.

## Components

This theme provides the following components:

### Theorem Component

The `Theorem` component allows you to insert mathematical theorems, lemmas, propositions, and other formal statements in your slides with automatic numbering and multi-language support.

**Props:**

- `type`: The type of statement - `'theorem'` | `'lemma'` | `'proposition'` | `'corollary'` | `'definition'` | `'example'` | `'remark'` (default: `'theorem'`)
- `number`: Optional manual number (string or number). If provided, auto-numbering is disabled for this theorem.
- `title`: Optional title for the theorem
- `autoNumber`: Enable/disable auto-numbering (default: `true`)

**Multi-language Support:**

Set the `lang` field in your frontmatter to use different languages:

```yaml
---
theme: academic
lang: zh  # Chinese (中文) - default
# OR
lang: en  # English
---
```

**Customize Numbering Format:**

You can customize how theorem numbers are displayed using the `theoremNumberFormat` field:

```yaml
---
theme: academic
lang: en
theoremNumberFormat: '{number}'  # Default: just the number (e.g., "1", "2", "3")
# OR
theoremNumberFormat: '({number})'  # Parentheses (e.g., "(1)", "(2)", "(3)")
# OR
theoremNumberFormat: '[{number}]'  # Brackets (e.g., "[1]", "[2]", "[3]")
# OR
theoremNumberFormat: '{number}.'  # With period (e.g., "1.", "2.", "3.")
---
```

The `{number}` placeholder will be replaced with the actual theorem number.

**Auto-numbering:**

By default, theorems are automatically numbered. Each type (theorem, lemma, etc.) has its own counter:

```markdown
---
theme: academic
lang: en
---

# Mathematical Results

<Theorem type="theorem" title="Pythagorean Theorem">

For a right triangle with legs $a$ and $b$, and hypotenuse $c$:

$$a^2 + b^2 = c^2$$

</Theorem>
<!-- Displays: "Theorem 1 (Pythagorean Theorem)" -->

<Theorem type="theorem">

Another theorem here.

</Theorem>
<!-- Displays: "Theorem 2" -->

<Theorem type="lemma">

A useful lemma.

</Theorem>
<!-- Displays: "Lemma 1" -->
```

**Manual numbering:**

You can override auto-numbering by providing the `number` prop:

```markdown
<Theorem type="theorem" number="3.1" title="Special Case">

Content here.

</Theorem>
<!-- Displays: "Theorem 3.1 (Special Case)" -->
```

**Disable numbering:**

```markdown
<Theorem type="remark" :autoNumber="false">

This remark has no number.

</Theorem>
<!-- Displays: "Remark" (without number) -->
```

**Language Examples:**

Chinese (zh):

```markdown
<Theorem type="theorem" title="勾股定理">
内容...
</Theorem>
<!-- Displays: "定理 1（勾股定理）" -->
```

English (en):

```markdown
<Theorem type="theorem" title="Pythagorean Theorem">
Content...
</Theorem>
<!-- Displays: "Theorem 1 (Pythagorean Theorem)" -->

</Theorem>

<Theorem type="lemma" number="2.1">

Every continuous function on a closed interval is uniformly continuous.

</Theorem>

<Theorem type="definition" title="Limit">

Let $f$ be a function defined on some open interval containing $a$. We say:

$$\lim_{x \to a} f(x) = L$$

if for every $\epsilon > 0$, there exists $\delta > 0$ such that...

</Theorem>

<Theorem type="example">

Consider the function $f(x) = x^2$. Then:
- $f(0) = 0$
- $f(1) = 1$
- $f(2) = 4$

</Theorem>
```

**Available types and their colors:**

- `theorem` - Blue (定理)
- `lemma` - Purple (引理)
- `proposition` - Cyan (命题)
- `corollary` - Green (推论)
- `definition` - Amber (定义)
- `example` - Pink (例)
- `remark` - Gray (注)

Each type has a distinct color scheme to help differentiate them visually in your presentation.

## Contributing

- `npm install`
- `npm run dev` to start theme preview of `example.md`
- Edit the `example.md` and style to see the changes
- `npm run export` to generate the preview PDF
- `npm run screenshot` to generate the preview PNG
