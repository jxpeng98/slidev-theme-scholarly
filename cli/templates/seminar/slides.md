---
theme: scholarly
title: Research Seminar
footerMiddle: Research Seminar
description: Seminar deck with agenda, related work, method, and discussion
aspectRatio: 4/3
lang: en
themeConfig:
  colorTheme: cambridge-green
  fontTheme: elegant
  chromeMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: Your Name
    institution: Your Lab
---

# Research Seminar Title

Speaker Name

---
layout: agenda
title: Agenda
items:
  - label: 1
    title: Context
    description: Why the problem matters
  - label: 2
    title: Related Work
    description: Where the current project fits
  - label: 3
    title: Method
    description: What we changed and measured
  - label: 4
    title: Discussion
    description: What feedback would help most
---

---
layout: default
title: Context
---

## Why This Topic Is Worth A Seminar

- The field has converged on similar evaluation patterns @brown2025seminar.
- Tooling decisions affect reproducibility and review quality @garcia2024bench.
- The seminar goal is to sharpen the problem framing, not only present results.

---
layout: related-work-matrix
title: Related Work
description: Position the project before introducing the method.
---

| Work | Setting | Method | Limitation |
| --- | --- | --- | --- |
| Brown et al. 2025 | Seminar practice | Structured critique | Limited tooling focus |
| Garcia et al. 2024 | Workflow benchmark | Reproducibility checklist | No talk-level template |
| This project | Academic Slidev | Integrated authoring workflow | Needs user validation |

::notes::
Use this slide to invite early disagreement about the framing.

---
layout: method-pipeline
title: Proposed Approach
activeStep: 3
steps:
  - title: Scope
    description: Define the talk use case
    detail: seminar audience
  - title: Build
    description: Compose layouts and components
    detail: reusable slides
  - title: Validate
    description: Run doctor and citation checks
    detail: release gate
---

Keep the method concrete enough for discussion but short enough to leave room for questions.

---
layout: default
title: Discussion Prompts
---

## Open Questions

- Which claim needs stronger evidence?
- Which assumption should move into the limitation slide?
- What would make this workflow easier for a new presenter?

---
layout: references
---

# References
