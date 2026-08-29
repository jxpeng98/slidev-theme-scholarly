---
title: MetricGrid
---

# MetricGrid

`MetricGrid` 将多个 `MetricCard` 排成响应式网格，适合汇总结果、消融实验和实验概览。

![MetricGrid 示例](/images/components/metric-grid.png)

## 基本用法

```markdown
<MetricGrid :columns="3" :metrics="[
  { label: '准确率', value: '94.7', unit: '%', delta: '+3.2', variant: 'success' },
  { label: '延迟', value: '18', unit: 'ms', delta: '-12%', variant: 'info' },
  { label: '能耗', value: '-28', unit: '%', delta: '每个样本', variant: 'primary' }
]" />
```

## 混合自定义卡片

```markdown
<MetricGrid :columns="2">
  <MetricCard label="宏平均 F1" value="91.2" unit="%" delta="+1.4" variant="success" />
  <MetricCard label="校准误差" value="0.04" unit="ECE" caption="越低越好" />
</MetricGrid>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `metrics` | `MetricItem[]` | `[]` | 需要渲染为卡片的指标对象 |
| `columns` | `number \| string` | `3` | 列数，范围限制为 1 到 4 |
| `gap` | `string \| number` | `'0.75rem'` | 卡片间距 |
| `variant` | `string` | `'primary'` | 默认卡片样式 |
| `compact` | `boolean` | `false` | 使用紧凑卡片间距 |
