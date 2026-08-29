---
title: Emphasis Layouts
---

# Emphasis Layouts

These layouts make a quote, number, or conclusion the focus of the slide.

## quote - Quotations {#quote}

**Use for:** Highlighting memorable quotes

![Quote Layout Example](/images/layouts/quote.png)

```markdown
---
layout: quote
author: Richard Feynman
source: The Character of Physical Law, 1965
---

The first principle is that you must not fool yourself.
```

**Props:**
- `author`: Quote attribution
- `source`: Source of the quote (book, speech, etc.)

**What it shows:**

- Large, styled quote with decorative quotation marks
- Attribution below

---

## fact - Single Statistic {#fact}

**Use for:** Highlighting important numbers or facts

![Fact Layout Example](/images/layouts/fact.png)

```markdown
---
layout: fact
color: green
---

# 94.7%

Accuracy on benchmark dataset
```

**Props:**
- `color`: `primary`, `blue`, `green`, `amber`, `red`, `purple` (default: `primary`)

**What it shows:**

- Large number
- Smaller description below
- Simple decorative elements

---

## statement - Important Statement {#statement}

**Use for:** One sentence the audience should remember

![Statement Layout Example](/images/layouts/statement.png)

```markdown
---
layout: statement
author: Einstein
---

# Imagination is more important than knowledge

The true sign of intelligence is not knowledge but imagination.
```

**Props:**
- `author`: Attribution text (optional)

**What it shows:**

- Large statement text, centered
- Decorative quotation marks
- Medium width for readability

---

## focus - Focused Statement {#focus}

**Use for:** One important statement or question

![Focus Layout Example](/images/layouts/focus.png)

```markdown
---
layout: focus
color: blue
icon: 🎯
---

# Research Question

How can we improve model accuracy while reducing computational cost?
```

**Props:**
- `color`: `blue`, `green`, `amber`, `red`, `purple` (default: `blue`)
- `icon`: Any emoji or text (default: none)

**What it shows:**

- Large icon (if specified)
- Color-accented main message
- Supporting text below
