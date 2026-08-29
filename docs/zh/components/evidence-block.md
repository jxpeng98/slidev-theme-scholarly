---
title: EvidenceBlock
---

# EvidenceBlock

`EvidenceBlock` 把结论和对应的证据、来源、可信度说明放在一起。

![EvidenceBlock 示例](/images/components/evidence-block.png)

## 基本用法

```markdown
<EvidenceBlock
  title="消融实验支持路由模块"
  label="证据"
  source="表 3"
  confidence="5 次随机种子"
  variant="success"
>

- 移除路由模块后，准确率下降 2.1 个百分点。
- 吞吐量仍保持在同一部署预算内。

</EvidenceBlock>
```

## 底部插槽

```markdown
<EvidenceBlock title="在中等分布偏移下保持稳定" source="附录 B">
所有偏移域上的 Macro F1 均高于基线。

<template #footer>
适用范围：使用相同预处理流程的有标签适配任务。
</template>
</EvidenceBlock>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `string` | `'Evidence'` | 标题上方的小标签 |
| `title` | `string` | - | 证据标题或结论 |
| `source` | `string` | - | 表格、图、附录或数据来源 |
| `confidence` | `string` | - | 随机种子数量、区间或适用范围 |
| `variant` | `string` | `'primary'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用更紧凑的间距 |
