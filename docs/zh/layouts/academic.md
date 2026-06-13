---
title: 学术布局
---

# 学术布局

专为学术演示设计的布局 - 研究方法、结果、对比和参考文献。

## paper-summary - 论文摘要

**用于：** 汇总单篇论文的元信息、问题、方法和主要发现。

```markdown
---
layout: paper-summary
paperTitle: Efficient Adaptation for Scientific Models
authors:
  - A. Smith
  - B. Lee
venue: ICML
year: 2026
keywords:
  - efficient learning
  - adaptation
---

::problem::
已有适配方法提升了准确率，但增加了计算成本。

::method::
论文在微调前加入轻量路由阶段。

::finding::
准确率提升 3.2 个点，同时不增加推理成本。
```

**属性：**
- `paperTitle`：摘要头部展示的论文标题
- `authors`：作者字符串或作者数组
- `venue`、`year`、`doi`、`status`：可选元信息
- `keywords`：主题标签字符串或数组
- `problemLabel`、`methodLabel`、`findingLabel`：覆盖三张摘要卡片标题

---

## related-work-matrix - 相关工作矩阵

**用于：** 在介绍贡献前，对比已有工作、方法假设和研究空白。

```markdown
---
layout: related-work-matrix
title: 相关工作
description: 将当前工作放到已有方法谱系中定位。
---

| 工作 | 设置 | 方法 | 局限 |
| --- | --- | --- | --- |
| Smith et al. 2024 | 基准任务 | Transformer baseline | 计算成本高 |
| 本文 | 同一基准 | **高效适配** | 需要任务标签 |

::notes::
用矩阵先说明研究空白，再进入方法页。
```

**属性：**
- `title`、`subtitle`：可选页眉
- `heading`：页面内主标题
- `description`：矩阵上方的简短说明
- `note`：不使用 `notes` slot 时的可选说明

---

## method-pipeline - 方法流程

**用于：** 以有序步骤展示研究流程，并可突出当前步骤。

```markdown
---
layout: method-pipeline
title: 方法流程
activeStep: 2
steps:
  - title: Collect
    description: 整理数据集和约束
    detail: N=12k samples
  - title: Model
    description: 训练提出的模型结构
    detail: 3 ablations
  - title: Validate
    description: 与基线比较
    detail: 5 seeds
---

可以在这里补充假设、控制变量或可复现性说明。
```

**属性：**
- `steps`：`{ title, description, detail }` 数组
- `activeStep`：要强调的步骤序号，从 1 开始
- `heading`、`description`、`eyebrow`：页面内文字控制

---

## result-highlight - 结果强调

**用于：** 先给出一个核心结果，再用证据或限制说明支撑它。

```markdown
---
layout: result-highlight
title: 主要结果
heading: 我们的方法在不增加计算量的情况下提升准确率
label: Accuracy
metric: 94.7
unit: "%"
delta: +3.2 over baseline
baseline: 5-seed average
variant: success
---

- 解释这个结果意味着什么。
- 说明对比对象或基准。

::evidence::
- Dataset: AcademicBench
- Baseline: strong supervised model
```

**属性：**
- `metric`、`unit`、`label`：主指标区域
- `delta`、`baseline`：指标下方的上下文标签
- `variant`：`primary`、`success`、`warning`、`danger` 或 `info`
- `heading`、`description`、`eyebrow`：结论文字控制

---

## compare - 并排对比

**用于：** 用带标签的双栏对比两种方法、方案或概念

![并排对比布局示例](/images/layouts/compare.png)

```markdown
---
layout: compare
title: 传统方法 vs. 我们的方法
leftLabel: 传统方法
rightLabel: 我们的方法
leftColor: red
rightColor: green
---

### 局限性
- 计算成本高
- 训练时间长

::right::

### 优势
- 计算量减少 50%
- 训练速度提升 3 倍
```

