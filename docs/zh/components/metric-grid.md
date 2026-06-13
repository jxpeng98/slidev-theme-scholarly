---
title: MetricGrid
---

# MetricGrid

`MetricGrid` 将多个 `MetricCard` 组织成紧凑的响应式网格。它适合结果摘要、消融实验或实验概览页。

![MetricGrid 示例](/images/components/metric-grid.png)

## 基本用法

```markdown
<MetricGrid :columns="3" :metrics="[
  { label: 'Accuracy', value: '94.7', unit: '%', delta: '+3.2', variant: 'success' },
  { label: 'Latency', value: '18', unit: 'ms', delta: '-12%', variant: 'info' },
  { label: 'Energy', value: '-28', unit: '%', delta: 'per sample', variant: 'primary' }
]" />
```

## 混合自定义卡片

```markdown
<MetricGrid :columns="2">
  <MetricCard label="Macro F1" value="91.2" unit="%" delta="+1.4" variant="success" />
  <MetricCard label="Calibration" value="0.04" unit="ECE" caption="越低越好" />
</MetricGrid>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `metrics` | `MetricItem[]` | `[]` | 需要渲染为卡片的指标对象 |
| `columns` | `number \| string` | `3` | 列数，范围限制为 1 到 4 |
| `gap` | `string \| number` | `'0.75rem'` | 卡片间距 |
| `variant` | `string` | `'primary'` | 默认卡片样式 |
| `compact` | `boolean` | `false` | 使用紧凑卡片间距 |
