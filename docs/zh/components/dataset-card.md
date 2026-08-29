---
title: DatasetCard
---

# DatasetCard

`DatasetCard` 集中说明数据集的任务、规模、划分、来源和许可，适合实验设置或数据来源页。

![DatasetCard 示例](/images/components/dataset-card.png)

## 基本用法

```markdown
<DatasetCard
  name="AcademicBench"
  description="面向科学模型高效适配的整理后基准数据集。"
  task="分类"
  samples="12k"
  features="128"
  split="70 / 15 / 15"
  source="内部基准数据集"
  license="仅限研究使用"
/>
```

## 带说明内容

```markdown
<DatasetCard name="RobustBench-Shift" task="分布偏移" samples="8.4k" split="5 折">
所有样本沿用主基准数据集的预处理流程。
</DatasetCard>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | 必填 | 数据集名称 |
| `label` | `string` | `'Dataset'` | 名称上方的小标签 |
| `description` | `string` | - | 数据集简介 |
| `task` | `string` | - | 任务或模态 |
| `samples` | `string \| number` | - | 样本数量或规模 |
| `features` | `string \| number` | - | 特征、模态或字段数量 |
| `split` | `string` | - | 训练/验证/测试划分 |
| `source` | `string` | - | 来源基准或仓库 |
| `license` | `string` | - | 许可或访问限制 |
| `variant` | `string` | `'primary'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用紧凑间距 |
