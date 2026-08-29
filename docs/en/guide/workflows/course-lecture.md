---
title: Course Lecture Workflow
---

# Course Lecture Workflow

A course deck usually moves from concepts to examples, with regular checkpoints.
Start a lecture, tutorial, or structured lesson with the `basic` template:

```bash
npx -y slidev-theme-scholarly init lecture --template basic
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
pnpm exec sch snippet append theorem --file slides.md
pnpm exec sch snippet append block --file slides.md
pnpm exec sch snippet append section --file slides.md
```

Use examples early and move optional derivations to appendix or backup slides.

## Theme mode and contrast

Lecture slides must stay readable from the back of the room. Keep explanatory
slides in `contentMode: light` with `chromeMode: match`, use `sectionMode: dark`
for section breaks, and avoid low-contrast quote or Highlight combinations. See
[theme mode and contrast](../theme-mode-contrast).
