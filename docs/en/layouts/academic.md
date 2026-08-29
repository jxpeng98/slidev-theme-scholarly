---
title: Academic Layouts
---

# Academic Layouts

These research-specific layouts cover papers, methods, experiments, results, defenses, and references.

## paper-summary - Paper Reading Summary {#paper-summary}

**Use for:** Summarizing one paper's metadata, problem, method, and main finding.

```markdown
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
---

::problem::
Prior adaptation methods improve accuracy but increase compute cost.

::method::
The paper adds a lightweight routing stage before fine-tuning.

::finding::
Accuracy improves by 3.2 points with no additional inference cost.
```

**Props:**
- `title`, `subtitle`: Optional frame header
- `paperTitle`: Paper title shown in the summary header
- `authors`: String or array of author names
- `venue`, `year`, `doi`, `status`: Optional metadata chips
- `keywords`: String or array of topic chips
- `eyebrow`: Label above the paper title
- `problemLabel`, `methodLabel`, `findingLabel`: Override the three card headings

---

## related-work-matrix - Related Work Matrix {#related-work-matrix}

**Use for:** Comparing prior work, methods, assumptions, and gaps before introducing your contribution.

```markdown
---
layout: related-work-matrix
title: Related Work
description: Position the current work against prior approaches.
---

| Work | Setting | Method | Limitation |
| --- | --- | --- | --- |
| Smith et al. 2024 | Benchmark | Transformer baseline | High compute cost |
| Ours | Same benchmark | **Efficient adaptation** | Requires task labels |

::notes::
Use the matrix to make the research gap explicit before the method slide.
```

**Props:**
- `title`, `subtitle`: Optional frame header
- `heading`: Main in-slide heading
- `description`: Short context above the matrix
- `eyebrow`: Label above the main heading
- `note`: Optional note when not using the `notes` slot

---

## method-pipeline - Method Pipeline {#method-pipeline}

**Use for:** Showing a research workflow as ordered steps, with optional emphasis on the current step.

```markdown
---
layout: method-pipeline
title: Method Pipeline
activeStep: 2
steps:
  - title: Collect
    description: Curate the dataset and constraints
    detail: N=12k samples
  - title: Model
    description: Train the proposed architecture
    detail: 3 ablations
  - title: Validate
    description: Compare against baselines
    detail: 5 seeds
---

Optional note about assumptions, controls, or reproducibility.
```

**Props:**
- `title`, `subtitle`: Optional frame header
- `steps`: Array of `{ title, description, detail }`
- `activeStep`: 1-based step index to emphasize
- `heading`, `description`, `eyebrow`: In-slide text controls

---

## result-highlight - Result Highlight {#result-highlight}

**Use for:** Leading with one main result, then supporting it with evidence or caveats.

```markdown
---
layout: result-highlight
title: Main Result
heading: Our method improves accuracy without extra compute
label: Accuracy
metric: 94.7
unit: "%"
delta: +3.2 over baseline
baseline: 5-seed average
variant: success
---

- Explain what the result means.
- Name the comparison or benchmark.

::evidence::
- Dataset: AcademicBench
- Baseline: strong supervised model
```

**Props:**
- `title`, `subtitle`: Optional frame header
- `metric`, `unit`, `label`: Main metric block
- `delta`, `baseline`: Context chips below the metric
- `variant`: `primary`, `success`, `warning`, `danger`, or `info`
- `heading`, `description`, `eyebrow`: Claim text controls

---

## experiment-grid - Experiment Grid {#experiment-grid}

**Use for:** Comparing experimental settings, metrics, and notes in a compact grid.

```markdown
---
layout: experiment-grid
title: Experiment Grid
cols: 2
experiments:
  - name: Ablation
    setup: Remove one module at a time
    result: "-2.1"
    metric: accuracy points
    note: Largest drop from routing module
  - name: Robustness
    setup: Evaluate across shifted domains
    result: "+1.4"
    metric: macro F1
    note: Stable under moderate shift
---

Optional note about experimental controls or evaluation protocol.
```

**Props:**
- `title`, `subtitle`: Optional frame header
- `heading`, `description`, `eyebrow`: In-slide text controls
- `experiments`: Array of `{ name, setup, result, metric, note }`
- `cols`: Number of grid columns, usually `2` or `3`
- `setupLabel`, `metricLabel`, `noteLabel`: Override definition-list labels

---

## limitation - Limitation and Mitigation {#limitation}

**Use for:** Stating the boundary of a claim and how the study controls or scopes it.

```markdown
---
layout: limitation
title: Limitations
heading: Boundary Conditions
description: Name what the current study can and cannot support.
---

::limitation::
- The method assumes labeled target tasks.
- Performance under severe distribution shift remains uncertain.

::mitigation::
- Report shifted-domain evaluation separately.
- Scope the claim to labeled adaptation settings.
```

**Props:**
- `title`, `subtitle`: Optional frame header
- `limitation`, `mitigation`: Plain-text fallbacks when not using slots
- `limitationLabel`, `mitigationLabel`: Panel headings
- `heading`, `description`, `eyebrow`: In-slide text controls

---

## defense-question - Defense Question {#defense-question}

**Use for:** Preparing a thesis-defense or Q&A slide with an answer, evidence, and follow-up.

```markdown
---
layout: defense-question
title: Defense Question
question: Why does the proposed method outperform the strongest baseline?
source: Committee question
---

The routing stage improves specialization while keeping the base representation stable.

::evidence::
- Ablation shows the routing module contributes +2.1 points.
- Variance stays low across five seeds.

::followup::
If compute budget increases, compare against a larger teacher model.
```

