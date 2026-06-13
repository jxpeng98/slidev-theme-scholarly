---
title: EvidenceBlock
---

# EvidenceBlock

`EvidenceBlock` 将结论、证据、来源和可信度说明放在同一块内容中。它适合论文汇报和答辩页面，让听众快速看到某个 claim 的依据。

![EvidenceBlock 示例](/images/components/evidence-block.png)

## 基本用法

```markdown
<EvidenceBlock
  title="消融实验支持 routing 模块"
  label="Evidence"
  source="Table 3"
  confidence="5 seeds"
  variant="success"
>

- 移除 routing 后准确率下降 2.1 个点。
- 吞吐量仍保持在同一部署预算内。

</EvidenceBlock>
```

## Footer 插槽

```markdown
<EvidenceBlock title="在中等分布偏移下保持稳定" source="Appendix B">
所有 shifted domain 上的 Macro F1 都高于基线。

<template #footer>
适用范围：使用相同预处理流程的有标签适配任务。
</template>
</EvidenceBlock>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `string` | `'Evidence'` | 标题上方的小标签 |
| `title` | `string` | - | 证据标题或结论 |
| `source` | `string` | - | 表格、图、附录或数据来源 |
| `confidence` | `string` | - | 随机种子数量、区间或适用范围 |
| `variant` | `string` | `'primary'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用更紧凑的间距 |
