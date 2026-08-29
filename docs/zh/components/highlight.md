---
title: Highlight
---

# Highlight 组件

`Highlight` 强调句子中的短语或关键数字，不适合包裹整段文字。

## 基本用法

```markdown
这是你幻灯片中的 <Highlight>重要文本</Highlight>。
```

也可以写成 Markdown 指令：

```markdown
:::highlight{type="warning"}
需要高亮的重要文本
:::
```

## 示例

### 不同类型

```markdown
<Highlight type="primary">主要高亮</Highlight>

<Highlight type="success">成功高亮</Highlight>

<Highlight type="warning">警告高亮</Highlight>

<Highlight type="danger">危险高亮</Highlight>

<Highlight type="info">信息高亮</Highlight>
```

### 在上下文中使用

```markdown
我们的方法达到了 <Highlight type="success">94.7% 的准确率</Highlight>，
这 <Highlight type="warning">显著优于</Highlight> 基线方法。
```

### 旧版 `color` 别名

为兼容旧写法，仍支持 `color`，并会映射到 `type`：

- `yellow` → `warning`
- `green` → `success`
- `blue` → `info`
- `pink` → `danger`
- `purple` → `primary`

```markdown
<Highlight color="yellow">黄色高亮</Highlight>
```

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `type` | `string` | `'primary'` | 高亮类型：`primary`、`success`、`warning`、`danger`、`info` |
| `color` | `string` | - | `type` 的旧版别名：`yellow`、`green`、`blue`、`pink`、`purple` |