**属性：**
- `title`：主标题
- `subtitle`：可选副标题
- `leftLabel`、`rightLabel`：列标签
- `leftColor`、`rightColor`：`red`、`green`、`blue`、`amber`、`purple`

---

## methodology - 研究方法

**用于：** 用于展示研究方法和图表的双栏布局

![研究方法布局示例](/images/layouts/methodology.png)

```markdown
---
layout: methodology
ratio: "1:1"
title: 研究方法
---

## 我们的方法

1. 数据收集
2. 特征提取
3. 模型训练

::right::

![图表](./diagram.png)
```

**属性：**
- `ratio`：列比例（默认："1:1"）
- `title`、`subtitle`：页眉内容

---

## results - 结果仪表板

**用于：** 用于显示多个指标或结果的网格布局

![结果仪表板布局示例](/images/layouts/results.png)

```markdown
---
layout: results
cols: 2
title: 主要结果
---

<div class="p-4 bg-white rounded shadow">
  <h3>准确率</h3>
  <h1>94.7%</h1>
</div>

<div class="p-4 bg-white rounded shadow">
  <h3>速度</h3>
  <h1>2.3x</h1>
</div>
```

**属性：**
- `cols`：列数（默认：2）
- `title`、`subtitle`：页眉内容

---

## timeline - 研究时间线

**用于：** 以垂直时间线格式显示研究进展或历史事件

![研究时间线布局示例](/images/layouts/timeline.png)

```markdown
---
layout: timeline
title: 研究时间线
items:
  - year: "2020"
    title: 初步研究
    description: 开始探索问题空间
  - year: "2021"
    title: 方法论开发
    description: 开发核心算法
  - year: "2022"
    title: 验证
    description: 进行实验
---
```

**属性：**
- `title`：时间线上方的可选标题
- `items`：带有 `year`、`title` 和 `description` 的时间线项目数组

---

## agenda - 议程概览

**用于：** 展示演示大纲或会议议程

![议程概览布局示例](/images/layouts/agenda.png)

```markdown
---
layout: agenda
title: 今日议程
items:
  - 简介和背景
  - 方法概述
  - 实验结果
  - 讨论和未来工作
---
```

**属性：**
- `title`：议程标题（默认："Agenda"）
- `items`：议程项目字符串数组

---

## acknowledgments - 致谢

**用于：** 显示资助来源和合作者

![致谢布局示例](/images/layouts/acknowledgments.png)

```markdown
---
layout: acknowledgments
title: 致谢
funders:
  - 国家自然科学基金
  - 科技部
collaborators:
  - 清华大学人工智能实验室
  - 北京大学计算机系
---

特别感谢所有贡献者。
```

**属性：**
- `title`：章节标题（默认："Acknowledgments"）
- `funders`：资助组织名称数组
- `collaborators`：合作者名称数组

---

## references - 参考文献

**用于：** 以学术格式显示参考文献。自动从 BibTeX 引用生成参考文献。

![参考文献布局示例](/images/layouts/references.png)

```markdown
---
layout: references
---
```

**对于较长的参考文献列表，使用分页：**

```markdown
---
layout: references
perPage: 5
page: 1
---

---
layout: references
perPage: 5
page: 2
title: "参考文献（续）"
---
```

如果你想把 bibliography 放在该页里的某个精确位置，可以手动在对应位置写 `[[bibliography]]`。

**手动参考文献（不使用 BibTeX）：**

```markdown
---
layout: references
---

1. **张三等** (2024). *高效深度学习*. 自然机器智能.

2. **李四和王五** (2023). *绿色 AI*. ICML.

3. **陈某等** (2023). *边缘计算*. NeurIPS.
```

**属性：**

- `page`：当前页码（用于分页）
- `perPage`：每页参考文献数量
- `title`：自定义标题（默认："参考文献"或"参考文献（续）"）

**特点：**

- 自动编号的参考文献样式
- 简洁的学术排版
- 根据内容自动调整字体大小
