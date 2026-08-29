---
title: 组件
description: 在 Scholarly 幻灯片中加入结构化研究内容。
---

# 组件

普通 Markdown 不够用时，再用组件组织定理、指标、证据等内容。

## 按内容选择

| 内容 | 组件 |
|---|---|
| 论点和正式陈述 | [Theorem](./theorem)、[Block](./block)、[Highlight](./highlight) |
| 来源和论文 | [引用](./cite)、[PaperCard](./paper-card) |
| 结果和证据 | [MetricCard](./metric-card)、[MetricGrid](./metric-grid)、[EvidenceBlock](./evidence-block)、[ResultTable](./result-table) |
| 方法和数据 | [EquationBlock](./equation-block)、[DatasetCard](./dataset-card)、[Steps](./steps) |
| 贡献和局限 | [ContributionList](./contribution-list)、[CaveatList](./caveat-list) |
| 页面组织 | [Columns](./columns)、[Keywords](./keywords)、[ThemePreview](./theme-preview) |

## 使用组件

组件可以包裹 Markdown 内容：

```markdown
<Theorem type="theorem" title="勾股定理">

对于直角三角形，$a^2 + b^2 = c^2$。

</Theorem>
```

组件也可以通过属性接收数据：

```markdown
<MetricCard label="准确率" value="94.7" unit="%" />
```

每个组件页面都提供属性说明和完整示例。如果希望进一步缩短写法，请查看[语法糖](../syntax-sugar)。
