---
theme: ./
footerMiddle: Slidev Theme Scholarly
description: Presentation slides for scholars
aspectRatio: 4/3
lang: zh
theoremNumberFormat: '{number}'
authors:
  - name: Jiaxin Peng
    institution: Your University
    email: jiaxin@example.edu
  - name: Second Author
    institution: Another University
    email: second@example.edu
  - name: Third Author
    institution: Third University
    email: third@example.edu
---

# Slidev Theme Scholarly

Presentation slides for scholars

<!--
This example demonstrates all features of the Scholarly theme.

GLOBAL CONFIGURATION (applies to all slides):
- authors: List of authors with name, institution, email
  (Or use single "author: Your Name" for one author)
- footerMiddle: Conference name or event (middle section of footer)
- footerLeft: Custom text for left footer (overrides author display)
- theoremNumberFormat: Format for theorem numbers (e.g., '{number}', 'Theorem {number}')
- lang: Language for theorem components (zh, en, fr, de, es, it, ja, pt, ru)

The footer automatically appears on all slides with page numbers on the right.
-->

---
layout: intro
footerMiddle: Slidev Theme
---

<!--
LAYOUT: intro
PURPOSE: Introduction or agenda slide
WHEN TO USE: For outlining your presentation structure or introducing a topic

FEATURES:
- Vertically centered content
- Left-aligned text for readability
- Footer with conference/author info

TIP: Great for "What we'll cover today" type slides
-->

# What is Slidev?

Slidev is a slide maker and presentation tool designed for developers. It includes the following features:

- 📝 **Text-based** - focus on your content with Markdown, then style it later
- 🎨 **Themable** - themes can be shared and reused as npm packages
- 🧑‍💻 **Developer Friendly** - code highlighting, live coding with autocompletion
- 🤹 **Interactive** - embed Vue components to enhance your expressions
- 🎥 **Recording** - built-in recording and camera view
- 📤 **Portable** - export to PDF, PPTX, PNGs, or even a hostable SPA
- 🛠 **Hackable** - virtually anything that's possible on a webpage is possible in Slidev

<br>
<br>

