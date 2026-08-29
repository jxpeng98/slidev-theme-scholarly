---
theme: ../
title: Efficient Adaptation for Scientific Models
footerMiddle: Model Research Talk - Sample Data
lang: en
themeConfig:
  contentMode: light
  chromeMode: dark
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

# Efficient Adaptation for Scientific Models

An evidence-first model research talk using illustrative sample data

---
layout: bullets
title: Research Story
subtitle: Question, method, evidence, and boundary conditions
---

## What this talk establishes

1. **Problem** - Adaptation improves accuracy but often raises compute cost
2. **Method** - Lightweight routing specializes a fixed base representation
3. **Evidence** - Accuracy, latency, energy, and ablation results
4. **Scope** - Claims apply to labeled scientific adaptation tasks

---
layout: focus
color: blue
---

# Research Question

Can model adaptation improve accuracy without increasing deployment cost?

---
layout: related-work-matrix
title: Research Gap
description: Prior methods improve efficiency, but often depend on costly teachers or pruning pipelines.
---

| Work | Setting | Method | Remaining limitation |
| --- | --- | --- | --- |
| LeCun et al. 2015 | General deep learning | Representation learning | Deployment cost is not the objective |
| Smith 2023 | Efficient training | Distillation and pruning | Requires an expensive teacher model |
| **This study** | Scientific adaptation | **Lightweight routing** | Requires labeled target examples |

::notes::
The contribution is a deployment-aware adaptation path, not a larger base model.

---
layout: method-pipeline
title: Proposed Method
description: The workflow isolates the new routing stage and keeps evaluation comparable.
activeStep: 2
steps:
  - title: Curate
    description: Normalize task labels and filter noisy examples
    detail: 12k sample benchmark
  - title: Route
    description: Learn a sparse path before task-specific fine-tuning
    detail: Lightweight adapter only
  - title: Validate
    description: Compare quality and deployment cost
    detail: Five random seeds
---

All variants use the same preprocessing, hardware budget, and evaluation protocol.

---
layout: default
title: Training Objective
subtitle: The routing loss changes the adapter, not the deployed base representation
---

<EquationBlock
  title="Joint Objective"
  reference="1"
  caption="The sample study reports the same loss weights across all ablations."
>

$$
\mathcal{L} = \mathcal{L}_{task} + \lambda \mathcal{L}_{routing}
$$

</EquationBlock>

<EvidenceBlock
  title="Controlled comparison"
  label="Protocol"
  source="Illustrative study design"
  confidence="5 seeds"
  compact
>

- The base representation remains fixed at inference time.
- Each variant uses the same dataset split and compute budget.

</EvidenceBlock>

---
layout: result-highlight
title: Primary Result
heading: Accuracy improves within the same deployment budget
description: Illustrative sample results show a 3.2-point gain with lower latency and energy per sample.
label: Accuracy
metric: 94.7
unit: "%"
delta: +3.2 points
baseline: Five-seed mean
variant: success
---

- Improvement is consistent across the evaluated benchmark splits.
- Throughput remains inside the baseline deployment envelope.

::evidence::
- Dataset: AcademicBench sample
- Baseline: tuned supervised model
- Measures: accuracy, latency, and energy per sample

---
layout: default
title: Evidence Table
subtitle: Sample structured data stays next to the claim it supports
---

<script setup>
import { parseCsvTable, toMetricItems } from '../utils/data'

const dataDrivenResultsCsv = `method,accuracy,latency,note
Baseline,91.5,21 ms,Teacher tuned
Ours,94.7,18 ms,Routing enabled
Ours - routing,92.6,18 ms,Ablation`

const dataDrivenResultRows = parseCsvTable(dataDrivenResultsCsv)
const dataDrivenMetrics = toMetricItems([
  { label: 'Accuracy', value: '94.7', unit: '%', delta: '+3.2', variant: 'success' },
  { label: 'Latency', value: '18', unit: 'ms', delta: '-12%', variant: 'info' },
  { label: 'Energy', value: '-28', unit: '%', delta: 'per sample', variant: 'primary' },
])
</script>

<MetricGrid :columns="3" :metrics="dataDrivenMetrics" compact />

<ResultTable
  :rows="dataDrivenResultRows"
  :columns="[
    { key: 'method', label: 'Method' },
    { key: 'accuracy', label: 'Accuracy', align: 'right' },
    { key: 'latency', label: 'Latency', align: 'right' },
    { key: 'note', label: 'Note' }
  ]"
  caption="Illustrative sample results parsed from CSV text."
  highlightColumn="accuracy"
  compact
/>

---
layout: experiment-grid
title: What Changes the Result?
description: Ablations separate the routing contribution from dataset and hardware effects.
cols: 2
experiments:
  - name: Routing ablation
    setup: Remove routing
    result: "-2.1"
    metric: accuracy points
    note: Largest contribution
  - name: Domain shift
    setup: Shift evaluation domain
    result: "+1.4"
    metric: macro F1
    note: Stable under moderate shift
  - name: Throughput
    setup: Fixed hardware
    result: "142"
    metric: samples per second
    note: Matches baseline budget
  - name: Energy
    setup: Per-sample power
    result: "-28%"
    metric: energy use
    note: No pruning required
---

The routing ablation removes most of the measured quality gain.

---
layout: limitation
title: Boundary Conditions
heading: Where the claim stops
description: The evidence supports labeled scientific adaptation, not universal efficiency.
---

::limitation::
- Labeled target examples are required.
- Severe distribution shift still needs separate calibration.

::mitigation::
- Report few-shot sensitivity as a separate analysis.
- Keep shifted-domain results outside the primary claim.

---
layout: bullets
title: Conclusion
subtitle: One claim, one mechanism, and one explicit boundary
---

## Takeaways

- **Claim:** sample accuracy improves by 3.2 points within the baseline deployment budget
- **Mechanism:** lightweight routing specializes a fixed representation during adaptation
- **Evidence:** controlled metrics, ablations, and cost measurements agree
- **Boundary:** labeled tasks and moderate distribution shift define the supported scope

---
layout: references
---

---
layout: end
email: kl.moore@university.edu
website: https://github.com/example/project
subtitle: Questions?
---

Thank you.
