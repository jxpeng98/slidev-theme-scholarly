---
title: 结果密集型报告工作流
---

# 结果密集型报告工作流

如果整场报告主要围绕指标、消融、数据集和实验对比展开，可以从 `conference-lightning` 模板开始：

```bash
npx -y slidev-theme-scholarly init results-talk --template conference-lightning
```

## 推荐布局

- [result-highlight](../../layouts/academic#result-highlight)：强调最重要的发现。
- [experiment-grid](../../layouts/academic#experiment-grid)：比较分组实验。
- [results](../../layouts/academic#results)：汇总多项结果。
- [fact](../../layouts/emphasis#fact)：突出一个决定性数字。
- [figure](../../layouts/content#figure)：展示图表。

## 推荐组件

- [MetricCard](../../components/metric-card) 展示单个关键指标。
- [MetricGrid](../../components/metric-grid) 展示多个可比较指标。
- [DatasetCard](../../components/dataset-card) 说明基准数据集。
- [EvidenceBlock](../../components/evidence-block) 解释结果意义。
- [EquationBlock](../../components/equation-block) 展示指标公式。

## 常用片段

```bash
pnpm exec sch snippet append results --file slides.md
pnpm exec sch snippet append block --file slides.md
```

同类结果反复出现时，使用 MetricGrid 或 EvidenceBlock 统一排版，不必每页重新搭建内容框。

## 主题模式与对比度

结果页需要图表和表格保持高对比。建议使用 `contentMode: light` 搭配
`chromeMode: match`，投影图表细节不足时使用 `high-contrast`。详见[主题模式与对比度](../theme-mode-contrast)。
