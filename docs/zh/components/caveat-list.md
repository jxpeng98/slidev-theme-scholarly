---
title: CaveatList
---

# CaveatList

`CaveatList` 把研究局限和对应的应对方式放在一起，适合结果页、答辩页，以及其他需要说明结论边界的页面。

![CaveatList 示例](/images/components/caveat-list.png)

## 基本用法

```markdown
<CaveatList title="适用边界" mitigationLabel="应对方式" :items="[
  { title: '需要标注数据', description: '这种方法假设目标任务包含标注样本。', mitigation: '单独报告小样本条件下的敏感性。' },
  { title: '难以应对严重偏移', description: '严重分布偏移仍需要校准。', mitigation: '单独报告偏移域上的评估结果。' }
]" />
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 区块标题 |
| `label` | `string` | `'Caveats'` | 标题上方的小标签 |
| `items` | `CaveatItem[]` | `[]` | 局限性条目 |
| `mitigationLabel` | `string` | `'Mitigation'` | 应对方式前的标签 |
| `variant` | `string` | `'warning'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用紧凑间距 |

`CaveatItem` 支持 `title`、`description` 和 `mitigation`。
