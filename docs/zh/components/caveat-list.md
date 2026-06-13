---
title: CaveatList
---

# CaveatList

`CaveatList` 用于展示局限性和对应缓解方案。它适合结果页、答辩页或需要明确 claim 边界的页面。

![CaveatList 示例](/images/components/caveat-list.png)

## 基本用法

```markdown
<CaveatList title="Boundary Conditions" mitigationLabel="缓解" :items="[
  { title: 'Labeled tasks required', description: '方法假设目标任务存在有标签样本。', mitigation: '单独报告 few-shot sensitivity。' },
  { title: 'Severe shift remains hard', description: '严重分布偏移仍需要校准。', mitigation: '将 shifted-domain evaluation 作为独立 claim。' }
]" />
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 区块标题 |
| `label` | `string` | `'Caveats'` | 标题上方的小标签 |
| `items` | `CaveatItem[]` | `[]` | 局限性条目 |
| `mitigationLabel` | `string` | `'Mitigation'` | mitigation 文本前的标签 |
| `variant` | `string` | `'warning'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用紧凑间距 |

`CaveatItem` 支持 `title`、`description` 和 `mitigation`。
