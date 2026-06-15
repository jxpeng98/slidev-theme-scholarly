---
title: 结果密集型报告工作流
---

# 结果密集型报告工作流

适合主线由指标、消融、数据集和实验对比驱动的报告。

```bash
sch init results-talk --template conference-lightning
```

## 推荐布局

- [result-highlight](../../layouts/academic#result-highlight---结果高亮) 用于最重要发现。
- [experiment-grid](../../layouts/academic#experiment-grid---实验矩阵) 用于分组实验。
- [results](../../layouts/academic#results) 用于 dashboard 式结果页。
- [fact](../../layouts/emphasis#fact) 用于一个决定性数字。
- [figure](../../layouts/content#figure) 用于图表页。

## 推荐组件

- [MetricCard](../../components/metric-card) 展示单个关键指标。
- [MetricGrid](../../components/metric-grid) 展示多个可比较指标。
- [DatasetCard](../../components/dataset-card) 说明 benchmark。
- [EvidenceBlock](../../components/evidence-block) 解释结果意义。
- [EquationBlock](../../components/equation-block) 展示指标公式。

## 常用片段

```bash
sch snippet append results --file slides.md
sch snippet append block --file slides.md
```

把重复出现的结果结论整理成 MetricGrid 或 EvidenceBlock，避免每页临时画框。

## 主题模式与对比度

结果页需要图表和表格保持高对比。建议使用 `colorMode: light`，投影图表细节不足时使用
`high-contrast`。详见[主题模式与对比度](../theme-mode-contrast)。
