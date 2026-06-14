---
theme: ../
footerMiddle: Academic Conference 2025
lang: en
themeConfig:
  colorMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: Dr. K.L. Moore
    institution: Department of Computer Science
    email: kl.moore@university.edu
  - name: Dr. M.N. Taylor
    institution: School of Engineering
    email: mn.taylor@institute.edu
---

# Efficient Deep Learning Models

A Study on Reducing Computational Cost While Maintaining Accuracy

<!--
SLIDE: Cover
LAYOUT: cover (default for first slide)
PURPOSE: Title slide with authors in footer
-->

---
layout: bullets
title: Outline
subtitle: What we'll cover today
---

<!--
SLIDE: Outline
LAYOUT: bullets
PURPOSE: Show agenda with bullet points
-->

## Today's Agenda

1. **Introduction** - Background and motivation
2. **Methods** - Our approach and methodology
3. **Results** - Key findings
4. **Discussion** - Implications and future work

---
layout: section
---

<!--
SLIDE: Section Divider
LAYOUT: section
PURPOSE: Mark the beginning of a new section
-->

# Introduction

Background and Motivation

---
layout: focus
color: blue
icon: 🎯
---

<!--
SLIDE: Research Question
LAYOUT: focus
PURPOSE: Highlight the main research question with icon and color
OPTIONS: color (blue/green/amber/red), icon (emoji)
-->

# Research Question

How can we improve model accuracy while reducing computational cost?

---
layout: bullets
title: Background
subtitle: Setting the stage
---

<!--
SLIDE: Background
LAYOUT: bullets
PURPOSE: List key background points
CITATIONS: Using @citekey syntax (Vue-style would be <Cite key="..." />)
-->

## Why This Matters

- Deep learning models are becoming increasingly complex @lecun2015deep
- Training costs have grown exponentially
- Environmental impact is a growing concern
- Need for more efficient approaches @smith2023deep
- Prior adaptation work often combines grouped evidence @smith2023deep @wang2022attention

<Cite :inline="false" author="Moore and Taylor" year="2026">
Manual citation notes are useful for reading-group context that should not appear in the BibTeX bibliography.
</Cite>

---
layout: compare
title: Traditional vs. Our Approach
leftLabel: Traditional Methods
rightLabel: Our Approach
leftColor: red
rightColor: green
---

<!--
SLIDE: Comparison
LAYOUT: compare
PURPOSE: Side-by-side comparison with colored labels
OPTIONS: leftLabel, rightLabel, leftColor, rightColor
-->

### Limitations

- High computational cost
- Long training time
- Large carbon footprint
- Requires expensive hardware

::right::

### Advantages

- 50% less computation
- 3x faster training
- Eco-friendly
- Runs on consumer GPUs

---
layout: paper-summary
title: Paper Context
paperTitle: Efficient Adaptation for Scientific Models
authors:
  - A. Smith
  - B. Lee
venue: ICML
year: 2026
status: Accepted
keywords:
  - efficient learning
  - model adaptation
  - green AI
---

<!--
SLIDE: Paper Summary
LAYOUT: paper-summary
PURPOSE: Summarize one paper's metadata and key takeaways
-->

::problem::
Existing adaptation methods improve accuracy but often increase training and inference cost.

::method::
The paper inserts a lightweight routing stage before task-specific fine-tuning.

::finding::
Accuracy improves by 3.2 points while keeping inference cost unchanged.

---
layout: default
title: Study Context
subtitle: Paper and dataset summary
---

<!--
SLIDE: Study Context
LAYOUT: default
COMPONENTS: <PaperCard>, <DatasetCard>
PURPOSE: Summarize source paper and evaluation dataset before detailed evidence
-->

<PaperCard
  title="Efficient Adaptation for Scientific Models"
  :authors="['A. Smith', 'B. Lee']"
  venue="ICML"
  year="2026"
  status="Accepted"
  contribution="Introduces lightweight routing before task-specific fine-tuning."
/>

<DatasetCard
  name="AcademicBench"
  description="Curated benchmark for efficient scientific model adaptation."
  task="Classification"
  samples="12k"
  features="128"
  split="70 / 15 / 15"
  source="Internal benchmark"
  license="Research use"
/>

---
layout: related-work-matrix
title: Related Work
description: Position our contribution against prior efficient learning approaches.
---

<!--
SLIDE: Related Work Matrix
LAYOUT: related-work-matrix
PURPOSE: Compare prior work and make the research gap explicit
-->

| Work | Setting | Method | Limitation |
| --- | --- | --- | --- |
| LeCun et al. 2015 | General deep learning | Representation learning | Not optimized for deployment cost |
| Smith 2023 | Efficient training | Distillation and pruning | Requires expensive teacher models |
| Ours | Scientific models | **Lightweight adaptive routing** | Requires task labels |

