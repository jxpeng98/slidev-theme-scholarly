---
title: Theorem
---

# 定理组件

## 适用场景

`Theorem` 用统一的格式展示定理、引理、定义和证明，并提供：

- 自动编号
- 与主题一致的样式
- 中英文标签

### 基本用法

```markdown
<Theorem type="theorem" title="勾股定理">

对于直角三角形，设两条直角边为 $a$ 和 $b$，斜边为 $c$：

$$a^2 + b^2 = c^2$$

</Theorem>
```

最终显示的标题是“定理 1（勾股定理）”，下方紧接定理正文。

### 可用类型

每种类型都有不同的颜色：

| 类型 | 中文 | 英文 | 颜色 |
|------|------|------|------|
| `theorem` | 定理 | Theorem | 蓝色 |
| `lemma` | 引理 | Lemma | 紫色 |
| `proposition` | 命题 | Proposition | 青色 |
| `corollary` | 推论 | Corollary | 绿色 |
| `definition` | 定义 | Definition | 琥珀色 |
| `example` | 例 | Example | 粉色 |
| `remark` | 注 | Remark | 灰色 |
| `proof` | 证明 | Proof | 石板灰 |
| `note` | 注意 | Note | 天蓝色 |
| `claim` | 断言 | Claim | 靛蓝色 |

默认情况下，`proof` 和 `note` 不参与自动编号；`claim` 会和其他可编号类型一样参与自动编号。

### 示例

**简单定理：**

```markdown
<Theorem type="theorem">

每个有界序列都有一个收敛子序列。

</Theorem>
```

**带标题的定理：**

```markdown
<Theorem type="definition" title="连续性">

如果函数 $f$ 在 $x = a$ 处连续，那么……

</Theorem>
```

**手动编号：**

```markdown
<Theorem type="lemma" number="3.2">

这条引理会显示为“引理 3.2”，不再使用自动编号。

</Theorem>
```

**无编号：**

```markdown
<Theorem type="remark" :autoNumber="false">

这条注记不显示编号。

</Theorem>
```

**只显示内容，不显示标题行：**

```markdown
<Theorem type="note" :showHeader="false">

原始支付金额是真实发生的，但**本年度费用**只应计入已经消耗的部分。

</Theorem>
```

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `type` | `string` | `'theorem'` | 上表列出的陈述类型 |
| `number` | `string \| number` | 自动编号 | 显式指定显示编号 |
| `title` | `string` | - | 类型和编号之后的可选标题 |
| `autoNumber` | `boolean` | `true` | 为支持的类型启用自动编号 |
| `compact` | `boolean` | `false` | 减小外边距、内边距和标题字号 |
| `showHeader` | `boolean` | `true` | 设为 false 时隐藏类型、编号和标题行 |
