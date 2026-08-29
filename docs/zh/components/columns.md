---
title: Columns
---

# Columns 组件

`Columns` 将正文分成两至四列，适合并列比较或组织相关内容。

## 基本用法

```markdown
<Columns :columns="2">
  
第一列内容

<template #col2>

第二列内容

</template>

</Columns>
```

也可以写成 Markdown 指令：

```markdown
:::columns{columns="2" gap="2rem"}
第一列内容
+++
第二列内容
:::
```

## 示例

### 两列

```markdown
:::columns{columns="2"}
## 方法 A
- 优势 1
- 优势 2
+++
## 方法 B
- 优势 1
- 优势 2
:::
```

### 三列

```markdown
:::columns{columns="3" gap="1rem"}
### 步骤 1
引言
+++
### 步骤 2
方法
+++
### 步骤 3
结果
:::
```

### 自定义比例

```markdown
<Columns :columns="2" ratio="1:2">
  
窄侧边栏内容

<template #col2>

宽主内容区域

</template>

</Columns>
```

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `columns` | `2 \| 3 \| 4` | `2` | 列数（别名：`cols`） |
| `gap` | `string \| number` | `'1.5rem'` | 列间距。如果传入数字，会被当作 `rem` |
| `ratio` | `string` | - | 列宽比例（如 `'1:2'`、`'1:1:2'`） |
| `balanced` | `boolean` | `false` | 尽量平衡各列的内容高度 |

## 说明

- 命名插槽：`col2`、`col3`、`col4`
- 语法糖会根据 `+++` 分隔的段落数量自动推断 `columns`（最多 4 列）
