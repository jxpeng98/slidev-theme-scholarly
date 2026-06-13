---
title: ContributionList
---

# ContributionList

`ContributionList` 用于展示带编号的贡献点，并可附带证据标记。适合 title 附近的 contribution slide 或论文摘要页。

![ContributionList 示例](/images/components/contribution-list.png)

## 基本用法

```markdown
<ContributionList title="Main Contributions" :items="[
  { title: 'Efficient adaptation', description: '在 fine-tuning 前加入轻量 routing。', evidence: '+3.2 accuracy points' },
  { title: 'Stable deployment cost', description: '推理时保持 base representation 固定。', evidence: 'Same throughput budget' },
  { title: 'Reproducible evaluation', description: '所有实验报告 5 次随机种子平均值。', evidence: 'Appendix B' }
]" />
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 区块标题 |
| `label` | `string` | `'Contributions'` | 标题上方的小标签 |
| `items` | `ContributionItem[]` | `[]` | 贡献条目 |
| `ordered` | `boolean` | `true` | 是否显示数字标记 |
| `variant` | `string` | `'primary'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用紧凑间距 |

`ContributionItem` 支持 `title`、`description` 和 `evidence`。