::notes::
The matrix makes the gap explicit before introducing the proposed method.

---
layout: method-pipeline
title: Method Pipeline
description: Our workflow separates data curation, efficient adaptation, and validation.
activeStep: 2
steps:
  - title: Curate
    description: Filter noisy examples and normalize task labels
    detail: 12k training samples
  - title: Adapt
    description: Learn lightweight routing before fine-tuning
    detail: 3 ablation variants
  - title: Validate
    description: Compare accuracy, speed, and energy
    detail: 5 random seeds
---

<!--
SLIDE: Method Pipeline
LAYOUT: method-pipeline
PURPOSE: Show the ordered method steps with active-step emphasis
-->

Validation reports mean and standard deviation for each metric.

---
layout: result-highlight
title: Main Result
heading: Accuracy improves without extra inference cost
description: The proposed routing stage improves downstream quality while preserving deployment efficiency.
label: Accuracy
metric: 94.7
unit: "%"
delta: +3.2 over baseline
baseline: 5-seed average
variant: success
---

<!--
SLIDE: Result Highlight
LAYOUT: result-highlight
PURPOSE: Lead with a key metric and support it with evidence
-->

- The improvement is consistent across all evaluated datasets.
- Runtime remains within the same deployment budget.

::evidence::
- Dataset: AcademicBench
- Baseline: optimized supervised model
- Evaluation: accuracy, throughput, and energy per sample

---
layout: experiment-grid
title: Experiment Grid
description: Compare experimental settings, metrics, and notes.
cols: 2
experiments:
  - name: Ablation
    setup: Remove one component at a time
    result: "-2.1"
    metric: accuracy points
    note: Routing module has the largest contribution
  - name: Robustness
    setup: Evaluate across shifted domains
    result: "+1.4"
    metric: macro F1
    note: Stable under moderate distribution shift
  - name: Efficiency
    setup: Measure inference throughput
    result: "142"
    metric: samples per second
    note: Same hardware budget as baseline
  - name: Energy
    setup: Track energy per sample
    result: "-28%"
    metric: power use
    note: Lower cost without pruning
---

<!--
SLIDE: Experiment Grid
LAYOUT: experiment-grid
PURPOSE: Compare experiment settings and results
-->

All experiments use the same preprocessing pipeline and report five-seed averages.

---
layout: limitation
title: Limitations
heading: Boundary Conditions
description: Scope the claim before moving into the method details.
---

<!--
SLIDE: Limitation
LAYOUT: limitation
PURPOSE: State limitations and mitigations clearly
-->

::limitation::
- The method assumes labeled target tasks are available.
- Severe distribution shift still requires separate calibration.

::mitigation::
- We report shifted-domain evaluation separately.
- Claims are scoped to labeled adaptation settings.

---
layout: defense-question
title: Defense Question
question: Why does the routing module improve accuracy without increasing inference cost?
source: Committee question
---

<!--
SLIDE: Defense Question
LAYOUT: defense-question
PURPOSE: Prepare a direct answer with evidence and follow-up
-->

The routing stage improves specialization during adaptation while keeping the deployed base representation fixed.

::evidence::
- Ablation removes 2.1 accuracy points when routing is disabled.
- Throughput remains within the same deployment budget.

::followup::
With a larger compute budget, compare against a larger teacher model and report cost-normalized accuracy.

---
layout: appendix-index
title: Appendix
description: Backup slides for experimental details and extended evidence.
items:
  - label: A1
    title: Additional Experiments
    description: Full ablation and robustness tables
    page: 31
  - label: A2
    title: Implementation Details
    description: Hyperparameters, training setup, and data splits
    page: 34
  - label: A3
    title: Extended Metrics
    description: Energy, throughput, and confidence intervals
    page: 38
---

<!--
SLIDE: Appendix Index
LAYOUT: appendix-index
PURPOSE: Map backup slides for Q&A navigation
-->

Use this index when jumping to backup evidence during questions.

---
layout: section
---

<!--
SLIDE: Section Divider
LAYOUT: section
-->

# Methods

Our Approach

---
layout: default
title: Methodology Overview
---

<!--
SLIDE: Methodology
LAYOUT: default
COMPONENT: <Steps> (Vue component)
PURPOSE: Show step-by-step process with active step highlighted
-->

## Our Framework

<Steps :steps="[
  { title: 'Data Collection', description: 'Gather and preprocess datasets' },
  { title: 'Model Design', description: 'Design efficient architecture' },
  { title: 'Training', description: 'Train with optimized procedure' },
  { title: 'Evaluation', description: 'Benchmark against baselines' }
]" :activeStep="2" />

---
layout: figure
image: https://cover.sli.dev
caption: Overview of our proposed architecture showing the main components and data flow.
label: "Figure 1:"
title: System Architecture
---

