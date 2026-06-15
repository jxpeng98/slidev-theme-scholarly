---
title: Key Features
---

# Key Features

## 🎨 Professional Design

- Clean, academic aesthetic inspired by LaTeX Beamer
- Automatic header and footer on all slides
- Consistent styling throughout your presentation

## 👥 Multi-Author Support

Display one author, two authors, or entire research teams elegantly:

- 1 author: "Jane Smith"
- 2 authors: "Jane Smith & John Doe"  
- 3 authors: "Jane Smith, John Doe, Alice Brown"
- 4+ authors: "Jane Smith et al."

## 🔢 Smart Theorem Numbering

Insert theorems, lemmas, definitions with automatic numbering:

- Each type (theorem, lemma, etc.) has its own counter
- Supports both English and Chinese
- Customizable number format

## 📐 18 Layout Options

Different layouts for different needs:

- **Basic**: cover, default, intro, section, center
- **Content**: quote, fact, statement, two-cols
- **Image**: image-left, image-right
- **Advanced (v2.0)**: focus, compare, bullets, figure, references, end, auto-center, auto-size

## 📊 Academic Styling (v0.1.2)

Professional CSS styling for academic presentations:

- **Booktabs Tables** - Three-line table style (no vertical lines)
- **Code Blocks** - Light gray background with monospace fonts
- **Citation Styling** - Smaller font size with gray color for hierarchy
- **Blockquotes** - Left border with italic styling

## 📚 Built-in Citation Support

Automatic bibliography generation from BibTeX files:

- Use `@citekey` for parenthetical citations
- Use `!@citekey` for narrative citations
- Use standard Markdown footnotes with academic styling
- Hover footnote markers on desktop to preview notes, or click to pin them
- Supports APA, Harvard, Vancouver, IEEE, MLA, Chicago styles
- Auto-generates bibliography from all cited references
- No additional configuration required!

## 🧩 Rich Components

Built-in components for academic content:

- **Theorem** - Theorems, lemmas, definitions with auto-numbering
- **Block** - Beamer-style colored blocks
- **Steps** - Workflow/process visualization
- **Keywords** - Keyword tags
- **Columns** - Flexible multi-column layouts
- **Highlight** - Inline text highlighting

## 📈 Data-Driven Results

Keep small result summaries in data files and render them with the existing
academic components. Scholarly uses Vite and Slidev imports directly, so there is
no runtime fetch loader and no charting dependency.

### JSON import

```ts
import rows from './results.json'
import { toMetricItems } from 'slidev-theme-scholarly/utils/data'

const metrics = toMetricItems(rows)
```

```markdown
<MetricGrid :metrics="metrics" compact />
```

### CSV `?raw` import

```ts
import csv from './results.csv?raw'
import { parseCsvTable } from 'slidev-theme-scholarly/utils/data'

const rows = parseCsvTable(csv)
```

```markdown
<ResultTable
  :rows="rows"
  :columns="[
    { key: 'method', label: 'Method' },
    { key: 'accuracy', label: 'Accuracy', align: 'right' },
    { key: 'latency', label: 'Latency', align: 'right' }
  ]"
  highlightColumn="accuracy"
  compact
/>
```

For one-off slides, a static Markdown table is still the best fallback:

```markdown
| Method | Accuracy | Latency |
| --- | ---: | ---: |
| Baseline | 91.5 | 21 ms |
| Ours | **94.7** | 18 ms |
```

## 📝 Markdown Syntax Sugar

Use simple Markdown directives instead of HTML:

```markdown
:::block{type="info" title="Note"}
Content here
:::

:::theorem{type="theorem" title="Result"}
Mathematical content
:::

:::columns{columns="2"}
Left column
+++
Right column
:::
```

## 🌍 Multi-Language

Supports English and Chinese (中文) for mathematical content.

## 🆕 New in v0.1.2

| Feature | Description |
|---------|-------------|
| `quote` layout | New `author` and `source` props |
| `bullets` layout | New `icon` prop for custom bullets |
| `fact` layout | New `purple` color variant |
| Booktabs tables | Academic three-line tables |
| Code blocks | Enhanced styling |
