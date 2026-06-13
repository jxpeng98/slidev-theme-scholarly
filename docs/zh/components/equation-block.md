---
title: EquationBlock
---

# EquationBlock

`EquationBlock` 为公式添加标题、标签、编号和说明，使公式与周围论证保持清晰关联，同时继续使用主题语义 token。

![EquationBlock 示例](/images/components/equation-block.png)

## 基本用法

```markdown
<EquationBlock title="Training Objective" reference="1" caption="监督损失与 routing 损失的加权组合">

$$
\mathcal{L} = \mathcal{L}_{task} + \lambda \mathcal{L}_{routing}
$$

</EquationBlock>
```

## 非编号引用

```markdown
<EquationBlock label="Update" title="Routing score" reference="Appendix A" :numbered="false">

$$
s_i = \operatorname{softmax}(W h_i)
$$

</EquationBlock>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 公式标题 |
| `label` | `string` | `'Equation'` | 标题前的小标签 |
| `caption` | `string` | - | 公式下方说明 |
| `reference` | `string \| number` | - | 公式编号或引用标记 |
| `numbered` | `boolean` | `true` | 是否将引用数字包在括号中 |
| `compact` | `boolean` | `false` | 使用更紧凑的间距 |
