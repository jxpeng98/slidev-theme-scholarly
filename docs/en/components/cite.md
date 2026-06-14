---
title: Citations
---

# Citations

The theme has built-in support for academic citations using BibTeX files. Citations are automatically collected and bibliography is generated.

## Configuration

Configure citation settings in your frontmatter:

```yaml
---
theme: scholarly
bibFile: references.bib  # Path to BibTeX file (default: references.bib)
bibStyle: apa            # Citation style
bibShowNum: false        # Show numbered markers in bibliography (e.g. [1])
---
```

**Supported styles:**

- `apa` (default)
- `harvard1`
- `vancouver`
- `ieee`
- `mla`
- `chicago-author-date`

## Basic Usage

### Parenthetical Citations

Use `@citekey` for parenthetical citations:

```markdown
Deep learning has revolutionized AI @lecun2015deep.
```

Renders as: Deep learning has revolutionized AI (LeCun et al., 2015).

### Narrative Citations

Use `!@citekey` for narrative (author-prominent) citations:

```markdown
!@vaswani2017attention introduced the Transformer architecture.
```

Renders as: Vaswani et al. (2017) introduced the Transformer architecture.

### Multiple Citations

```markdown
Recent advances @smith2023deep @wang2022attention have shown...
```

### Grouped Citations

Place multiple BibTeX keys in the same sentence when one claim is supported by several papers:

```markdown
Efficient adaptation is commonly evaluated with grouped evidence @smith2023deep @wang2022attention.
```

### Footnote-like Citation Note

For a short manual note that behaves like a footnote or reading annotation, use `<Cite :inline="false">`.
This is not connected to the BibTeX bibliography; it is for manual context.

```markdown
<Cite :inline="false" author="Smith et al." year="2026">
Reports all primary metrics as five-seed averages with confidence intervals.
</Cite>
```

## Markdown Footnotes

Standard Markdown footnotes work out of the box. No theme-specific syntax is required:

```markdown
Our compact model stays stable across five seeds[^1].

[^1]: Validation accuracy varied by less than 0.3 percentage points.
```

In Slidev's interactive view, the theme applies academic footnote styling automatically:

- Hover a footnote marker on desktop to preview the note
- Click the marker to pin the popover
- Press `Esc` or click outside to close it

You can set a global default in the headmatter:

```yaml
---
footnoteDisplay: hover-only
---
```

And override it per slide with frontmatter:

```markdown
---
footnoteDisplay: notes-only
---
```

- `footnoteDisplay: both` keeps the bottom footnotes and the inline hover/click preview
- `footnoteDisplay: hover-only` hides the bottom footnote block and keeps only the inline preview
- `footnoteDisplay: notes-only` keeps the bottom footnotes and disables the hover/click popover

Priority order:

- Per-slide `footnoteDisplay`
- Global headmatter `footnoteDisplay`
- Legacy `themeConfig.footnoteDisplay`
- Default `both`

When you print or export slides, footnotes fall back to the normal footnote block at the bottom of the slide.

## Bibliography

Add a references slide:

```markdown
---
layout: references
---
```

The bibliography is automatically generated from all citations used in your slides.

If the slide body is empty, or only contains headings/comments, the theme injects the bibliography automatically.

If you want custom placement inside a references slide, add `[[bibliography]]` exactly where the list should appear.

Normal theme usage does not require a project-level `vite.config.ts`; Scholarly registers the citation hooks from the theme package itself.

## Doctor Diagnostics

Run the doctor when citations do not render as expected:

```bash
npx -y --package slidev-theme-scholarly sch doctor
```

The citation checks report:

- `Citation setup`: whether citations have a `bibFile` or default `references.bib`
- `Citation bibliography`: whether the `.bib` file exists and has duplicate keys
- `Citation keys`: unresolved `@citekey` values used in slides
- `References slide`: whether a `layout: references` slide exists

Common warnings:

```text
- Citation setup: [WARN] citations found but no bibFile or references.bib
- Citation bibliography: [WARN] missing .bib file: ./references.bib
- Citation keys: [WARN] unresolved citation keys: missing2026
- References slide: [WARN] missing; add layout: references
```

## Internal Anchor Jumps

In Slidev's interactive view, Scholarly now upgrades internal `href="#..."` links into slide-aware jumps:

- In-text BibTeX citations can jump to the matching bibliography entry, even when the references list is on another slide
- Generic internal links such as `[Jump](#appendix-proof)` work across slides when the target is declared with `## Appendix {#appendix-proof}`, `::anchor{#appendix-proof}`, or an explicit `id="appendix-proof"`
- After jumping, a floating `Back to source` button appears so you can return to the previous citation or link position

This behavior is designed for live presentations and local browser viewing. Print and export outputs keep the normal static content.

## Pagination

For long reference lists, use pagination:

```markdown
---
layout: references
perPage: 5
page: 1
---

---
layout: references
perPage: 5
page: 2
title: "References (continued)"
---
```

## BibTeX File Example

Create a `references.bib` file in your project root:

```bibtex
@article{lecun2015deep,
  title={Deep learning},
  author={LeCun, Yann and Bengio, Yoshua and Hinton, Geoffrey},
  journal={Nature},
  volume={521},
  pages={436--444},
  year={2015}
}

@inproceedings{vaswani2017attention,
  title={Attention is all you need},
  author={Vaswani, Ashish and others},
  booktitle={NeurIPS},
  year={2017}
}
```

## Cite Component (Manual)

The `<Cite>` component is a lightweight helper for manual citation notes (non-BibTeX). For BibTeX citations, prefer `@citekey` / `!@citekey`.

### Author-Year Marker (Legacy)

```markdown
<Cite author="Smith et al." year="2024" />
```

Renders as: (Smith et al., 2024)

You can also provide additional context:

```markdown
<Cite author="Smith et al." year="2024">
Citation text here.
</Cite>
```

### Numeric Marker

```markdown
<Cite :inline="true">
Citation text here.
</Cite>
```

Optionally set a fixed `id`:

```markdown
<Cite :inline="false" :id="1">
Reference item here.
</Cite>
```
