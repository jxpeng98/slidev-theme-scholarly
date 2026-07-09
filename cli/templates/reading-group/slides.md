---
theme: scholarly
title: Reading Group
footerMiddle: Reading Group
description: Reading group deck for paper critique and discussion
aspectRatio: 4/3
lang: en
themeConfig:
  colorTheme: nordic-blue
  fontTheme: classic
  chromeMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: Discussion Lead
    institution: Reading Group
---

# Reading Group

Paper Title And Discussion

---
layout: paper-summary
paperTitle: Lightweight Routing for Efficient Model Adaptation
authors:
  - K. Nguyen
  - M. Patel
venue: ICLS
year: 2026
keywords:
  - model adaptation
  - routing
  - efficiency
---

::problem::
The paper studies adaptation when compute and labeled examples are constrained @nguyen2026routing.

::method::
It introduces a routing stage and compares it with full fine-tuning.

::finding::
The method improves average accuracy, but the robustness story needs closer reading.

---
layout: related-work-matrix
title: Positioning
description: Compare what this paper assumes against adjacent work.
---

| Work | Main Question | Evidence | Discussion Gap |
| --- | --- | --- | --- |
| Miller et al. 2025 | How reading groups critique papers | Survey | Does not cover technical slide design |
| Lee 2024 | How slides structure evidence | Design patterns | Less focus on paper discussion |
| Nguyen 2026 | How routing changes adaptation | Benchmark | Robustness limits need unpacking |

::notes::
Use the final column as the discussion agenda.

---
layout: limitation
title: Critique
heading: What We Should Debate
description: Separate paper limitations from presentation questions.
---

::limitation::
- The evaluation uses a narrow set of target tasks.
- The method may require labels unavailable in some deployment settings.
- The paper reports aggregate gains but fewer qualitative failure cases.

::mitigation::
- Ask whether the setup matches our group's target domain.
- Track what evidence would change our conclusion.

---
layout: default
title: Discussion Prompts
---

## Questions For The Room

- Which baseline would you add?
- Which claim is strongest?
- Which limitation would matter most in our own work?

---
layout: references
---

# References
