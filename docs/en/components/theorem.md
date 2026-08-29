---
title: Theorem
---

# Theorem

## When to use it

Use `Theorem` for theorems, lemmas, definitions, proofs, and other formal statements. It includes:

- Automatic numbering
- Consistent styling
- English and Chinese labels

### Basic Usage

```markdown
<Theorem type="theorem" title="Pythagorean Theorem">

For a right triangle with legs $a$ and $b$, and hypotenuse $c$:

$$a^2 + b^2 = c^2$$

</Theorem>
```

The rendered heading is “Theorem 1 (Pythagorean Theorem).”

### Available Types

Each type uses a distinct color:

| Type | English | Chinese | Color |
|------|---------|---------|-------|
| `theorem` | Theorem | 定理 | Blue |
| `lemma` | Lemma | 引理 | Purple |
| `proposition` | Proposition | 命题 | Cyan |
| `corollary` | Corollary | 推论 | Green |
| `definition` | Definition | 定义 | Amber |
| `example` | Example | 例 | Pink |
| `remark` | Remark | 注 | Gray |
| `proof` | Proof | 证明 | Slate |
| `note` | Note | 注意 | Sky |
| `claim` | Claim | 断言 | Indigo |

`proof` and `note` are rendered without automatic numbering by default. `claim` participates in the same auto-numbering flow as the other numbered theorem types.

### Examples

**Simple theorem:**

```markdown
<Theorem type="theorem">

Every bounded sequence has a convergent subsequence.

</Theorem>
```

**Theorem with title:**

```markdown
<Theorem type="definition" title="Continuity">

A function $f$ is continuous at $x = a$ if...

</Theorem>
```

**Manual numbering:**

```markdown
<Theorem type="lemma" number="3.2">

This lemma appears as "Lemma 3.2" instead of using an automatic number.

</Theorem>
```

**No numbering:**

```markdown
<Theorem type="remark" :autoNumber="false">

This remark has no number.

</Theorem>
```

**Content only, without the header label:**

```markdown
<Theorem type="note" :showHeader="false">

The original cash payment was real, but the **expense for this year** is only the part that has been consumed.

</Theorem>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | `'theorem'` | Statement type listed above |
| `number` | `string \| number` | automatic | Explicit display number |
| `title` | `string` | - | Optional title after the type and number |
| `autoNumber` | `boolean` | `true` | Enables automatic numbering for supported types |
| `compact` | `boolean` | `false` | Reduces margins, padding, and heading size |
| `showHeader` | `boolean` | `true` | Hides the type, number, and title row when false |