<!--
SLIDE: Figure
LAYOUT: figure
PURPOSE: Display image with caption and label
OPTIONS: image, caption, label, fit
-->

The model consists of three main modules working together.

---
layout: default
title: Mathematical Foundation
---

<!--
SLIDE: Theorem
LAYOUT: default
COMPONENT: <Theorem> (Vue component)
PURPOSE: Display mathematical theorems with auto-numbering
-->

## Key Theorem

<Theorem type="theorem" title="Convergence Guarantee">

For any $\epsilon > 0$, our algorithm converges to an $\epsilon$-optimal solution in $O(\frac{1}{\epsilon^2})$ iterations.

</Theorem>

<Theorem type="proof">

The proof follows from the convexity of the loss function and the bounded gradient assumption. See Appendix A for details. $\square$

</Theorem>

---
layout: default
title: Model Architecture
---

<!--
SLIDE: Definition
LAYOUT: default
COMPONENT: :::theorem (Syntax Sugar)
PURPOSE: Same as <Theorem> but using markdown syntax sugar
CITATION: !@citekey for narrative citation "Author (Year)"
-->

## Attention Mechanism

Building on the Transformer architecture !@vaswani2017attention, we propose:

:::theorem{type="definition" title="Efficient Attention"}
Given query $Q$, key $K$, and value $V$ matrices, our efficient attention is:

$$\text{EfficientAttn}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}} \odot M\right)V$$

where $M$ is a learnable sparse mask.
:::

---
layout: section
---

<!--
SLIDE: Section Divider
LAYOUT: section
-->

# Results

Key Findings

---
layout: fact
color: green
---

<!--
SLIDE: Key Fact
LAYOUT: fact
PURPOSE: Highlight a single impressive statistic
OPTIONS: color (green/blue/amber/red)
-->

# 94.7%

Accuracy on benchmark dataset

---
layout: default
title: Evidence Summary
subtitle: Metrics and claim support
---

<!--
SLIDE: Evidence Summary
LAYOUT: default
COMPONENTS: <MetricCard>, <MetricGrid>, <EvidenceBlock>
PURPOSE: Show compact evidence components for result-heavy academic slides
-->

<MetricCard
  label="Main Result"
  value="94.7"
  unit="%"
  delta="+3.2"
  caption="Five-seed average on AcademicBench"
  variant="success"
/>

<MetricGrid :columns="3" :metrics="[
  { label: 'Macro F1', value: '0.93', delta: '+0.04', variant: 'success' },
  { label: 'Latency', value: '18', unit: 'ms', delta: '-12%', variant: 'info' },
  { label: 'Energy', value: '-28', unit: '%', delta: 'per sample', variant: 'primary' }
]" />

<EvidenceBlock
  title="Ablation supports the routing module"
  label="Evidence"
  source="Table 3"
  confidence="5 seeds"
  variant="success"
  compact
>

- Removing routing reduces accuracy by 2.1 points.
- Throughput remains within the same deployment budget.

</EvidenceBlock>

---
layout: default
title: Training Objective
subtitle: Equation evidence
---

<!--
SLIDE: Equation Evidence
LAYOUT: default
COMPONENT: <EquationBlock>
PURPOSE: Connect a method equation to the result claim
-->

<EquationBlock
  title="Training Objective"
  reference="1"
  caption="Weighted supervised and routing losses used across all ablations."
>

$$
\mathcal{L} = \mathcal{L}_{task} + \lambda \mathcal{L}_{routing}
$$

</EquationBlock>

The routing term is active only during adaptation, so deployed inference cost stays unchanged.

---
layout: default
title: Contributions and Caveats
subtitle: Claim scope before discussion
---

<!--
SLIDE: Contributions and Caveats
LAYOUT: default
COMPONENTS: <ContributionList>, <CaveatList>
PURPOSE: State what the paper contributes and what boundaries remain
-->

<ContributionList title="Main Contributions" :items="[
  { title: 'Efficient adaptation', description: 'Adds a lightweight routing stage before fine-tuning.', evidence: '+3.2 accuracy points' },
  { title: 'Stable deployment cost', description: 'Keeps the base representation fixed at inference time.', evidence: 'Same throughput budget' },
  { title: 'Reproducible evaluation', description: 'Reports five-seed averages across all experiments.', evidence: 'Appendix B' }
]" compact />

<CaveatList title="Boundary Conditions" :items="[
  { title: 'Labeled tasks required', description: 'The method assumes labeled target examples are available.', mitigation: 'Report few-shot sensitivity separately.' },
  { title: 'Severe shift remains hard', description: 'Large distribution shift still needs calibration.', mitigation: 'Use shifted-domain evaluation as a separate claim.' }
]" compact />

