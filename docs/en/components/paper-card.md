---
title: PaperCard
---

# PaperCard

`PaperCard` presents a paper's title, authors, venue, status, and contribution. It works well in related-work slides, paper summaries, and reading-group decks.

![PaperCard example](/images/components/paper-card.png)

## Basic Usage

```markdown
<PaperCard
  title="Efficient Adaptation for Scientific Models"
  :authors="['A. Smith', 'B. Lee']"
  venue="ICML"
  year="2026"
  status="Accepted"
  contribution="Introduces lightweight routing before task-specific fine-tuning."
/>
```

## With Link

```markdown
<PaperCard
  title="Cost-Aware Fine-Tuning"
  authors="Chen et al."
  venue="NeurIPS"
  year="2025"
  doi="10.0000/example"
  url="https://example.org/paper"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Paper title |
| `label` | `string` | `'Paper'` | Small label above title |
| `authors` | `string[] \| string` | - | Authors |
| `venue` | `string` | - | Venue or journal |
| `year` | `string \| number` | - | Publication year |
| `status` | `string` | - | Review or publication status |
| `doi` | `string` | - | DOI without URL prefix |
| `url` | `string` | - | Paper URL |
| `urlLabel` | `string` | `'Open paper'` | Link label |
| `contribution` | `string` | - | One-sentence takeaway |
| `variant` | `string` | `'primary'` | `primary`, `success`, `warning`, `danger`, or `info` |
| `compact` | `boolean` | `false` | Reduce spacing |
