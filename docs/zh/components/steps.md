---
title: Steps
---

# Steps 组件

`Steps` 按顺序展示流程，并可突出当前步骤。

## 基本用法

```markdown
<Steps :steps="[
  { title: '步骤 1', description: '第一步说明' },
  { title: '步骤 2', description: '第二步说明' },
  { title: '步骤 3', description: '第三步说明' }
]" />
```

也可以写成 Markdown 指令：

```markdown
:::steps{:steps='[{"title":"步骤 1","description":"说明"}]' :activeStep="1"}:::
```

## 示例

### 研究工作流程

```markdown
<Steps :steps="[
  { title: '数据收集', description: '收集并预处理数据集' },
  { title: '模型设计', description: '设计高效的架构' },
  { title: '训练', description: '使用优化的流程训练' },
  { title: '评估', description: '与基线对比' }
]" :activeStep="2" />
```

### 简单步骤

```markdown
<Steps :steps="[
  { title: '引言' },
  { title: '方法' },
  { title: '结果' },
  { title: '结论' }
]" />
```

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `steps` | `Array<{title: string, description?: string}>` | `[]` | 步骤对象数组 |
| `activeStep` | `number` | - | 当前激活的步骤（从 1 开始）。不传表示无 |
