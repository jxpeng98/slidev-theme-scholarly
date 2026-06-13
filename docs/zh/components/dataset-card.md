---
title: DatasetCard
---

# DatasetCard

`DatasetCard` 用于概括数据集的任务、规模、划分、来源和许可信息。适合在实验设置、benchmark 或数据来源页中使用。

![DatasetCard 示例](/images/components/dataset-card.png)

## 基本用法

```markdown
<DatasetCard
  name="AcademicBench"
  description="用于高效科学模型适配的 curated benchmark。"
  task="Classification"
  samples="12k"
  features="128"
  split="70 / 15 / 15"
  source="Internal benchmark"
  license="Research use"
/>
```

## 带说明内容

```markdown
<DatasetCard name="RobustBench-Shift" task="Domain shift" samples="8.4k" split="5 folds">
所有样本使用与主 benchmark 相同的预处理流程。
</DatasetCard>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | 必填 | 数据集名称 |
| `label` | `string` | `'Dataset'` | 名称上方的小标签 |
| `description` | `string` | - | 数据集简介 |
| `task` | `string` | - | 任务或模态 |
| `samples` | `string \| number` | - | 样本数量或规模 |
| `features` | `string \| number` | - | 特征、模态或字段数量 |
| `split` | `string` | - | 训练/验证/测试划分 |
| `source` | `string` | - | 来源 benchmark 或仓库 |
| `license` | `string` | - | 许可或访问限制 |
| `variant` | `string` | `'primary'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用紧凑间距 |
