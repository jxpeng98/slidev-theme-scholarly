---
title: 引用
---

# 引用

Scholarly 会读取本地 BibTeX 文件，将正文引用的条目汇总到参考文献页。先准备文献文件，再添加引用和参考文献页。手动注记与 Markdown 注脚的用法另列在后文。

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

## BibTeX 文件示例

在 `slides.md` 旁创建 `references.bib`。后文示例使用的 key 均来自这两个条目：

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

## 基本用法

### 括号引用

括号引用使用 `@citekey`：

```markdown
深度学习综述介绍了这些方法 @lecun2015deep。
```

使用 APA 样式时，引用显示为 `(LeCun et al., 2015)`。引用格式由 `bibStyle` 决定，不会随正文语言自动翻译。

### 叙述性引用

需要把作者写进句子时，使用 `!@citekey`：

```markdown
!@vaswani2017attention 提出了 Transformer 架构。
```

使用 APA 样式时，叙述性引用显示为 `Vaswani et al. (2017)`。

### 多个引用

一句话涉及多篇文献时，可以连续写多个 key。每个 key 都应在参考文献文件中存在：

```markdown
这些论文讨论了神经网络架构 @lecun2015deep @vaswani2017attention。
```

## 参考文献

添加一个参考文献页：

```markdown
---
layout: references
---
```

主题会根据幻灯片中实际使用的引用生成参考文献。

如果页面正文为空，或只包含标题和注释，主题会自动插入参考文献。

需要指定插入位置时，在相应位置写入 `[[bibliography]]`。

项目无需为引用功能额外配置 `vite.config.ts`；所需的处理逻辑已经包含在主题包中。

## 分页

每一页参考文献都需要单独添加一张幻灯片。`perPage` 限制当前页的条目数，不会自动创建后续页面：

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

## Markdown 注脚

标准 Markdown 注脚可以直接使用，不需要额外的主题语法：

```markdown
我们的紧凑模型在五个随机种子下依然稳定[^1]。

[^1]: 验证集准确率波动小于 0.3 个百分点。
```

在 Slidev 的交互视图中，注脚支持以下操作：

- 桌面端悬停注脚标记即可预览内容
- 点击标记可固定浮窗
- 按 `Esc` 或点击外部即可关闭

可以先在文件开头的 headmatter 中设置全局默认值：

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

- `footnoteDisplay: both` 同时保留底部注脚和行内悬停、点击预览
- `footnoteDisplay: hover-only` 隐藏底部注脚，只保留行内预览
- `footnoteDisplay: notes-only` 保留底部注脚，同时关闭悬停和点击浮窗

优先级顺序：

- 单页 `footnoteDisplay`
- 文件 headmatter 中的 `footnoteDisplay`
- 兼容旧配置 `themeConfig.footnoteDisplay`
- 默认值 `both`

打印或导出时，注脚会显示为幻灯片底部的普通列表。

## 内部锚点跳转

在 Slidev 的交互视图中，Scholarly 会将内部 `href="#..."` 链接识别为跨页跳转：

- 正文中的 BibTeX 引用可以直接跳到对应条目，即使参考文献在另一页
- 普通内部链接如 `[跳转](#appendix-proof)` 也可以跨页工作，只要目标位置使用了 `## 标题 {#appendix-proof}`、`::anchor{#appendix-proof}`，或者显式声明了 `id="appendix-proof"`
- 跳转后会显示 `Back to source` 按钮，点击即可回到原来的引用或链接位置

跨页跳转只在现场演示和浏览器中生效；打印和导出仍使用静态内容。

## 运行诊断

引用没有按预期显示时，运行：

```bash
pnpm exec sch doctor
```

检查结果包括：

- `Citation setup`：是否存在 `bibFile` 或默认 `references.bib`
- `Citation bibliography`：`.bib` 文件是否存在，是否包含重复 key
- `Citation keys`：幻灯片中无法解析的 `@citekey`
- `References slide`：是否存在 `layout: references` 页面

常见警告：

```text
- Citation setup: [WARN] citations found but no bibFile or references.bib
- Citation bibliography: [WARN] missing .bib file: ./references.bib
- Citation keys: [WARN] unresolved citation keys: missing2026
- References slide: [WARN] missing; add layout: references
```

## Cite 组件（手动）

`<Cite>` 是轻量的手动引用和注记组件，不会写入 BibTeX。正式引用优先使用 `@citekey` 或 `!@citekey`。

### 作者—年份标记（旧写法）

```markdown
<Cite author="张三等" year="2024" />
```

渲染为：（张三等，2024）

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

### 属性

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `id` | `string \| number` | 自动生成 | 固定的数字标记或键 |
| `inline` | `boolean` | `true` | 使用行内样式，而不是块级样式 |
| `author` | `string` | - | 手动作者—年份标记中的作者文字 |
| `year` | `string \| number` | - | 手动作者—年份标记中的年份 |