---
layout: two-cols
ratio: "1:1"
title: Quantitative Results
---

<!--
SLIDE: Two Columns
LAYOUT: two-cols
PURPOSE: Side-by-side content with tables
OPTIONS: ratio (e.g., "1:1", "2:3")
-->

## Performance Metrics

| Metric | Ours | Baseline |
|--------|------|----------|
| Accuracy | **94.7%** | 91.2% |
| F1 Score | **0.93** | 0.89 |
| Speed | **3.2s** | 9.8s |

::right::

## Resource Usage

| Resource | Ours | Baseline |
|----------|------|----------|
| GPU Memory | **4GB** | 12GB |
| Training Time | **2h** | 8h |
| Parameters | **12M** | 45M |

---
layout: focus
color: amber
icon: ⚠️
---

<!--
SLIDE: Limitations
LAYOUT: focus
PURPOSE: Highlight important limitations with warning color
-->

# Limitations

Our method requires clean labeled data and may not generalize to all domains.

---
layout: section
---

<!--
SLIDE: Section Divider
LAYOUT: section
-->

# Discussion

Implications and Future Work

---
layout: bullets
title: Key Takeaways
subtitle: Summary of Findings
---

<!--
SLIDE: Key Takeaways
LAYOUT: bullets
COMPONENT: <Highlight> (Vue component)
PURPOSE: Summarize findings with highlighted keywords
-->

## What We Learned

- <Highlight type="primary">Efficiency matters</Highlight> - Smaller models can achieve competitive results
- <Highlight type="success">Architecture design is crucial</Highlight> - Right inductive biases help @wang2022attention
- <Highlight type="warning">Trade-offs exist</Highlight> - Speed vs. accuracy balance
- <Highlight type="info">Reproducibility is key</Highlight> - All code is open-sourced

---
layout: default
title: Future Directions
---

<!--
SLIDE: Future Work
LAYOUT: default
COMPONENT: :::block (Syntax Sugar)
PURPOSE: Same as <Block> but using markdown syntax sugar
-->

## Next Steps

:::block{type="info" title="Short-term Goals"}
- Extend to more domains (NLP, speech)
- Improve robustness to noisy data
- Release pre-trained models
:::

:::block{type="example" title="Long-term Vision"}
- Develop theoretical foundations @bishop2006pattern
- Build user-friendly tools
- Foster community adoption
:::

---
layout: default
title: Acknowledgments
---

<!--
SLIDE: Acknowledgments
LAYOUT: default
COMPONENT: <Block> (Vue component)
PURPOSE: Show acknowledgments using Vue component syntax
-->

## Acknowledgments

<Block type="success" title="Funding">

This work was supported by the National Science Foundation.

</Block>

<Block type="info" title="Resources">

We thank the computing center for providing GPU resources.

</Block>

---
layout: references
---

<!--
SLIDE: References
LAYOUT: references
PURPOSE: Auto-generated bibliography from BibTeX citations
AUTO: empty or heading-only references slides inject the bibliography automatically
-->

---
layout: section
---

# Additional Academic Features

## Tables, Code, Modern Quotes

---
layout: default
title: Academic Tables
subtitle: Booktabs Style
---

<!--
FEATURE: Booktabs-style tables
- No vertical lines
- Thick top/bottom borders (2px)
- Thin middle border (1px)
-->

## Performance Comparison

| Model | Accuracy | Latency | GPU Memory |
| ----- | -------- | ------- | ---------- |
| ResNet-50 | 76.2% | 4.1ms | 4.0GB |
| EfficientNet-B0 | 77.1% | 2.8ms | 2.5GB |
| **Ours** | **79.4%** | **1.9ms** | **1.8GB** |
| ViT-B/16 | 77.9% | 5.3ms | 6.2GB |

> Tables automatically use academic three-line style (booktabs).

---
layout: quote
author: Richard Feynman
source: The Character of Physical Law, 1965
---

<!--
SLIDE: Quote with Attribution
LAYOUT: quote
NEW PROPS: author, source (automatically rendered)
-->

The first principle is that you must not fool yourself — and you are the easiest person to fool.

---
layout: bullets
title: Key Contributions
icon: "✓"
---

<!--
SLIDE: Bullets with Custom Icon
LAYOUT: bullets  
NEW PROP: icon (custom bullet character)
-->

## What We Achieved

- Reduced model size by 60% while improving accuracy
- First to achieve real-time inference on edge devices
- Open-source implementation with full documentation
- Comprehensive ablation study validating design choices

---
layout: end
email: kl.moore@university.edu
website: https://github.com/example/project
subtitle: Questions?
---

<!--
SLIDE: End
LAYOUT: end
PURPOSE: Closing slide with contact information
OPTIONS: email, website, subtitle
-->

Thank you for your attention!
