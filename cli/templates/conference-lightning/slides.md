---
theme: scholarly
title: Conference Lightning Talk
footerMiddle: Lightning Talk
description: Short conference talk with one claim and one result
aspectRatio: 16/9
lang: en
themeConfig:
  colorTheme: high-contrast
  fontTheme: sans
  chromeMode: dark
  sectionMode: dark
  outlineToc: false
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: Your Name
    institution: Your Institution
---

# One Result In Five Minutes

Your Name

---
layout: statement
---

# Academic decks should be checked like software artifacts.

---
layout: result-highlight
title: Main Result
heading: A single release gate catches the highest-risk authoring failures
label: Checks
metric: 8
unit: ""
delta: theme, docs, CLI, VS Code, screenshots
baseline: local release readiness
variant: info
---

- Contrast regressions are caught before export.
- Citation setup failures are caught before presenting @smith2025llm.
- Templates initialize as real Slidev projects.

::evidence::
- Command: `pnpm run check`
- Output: release gate plus theme matrix dry run

---
layout: default
title: Takeaway
---

## What To Remember

- Make the first slide useful immediately.
- Keep one claim per lightning talk.
- Use references only for claims the audience may want to inspect later.

---
layout: references
---

# References
