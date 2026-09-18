---
theme: ../
footerMiddle: Slidev Theme Scholarly
description: Professional academic presentation theme
aspectRatio: 4/3
lang: en
themeConfig:
  colorTheme: classic-blue
  fontTheme: contemporary
  contentMode: light
  chromeMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
theoremNumberFormat: '{number}'
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: Dr. A.B. Smith
    institution: XYZ University
    email: ab.smith@xyz.edu
  - name: Dr. C.D. Johnson
    institution: ABC University
    email: cd.johnson@abc.edu
  - name: Dr. E.F. Davis
    institution: DEF University
    email: ef.davis@def.edu
---

# Slidev Theme Scholarly

Professional academic presentations with LaTeX Beamer-inspired styling

---
layout: intro
---

<!--
LAYOUT: intro
PURPOSE: Introduction or agenda slide
-->

# Professional Academic Presentations

Slidev Theme Scholarly brings LaTeX Beamer aesthetics to modern presentations:

- 🎓 **Specialized Layouts** - Structure, content, emphasis, and academic categories
- 🎨 **Theme Presets** - Academic color palettes with light and dark surfaces
- ✍️ **Typography Presets** - Serif, sans-serif, and technical combinations
- 🧩 **Rich Components** - Theorems, Blocks, Citations, Steps, Keywords
- 🌓 **Surface Mode Support** - Light content with configurable chrome and section surfaces
- 📊 **Academic Features** - BibTeX citations, booktabs tables, theorem numbering

<br/>

**Perfect for conferences, seminars, and research presentations**

---
layout: toc
title: Table of Contents
---

<!--
LAYOUT: toc
PURPOSE: Automatic table of contents with section navigation
FEATURES:
- Auto-extracts sections from slides with layout: section
- Highlights current section
- Click to navigate to section
PROPS: title, showNumbers, highlightCurrent, sections
-->

Click on any section to navigate directly to it!

---
layout: section
---


<!--
LAYOUT: section
PURPOSE: Mark the beginning of a new section
NOTE: Uses global sectionMode: dark (from themeConfig)
-->

# Part 1: Structure Layouts

## Essential layouts for organizing your presentation

---
layout: section
sectionMode: light
---

<!--
LAYOUT: section with sectionMode: light
PURPOSE: Demonstrate per-slide sectionMode override
NOTE: This section uses light section mode, overriding the global section setting
-->

# Light Section Demo

## Per-slide sectionMode override

---
layout: default
title: Default Layout
subtitle: Standard Content Slide
---

<!--
LAYOUT: default
PURPOSE: Standard slide for regular content
-->

## Keyboard Shortcuts

|     |     |
| --- | --- |
| <kbd>space</kbd> / <kbd>tab</kbd> / <kbd>right</kbd> | next animation or slide |
| <kbd>left</kbd>  / <kbd>shift</kbd><kbd>space</kbd> | previous animation or slide |
| <kbd>up</kbd> | previous slide |
| <kbd>down</kbd> | next slide |

---
layout: center
title: Center Layout
subtitle: Centered Content
---

<!--
LAYOUT: center
PURPOSE: Center important content on the slide
-->

## Centered Content

This layout is perfect for important statements or key messages.

All content is vertically and horizontally centered.

---
layout: quote
---

<!--
LAYOUT: quote
PURPOSE: Display memorable quotes
-->

Life is like a box of chocolates. You never know what you're gonna get.

— Forrest Gump

---
layout: fact
---

<!--
LAYOUT: fact
PURPOSE: Highlight a single statistic or fact
-->

# 100%

Academic Excellence

---
layout: statement
---

<!--
LAYOUT: statement
PURPOSE: Make a bold, impactful statement
-->

# Important Statement

This layout is designed for impactful statements that need emphasis.

---
layout: section
---

# Part 2: Content Layouts

## Layouts with images, columns, and structured content

---
layout: two-cols
ratio: "2:3"
title: Two Columns Layout
subtitle: Configurable Ratio
---

<!--
LAYOUT: two-cols
- ratio: Column width ratio, e.g., "1:1", "2:3"
-->

