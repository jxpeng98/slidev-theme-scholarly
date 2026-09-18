---
title: ContributionList
---

# ContributionList

`ContributionList` 按顺序列出研究贡献，并可在每项后补充证据，适合论文概览或贡献总结页。

![ContributionList 示例](/images/components/contribution-list.png)

## 基本用法

```markdown
<ContributionList title="主要贡献" :items="[
  { title: '高效适配', description: '在微调前加入轻量路由模块。', evidence: '准确率提高 3.2 个百分点' },
  { title: '部署成本稳定', description: '推理时保持基础表征固定。', evidence: '吞吐预算不变' },
  { title: '结果可复现', description: '所有实验报告 5 次随机种子平均值。', evidence: '见附录 B' }
]" />
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 区块标题 |
| `label` | `string` | `'Contributions'` | 标题上方的小标签 |
| `items` | `ContributionItem[]` | `[]` | 贡献条目 |
| `ordered` | `boolean` | `true` | 是否显示数字标记 |
| `variant` | `string` | `'primary'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用紧凑间距 |

`ContributionItem` 支持 `title`、`description` 和 `evidence`。
