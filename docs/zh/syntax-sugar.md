---
title: 语法糖
---

# 语法糖

语法糖让你用 Markdown 指令调用组件，不必反复书写完整的 Vue 标签。

## 概述

以 `Block` 为例，完整的 Vue 写法是：

```markdown
<Block type="info" title="提示">
这里是内容
</Block>
```

改用 Markdown 指令后，可以写成：

```markdown
:::block{type="info" title="提示"}
这里是内容
:::
```

## 可用语法

### Block（信息块）

```markdown
:::block{type="info" title="标题"}
正文内容……
:::
```

**类型：** `default`、`info`、`success`、`warning`、`danger`、`example`、`alert`

### Theorem（定理）

```markdown
:::theorem{type="theorem" title="定理名称"}
数学内容……
:::
```

**类型：** `theorem`、`lemma`、`proposition`、`corollary`、`definition`、`example`、`remark`

### Highlight（高亮）

```markdown
:::highlight{type="warning"}
需要高亮的文本
:::
```

**类型：** `primary`、`success`、`warning`、`danger`、`info`（旧版别名：`color="yellow|green|blue|pink|purple"`）

### Cite（引用）

```markdown
:::cite{author="张三等" year="2024"}
引用上下文
:::
```

### Steps（步骤）

```markdown
:::steps{:steps='[{"title":"步骤 1","description":"说明"}]' :activeStep="1"}:::
```

### Keywords（关键词）

```markdown
:::keywords{:keywords='["关键词 1", "关键词 2"]' color="blue"}:::
```

### Columns（多列）

使用 `+++` 分隔列：

```markdown
:::columns{columns="2" gap="2rem"}
第一列内容
+++
第二列内容
:::
```

## 完整示例

```markdown
---
layout: default
title: 研究方法
---

## 我们的方法

:::block{type="info" title="核心创新"}
我们提出了一种结合两类方法的新方案。
:::

:::theorem{type="theorem" title="收敛性"}
对于任意 $\epsilon > 0$，算法在 $O(1/\epsilon^2)$ 步内收敛。
:::

:::columns{columns="2"}
### 优势
- 快速收敛
- 低内存使用
+++
### 应用
- 图像分类
- 自然语言处理
:::

:::keywords{:keywords='["深度学习", "优化", "收敛性"]' color="blue"}:::
```

## 注意事项

- 主题会在构建时处理这些 Markdown 指令。
- 指令支持对应组件的全部属性。
- 数组和对象等复杂属性需要使用 Vue 绑定语法 `:prop`。
- 修改语法后需要重启 Slidev。
