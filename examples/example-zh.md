---
theme: ../
footerMiddle: Slidev 学术主题演示
description: 面向学术工作者的演示幻灯片
aspectRatio: 4/3
lang: zh
themeConfig:
  contentMode: light
  chromeMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
theoremNumberFormat: '{number}'
bibFile: ./references.bib
bibStyle: apa
authors:
  - name: A.B. 张
    institution: XYZ 大学
    email: zhangsan@example.edu
  - name: C.D. 李
    institution: ABC 大学
    email: lisi@example.edu
  - name: E.F. 王
    institution: DEF 大学
    email: wangwu@example.edu
---

# Slidev 学术主题

专为学术演示打造的幻灯片主题

<!--
本示例展示 Scholarly 主题的完整功能。

全局配置（对所有幻灯片生效）：
- authors: 作者信息（姓名、单位、邮箱）
- footerMiddle: 页脚中间文字（如会议名称）
- theoremNumberFormat: 定理编号格式
- lang: 界面语言
- bibFile: BibTeX 文件路径
- bibStyle: 引用样式 (apa, harvard1, vancouver, ieee, mla, chicago-author-date)
-->

---
layout: intro
---

<!--
布局：intro
用途：开场介绍或目录页
-->

# Slidev 是什么？

Slidev 是一款专为开发者打造的幻灯片工具，具备以下特性：

- 📝 **Markdown 驱动** - 专注内容创作，样式随时调整
- 🎨 **主题丰富** - 主题可通过 npm 分享和复用
- 🧑‍💻 **开发者友好** - 代码高亮、实时编码、自动补全
- 🤹 **交互增强** - 支持嵌入 Vue 组件
- 🎥 **内置录制** - 自带录屏和摄像头功能
- 📤 **多格式导出** - 支持 PDF、PPTX、PNG 及在线部署
- 🛠 **高度可定制** - 网页能做的，Slidev 都能做

<br/>

