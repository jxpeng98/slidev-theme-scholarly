---
title: Examples
---

# Examples

Start with a complete research talk, a layout gallery, or a minimal deck. Sample paper metadata and results illustrate the layouts; replace them with your own research.

## Complete decks

| Deck | Use it to |
|---|---|
| [Academic talk](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example-academic.md) | Follow a research argument through methods, evidence, data, and references |
| [Academic layout gallery](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example-academic-gallery.md) | Compare research layouts page by page |
| [English example](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example.md) | Browse common layouts and components |
| [Chinese example](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example-zh.md) | Use Chinese content and labels |

After [setting up the repository](./contributing), run an example from its root:

```bash
pnpm run dev -- examples/example-academic.md
```

Repository decks use `theme: ../`. When copying a deck into your own project, change it to `theme: scholarly` and copy its bibliography, images, and imported data files as well. Check their paths relative to the new deck. Replace repository helper imports such as `../utils/data` with `slidev-theme-scholarly/utils/data`. To generate a self-contained starter instead, use [Quick start](./guide/quick-start).

## Minimal Complete Example

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

State the research question in one sentence.

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
