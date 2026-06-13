---
title: MetricCard
---

# MetricCard

`MetricCard` 用于展示单个关键结果指标，可带单位、变化量和简短说明。适合论文汇报中需要突出一个数字，但又不希望整页只剩一个大数字的场景。

![MetricCard 示例](/images/components/metric-card.png)

## 基本用法

```markdown
<MetricCard
  label="Accuracy"
  value="94.7"
  unit="%"
  delta="+3.2"
  caption="相对监督基线的 5 次随机种子平均结果"
  variant="success"
/>
```

## 使用正文插槽

```markdown
<MetricCard label="Latency" value="18" unit="ms" delta="-12%" variant="info">
在单张 A100、batch size 32 下测量。
</MetricCard>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `string` | - | 指标标签 |
| `value` | `string \| number` | 必填 | 主指标值 |
| `unit` | `string` | - | 单位 |
| `delta` | `string` | - | 对比或变化说明 |
| `caption` | `string` | - | 指标下方说明 |
| `variant` | `string` | `'primary'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `trend` | `string` | `'flat'` | `up`、`down` 或 `flat` |
| `compact` | `boolean` | `false` | 使用更紧凑的间距 |