**Props:**
- `title`, `subtitle`: Optional frame header
- `eyebrow`: Label above the question
- `question`: Main prompt
- `source`: Optional source or examiner label
- `answer`, `evidence`, `followup`: Plain-text fallbacks when not using slots
- `answerLabel`, `evidenceLabel`, `followupLabel`: Panel headings

---

## appendix-index - Appendix Index {#appendix-index}

**Use for:** Building a backup-slide map for appendices, extra experiments, and proofs.

```markdown
---
layout: appendix-index
title: Appendix
description: Fast map for backup slides and detailed evidence.
items:
  - label: A1
    title: Additional Experiments
    description: Full ablation and robustness tables
    page: 31
  - label: A2
    title: Implementation Details
    description: Hyperparameters, training setup, and data splits
    page: 34
---

Optional note for backup-slide navigation.
```

**Props:**
- `title`, `subtitle`: Optional frame header
- `items`: Array of `{ label, title, description, page }`
- `heading`, `description`, `eyebrow`: In-slide text controls

---

## compare - Side-by-Side Comparison {#compare}

**Use for:** Comparing two approaches, methods, or concepts in labeled columns.

![Compare Layout Example](/images/layouts/compare.png)

```markdown
---
layout: compare
title: Traditional vs. Our Approach
leftLabel: Traditional Methods
rightLabel: Our Approach
leftColor: red
rightColor: green
---

### Limitations
- High computational cost
- Long training time

::right::

### Advantages
- 50% less computation
- 3x faster training
```

**Props:**
- `title`: Main title
- `subtitle`: Optional subtitle
- `leftLabel`, `rightLabel`: Column labels
- `leftColor`, `rightColor`: `red`, `green`, `blue`, `amber`, `purple`

---

## methodology - Research Methodology {#methodology}

**Use for:** Presenting a research method beside a diagram.

![Methodology Layout Example](/images/layouts/methodology.png)

```markdown
---
layout: methodology
ratio: "1:1"
title: Research Methodology
---

## Our Approach

1. Data Collection
2. Feature Extraction
3. Model Training

::right::

![Diagram](./diagram.png)
```

**Props:**
- `ratio`: Column ratio (default: "1:1")
- `title`, `subtitle`: Header content

---

## results - Results Dashboard {#results}

**Use for:** Summarizing multiple metrics or results in a grid.

![Results Layout Example](/images/layouts/results.png)

```markdown
---
layout: results
cols: 2
title: Key Results
---

<div class="p-4 bg-white rounded shadow">
  <h3>Accuracy</h3>
  <h1>94.7%</h1>
</div>

<div class="p-4 bg-white rounded shadow">
  <h3>Speed</h3>
  <h1>2.3x</h1>
</div>
```

**Props:**
- `cols`: Number of columns (default: 2)
- `title`, `subtitle`: Header content

---

## timeline - Research Timeline {#timeline}

**Use for:** Showing research progress or historical events in chronological order.

![Timeline Layout Example](/images/layouts/timeline.png)

```markdown
---
layout: timeline
title: Research Timeline
items:
  - year: "2020"
    title: Initial Research
    description: Began exploring the problem space
  - year: "2021"
    title: Methodology Development
    description: Developed core algorithms
  - year: "2022"
    title: Validation
    description: Conducted experiments
---
```

**Props:**
- `title`: Optional title above the timeline
- `items`: Array of timeline items with `year`, `title`, and `description`

---

## agenda - Agenda Overview {#agenda}

**Use for:** Presenting a talk outline or meeting agenda.

![Agenda Layout Example](/images/layouts/agenda.png)

```markdown
---
layout: agenda
title: Today's Agenda
items:
  - Introduction and Background
  - Methodology Overview
  - Experimental Results
  - Discussion and Future Work
---
```

**Props:**
- `title`: Agenda title (default: "Agenda")
- `items`: Array of agenda item strings

---

## acknowledgments - Thank You & Credits {#acknowledgments}

**Use for:** Listing funding sources and collaborators.

![Acknowledgments Layout Example](/images/layouts/acknowledgments.png)

```markdown
---
layout: acknowledgments
title: Acknowledgments
funders:
  - National Science Foundation
  - Department of Energy
collaborators:
  - MIT AI Lab
  - Stanford NLP Group
---

Special thanks to all contributors.
```

**Props:**
- `title`: Section title (default: "Acknowledgments")
- `funders`: Array of funding organization names
- `collaborators`: Array of collaborator names

---

## references - Bibliography {#references}

**Use for:** Generating an academic bibliography from BibTeX citations.

![References Layout Example](/images/layouts/references.png)

```markdown
---
layout: references
---
```

**For long reference lists, use pagination:**

```markdown
---
layout: references
perPage: 5
page: 1
---

---
layout: references
perPage: 5
page: 2
title: "References (continued)"
---
```

If you want the bibliography to appear at a specific point inside the slide, add `[[bibliography]]` manually at that exact position.

**Manual references (without BibTeX):**

```markdown
---
layout: references
---

1. **Smith et al.** (2024). *Efficient Deep Learning*. Nature MI.

2. **Johnson & Williams** (2023). *Green AI*. ICML.

3. **Chen et al.** (2023). *Edge Computing*. NeurIPS.
```

**Props:**

- `page`: Current page number (for pagination)
- `perPage`: Number of references per page
- `title`: Custom title (default: "References" or "References (cont.)")
- `minFontSize`, `maxFontSize`: Font-size limits in pixels

**Features:**

- Automatic numbered reference styling
- Clean academic typography
- Auto-adjusting font size based on content
