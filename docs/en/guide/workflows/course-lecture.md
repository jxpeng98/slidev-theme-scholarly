---
title: Course Lecture Workflow
---

# Course Lecture Workflow

Use this path for teaching decks, tutorials, and structured lessons where the
audience needs concepts, examples, and checkpoints.

```bash
sch init lecture --template basic
```

## Recommended layouts

- [toc](../../layouts/structure#toc) for a lesson outline.
- [section](../../layouts/structure#section) for module breaks.
- [two-cols](../../layouts/content#two-cols) for concept/example pairs.
- [auto-size](../../layouts/structure#auto-size) for text-heavy explanations.
- [focus](../../layouts/emphasis#focus) for key takeaways.

## Recommended components

- [Theorem](../../components/theorem) for definitions, lemmas, and proofs.
- [Block](../../components/block) for notes, warnings, and examples.
- [Steps](../../components/steps) for procedures.
- [Columns](../../components/columns) for examples beside explanations.
- [Highlight](../../components/highlight) for short terms, not long paragraphs.

## Useful snippets

```bash
sch snippet append theorem --file slides.md
sch snippet append block --file slides.md
sch snippet append section --file slides.md
```

Use examples early and move optional derivations to appendix or backup slides.

## Theme mode and contrast

Lecture slides are often read from the back of a room. Keep explanatory slides
in `colorMode: light`, use `sectionMode: dark` for separation, and avoid low
contrast quote or Highlight combinations. See [theme mode and contrast](../theme-mode-contrast).
