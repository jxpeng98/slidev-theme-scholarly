---
title: Keywords
---

# Keywords 组件

`Keywords` 将研究主题或核心概念整理成一组简短标签。

## 基本用法

```markdown
<Keywords :keywords="['机器学习', '深度学习', '神经网络']" />
```

也可以写成 Markdown 指令：

```markdown
:::keywords{:keywords='["机器学习", "深度学习"]' color="blue"}:::
```

## 示例

### 研究关键词

```markdown
<Keywords 
  :keywords="['计算机视觉', '目标检测', 'CNN', '迁移学习']" 
  color="blue" 
/>
```

### 主题标签

```markdown
<Keywords 
  :keywords="['优化', '收敛性', '梯度下降']" 
  color="green" 
/>
```

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `keywords` | `string[]` | `[]` | 关键词字符串数组（别名：`items`） |
| `color` | `string` | `'primary'` | 颜色主题：`primary`、`blue`、`green`、`purple`、`gray` |