Read more about [Why Slidev?](https://sli.dev/guide/why)

---
layout: default
title: Layout Optimization
subtitle: Reducing Code Duplication and Enhancing Maintainability
---

<!--
LAYOUT: default
PURPOSE: Standard slide for regular content
WHEN TO USE: Most of your presentation slides (it's the default!)

FEATURES:
- Optional title and subtitle shown in header (if provided in frontmatter)
- Left-aligned content for easy reading
- Adjustable padding based on header presence
- Shows footer automatically

FRONTMATTER OPTIONS:
- title: Main heading shown in header
- subtitle: Secondary text shown in header
- header: Custom header text (overrides title/subtitle)
- footerLeft: Override footer left section for this slide only

TIP: If you don't specify a layout, this is what you get!
-->

## Keyboard Shortcuts

|     |     |
| --- | --- |
| <kbd>space</kbd> / <kbd>tab</kbd> / <kbd>right</kbd> | next animation or slide |
| <kbd>left</kbd>  / <kbd>shift</kbd><kbd>space</kbd> | previous animation or slide |
| <kbd>up</kbd> | previous slide |
| <kbd>down</kbd> | next slide |

---

<!--
LAYOUT: default (auto-applied when no layout is specified)
PURPOSE: Demonstrates that default layout is automatic

KEY POINT: You don't need to write `layout: default` explicitly.
If you don't specify any layout, Slidev uses "default" automatically.
-->

## This Slide Uses Default Layout

Notice that even without specifying `layout: default`, this slide:

- Uses the default layout automatically
- Shows the footer with author information from the frontmatter
- Displays the conference name in the middle
- Shows page numbers on the right

This demonstrates that **all footer configuration is global** and works across all slides.

---
layout: image-left
image: https://cover.sli.dev
---

<!--
LAYOUT: image-left
PURPOSE: Visual content on left, text content on right
WHEN TO USE: When you want a strong visual element alongside explanatory text

FEATURES:
- Image fills entire left half (full height, no padding)
- Text content in right half
- 50/50 split layout
- Footer shown at bottom

FRONTMATTER OPTIONS:
- image: URL or path to your image (REQUIRED)
- title: Optional title for header
- subtitle: Optional subtitle for header

TIP: Great for showing screenshots, diagrams, or photos with explanations
-->

## Code

Use code snippets and get the highlighting directly!

```ts
interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}

function updateUser(id: number, update: Partial<User>) {
  const user = getUser(id)
  const newUser = { ...user, ...update }
  saveUser(id, newUser)
}
```

---
layout: quote
title: Quote Layout
subtitle: Display Inspirational Quotes
---

<!--
LAYOUT: quote
PURPOSE: Display memorable quotes or important statements
WHEN TO USE: For emphasizing key insights, famous quotes, or important principles

FEATURES:
- Centered, large text for maximum impact
- Special styling for quote and attribution
- No header (header is hidden even if title/subtitle provided)
- Footer shown at bottom

FORMAT:
First paragraph = The quote
Second paragraph (starting with —) = Attribution

TIP: Keep quotes short and impactful for best effect
-->

生活就像一盒巧克力，你永远不知道下一颗是什么味道。

— 阿甘正传

---
layout: section
title: Section Layout
subtitle: Chapter Dividers
---

<!--
LAYOUT: section
PURPOSE: Mark the beginning of a new section or chapter
WHEN TO USE: To divide your presentation into major parts

FEATURES:
- Large, centered heading
- Prominent subtitle
- No header shown
- Footer at bottom
- More spacing than regular slides

TIP: Use this to give your audience a mental "break" between topics
-->

## Section Title

### Subtitle

Use this layout to mark the beginning of a new section or chapter in your presentation.

---
layout: center
title: Center Layout
subtitle: Centered Content
---

<!--
LAYOUT: center
PURPOSE: Center important content on the slide
WHEN TO USE: For key messages, important announcements, or single focal points

FEATURES:
- All content vertically and horizontally centered
- Optional header (shown if title/subtitle provided)
- Footer at bottom
- Clean, focused design

TIP: Best for slides with minimal content that deserve full attention
-->

## Centered Content

This layout is perfect for important statements or key messages.

---
layout: fact
title: Fact Layout
---

<!--
LAYOUT: fact
PURPOSE: Highlight a single statistic or fact
WHEN TO USE: To emphasize important numbers or brief statements

FEATURES:
- Extra large, centered content
- Maximum width constrained for readability
- No header (even if title provided)
- Footer at bottom
- Designed for 1-2 lines of text max

TIP: Use big numbers or very short phrases (e.g., "100%", "First Place")
-->

## 100%

Academic Excellence

---
layout: statement
title: Statement Layout
---

<!--
LAYOUT: statement
PURPOSE: Make a bold, impactful statement
WHEN TO USE: For thesis statements, key findings, or important conclusions

FEATURES:
- Large, centered text
- Medium width constraint for readability
- No header shown
- Footer at bottom
- More width than 'fact' layout

TIP: Best for 1-3 sentence statements that capture a main idea
-->

## Important Statement

This layout is designed for impactful statements that need emphasis.

---
layout: two-cols
title: Two Columns Layout
subtitle: Side-by-side Content
---

<!--
LAYOUT: two-cols
PURPOSE: Display two columns of content side by side
WHEN TO USE: For comparisons, before/after, pros/cons, or parallel content

FEATURES:
- Equal width columns (50/50 split)
- Top-aligned content (columns start at same height)
- Use `::right::` marker to separate left and right content
- Optional header with title/subtitle
- Footer at bottom

SYNTAX:
Content before ::right:: goes in left column
Content after ::right:: goes in right column

TIP: Great for comparing concepts, showing code and output, or listing parallel ideas
-->

## Left Column

- Point 1
- Point 2
- Point 3

You can put any content here:

- Lists
- Text
- Images

::right::

## Right Column

```python
def hello():
    print("Hello World!")
    
# Code example
for i in range(10):
    hello()
```

---
layout: image-left
image: https://cover.sli.dev
title: Image Left Layout
subtitle: Image on the left, content on the right
---

<!--
LAYOUT: image-left
PURPOSE: Combine visual and textual content (visual on left)
WHEN TO USE: When the image is the primary focus and text provides context

FEATURES:
- Image fills entire left half (full height, edge to edge)
- Text content in right half
- 50/50 split
- Optional header
- Footer at bottom

FRONTMATTER OPTIONS:
- image: URL or path to image (REQUIRED)

TIP: Use when the visual should be seen first (left-to-right reading)
-->

## Content on Right

When you use `image-left` layout:

- Image fills the entire left side
- Content appears on the right
- Great for visual presentations

You can use markdown, code, or any other content here.

---
layout: image-right
image: https://cover.sli.dev
title: Image Right Layout
subtitle: Content on the left, image on the right
---

<!--
LAYOUT: image-right
PURPOSE: Combine textual and visual content (text first, visual second)
WHEN TO USE: When the text is primary and the image provides support/context

FEATURES:
- Content appears in left half
- Image fills entire right half (full height, edge to edge)
- 50/50 split
- Optional header
- Footer at bottom

FRONTMATTER OPTIONS:
- image: URL or path to image (REQUIRED)

TIP: Use when you want readers to process the text before seeing the visual
-->

## Content on Left

When you use `image-right` layout:

- Content appears on the left
- Image fills the entire right side
- Perfect for balancing visuals and text

```ts
// You can even add code blocks
const message = "Hello Slidev!"
console.log(message)
```

---
layout: default
title: Theorem Component Demo
subtitle: Mathematical Statements with Auto-numbering
---

<!--
COMPONENT: <Theorem>
PURPOSE: Display mathematical theorems, definitions, lemmas, etc. with automatic numbering
WHEN TO USE: For academic presentations with formal mathematical statements

FEATURES:
- Automatic numbering (starts from 1, increments globally)
- Multiple types: theorem, lemma, definition, proposition, corollary, example, remark
- Multi-language support (auto-translates based on frontmatter lang setting)
- Optional custom titles
- Optional manual numbering

COMPONENT PROPS:
- type: "theorem" | "lemma" | "definition" | "proposition" | "corollary" | "example" | "remark"
- title: Optional title for the theorem
- number: Optional manual number (e.g., "3.1")
- autoNumber: Set to false to hide number completely

GLOBAL CONFIG (in frontmatter):
- lang: Language code (zh, en, fr, de, es, it, ja, pt, ru)
- theoremNumberFormat: Format string (e.g., '{number}', 'Theorem {number}')

TIP: Numbering resets at start of presentation automatically
-->

## Mathematical Theorems

<Theorem type="theorem" title="勾股定理">

对于直角三角形，设两直角边为 $a$ 和 $b$，斜边为 $c$，则：

$$a^2 + b^2 = c^2$$

</Theorem>

<Theorem type="theorem" title="勾股定理">

对于直角三角形，设两直角边为 $a$ 和 $b$，斜边为 $c$，则：

$$a^2 + b^2 = c^2$$

</Theorem>

<Theorem type="lemma">

闭区间上的每个连续函数都是一致连续的。

</Theorem>

---
layout: default
title: More Theorem Examples
---

<!--
THEOREM TYPES EXPLAINED:
- theorem: Major results
- lemma: Helper results used to prove theorems
- definition: Precise definitions of concepts
- proposition: Smaller results
- corollary: Results that follow directly from theorems
- example: Illustrative examples
- remark: Additional notes or observations

All types auto-number separately in presentation order.
-->

## Definitions and Examples

<Theorem type="definition" title="极限">

设函数 $f$ 在包含点 $a$ 的某个开区间上有定义。如果对于任意 $\epsilon > 0$，存在 $\delta > 0$ 使得当 $0 < |x - a| < \delta$ 时，有 $|f(x) - L| < \epsilon$，则称 $\lim_{x \to a} f(x) = L$。

</Theorem>

<Theorem type="example">

考虑函数 $f(x) = x^2$：

- $f(0) = 0$
- $f(1) = 1$
- $f(2) = 4$

</Theorem>

---
layout: default
title: More Theorem Types
---

<!--
MULTI-LANGUAGE SUPPORT:
The component automatically translates labels based on your frontmatter:
- lang: zh → "定理", "引理", "定义" etc.
- lang: en → "Theorem", "Lemma", "Definition" etc.
- lang: fr → "Théorème", "Lemme", "Définition" etc.
And more languages supported!
-->

## Propositions and Remarks

<Theorem type="proposition">

如果 $f$ 和 $g$ 在点 $a$ 处连续，则 $f + g$ 在点 $a$ 处也连续。

</Theorem>

<Theorem type="corollary">

有限个连续函数的和仍然是连续函数。

</Theorem>

<Theorem type="remark">

注意：此结果对于连续函数的乘积同样成立。

</Theorem>

---
layout: default
title: Manual Numbering Example
subtitle: Override auto-numbering when needed
---

<!--
CUSTOM NUMBERING:
Sometimes you need specific numbering (like "3.1" for chapter 3, theorem 1).
Use the `number` prop to override auto-numbering.

To hide numbering completely, use `:autoNumber="false"` (note the colon for boolean)
-->

## Custom Numbering

<Theorem type="theorem" number="3.1" title="特殊情况">

有时我们需要使用特定的编号，比如 3.1 表示第三章第一个定理。

</Theorem>

<Theorem type="theorem" :autoNumber="false" title="无编号定理">

这个定理没有编号，因为设置了 `autoNumber={false}`。

</Theorem>

---
layout: center
---

<!--
FINAL SLIDE
This is a simple closing slide using the center layout.
Perfect for "Thank You", Q&A, or contact information.
-->

## Thank You

Questions?

[Documentation](https://sli.dev) / [GitHub Repo](https://github.com/slidevjs/slidev)
