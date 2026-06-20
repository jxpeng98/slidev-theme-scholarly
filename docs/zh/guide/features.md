---
title: 主要功能
---

# 主要功能

Scholarly 将 Slidev 扩展为面向学术演示的写作环境：结构化布局、可复用研究组件、BibTeX 引用、可读主题预设和编辑器工具。

## 学术演示结构

- 34 个布局预览，覆盖封面、章节、正文、图片、对比、方法、结果、时间线、附录、答辩和参考文献页。
- 自动页眉和页脚样式，支持作者、会议信息、页码和可选的 beamer 风格导航。
- 面向长演示的页脚大纲 TOC，按 `layout: section` 分组。

如果你已经知道页面需要承载什么内容，先从[布局](../layouts/)开始。

## 研究组件

用组件承载重复出现的学术内容，避免在每页手写样式：

| 组件类型 | 组件 |
| --- | --- |
| 陈述 | `Theorem`、`Block`、`Highlight`、`Keywords` |
| 结构 | `Steps`、`Columns` |
| 证据 | `MetricCard`、`MetricGrid`、`EvidenceBlock`、`EquationBlock`、`ResultTable` |
| 论文上下文 | `DatasetCard`、`PaperCard`、`ContributionList`、`CaveatList` |
| 引用 | `Cite`、参考文献布局、注脚预览 |

定理类陈述支持中文和英文标签、自动编号、手动编号和自定义编号格式。

## 引用和注脚

- 使用 `@citekey` 写括号引用。
- 使用 `!@citekey` 写叙述性引用。
- 使用标准 Markdown 注脚，并继承 Scholarly 的显示样式。
- 桌面端悬停注脚标记可预览内容，点击可固定浮窗。
- 从 BibTeX 生成 APA、Harvard、Vancouver、IEEE、MLA 或 Chicago 样式参考文献。

常规引用只需要在 frontmatter 中设置 `bibFile` 和 `bibStyle`。

## 数据驱动结果页

小型结果摘要可以放在 JSON 或 CSV 中，再通过主题组件渲染。Scholarly 直接使用 Vite 和 Slidev 的 import 能力，不提供运行时 fetch loader，也不引入 charting dependency。

```ts
import rows from './results.json'
import { toMetricItems } from 'slidev-theme-scholarly/utils/data'

const metrics = toMetricItems(rows)
```

```markdown
<MetricGrid :metrics="metrics" compact />
```

CSV 可以使用 `?raw`：

```ts
import csv from './results.csv?raw'
import { parseCsvTable } from 'slidev-theme-scholarly/utils/data'

const rows = parseCsvTable(csv)
```

如果只是单页临时结果，静态 Markdown table 通常更轻。

## 论文元数据脚手架

从 BibTeX key 生成论文摘要：

```bash
sch paper summary --bib references.bib --key sample2026
```

命令会读取 title、authors、year、DOI、URL 和 venue 字段，并输出 `paper-summary` 幻灯片。使用 `--layout paper-card` 可以生成组件片段，使用 `--json` 可以给脚本消费结构化输出。缺少关键字段时，命令会返回 `warnings`，但仍输出可渲染的 fallback Markdown。

## 主题预设

Scholarly 提供适合学术演示的颜色和字体预设，包括 classic blue、Oxford burgundy、Cambridge green、Yale blue、Princeton orange、Nordic blue、warm sepia、monochrome 和 high contrast。

先在[色彩与字体主题](./themes.md)中做视觉选择，再到[主题模式与对比度](./theme-mode-contrast.md)调整模式和可读性。

## 写作工具

- CLI 模板和工作流可以生成完整起步演示。
- `sch doctor` 会报告配置问题并给出可执行修复建议。
- VS Code 代码片段可插入布局和组件。
- VS Code 预览与文档站使用同一批生成截图。

编辑器设置见 [VS Code 插件](./vscode-extension.md)。

## 基础主题边界

Scholarly 会把不需要网络的学术辅助能力保留在基础主题中：引用、注脚预览、参考文献页、轻量数据导入和 BibTeX 摘要脚手架。需要网络访问、大型解析器、图表引擎、大型资源包或广泛集成 API 的能力，应放在可选 addon 中。
