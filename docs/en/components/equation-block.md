---
title: EquationBlock
---

# EquationBlock

`EquationBlock` wraps an equation with a title, label, reference number, and caption. It keeps math blocks visually connected to the surrounding argument without relying on raw color styling.

![EquationBlock example](/images/components/equation-block.png)

## Basic Usage

```markdown
<EquationBlock title="Training Objective" reference="1" caption="Weighted supervised and routing losses">

$$
\mathcal{L} = \mathcal{L}_{task} + \lambda \mathcal{L}_{routing}
$$

</EquationBlock>
```

## Unnumbered Reference

```markdown
<EquationBlock label="Update" title="Routing score" reference="Appendix A" :numbered="false">

$$
s_i = \operatorname{softmax}(W h_i)
$$

</EquationBlock>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Equation title |
| `label` | `string` | `'Equation'` | Small label before the title |
| `caption` | `string` | - | Caption below the equation |
| `reference` | `string \| number` | - | Number or reference marker |
| `numbered` | `boolean` | `true` | Wrap numeric references in parentheses |
| `compact` | `boolean` | `false` | Reduce spacing for dense slides |
