---
title: 从数据生成幻灯片
---

# 从数据生成幻灯片

同一组结果需要多处使用，或由脚本更新时，可以导入 JSON 或 CSV。如果一页只有几个数值，直接写 Markdown 表格通常更简单。主题负责显示表格和指标卡片，不会计算统计结果或绘制图表。

## 将 JSON 显示为表格

将下面的示例保存为 `results.json`，放在 `slides.md` 旁边：

```json
[
  { "model": "Baseline", "accuracy": 91.5, "latency": 24 },
  { "model": "Ours", "accuracy": 94.7, "latency": 18 }
]
```

在 `slides.md` 中添加以下页面。导入语句和组件应放在同一张幻灯片内：

```markdown
---
layout: default
title: 基准结果
---

<script setup>
import rows from './results.json'
</script>

<ResultTable
  :rows="rows"
  :columns="[
    { key: 'model', label: '模型' },
    { key: 'accuracy', label: '准确率（%）', align: 'right' },
    { key: 'latency', label: '延迟（ms）', align: 'right' }
  ]"
  highlightColumn="accuracy"
/>
```

## 将 CSV 显示为指标卡片

将以下内容保存为 `metrics.csv`，同样放在 `slides.md` 旁边：

```csv
label,value,unit,delta
准确率,94.7,%,+3.2 个百分点
延迟,18,ms,-12%
```

以原始文本形式导入 CSV，再将每条记录转换成指标：

```markdown
---
layout: default
title: 结果概览
---

<script setup>
import csv from './metrics.csv?raw'
import { parseCsvTable, toMetricItems } from 'slidev-theme-scholarly/utils/data'

const metrics = toMetricItems(parseCsvTable(csv))
</script>

<MetricGrid :metrics="metrics" :columns="2" compact />
```

`parseCsvTable` 将第一行作为表头，返回的字段值均为字符串。需要计算时，请自行转换为数值。`toMetricItems` 会识别 `label`、`value`、`unit`、`delta` 等常用字段，跳过没有有效指标值的行。字段名称不同时，可以传入映射，例如 `toMetricItems(rows, { labelKey: 'measure', valueKey: 'score' })`。

## 让结果容易阅读

精确比较数值时用 [ResultTable](../components/result-table)，概括少量关键指标时用 [MetricGrid](../components/metric-grid)。保留单位和评测条件。这两个组件会在数据为空时显示提示；文件缺失则会导致导入失败，需要先修正路径。

文件通过 Slidev 和 Vite 的构建流程导入，放映时不会轮询文件或自动拉取远程数据。[学术演示示例](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example-academic.md)中有一张可运行的数据结果页。
