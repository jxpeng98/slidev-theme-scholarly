---
title: Layouts
description: Choose a page structure for each part of an academic presentation.
---

# Layouts

A layout controls the structure of an entire slide. Scholarly includes 34 layouts, grouped by the job they do.

## Choose by task

| I need to... | Start with... | Reference |
|---|---|---|
| Open, divide, or close a talk | `cover`, `section`, `toc`, `end` | [Structure](./structure) |
| Arrange text, figures, or columns | `default`, `two-cols`, `figure`, `image-right` | [Content](./content) |
| Make one idea stand out | `focus`, `fact`, `quote`, `statement` | [Emphasis](./emphasis) |
| Present methods, evidence, or findings | `method-pipeline`, `experiment-grid`, `results`, `references` | [Academic](./academic) |

## Use a layout

Set `layout` in the frontmatter for that slide:

```markdown
---
layout: figure
image: /results.png
caption: Validation accuracy across three datasets
---

# Main result
```

Options belong in the same frontmatter block. Each reference page lists the supported options and shows the rendered layout.

## A useful rule

Choose the layout that matches the slide's main job. Add components only for content the layout does not already provide.
