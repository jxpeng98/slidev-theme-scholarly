---
title: MetricCard
---

# MetricCard

`MetricCard` presents one result metric with an optional unit, delta, and short caption. It is useful for paper talks where one number needs to stay readable without taking over the slide.

![MetricCard example](/images/components/metric-card.png)

## Basic Usage

```markdown
<MetricCard
  label="Accuracy"
  value="94.7"
  unit="%"
  delta="+3.2"
  caption="Five-seed average against the supervised baseline"
  variant="success"
/>
```

## With Body Content

```markdown
<MetricCard label="Latency" value="18" unit="ms" delta="-12%" variant="info">
Measured on one A100 with batch size 32.
</MetricCard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Short metric label |
| `value` | `string \| number` | required | Main value |
| `unit` | `string` | - | Unit shown after the value |
| `delta` | `string` | - | Comparison or change note |
| `caption` | `string` | - | Supporting note below the value |
| `variant` | `string` | `'primary'` | `primary`, `success`, `warning`, `danger`, or `info` |
| `trend` | `string` | `'flat'` | `up`, `down`, or `flat` delta semantics |
| `compact` | `boolean` | `false` | Reduce spacing for dense slides |