## Left Column (2fr)

This column takes 2 parts of the width.

- Point 1
- Point 2
- Point 3

::right::

## Right Column (3fr)

This column takes 3 parts of the width.

\`\`\`python
def hello():
    print("Hello World!")
    
# Code example
for i in range(10):
    hello()
\`\`\`

---
layout: image-left
image: https://cover.sli.dev
ratio: "1:2"
title: Image Left Layout
subtitle: Configurable Ratio
---

<!--
LAYOUT: image-left
- ratio: Image:content ratio
- fit: cover, contain, fill
-->

## Content on Right (2fr)

The image takes 1 part, content takes 2 parts.

When you use `image-left` layout:

- Image fills the left side
- Content appears on the right
- Ratio is configurable now!

\`\`\`ts
const ratio = "1:2" // image:content
\`\`\`

---
layout: image-right
image: https://cover.sli.dev
ratio: "3:2"
fit: contain
title: Image Right Layout
subtitle: With Configurable Options
---

<!--
LAYOUT: image-right
Same features as image-left but reversed
-->

## Content on Left (3fr)

The content takes 3 parts, image takes 2 parts.

Features:
- `ratio` - control image:content ratio
- `fit` - cover, contain, or fill
- `position` - image position

The image uses `fit: contain` to show the full image.

---
layout: section
---

# Part 3: Emphasis & Academic Layouts

## Built-in components and specialized academic features

---
layout: default
title: Block Component
subtitle: Beamer-style Blocks
---

<!--
COMPONENT: <Block>
TYPES: default, info, success, warning, danger, example
-->

## Block Component

<Block type="default" title="Default Block">

This is a default block with Beamer-style gradient header.

</Block>

<Block type="info" title="Information">

Use info blocks for general information and explanations.

</Block>

<Block type="warning" title="Warning">

Use warning blocks for important notes and cautions.

</Block>

---
layout: default
title: More Block Types
---

## More Block Styles

<Block type="success" title="Success">

Use success blocks for positive outcomes and confirmations.

</Block>

<Block type="danger" title="Danger">

Use danger blocks for critical warnings and errors.

</Block>

<Block type="example" title="Example">

Use example blocks for demonstrations and code samples.

</Block>

---
layout: default
title: Theorem Component
subtitle: Mathematical Statements
---

<!--
COMPONENT: <Theorem>
PURPOSE: Display mathematical theorems with auto-numbering
-->

## Mathematical Theorems

<Theorem type="theorem" title="Pythagorean Theorem">

For a right triangle with legs \(a\) and \(b\), and hypotenuse \(c\), we have:

$$a^2 + b^2 = c^2$$

</Theorem>

:::theorem{type="theorem" title="Theorem Name"}
For a right triangle with legs \(a\) and \(b\), and hypotenuse \(c\), we have:

$$a^2 + b^2 = c^2$$
:::

<Theorem type="lemma">

All continuous functions on a closed interval are uniformly continuous.

</Theorem>

---
layout: default
title: Consecutive Equation Number Check
subtitle: Regression guard for repeated renders
---

<!--
COMPONENT: <Theorem>
PURPOSE: Check that consecutive equation-bearing statements keep auto numbers stable
REGRESSION: Guards against repeated slide renders turning a sequence into duplicate final numbers
-->

## Consecutive Equation Number Check

These equation-bearing statements intentionally share one slide. Their headers should continue from the previous theorem slide as Theorem 3, Theorem 4, and Theorem 5.

<Theorem type="theorem" title="Energy Bound" :compact="true">

$$E_{t+1} \leq \rho E_t + \eta_t$$

</Theorem>

<Theorem type="theorem" title="Gradient Bound" :compact="true">

$$\|\nabla f(x_t)\|^2 \leq \frac{2}{\alpha}\left(f(x_t) - f^\star\right)$$

</Theorem>

:::theorem{type="theorem" title="Residual Bound"}
$$r_{t+1} \leq \gamma r_t + \epsilon_t$$
:::

---
layout: default
title: Definitions and Examples
---

## Definitions and Examples

<Theorem type="definition" title="Limit">

Let the function $f$ be defined on an open interval containing point $a$. If for any $\epsilon > 0$, there exists a $\delta > 0$ such that when $0 < |x - a| < \delta$, we have $|f(x) - L| < \epsilon$, then we say $\lim_{x \to a} f(x) = L$.

</Theorem>

<Theorem type="example">

Consider the function $f(x) = x^2$:

- $f(0) = 0$
- $f(1) = 1$
- $f(2) = 4$

</Theorem>

---
layout: default
title: Proof and Note Types
---

## Proof and Note Types

<Theorem type="claim" title="Bounded Sequence">

Every bounded sequence in $\mathbb{R}^n$ has a convergent subsequence.

</Theorem>

<Theorem type="proof">

We prove this by the Bolzano-Weierstrass theorem. Since the sequence is bounded, it lies within a compact set. By sequential compactness, there exists a convergent subsequence. $\square$

</Theorem>

<Theorem type="note">

This is a fundamental result in real analysis and is essential for proving many convergence theorems.

</Theorem>

---
layout: default
title: Compact Theorem Mode
---

## Compact Mode for Dense Content

<Theorem type="theorem" :compact="true">

For $n \geq 1$, we have $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$.

</Theorem>

<Theorem type="proof" :compact="true">

By induction on $n$. Base case $n=1$ is trivial. Assume true for $n$, then $\sum_{k=1}^{n+1} k = \sum_{k=1}^{n} k + (n+1) = \frac{n(n+1)}{2} + (n+1) = \frac{(n+1)(n+2)}{2}$. $\square$

</Theorem>

<Theorem type="corollary" :compact="true">

The sum of the first $n$ positive integers is always a triangular number.

</Theorem>

---
layout: default
title: Custom Numbering
subtitle: Override auto-numbering
---

## Custom Numbering

<Theorem type="theorem" number="3.1" title="Special Case">

Sometimes we need to use specific numbering, such as 3.1 to represent the first theorem in chapter 3.

</Theorem>

<Theorem type="theorem" :autoNumber="false" title="Unnumbered Theorem">

This theorem has no number because `autoNumber={false}` is set.

</Theorem>

---
layout: default
title: Highlight Component
---

<!--
COMPONENT: <Highlight>
TYPES: primary, success, warning, danger, info
-->

## Highlighting Important Content

The <Highlight>key concept</Highlight> here is that you can easily highlight text inline.

Different highlight types:
- <Highlight type="primary">Primary highlight</Highlight> for main concepts
- <Highlight type="success">Success highlight</Highlight> for positive points
- <Highlight type="warning">Warning highlight</Highlight> for cautions
- <Highlight type="danger">Danger highlight</Highlight> for critical items
- <Highlight type="info">Info highlight</Highlight> for general info

This makes your slides more <Highlight type="success">readable</Highlight> and <Highlight type="primary">engaging</Highlight>!

---
layout: section
---

# Part 4: Customization Features

## Font sizing, auto-centering, fit-to-page sizing, and academic citations

---
fontsize:
  body: 20px
  h1: 48px
  h2: 36px
  h3: 28px
---

<!--
FEATURE: Custom font sizes per slide
-->

# This H1 Should Be 48px

## This H2 Should Be 36px

### This H3 Should Be 28px

Notice that even without specifying `layout: default`, this slide:

- Uses the default layout automatically
- Shows the footer with author information
- **Body text is 20px, H1 is 48px, H2 is 36px, H3 is 28px**

This demonstrates that **all fontsize configuration works correctly**!

---
layout: auto-center
title: Auto Center Layout
subtitle: Auto-adjusting font size
---

<!--
LAYOUT: auto-center
PURPOSE: Automatically adjust font size and center vertically
-->

## Auto-Centered Content

This layout automatically:

- Adjusts font size to fit content
- Centers content vertically
- Keeps text left-aligned within the centered block

### Example Use Cases

1. Slides with varying content length
2. Content that needs to "fill" the space
3. Dynamic content from data sources

---
layout: auto-center
---

## Short Content Test

Just a few lines of text.

This should display with a larger font size since there's less content.

---
layout: auto-center
title: Dense Content Test
---

## This Slide Has More Content

- Point 1: Lorem ipsum dolor sit amet
- Point 2: Consectetur adipiscing elit
- Point 3: Sed do eiusmod tempor incididunt
- Point 4: Ut labore et dolore magna aliqua
- Point 5: Ut enim ad minim veniam
- Point 6: Quis nostrud exercitation ullamco
- Point 7: Laboris nisi ut aliquip ex ea commodo consequat

The font size should automatically decrease to fit all this content while keeping it centered.

---
layout: auto-size
title: Auto Size Layout
subtitle: Default flow with Beamer-style page fitting
autoSizePadding: normal
---

<!--
LAYOUT: auto-size
PURPOSE: Keep the default reading flow while fitting the main matter to the available area
-->

## Auto-Sized Main Matter

This layout keeps the familiar default layout structure, but it scales the main matter to fit the available width and height before overflow occurs.

- Preserves the default header and footer
- Keeps content top-aligned instead of vertically centered
- Scales sparse slides up and dense slides down
- Supports `minFontSize` and `maxFontSize` in frontmatter when you need tighter control

This is useful for theorem-heavy or table-heavy slides that should behave more like a LaTeX Beamer frame.

---
layout: auto-size
title: Auto Size Controls
subtitle: Growth, alignment, and padding presets
autoSizeGrow: false
autoSizeAlign: center
autoSizePadding: compact
minFontSize: 16
---

<!--
LAYOUT: auto-size
PURPOSE: Show the configuration entry points for fit growth, vertical alignment, and inner padding
-->

## Configurable Auto-Sizing

This variant keeps the same layout, but changes how aggressively the content area is used.

- `autoSizeGrow: false` keeps the base size and only shrinks when needed
- `autoSizeAlign: center` vertically centers the main matter in the available area
- `autoSizePadding: compact` reduces inner whitespace to maximize usable space
- `minFontSize` still defines the floor when content gets dense

Use this when you want Beamer-like fitting, but with tighter control over visual rhythm.

---
layout: default
title: Citations
subtitle: Academic Reference Support
---

<!--
FEATURE: Academic citations using BibTeX
- Configure in frontmatter: bibFile, bibStyle
- @citekey for parenthetical citations (Author, Year)
- !@citekey for narrative citations: Author (Year)
- layout: references auto-generates the reference list
-->

## Citation Examples

Deep learning has revolutionized many fields @lecun2015deep.

!@vaswani2017attention introduced the Transformer architecture, which has become foundational in NLP.

Multiple works have contributed to this area @smith2023deep @wang2022attention.

For a comprehensive introduction, see @bishop2006pattern.

In interactive view, click any citation above to jump to its matching bibliography entry on the references slide.

---
layout: default
title: Internal Anchor Navigation
subtitle: Cross-Slide href Demo
---

<!--
FEATURE: Internal anchor navigation
- Click any in-text citation to jump to the matching bibliography entry
- Use plain href="#target-id" links for arbitrary cross-slide navigation
- Use the floating "Back to source" button after jumping
-->

## Jump Examples

Try a bibliography jump here as well: @lecun2015deep.

Try a custom cross-slide anchor: [Jump to the appendix-style target](#anchor-demo-proof).

After the jump, use the floating `Back to source` button to return here.

---
layout: default
title: Footnotes
subtitle: Standard Markdown Notes
---

<!--
FEATURE: Standard Markdown footnotes
- Use [^key] inline and [^key]: below
- Desktop hover previews the footnote content
- Click the marker to pin the popover
- Set footnoteDisplay: hover-only | notes-only | both to control the rendered mode
-->

## Footnote Examples

Our compact variant remains stable across five random seeds[^stability] and reduces inference cost by 38%[^cost].

The release package also includes prompts, configs, and evaluation scripts for reproducibility[^repro].

[^stability]: Across five random seeds, validation accuracy varied by less than 0.3 percentage points.
[^cost]: Measured on a single RTX 4090 with mixed precision enabled.
[^repro]: In Slidev's interactive view, hover over a footnote marker to preview the note, or click the marker to pin the popover.

---
layout: default
title: Footnotes
subtitle: Hover Preview Only
footnoteDisplay: hover-only
---

<!--
FEATURE: Hide the bottom footnote block and keep only inline preview
-->

## Hover-Only Footnotes

This slide hides the footnote block at the bottom while keeping the inline preview on footnote markers[^hover-only].

[^hover-only]: Use `footnoteDisplay: hover-only` in frontmatter when you want a cleaner slide with preview-only notes.

---
layout: default
title: Footnotes
subtitle: Static Notes Only
footnoteDisplay: notes-only
---

<!--
FEATURE: Keep visible footnotes and disable inline preview / pinning
-->

## Notes-Only Footnotes

This slide keeps classic footnotes at the bottom[^notes-only] and disables hover or click popovers on the inline markers.

[^notes-only]: Use `footnoteDisplay: notes-only` when you want explicit notes on the slide and no floating preview UI.

---
layout: references
---

<!--
LAYOUT: references
PURPOSE: Display bibliography/references

For long reference lists, you can split across multiple pages:
- perPage: Number of references per page
- page: Current page number (1, 2, 3, ...)

Example for page 1:
layout: references
perPage: 3
page: 1

Example for page 2:
layout: references
perPage: 3
page: 2
title: "References (continued)"
-->

---
layout: default
title: Internal Anchor Target
subtitle: Generic href="#..." Destination
---

<!--
FEATURE: Generic internal anchor target
- Declare a target with heading syntax ## Title {#id}
- Or place a standalone target using ::anchor{#id}
-->

## Appendix-Style Target {#anchor-demo-proof}

This slide is a generic destination for internal `href="#..."` navigation.

Jump here from the earlier link, then use `Back to source` to return to the previous slide position.

---
layout: section
---

# Part 5: Academic Styling & Best Practices

## Tables, code blocks, and professional formatting

---
layout: default
title: Academic Tables
subtitle: Booktabs Style (三线表)
---

<!--
FEATURE: Booktabs-style tables
- No vertical lines
- Thick top/bottom borders
- Thin middle border
-->

## Research Results

| Method | Accuracy | Speed | Memory |
| ------ | -------- | ----- | ------ |
| Baseline | 85.2% | 1.0x | 4GB |
| Ours (v1) | 91.3% | 1.2x | 3.2GB |
| Ours (v2) | **94.7%** | 0.9x | 2.8GB |
| State-of-art | 93.1% | 2.1x | 6GB |

> Tables automatically use academic three-line style (booktabs).

---
layout: default
title: Code Examples
subtitle: Syntax Highlighting
---

<!--
FEATURE: Code block styling
- Light gray background
- Monospace fonts
- Clear borders
-->

## Algorithm Implementation

```python
def attention(Q, K, V):
    """Scaled Dot-Product Attention"""
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    attn = F.softmax(scores, dim=-1)
    return torch.matmul(attn, V)
```

Inline code example: Use `torch.nn.MultiheadAttention` for implementation.

---
layout: quote
author: Prof. G.H. Wilson
source: Letter to Max Born, 1926
---

<!--
LAYOUT: quote
NEW PROPS: author, source
-->

God does not play dice with the universe.

---
layout: bullets
title: Custom Bullets
icon: "→"
---

<!--
LAYOUT: bullets
NEW PROP: icon (custom bullet character)
-->

## Key Contributions

- Novel attention mechanism with linear complexity
- State-of-the-art results on multiple benchmarks
- Open-source implementation available

---
layout: fact
color: purple
---

<!--
LAYOUT: fact
NEW COLOR: purple
-->

# 94.7%

Best Accuracy Achieved

---
layout: center
---

## Thank You

Questions?

[Documentation](https://sli.dev) / [GitHub Repo](https://github.com/jxpeng98/slidev-theme-scholarly)
