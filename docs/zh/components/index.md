---
title: 组件
---

# 组件

本主题为学术演示提供多种组件。

## 定理组件

在学术演示中, 你经常需要展示正式的陈述, 如定理, 引理或定义. 这个主题提供了一个特殊的组件, 可以：

- 自动为定理编号
- 专业的样式设计
- 支持多种语言

### 基本用法

```markdown
<Theorem type="theorem" title="勾股定理">

对于直角三角形, 设两直角边为 $a$ 和 $b$, 斜边为 $c$：

$$a^2 + b^2 = c^2$$

</Theorem>
```

**结果：** 一个格式精美的框, 标题为"定理 1（勾股定理）", 内部是你的内容.

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

### 示例

**简单定理：**

```markdown
<Theorem type="theorem">

每个有界序列都有一个收敛的子序列.

</Theorem>
```

**带标题的定理：**

```markdown
<Theorem type="definition" title="连续性">

函数 $f$ 在 $x = a$ 处连续, 如果...

</Theorem>
```

**手动编号：**

```markdown
<Theorem type="lemma" number="3.2">

这将被编号为"引理 3.2", 而不是自动编号.

</Theorem>
```

**无编号：**

```markdown
<Theorem type="remark" :autoNumber="false">

此注记没有编号.

</Theorem>
```

---

## 其他组件

更多组件文档：

- [Block](./block.md) - Beamer 风格彩色块
- [Steps](./steps.md) - 工作流程可视化
- [Keywords](./keywords.md) - 关键词标签
- [Columns](./columns.md) - 多列布局
- [Highlight](./highlight.md) - 文本高亮
- [MetricCard](./metric-card.md) - 单个关键指标
- [MetricGrid](./metric-grid.md) - 结果指标网格
- [EvidenceBlock](./evidence-block.md) - 证据、来源和可信度说明
- [EquationBlock](./equation-block.md) - 带标题、编号和说明的公式块
- [DatasetCard](./dataset-card.md) - 数据集规模、划分、任务和来源摘要
- [PaperCard](./paper-card.md) - 论文元数据和贡献摘要
- [ContributionList](./contribution-list.md) - 带证据的贡献列表
- [CaveatList](./caveat-list.md) - 局限性和缓解方案
- [Cite](./cite.md) - 学术引用
- [ThemePreview](./theme-preview.md) - 主题配色预览
