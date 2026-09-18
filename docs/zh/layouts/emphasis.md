---
title: 强调布局
---

# 强调布局

这些布局让引用、数字和关键结论成为页面焦点。

## quote - 引用 {#quote}

**适合：** 展示需要单独强调的引用

![引用布局示例](/images/layouts/quote.png)

```markdown
---
layout: quote
author: 研究团队
source: 示例研究笔记
---

报告结果时，也要说明它成立的条件。
```

**属性：**
- `author`：引用出处
- `source`：引用来源（书籍、演讲等）

**显示内容：**

- 大字号、带装饰性引号的样式化引用
- 下方的出处

---

## fact - 单个统计数据 {#fact}

**适合：** 突出一个重要数字或事实

![单个统计数据布局示例](/images/layouts/fact.png)

```markdown
---
layout: fact
color: green
---

# 94.7%

基准数据集上的准确率
```

**属性：**
- `color`：`primary`、`blue`、`green`、`amber`、`red`、`purple`（默认：`primary`）

**显示内容：**

- 大字号数字
- 下方较小的描述
- 简洁的装饰元素

---

## statement - 重要陈述 {#statement}

**适合：** 需要听众记住的一句话

![重要陈述布局示例](/images/layouts/statement.png)

```markdown
---
layout: statement
---

# 说明结论，也说明适用范围

交代证据在什么条件下支持这一结论。
```

**属性：**
- `author`：署名文本（可选）

**显示内容：**

- 大字号陈述文本，居中
- 装饰性引号
- 中等宽度以提高可读性

---

## focus - 聚焦陈述 {#focus}

**适合：** 聚焦一个重要陈述或问题

![聚焦陈述布局示例](/images/layouts/focus.png)

```markdown
---
layout: focus
color: blue
icon: 🎯
---

# 研究问题

如何在降低计算成本的同时提高模型准确率？
```

**属性：**
- `color`：`blue`、`green`、`amber`、`red`、`purple`（默认：`blue`）
- `icon`：任何表情符号或文本（默认：无）

**显示内容：**

- 大图标（如果指定）
- 颜色强调的主要信息
- 下方的支持文本
