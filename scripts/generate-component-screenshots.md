---
theme: ../
aspectRatio: 4/3
colorMode: light
layout: default
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
title: Block Component
subtitle: Beamer-style blocks
authors:
  - name: Scholarly Theme
    institution: Documentation Team
---

<!-- Slide 1: block -->

<Block type="info" title="Research Finding">
Our evaluation shows a consistent accuracy gain across all three benchmark datasets while keeping inference latency within the target budget.
</Block>

<!-- Slide 2: theorem -->
---
layout: default
title: Theorem Component
subtitle: Formal mathematical statement
---

<Theorem type="theorem" title="Pythagorean Theorem">

For a right triangle with sides $a$, $b$ and hypotenuse $c$:

$$a^2 + b^2 = c^2$$

</Theorem>

<!-- Slide 3: definition -->
---
layout: default
title: Definition Component
subtitle: Styled explanatory statement
---

<Theorem type="definition" title="Continuous Function">
A function is continuous at a point when arbitrarily small input changes produce arbitrarily small output changes.
</Theorem>

<!-- Slide 4: highlight -->
---
layout: default
title: Highlight Component
subtitle: Text emphasis styles
---

## Inline Highlights

Use <Highlight type="primary">primary highlight</Highlight> for key concepts.

The <Highlight type="warning">warning highlight</Highlight> draws attention.

Consider the <Highlight type="success">success highlight</Highlight> for achievements.

Also available: <Highlight type="info">info</Highlight> and <Highlight type="danger">danger</Highlight> styles.

<!-- Slide 5: steps -->
---
layout: default
title: Steps Component
subtitle: Step-by-step process
---

<Steps :steps="[
  { title: 'Data Collection', description: 'Gather training data from multiple sources' },
  { title: 'Preprocessing', description: 'Clean and normalize the dataset' },
  { title: 'Model Training', description: 'Train the neural network' },
  { title: 'Evaluation', description: 'Test and validate results' }
]" :activeStep="2" />

<!-- Slide 6: columns -->
---
layout: default
title: Columns Component
subtitle: Multi-column layouts
---

:::columns{columns="3" gap="2rem" ratio="1:1:1"}
### Column 1
First column content with some text.

+++

### Column 2
Second column with different information.

+++

### Column 3
Third column completing the layout.
:::

<!-- Slide 7: keywords -->
---
layout: default
title: Keywords Component
subtitle: Tag-style keywords
---

## Research Keywords

<Keywords :keywords="['Machine Learning', 'Neural Networks', 'Computer Vision', 'Deep Learning', 'Optimization']" />

<!-- Slide 8: cite -->
---
layout: default
title: Cite Component
subtitle: Manual citation note
---

## Research Background

Recent studies have shown significant improvements in model accuracy.

<Cite>
For comprehensive analysis, see Johnson & Williams (2024), "Advanced Methods in Deep Learning", pp. 45-67.
</Cite>

<!-- Slide 9: theme-preview -->
---
layout: default
title: ThemePreview Component
subtitle: Local color theme preview
---

<ThemePreview colorTheme="oxford-burgundy">

## Local Theme Preview

This block previews a Scholarly color theme without changing the rest of the slide.

</ThemePreview>

<!-- Slide 10: metric-card -->
---
layout: default
title: MetricCard Component
subtitle: Single result metric
---

<MetricCard
  label="Accuracy"
  value="94.7"
  unit="%"
  delta="+3.2"
  caption="Five-seed average against the supervised baseline"
  variant="success"
/>

<!-- Slide 11: metric-grid -->
---
layout: default
title: MetricGrid Component
subtitle: Compact result summary
---

<MetricGrid :columns="3" :metrics="[
  { label: 'Accuracy', value: '94.7', unit: '%', delta: '+3.2', variant: 'success' },
  { label: 'Latency', value: '18', unit: 'ms', delta: '-12%', variant: 'info' },
  { label: 'Energy', value: '-28', unit: '%', delta: 'per sample', variant: 'primary' }
]" />

<!-- Slide 12: evidence-block -->
---
layout: default
title: EvidenceBlock Component
subtitle: Claim support with source
---

<EvidenceBlock
  title="Ablation supports the routing module"
  label="Evidence"
  source="Table 3"
  confidence="5 seeds"
  variant="success"
>

- Removing routing reduces accuracy by 2.1 points.
- Throughput remains within the same deployment budget.

</EvidenceBlock>

<!-- Slide 13: equation-block -->
---
layout: default
title: EquationBlock Component
subtitle: Numbered equation with caption
---

<EquationBlock title="Training Objective" reference="1" caption="Weighted supervised and routing losses used in all ablations.">

$$
\mathcal{L} = \mathcal{L}_{task} + \lambda \mathcal{L}_{routing}
$$

</EquationBlock>

<!-- Slide 14: dataset-card -->
---
layout: default
title: DatasetCard Component
subtitle: Dataset scale and source summary
---

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

<!-- Slide 15: paper-card -->
---
layout: default
title: PaperCard Component
subtitle: Paper metadata and takeaway
---

<PaperCard
  title="Efficient Adaptation for Scientific Models"
  :authors="['A. Smith', 'B. Lee']"
  venue="ICML"
  year="2026"
  status="Accepted"
  contribution="Introduces lightweight routing before task-specific fine-tuning."
/>

<!-- Slide 16: contribution-list -->
---
layout: default
title: ContributionList Component
subtitle: Numbered claims with evidence
---

<ContributionList title="Main Contributions" :items="[
  { title: 'Efficient adaptation', description: 'Adds a lightweight routing stage before fine-tuning.', evidence: '+3.2 accuracy points' },
  { title: 'Stable deployment cost', description: 'Keeps the base representation fixed at inference time.', evidence: 'Same throughput budget' },
  { title: 'Reproducible evaluation', description: 'Reports five-seed averages across all experiments.', evidence: 'Appendix B' }
]" />

<!-- Slide 17: caveat-list -->
---
layout: default
title: CaveatList Component
subtitle: Limitations with mitigations
---

<CaveatList title="Boundary Conditions" :items="[
  { title: 'Labeled tasks required', description: 'The method assumes labeled target examples are available.', mitigation: 'Report few-shot sensitivity separately.' },
  { title: 'Severe shift remains hard', description: 'Large distribution shift still needs calibration.', mitigation: 'Use shifted-domain evaluation as a separate claim.' }
]" />
