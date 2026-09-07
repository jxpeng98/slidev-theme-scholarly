---
title: Data-Driven Slides
---

# Data-Driven Slides

Use JSON or CSV when the same result data appears in several places or is updated by a script. For a few values on one slide, a Markdown table is usually simpler. The theme renders tables and metric cards; it does not calculate statistics or draw charts.

## Render JSON as a table

Save this sample as `results.json` beside `slides.md`:

```json
[
  { "model": "Baseline", "accuracy": 91.5, "latency": 24 },
  { "model": "Ours", "accuracy": 94.7, "latency": 18 }
]
```

Add this slide to `slides.md`. The import and the component belong to the same slide:

```markdown
---
layout: default
title: Benchmark results
---

<script setup>
import rows from './results.json'
</script>

<ResultTable
  :rows="rows"
  :columns="[
    { key: 'model', label: 'Model' },
    { key: 'accuracy', label: 'Accuracy (%)', align: 'right' },
    { key: 'latency', label: 'Latency (ms)', align: 'right' }
  ]"
  highlightColumn="accuracy"
/>
```

## Render CSV as metric cards

Save this as `metrics.csv` beside `slides.md`:

```csv
label,value,unit,delta
Accuracy,94.7,%,+3.2 points
Latency,18,ms,-12%
```

Import the raw CSV and convert each record to a metric item:

```markdown
---
layout: default
title: Result summary
---

<script setup>
import csv from './metrics.csv?raw'
import { parseCsvTable, toMetricItems } from 'slidev-theme-scholarly/utils/data'

const metrics = toMetricItems(parseCsvTable(csv))
</script>

<MetricGrid :metrics="metrics" :columns="2" compact />
```

`parseCsvTable` uses the first row as headers and returns string values. Convert values to numbers yourself if you need to calculate with them. `toMetricItems` maps common field names such as `label`, `value`, `unit`, and `delta`; rows without a usable value are omitted. For other names, pass a mapping such as `toMetricItems(rows, { labelKey: 'measure', valueKey: 'score' })`.

## Keep results readable

Use a [ResultTable](../components/result-table) for exact comparisons and a [MetricGrid](../components/metric-grid) for a small set of headline numbers. Keep units and evaluation conditions visible. Empty data shows a warning in these components, but missing files fail the import and must be corrected.

Imports use Slidev and Vite's normal build process. They do not poll files or fetch remote data while presenting. The [academic example](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example-academic.md) includes a working data-driven slide.
