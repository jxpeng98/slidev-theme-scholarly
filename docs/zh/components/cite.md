---
title: 引用
---

# 引用

主题内置了使用 BibTeX 文件的学术引用支持。引用会自动收集并生成参考文献。

## 配置

在 frontmatter 中配置引用设置：

```yaml
---
theme: scholarly
bibFile: references.bib  # BibTeX 文件路径（默认：references.bib）
bibStyle: apa            # 引用样式
bibShowNum: false        # 参考文献是否显示数字标记（如 [1]）
---
```

**支持的样式：**

- `apa`（默认）
- `harvard1`
- `vancouver`
- `ieee`
- `mla`
- `chicago-author-date`

## 基本用法

### 括号引用

使用 `@citekey` 进行括号引用：

```markdown
深度学习已经革新了人工智能 @lecun2015deep。
```

渲染为：深度学习已经革新了人工智能 (LeCun 等, 2015)。

### 叙述性引用

使用 `!@citekey` 进行叙述性（作者突出）引用：

```markdown
!@vaswani2017attention 提出了 Transformer 架构。
```

渲染为：Vaswani 等 (2017) 提出了 Transformer 架构。

### 多个引用

```markdown
最近的进展 @smith2023deep @wang2022attention 表明...
```

### 分组引用

当一个 claim 由多篇论文共同支持时，可以在同一句中连续写多个 BibTeX key：

```markdown
高效适配通常需要结合多篇工作的证据 @smith2023deep @wang2022attention。
```

### 类注脚引用说明

如果需要一条简短的手动阅读注记或脚注式说明，可以使用 `<Cite :inline="false">`。
它不会接入 BibTeX bibliography，适合补充上下文。

```markdown
<Cite :inline="false" author="Smith 等" year="2026">
主要指标均报告 5 次随机种子平均值和置信区间。
</Cite>
```

## Markdown 注脚

标准 Markdown 注脚开箱即用，不需要额外的主题语法：

```markdown
我们的紧凑模型在五个随机种子下依然稳定[^1]。

[^1]: 验证集准确率波动小于 0.3 个百分点。
```

在 Slidev 的交互视图中，主题会自动为注脚应用学术化样式：

- 桌面端悬停注脚标记即可预览内容
- 点击标记可固定浮窗
- 按 `Esc` 或点击外部即可关闭

你也可以先在首页 headmatter 中设置全局默认值：

```yaml
---
footnoteDisplay: hover-only
---
```

再通过单页 frontmatter 按页覆盖：

```markdown
---
footnoteDisplay: notes-only
---
```

- `footnoteDisplay: both` 同时保留底部注脚和行内 hover / click 预览
- `footnoteDisplay: hover-only` 隐藏底部注脚，只保留行内预览
- `footnoteDisplay: notes-only` 保留底部注脚，并关闭 hover / click 浮窗

优先级顺序：

- 单页 `footnoteDisplay`
- 首页 headmatter `footnoteDisplay`
- 兼容旧配置 `themeConfig.footnoteDisplay`
- 默认值 `both`

打印或导出时，注脚会回退为幻灯片底部的普通注脚列表。

## 参考文献

添加一个参考文献页：

```markdown
---
layout: references
---
```

参考文献会自动从幻灯片中使用的所有引用生成。

如果这一页的正文为空，或者只包含标题 / 注释，主题会自动插入 bibliography。

如果你想精确控制 bibliography 在该页中的插入位置，可以显式写 `[[bibliography]]`。

正常使用这个主题时，不需要额外维护项目级 `vite.config.ts`；Scholarly 会从主题包内部自动注册 citation 相关 hook。

## Doctor 诊断

当 citation 没有按预期渲染时，可以运行：

```bash
npx -y --package slidev-theme-scholarly sch doctor
```

citation 检查会报告：

- `Citation setup`：是否存在 `bibFile` 或默认 `references.bib`
- `Citation bibliography`：`.bib` 文件是否存在，以及是否有重复 key
- `Citation keys`：slides 中使用但无法解析的 `@citekey`
- `References slide`：是否存在 `layout: references` 页面

常见 warning：

```text
- Citation setup: [WARN] citations found but no bibFile or references.bib
- Citation bibliography: [WARN] missing .bib file: ./references.bib
- Citation keys: [WARN] unresolved citation keys: missing2026
- References slide: [WARN] missing; add layout: references
```

## 内部锚点跳转

在 Slidev 的交互式浏览视图中，Scholarly 会把内部 `href="#..."` 链接升级成支持跨页的跳转：

- 文中的 BibTeX citation 可以直接跳到对应的参考文献条目，即使参考文献列表在另一页
- 普通内部链接如 `[跳转](#appendix-proof)` 也可以跨页工作，只要目标位置使用了 `## 标题 {#appendix-proof}`、`::anchor{#appendix-proof}`，或者显式声明了 `id="appendix-proof"`
- 跳转后会出现一个浮动的 `Back to source` 按钮，用来回到之前的 citation 或链接位置

这个能力主要用于现场演示和浏览器中的交互式查看；打印和导出结果仍然保持静态内容。

## 分页

对于较长的参考文献列表，使用分页：

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

## BibTeX 文件示例

在项目根目录创建 `references.bib` 文件：

```bibtex
@article{lecun2015deep,
  title={Deep learning},
  author={LeCun, Yann and Bengio, Yoshua and Hinton, Geoffrey},
  journal={Nature},
  volume={521},
  pages={436--444},
  year={2015}
}

@inproceedings{vaswani2017attention,
  title={Attention is all you need},
  author={Vaswani, Ashish and others},
  booktitle={NeurIPS},
  year={2017}
}
```

## Cite 组件（手动）

`<Cite>` 组件是一个轻量的手动引用/注记组件（非 BibTeX）。BibTeX 引用请优先使用 `@citekey` / `!@citekey`。

### 作者-年份标记（传统写法）

```markdown
<Cite author="张三等" year="2024" />
```

渲染为：(张三等, 2024)

也可以附带引用上下文：

```markdown
<Cite author="张三等" year="2024">
引用上下文
</Cite>
```

### 数字标记

```markdown
<Cite :inline="true">
引用上下文
</Cite>
```

也可以固定 `id`：

```markdown
<Cite :inline="false" :id="1">
参考条目
</Cite>
```