了解更多：[为什么选择 Slidev?](https://sli.dev/guide/why)

---
layout: section
---

<!--
布局：section
用途：章节分隔页
-->

# 第一部分：基础布局

## 常用的幻灯片布局

---
layout: default
title: 默认布局
subtitle: 常规内容展示
---

<!--
布局：default
用途：最常用的内容布局
-->

## 快捷键一览

|     |     |
| --- | --- |
| <kbd>空格</kbd> / <kbd>Tab</kbd> / <kbd>→</kbd> | 下一页/下一动画 |
| <kbd>←</kbd> / <kbd>Shift</kbd>+<kbd>空格</kbd> | 上一页/上一动画 |
| <kbd>↑</kbd> | 上一张幻灯片 |
| <kbd>↓</kbd> | 下一张幻灯片 |

---
layout: center
title: 居中布局
subtitle: 聚焦核心内容
---

<!--
布局：center
用途：突出展示重要内容
-->

## 内容居中展示

适合呈现重要观点或关键信息。

内容自动水平垂直居中。

---
layout: quote
---

<!--
布局：quote
用途：展示名言警句
-->

生活就像一盒巧克力，你永远不知道下一颗是什么味道。

— 《阿甘正传》

---
layout: fact
---

<!--
布局：fact
用途：突出展示关键数据
-->

# 100%

追求卓越

---
layout: statement
---

<!--
布局：statement
用途：强调核心观点
-->

# 核心观点

用于展示需要重点强调的论述或结论。

---
layout: section
---

# 第二部分：分栏布局

## 图文并排与多栏展示

---
layout: two-cols
ratio: "2:3"
title: 双栏布局
subtitle: 支持自定义比例
---

<!--
布局：two-cols
- ratio: 左右栏宽度比，如 "1:1"、"2:3"
-->

## 左栏（占 2 份）

左侧内容区域。

- 要点一
- 要点二
- 要点三

::right::

## 右栏（占 3 份）

右侧内容区域。

\`\`\`python
def hello():
    print("你好，世界！")
    
# 代码示例
for i in range(10):
    hello()
\`\`\`

---
layout: image-left
image: https://cover.sli.dev
ratio: "1:2"
title: 左图右文
subtitle: 支持自定义比例
---

<!--
布局：image-left
- ratio: 图片:内容的宽度比
- fit: 图片填充方式 (cover/contain/fill)
-->

## 右侧内容（占 2 份）

图片占 1 份，文字占 2 份。

使用 `image-left` 布局时：

- 图片在左侧全高展示
- 文字内容在右侧
- 比例可灵活调整

\`\`\`ts
const ratio = "1:2" // 图片:内容
\`\`\`

---
layout: image-right
image: https://cover.sli.dev
ratio: "3:2"
fit: contain
title: 左文右图
subtitle: 多种配置选项
---

<!--
布局：image-right
与 image-left 功能相同，方向相反
-->

## 左侧内容（占 3 份）

文字占 3 份，图片占 2 份。

可配置项：
- `ratio` - 内容:图片比例
- `fit` - 图片填充模式
- `position` - 图片位置

本页图片使用 `fit: contain` 完整展示。

---
layout: section
---

# 第三部分：内置组件

## 为学术内容设计的组件

---
layout: default
title: Block 组件
subtitle: Beamer 风格信息框
---

<!--
组件：<Block>
类型：default, info, success, warning, danger, example
-->

## 信息框组件

<Block type="default" title="默认样式">

标准的 Beamer 风格渐变标题栏。

</Block>

<Block type="info" title="提示信息">

用于展示说明性内容。

</Block>

<Block type="warning" title="注意事项">

用于强调需要特别关注的内容。

</Block>

---
layout: default
title: 更多信息框样式
---

## 其他样式

<Block type="success" title="成功">

用于展示积极结果或确认信息。

</Block>

<Block type="danger" title="警告">

用于展示严重警告或错误信息。

</Block>

<Block type="example" title="示例">

用于展示演示和代码示例。

</Block>

---
layout: default
title: 定理组件
subtitle: 自动编号的数学环境
---

<!--
组件：<Theorem>
用途：展示带自动编号的定理、引理、定义等
-->

## 数学定理

<Theorem type="theorem" title="勾股定理">

在直角三角形中，设两直角边为 $a$、$b$，斜边为 $c$，则：

$$a^2 + b^2 = c^2$$

</Theorem>

<Theorem type="lemma">

闭区间上的连续函数必为一致连续。

</Theorem>

---
layout: default
title: 定义与例子
---

## 定义与例子

<Theorem type="definition" title="函数极限">

设函数 $f$ 在点 $a$ 的某去心邻域内有定义。若对任意 $\epsilon > 0$，存在 $\delta > 0$，使得当 $0 < |x - a| < \delta$ 时，有 $|f(x) - L| < \epsilon$，则称 $\lim_{x \to a} f(x) = L$。

</Theorem>

<Theorem type="example">

考察函数 $f(x) = x^2$：

- $f(0) = 0$
- $f(1) = 1$
- $f(2) = 4$

</Theorem>

---
layout: default
title: 证明与注记
---

## 证明与注记

<Theorem type="claim" title="Bolzano-Weierstrass 定理">

$\mathbb{R}^n$ 中的有界序列必有收敛子列。

</Theorem>

<Theorem type="proof">

由 Bolzano-Weierstrass 定理，有界序列必含于某紧集。由序列紧性，存在收敛子列。$\square$

</Theorem>

<Theorem type="note">

这是实分析的基本结果，是证明许多收敛性定理的基础。

</Theorem>

---
layout: default
title: 紧凑定理模式
---

## 紧凑模式

当内容较密集时，可使用紧凑模式减小间距。

<Theorem type="theorem" :compact="true">

对于 $n \geq 1$，有 $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$。

</Theorem>

<Theorem type="proof" :compact="true">

对 $n$ 归纳。$n=1$ 显然成立。设对 $n$ 成立，则 $\sum_{k=1}^{n+1} k = \sum_{k=1}^{n} k + (n+1) = \frac{n(n+1)}{2} + (n+1) = \frac{(n+1)(n+2)}{2}$。$\square$

</Theorem>

<Theorem type="corollary" :compact="true">

前 $n$ 个正整数之和总是三角形数。

</Theorem>

---
layout: default
title: 自定义编号
subtitle: 覆盖默认的自动编号
---

## 自定义编号

<Theorem type="theorem" number="3.1" title="定理 3.1">

有时需要指定编号，比如“3.1”表示第三章第一个定理。

</Theorem>

<Theorem type="theorem" :autoNumber="false" title="无编号定理">

设置 `autoNumber={false}` 可禁用自动编号。

</Theorem>

---
layout: default
title: 高亮组件
---

<!--
组件：<Highlight>
类型：primary, success, warning, danger, info
-->

## 突出重点内容

使用 <Highlight>高亮组件</Highlight> 可以轻松标记关键内容。

不同样式的适用场景：
- <Highlight type="primary">主要高亮</Highlight> - 核心概念
- <Highlight type="success">成功高亮</Highlight> - 积极要点
- <Highlight type="warning">警告高亮</Highlight> - 注意事项
- <Highlight type="danger">危险高亮</Highlight> - 关键警告
- <Highlight type="info">信息高亮</Highlight> - 一般信息

让幻灯片更<Highlight type="success">清晰易读</Highlight>，<Highlight type="primary">重点突出</Highlight>！

---
layout: section
---

# 第四部分：高级功能

## 字体大小自定义与自动居中布局

---
fontsize:
  body: 20px
  h1: 48px
  h2: 36px
  h3: 28px
---

<!--
功能：按页自定义字体大小
-->

# 这是 48px 的 H1

## 这是 36px 的 H2

### 这是 28px 的 H3

本页没有指定 `layout`，但依然：

- 自动使用默认布局
- 显示带作者信息的页脚
- **正文 20px，H1 48px，H2 36px，H3 28px**

这证明了**字体大小配置完全生效**！

---
layout: auto-center
title: 自动居中布局
subtitle: 自动调整字体大小
---

<!--
布局：auto-center
用途：自动调整字体大小并垂直居中
-->

## 自动居中内容

此布局自动：

- 调整字体大小以适应内容
- 垂直居中内容
- 在居中块内保持文本左对齐

### 使用场景示例

1. 内容长度不同的幻灯片
2. 需要"填充"空间的内容
3. 来自数据源的动态内容

---
layout: auto-center
---

## 少量内容测试

只有几行文字。

内容较少时，字体会自动放大。

---
layout: auto-center
title: 大量内容测试
---

## 本页内容较多

- 要点 1：Lorem ipsum dolor sit amet
- 要点 2：Consectetur adipiscing elit
- 要点 3：Sed do eiusmod tempor incididunt
- 要点 4：Ut labore et dolore magna aliqua
- 要点 5：Ut enim ad minim veniam
- 要点 6：Quis nostrud exercitation ullamco
- 要点 7：Laboris nisi ut aliquip ex ea commodo consequat

字体会自动缩小以容纳所有内容，同时保持居中展示。

---
layout: auto-size
title: Auto Size 布局
subtitle: 保留默认流式正文的页面自适应字号
autoSizePadding: normal
---

<!--
布局：auto-size
用途：保留 default 的阅读流，同时让 main matter 自动适应可用宽高
-->

## 自动适应页面的正文区域

这个布局保留了默认布局的 header、footer 和正文流式排版，但会在溢出前自动调整 main matter 的字号。

- 保留默认布局的阅读节奏
- 不做垂直居中，正文仍然从上往下展开
- 内容少时放大，内容多时缩小
- 需要更强约束时，可在 frontmatter 中设置 `minFontSize` 和 `maxFontSize`

它比较适合定理、表格、定义列表较多，但又希望页面行为更接近 LaTeX Beamer frame 的场景。

---
layout: auto-size
title: Auto Size 控制项
subtitle: 放大策略、对齐方式和内边距预设
autoSizeGrow: false
autoSizeAlign: center
autoSizePadding: compact
minFontSize: 16
---

<!--
布局：auto-size
用途：展示 fit growth、垂直对齐和内边距三个入口
-->

## 可配置的页面自适应字号

这一页保持相同布局，但可以更细地控制 main matter 的占位方式。

- `autoSizeGrow: false` 表示默认不主动放大，只在需要时缩小
- `autoSizeAlign: center` 会让正文在可用区域内垂直居中
- `autoSizePadding: compact` 会压缩正文内边距，留出更多可用空间
- `minFontSize` 仍然定义内容很密时的最小字号下限

适合希望保留 Beamer 式自动适配，但又想自己控制页面节奏的幻灯片。

---
layout: default
title: 学术引用
subtitle: 学术文献引用支持
---

<!--
功能：使用 BibTeX 的学术引用
- 在 frontmatter 中配置：bibFile, bibStyle
- @citekey 用于括号引用 (Author, Year)
- !@citekey 用于叙述性引用：Author (Year)
- layout: references 会自动生成参考文献列表
-->

## 引用示例

深度学习已经彻底改变了许多领域 @lecun2015deep。

!@vaswani2017attention 提出了 Transformer 架构，已成为自然语言处理的基础。

多项研究对这一领域做出了贡献 @smith2023deep @wang2022attention。

如需全面了解，请参阅 @bishop2006pattern。

在交互视图中，点击上面的任意 citation，即可跳转到 references 页中对应的参考文献条目。

---
layout: default
title: 内部锚点跳转
subtitle: 跨页 href 示例
---

<!--
功能：内部锚点跳转
- 点击行内 citation 跳到对应参考文献条目
- 使用普通 href="#target-id" 实现任意跨页跳转
- 跳转后使用浮动的 "Back to source" 按钮返回
-->

## 跳转示例

这里也可以直接测试 bibliography 跳转：@lecun2015deep。

也可以测试自定义跨页锚点：[跳到附录式目标页](#anchor-demo-proof)。

跳转后，使用浮动的 `Back to source` 按钮返回这里。

---
layout: default
title: 注脚
subtitle: 标准 Markdown 注脚
---

<!--
功能：标准 Markdown 注脚
- 行内使用 [^key]，文末使用 [^key]:
- 桌面端悬停可预览注脚内容
- 点击标记可固定浮窗
- 通过 footnoteDisplay: hover-only | notes-only | both 控制显示模式
-->

## 注脚示例

我们的紧凑模型在五个随机种子下依然稳定[^stability]，并将推理成本降低了 38%[^cost]。

发布包同时包含 prompts、配置文件和评测脚本，便于复现[^repro]。

[^stability]: 在五个随机种子下，验证集准确率波动小于 0.3 个百分点。
[^cost]: 在启用混合精度的单张 RTX 4090 上测得。
[^repro]: 在 Slidev 的交互视图中，可将鼠标悬停在注脚标记上进行预览，或点击标记固定浮窗。

---
layout: default
title: 注脚
subtitle: 仅保留悬停预览
footnoteDisplay: hover-only
---

<!--
功能：隐藏底部注脚，仅保留行内预览
-->

## 仅保留悬停预览

这一页会隐藏底部注脚区域，只保留行内标记的预览效果[^hover-only]。

[^hover-only]: 当你希望页面更干净，但仍然想通过行内标记查看说明时，可使用 `footnoteDisplay: hover-only`。

---
layout: default
title: 注脚
subtitle: 仅保留底部注脚
footnoteDisplay: notes-only
---

<!--
功能：保留底部注脚，关闭悬停和点击弹窗
-->

## 仅保留底部注脚

这一页会保留传统底部注脚[^notes-only]，同时关闭行内标记的 hover / click 弹窗。

[^notes-only]: 当你希望讲稿和投影片表现一致，并明确把注脚放在页面底部时，可使用 `footnoteDisplay: notes-only`。

---
layout: references
---

<!--
布局：references
用途：显示参考文献列表

对于较长的参考文献列表，可以分页显示：
- perPage: 每页显示的参考文献数量
- page: 当前页码 (1, 2, 3, ...)

第 1 页示例：
layout: references
perPage: 3
page: 1

第 2 页示例：
layout: references
perPage: 3
page: 2
title: "参考文献（续）"
-->

---
layout: default
title: 内部锚点目标
subtitle: 通用 href="#..." 目标页
---

<!--
功能：通用内部锚点目标
- 使用 ## 标题 {#id} 声明目标位置
- 或通过 ::anchor{#id} 放置一个独立锚点
-->

## 附录式目标页 {#anchor-demo-proof}

这一页是普通内部 `href="#..."` 跳转的目标位置示例。

可以从前面的链接跳到这里，然后使用 `Back to source` 回到之前的位置。

---
layout: section
---

# 第五部分：学术样式

## 表格、代码、引用

---
layout: default
title: 学术表格
subtitle: 三线表样式
---

<!--
功能：Booktabs 三线表样式
- 无垂直线
- 粗顶/底边框
- 细中间边框
-->

## 实验结果

| 方法 | 准确率 | 速度 | 内存 |
| ---- | ------ | ---- | ---- |
| 基线模型 | 85.2% | 1.0x | 4GB |
| 我们的方法 (v1) | 91.3% | 1.2x | 3.2GB |
| 我们的方法 (v2) | **94.7%** | 0.9x | 2.8GB |
| 当前最优 | 93.1% | 2.1x | 6GB |

> 表格自动应用学术三线表样式（booktabs）。

---
layout: default
title: 代码示例
subtitle: 语法高亮
---

<!--
功能：代码块样式
- 浅灰色背景
- 等宽字体
- 清晰边框
-->

## 算法实现

```python
def attention(Q, K, V):
    """缩放点积注意力"""
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    attn = F.softmax(scores, dim=-1)
    return torch.matmul(attn, V)
```

内联代码示例：使用 `torch.nn.MultiheadAttention` 进行实现。

---
layout: quote
author: 爱因斯坦
source: 致马克斯·玻恩的信, 1926
---

<!--
布局：quote
新属性：author, source
-->

上帝不会掷骰子。

---
layout: bullets
title: 自定义项目符号
icon: "→"
---

<!--
布局：bullets
新属性：icon（自定义项目符号）
-->

## 主要贡献

- 提出了具有线性复杂度的新型注意力机制
- 在多个基准测试上取得了最优结果
- 开源实现已公开发布

---
layout: fact
color: purple
---

<!--
布局：fact
新颜色：purple
-->

# 94.7%

最佳准确率

---
layout: center
---

## 谢谢观看！

有问题吗？

[Slidev 文档](https://sli.dev) / [GitHub 仓库](https://github.com/jxpeng98/slidev-theme-scholarly)
