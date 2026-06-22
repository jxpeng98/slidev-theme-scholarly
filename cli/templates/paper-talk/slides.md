---
theme: scholarly
title: Paper Talk
footerMiddle: Paper Talk
description: Structured academic paper presentation
aspectRatio: 4/3
lang: en
themeConfig:
  colorTheme: oxford-burgundy
  fontTheme: academic
  contentMode: light
  chromeMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: Your Name
    institution: Your Institution
---

# Paper Title

Author Name, Venue 2026

---
layout: paper-summary
paperTitle: Efficient Adaptation for Scientific Models
authors:
  - A. Smith
  - B. Lee
venue: ICML
year: 2026
keywords:
  - efficient learning
  - adaptation
  - reproducibility
---

::problem::
Large models adapt well but make iteration expensive for small research groups @smith2025llm.

::method::
The paper adds lightweight routing before fine-tuning, then evaluates against strong baselines @nguyen2026routing.

::finding::
Accuracy improves while inference cost remains stable.

---
layout: section
sectionMode: dark
---

# Research Question

---
layout: default
title: Why This Paper Matters
---

## Motivation

- Prior slide and paper workflows often separate evidence from narrative @lee2024design.
- This paper makes the trade-off explicit: better adaptation without a larger deployment footprint.
- The key question: can routing improve specialization without destabilizing the base representation?

---
layout: method-pipeline
title: Method Pipeline
activeStep: 2
steps:
  - title: Curate
    description: Build task-specific data splits
    detail: 12k examples
  - title: Route
    description: Select lightweight adaptation paths
    detail: learned gates
  - title: Validate
    description: Compare with fine-tuning baselines
    detail: 5 random seeds
---

The routing stage is the main intervention; the rest of the pipeline keeps the evaluation controlled.

---
layout: result-highlight
title: Main Result
heading: Routing improves adaptation without increasing inference cost
label: Accuracy
metric: 94.7
unit: "%"
delta: +3.2 over baseline
baseline: 5-seed average
variant: success
---

- The gain is largest on low-resource task families.
- Reported variance remains narrow across repeated runs.

::evidence::
- Benchmark: Scientific Adaptation Suite
- Baseline: full fine-tuning with matched compute

---
layout: limitation
title: Limitations
heading: Boundary Conditions
description: Scope the claim before moving to discussion.
---

::limitation::
- Requires labeled target-task examples.
- Does not evaluate severe out-of-domain shift.

::mitigation::
- Treat the result as evidence for efficient supervised adaptation.
- Use the appendix to separate robustness claims from the main contribution.

---
layout: references
---

# References
