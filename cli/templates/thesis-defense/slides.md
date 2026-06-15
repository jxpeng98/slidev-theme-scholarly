---
theme: scholarly
title: Thesis Defense
footerMiddle: Thesis Defense
description: Defense deck with experiments, limitations, Q&A, and appendix map
aspectRatio: 4/3
lang: en
themeConfig:
  colorTheme: yale-blue
  fontTheme: traditional
  outlineToc: true
  outlineTocOpen: false
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: Your Name
    institution: Your Department
---

# Thesis Title

Your Name

---
layout: paper-summary
paperTitle: Reliable Academic Presentation Systems
authors:
  - Your Name
venue: Thesis Defense
year: 2026
keywords:
  - reliability
  - academic tooling
  - evaluation
---

::problem::
Academic talks need dense evidence, but tooling often leaves consistency and verification to manual review @chen2026thesis.

::method::
This thesis combines semantic theme tokens, workflow templates, and release checks.

::finding::
The resulting system reduces authoring drift while preserving Slidev flexibility.

---
layout: experiment-grid
title: Evaluation Plan
cols: 2
experiments:
  - name: Visual QA
    setup: Theme matrix across modes
    result: 72
    metric: screenshots
    note: Covers quote, code, table, and highlight states
  - name: Citation QA
    setup: Doctor and VS Code diagnostics
    result: 5
    metric: issue classes
    note: Catches missing setup and unresolved keys
  - name: Template QA
    setup: Initialize every curated workflow
    result: 5
    metric: templates
    note: Validates package replacement and references
  - name: User Fit
    setup: Paper talk and defense dry runs
    result: qualitative
    metric: feedback
    note: Focuses on presenter friction
---

The evaluation pairs mechanical checks with workflow-level review @smith2025llm.

---
layout: limitation
title: Limitations
heading: Boundary Conditions
description: State what the thesis does not claim.
---

::limitation::
- The system focuses on academic Slidev decks, not general web design.
- The templates encode common workflows but cannot replace domain-specific judgment.

::mitigation::
- Keep APIs narrow and documented.
- Use the appendix to separate implementation details from the main argument.

---
layout: defense-question
title: Defense Question
question: How do you know these checks catch real presentation failures?
source: Committee prompt
---

The checks were derived from observed failures in color contrast, citation setup, and stale authoring metadata.

::evidence::
- Semantic token checks prevent dark highlight backgrounds from inheriting dark text.
- Citation diagnostics catch missing bibliography files before presenting.
- Curated templates are initialized and checked as real projects.

::followup::
The next evaluation should include external users building one deck from scratch.

---
layout: appendix-index
title: Appendix
description: Backup slide map for committee questions.
items:
  - label: A1
    title: Additional Experiments
    description: Full matrix screenshots and release gate logs
    page: 31
  - label: A2
    title: Citation Diagnostics
    description: CLI and VS Code failure examples
    page: 34
  - label: A3
    title: Template Inventory
    description: Paper, seminar, defense, reading group, and lightning decks
    page: 37
---

Use this map to jump quickly during Q&A.

---
layout: references
---

# References
