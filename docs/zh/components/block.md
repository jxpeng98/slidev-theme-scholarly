---
title: Block
---

# Block 组件

`Block` 用统一的视觉层级组织提示、结论、示例和警告。

## 基本用法

```markdown
<Block type="info" title="重要提示">

这里填写正文内容。

</Block>
```

也可以写成 Markdown 指令：

```markdown
:::block{type="info" title="重要提示"}
这里填写正文内容。
:::
```

## 可用类型

| 类型 | 颜色 | 用途 |
|------|------|------|
| `default` | 灰色 | 一般信息 |
| `info` | 蓝色 | 信息内容 |
| `success` | 绿色 | 正面结果 |
| `warning` | 黄色 | 警告 |
| `danger` | 红色 | 严重警告 |
| `example` | 青色 | 示例 |
| `alert` | 粉色 | 提醒 |

## 示例

### 信息块

```markdown
:::block{type="info" title="研究发现"}
我们的研究显示准确率有显著提升。
:::
```

### 警告块

```markdown
:::block{type="warning" title="局限性"}
这种方法需要大量训练数据。
:::
```

### 示例块

```markdown
:::block{type="example" title="案例研究"}
考虑函数 $f(x) = x^2$。
:::
```

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `type` | `string` | `'default'` | 块样式类型 |
| `title` | `string` | - | 可选的标题 |
| `compact` | `boolean` | `false` | 减小外边距和内边距 |
