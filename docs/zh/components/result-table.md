---
title: ResultTable
---

# ResultTable

如果要在小型基准测试或消融实验中呈现精确数值，`ResultTable` 比图表更合适。

![ResultTable 组件示例](/images/components/result-table.png)

## 基本用法

```markdown
<ResultTable
  caption="五个随机种子的基准结果"
  :columns="[
    { key: 'model', label: '模型' },
    { key: 'accuracy', label: '准确率（%）', align: 'right' },
    { key: 'latency', label: '延迟（ms）', align: 'right' }
  ]"
  :rows="[
    { model: '基线', accuracy: 91.5, latency: 24 },
    { model: '本文方法', accuracy: 94.7, latency: 18 }
  ]"
  highlightColumn="accuracy"
/>
```

省略 `columns` 时，组件会根据对象键或数组位置生成列。数组行需要可读列名时，
请显式提供 `columns`。数据为空时，组件会显示数据源提示，不会留下无说明的空白。

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `rows` | `Array<object \| array>` | `[]` | 对象行或按位置排列的数组行 |
| `columns` | `Array<string \| object>` | 自动推断 | 列顺序和列配置 |
| `caption` | `string` | - | 表格上方的简短说明 |
| `compact` | `boolean` | `false` | 减小外边距、字号和单元格内边距 |
| `highlightColumn` | `string \| number` | - | 需要强调的列键或从 0 开始的列序号 |

列对象支持 `key`、可选的 `label`、`align`（`left`、`center` 或 `right`），
以及可选的 `format(value, row)` 函数。
