---
title: 主要功能
---

# 主要功能

Scholarly 在 Slidev 的基础上加入学术演示常用的布局、组件、BibTeX 引用、主题预设和编辑器工具。

## 学术演示结构

- 34 种布局，覆盖封面、章节、正文、图片、对比、方法、结果、时间线、附录、答辩和参考文献页。
- 自动处理页眉和页脚，支持作者、会议信息、页码和可选的 Beamer 风格导航。
- 较长的演示可以从页脚打开大纲，并按 `layout: section` 分组。

如果已经知道下一页要表达什么，先从[布局](../layouts/)开始。

## 研究组件

定理、指标和证据等重复内容由组件统一排版：

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

大多数演示只需在 frontmatter 中设置 `bibFile` 和 `bibStyle`。

## 数据驱动结果页

少量结果数据可以保存在 JSON 或 CSV 中，再交给主题组件显示。Scholarly 直接使用 Vite 和 Slidev 的导入能力，不额外提供运行时数据加载器，也不引入图表依赖。

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

如果数据只在一页使用，直接写 Markdown 表格通常更简单。

## 从 BibTeX 生成论文摘要

从 BibTeX key 生成论文摘要：

```bash
pnpm exec sch paper summary --bib references.bib --key sample2026
```

命令会读取标题、作者、年份、DOI、URL 和会议等字段，并生成一张 `paper-summary` 幻灯片。使用 `--layout paper-card` 可以改为生成组件片段，使用 `--json` 则会输出便于脚本处理的结构化数据。缺失字段会写入 `warnings`；即使关键信息不全，命令仍会生成可继续编辑的 Markdown。

## 主题预设

内置配色包括经典蓝、牛津酒红、剑桥绿、耶鲁蓝、普林斯顿橙、北欧蓝、暖棕、单色和高对比度。

先在[色彩与字体主题](./themes.md)中选择配色和字体，再到[主题模式与对比度](./theme-mode-contrast.md)设置明暗模式并检查可读性。

## 写作工具

- CLI 模板和工作流可以生成完整起步演示。
- `sch doctor` 会报告配置问题并给出可执行修复建议。
- VS Code 代码片段可插入布局和组件。
- VS Code 预览与文档站使用同一批生成截图。

编辑器设置见 [VS Code 插件](./vscode-extension.md)。

## 基础主题边界

基础主题只包含离线可用的功能，包括引用、注脚预览、参考文献页、轻量数据导入和 BibTeX 摘要生成。联网功能、大型解析器、图表引擎和第三方 API 由可选扩展提供。
