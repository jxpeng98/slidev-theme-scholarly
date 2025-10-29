---
theme: ./
footerMiddle: Slidev 学术主题演示
description: 面向学术工作者的演示幻灯片
aspectRatio: 4/3
lang: zh
theoremNumberFormat: '{number}'
authors:
  - name: 张三
    institution: 某某大学
    email: zhangsan@example.edu
  - name: 李四
    institution: 另一所大学
    email: lisi@example.edu
  - name: 王五
    institution: 第三所大学
    email: wangwu@example.edu
---

# Slidev 学术主题

面向学术工作者的演示幻灯片

<!--
本示例演示了 Scholarly 主题的所有功能。

全局配置（应用于所有幻灯片）：
- authors: 作者列表，包含姓名、单位、邮箱
  （或使用单个作者：author: 你的名字）
- footerMiddle: 会议名称或活动名称（页脚中间部分）
- footerLeft: 自定义页脚左侧文本（会覆盖作者显示）
- theoremNumberFormat: 定理编号格式（例如：'{number}'、'定理 {number}'）
- lang: 定理组件的语言（zh、en、fr、de、es、it、ja、pt、ru）

页脚会自动出现在所有幻灯片上，右侧显示页码。
-->

---
layout: intro
footerMiddle: Slidev 学术主题
---

<!--
布局：intro
用途：介绍或议程幻灯片
何时使用：用于概述演示文稿结构或介绍主题

特性：
- 内容垂直居中
- 文本左对齐，易于阅读
- 带有会议/作者信息的页脚

提示：非常适合"今天要讲的内容"这类幻灯片
-->

## 什么是 Slidev？

Slidev 是一个为开发者设计的幻灯片制作和演示工具。它包含以下特性：

- 📝 **基于文本** - 用 Markdown 专注于内容，稍后再设计样式
- 🎨 **可主题化** - 主题可以作为 npm 包共享和重用
- 🧑‍💻 **开发者友好** - 代码高亮、实时编码与自动补全
- 🤹 **可交互** - 嵌入 Vue 组件来增强表达
- 🎥 **可录制** - 内置录制和摄像头视图
- 📤 **可移植** - 导出为 PDF、PPTX、PNG 或可托管的 SPA
- 🛠 **可扩展** - 几乎任何在网页上可能的事情在 Slidev 中都可以实现

<br>
<br>

了解更多：[为什么选择 Slidev?](https://sli.dev/guide/why)

---
layout: default
title: 布局优化
subtitle: 减少代码重复，提高可维护性
---

<!--
布局：default
用途：常规内容的标准幻灯片
何时使用：大部分演示幻灯片（这是默认布局！）

特性：
- 可选的标题和副标题显示在标题栏（如果在 frontmatter 中提供）
- 内容左对齐，易于阅读
- 根据标题栏内容自动调整内边距
- 自动显示页脚

frontmatter 选项：
- title: 标题栏中显示的主标题
- subtitle: 标题栏中显示的副标题
- header: 自定义标题栏文本（覆盖 title/subtitle）
- footerLeft: 仅为此幻灯片覆盖页脚左侧部分

提示：如果不指定布局，默认就是这个！
-->

## 键盘快捷键

|     |     |
| --- | --- |
| <kbd>空格</kbd> / <kbd>tab</kbd> / <kbd>右箭头</kbd> | 下一个动画或幻灯片 |
| <kbd>左箭头</kbd>  / <kbd>shift</kbd><kbd>空格</kbd> | 上一个动画或幻灯片 |
| <kbd>上箭头</kbd> | 上一张幻灯片 |
| <kbd>下箭头</kbd> | 下一张幻灯片 |

---

<!--
布局：default（未指定布局时自动应用）
用途：演示 default 布局是自动的

重点：你不需要显式写 `layout: default`。
如果不指定任何布局，Slidev 会自动使用 "default"。
-->

## 这张幻灯片使用默认布局

注意，即使没有指定 `layout: default`，这张幻灯片：

- 自动使用默认布局
- 显示带有 frontmatter 中作者信息的页脚
- 在中间显示会议名称
- 在右侧显示页码

这说明**所有页脚配置都是全局的**，适用于所有幻灯片。

---
layout: image-left
image: https://cover.sli.dev
---

<!--
布局：image-left
用途：左侧为视觉内容，右侧为文本内容
何时使用：当您希望强大的视觉元素与解释性文本并列时

特性：
- 图片填充整个左半部分（全高度，无内边距）
- 文本内容在右半部分
- 50/50 分割布局
- 底部显示页脚

frontmatter 选项：
- image: 图片的 URL 或路径（必需）
- title: 标题栏的可选标题
- subtitle: 标题栏的可选副标题

提示：非常适合展示截图、图表或带有说明的照片
-->

## 代码示例

直接使用代码片段并获得高亮！

```ts
interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}

function updateUser(id: number, update: Partial<User>) {
  const user = getUser(id)
  const newUser = { ...user, ...update }
  saveUser(id, newUser)
}
```

---
layout: quote
title: 引用布局
subtitle: 显示励志名言
---

<!--
布局：quote
用途：显示令人难忘的引用或重要陈述
何时使用：用于强调关键见解、名人名言或重要原则

特性：
- 居中、大字体文本以获得最大影响
- 引用和归属的特殊样式
- 无标题栏（即使提供了 title/subtitle 也会隐藏）
- 底部显示页脚

格式：
第一段 = 引用内容
第二段（以 — 开头）= 出处

提示：保持引用简短有力以获得最佳效果
-->

生活就像一盒巧克力，你永远不知道下一颗是什么味道。

— 阿甘正传

---
layout: section
title: 章节布局
subtitle: 章节分隔符
---

<!--
布局：section
用途：标记新章节或段落的开始
何时使用：将演示文稿划分为主要部分

特性：
- 大字号、居中的标题
- 醒目的副标题
- 不显示标题栏
- 底部显示页脚
- 比常规幻灯片有更多间距

提示：使用此布局在主题之间给观众一个心理"休息"
-->

## 章节标题

### 副标题

使用此布局标记演示文稿中新章节或段落的开始。

---
layout: center
title: 居中布局
subtitle: 居中内容
---

<!--
布局：center
用途：将重要内容居中显示在幻灯片上
何时使用：用于关键信息、重要公告或单一焦点

特性：
- 所有内容垂直和水平居中
- 可选标题栏（如果提供了 title/subtitle 则显示）
- 底部显示页脚
- 简洁、专注的设计

提示：最适合内容最少但值得充分关注的幻灯片
-->

## 居中的内容

此布局非常适合重要陈述或关键信息。

---
layout: fact
title: 事实布局
---

<!--
布局：fact
用途：突出显示单个统计数据或事实
何时使用：强调重要数字或简短陈述

特性：
- 超大、居中的内容
- 最大宽度受限以提高可读性
- 无标题栏（即使提供了 title）
- 底部显示页脚
- 专为最多 1-2 行文本设计

提示：使用大数字或非常短的短语（例如："100%"、"第一名"）
-->

## 100%

学术卓越

---
layout: statement
title: 陈述布局
---

<!--
布局：statement
用途：做出大胆、有影响力的陈述
何时使用：用于论文陈述、关键发现或重要结论

特性：
- 大字号、居中文本
- 中等宽度约束以提高可读性
- 不显示标题栏
- 底部显示页脚
- 比 'fact' 布局宽度更大

提示：最适合 1-3 句话的陈述，捕捉主要思想
-->

## 重要陈述

此布局专为需要强调的有影响力的陈述而设计。

---
layout: two-cols
title: 双栏布局
subtitle: 并排内容
---

<!--
布局：two-cols
用途：并排显示两栏内容
何时使用：用于比较、前后对比、优缺点或并行内容

特性：
- 等宽列（50/50 分割）
- 内容顶部对齐（列从相同高度开始）
- 使用 `::right::` 标记分隔左右内容
- 可选的带有 title/subtitle 的标题栏
- 底部显示页脚

语法：
`::right::` 之前的内容进入左栏
`::right::` 之后的内容进入右栏

提示：非常适合比较概念、显示代码和输出，或列出并行想法
-->

## 左栏

- 要点 1
- 要点 2
- 要点 3

您可以在这里放置任何内容：

- 列表
- 文本
- 图片

::right::

## 右栏

```python
def hello():
    print("你好，世界！")
    
# 代码示例
for i in range(10):
    hello()
```

---
layout: image-left
image: https://cover.sli.dev
title: 左图布局
subtitle: 图片在左侧，内容在右侧
---

<!--
布局：image-left
用途：结合视觉和文本内容（视觉在左侧）
何时使用：当图片是主要焦点，文本提供上下文时

特性：
- 图片填充整个左半部分（全高度，边到边）
- 文本内容在右半部分
- 50/50 分割
- 可选标题栏
- 底部显示页脚

frontmatter 选项：
- image: 图片的 URL 或路径（必需）

提示：当视觉内容应首先被看到时使用（从左到右阅读）
-->

## 右侧内容

当您使用 `image-left` 布局时：

- 图片填充整个左侧
- 内容出现在右侧
- 非常适合视觉演示

您可以在这里使用 markdown、代码或任何其他内容。

---
layout: image-right
image: https://cover.sli.dev
title: 右图布局
subtitle: 内容在左侧，图片在右侧
---

<!--
布局：image-right
用途：结合文本和视觉内容（文本在前，视觉在后）
何时使用：当文本是主要内容，图片提供支持/上下文时

特性：
- 内容出现在左半部分
- 图片填充整个右半部分（全高度，边到边）
- 50/50 分割
- 可选标题栏
- 底部显示页脚

frontmatter 选项：
- image: 图片的 URL 或路径（必需）

提示：当您希望读者在看到视觉内容之前先处理文本时使用
-->

## 左侧内容

当您使用 `image-right` 布局时：

- 内容出现在左侧
- 图片填充整个右侧
- 非常适合平衡视觉和文本

```ts
// 您甚至可以添加代码块
const message = "你好，Slidev！"
console.log(message)
```

---
layout: default
title: 定理组件演示
subtitle: 带自动编号的数学陈述
---

<!--
组件：<Theorem>
用途：显示带有自动编号的数学定理、定义、引理等
何时使用：用于带有形式化数学陈述的学术演示

特性：
- 自动编号（从 1 开始，全局递增）
- 多种类型：theorem、lemma、definition、proposition、corollary、example、remark
- 多语言支持（根据 frontmatter 的 lang 设置自动翻译）
- 可选的自定义标题
- 可选的手动编号

组件属性：
- type: "theorem" | "lemma" | "definition" | "proposition" | "corollary" | "example" | "remark"
- title: 定理的可选标题
- number: 可选的手动编号（例如："3.1"）
- autoNumber: 设置为 false 可完全隐藏编号

全局配置（在 frontmatter 中）：
- lang: 语言代码（zh、en、fr、de、es、it、ja、pt、ru）
- theoremNumberFormat: 格式字符串（例如：'{number}'、'定理 {number}'）

提示：编号在演示开始时自动重置
-->

## 数学定理

<Theorem type="theorem" title="勾股定理">

对于直角三角形，设两直角边为 $a$ 和 $b$，斜边为 $c$，则：

$$a^2 + b^2 = c^2$$

</Theorem>

<Theorem type="theorem" title="费马大定理">

当整数 $n > 2$ 时，关于 $x, y, z$ 的方程 $x^n + y^n = z^n$ 没有正整数解。

</Theorem>

<Theorem type="lemma">

闭区间上的每个连续函数都是一致连续的。

</Theorem>

---
layout: default
title: 更多定理示例
---

<!--
定理类型说明：
- theorem（定理）: 主要结果
- lemma（引理）: 用于证明定理的辅助结果
- definition（定义）: 概念的精确定义
- proposition（命题）: 较小的结果
- corollary（推论）: 直接从定理得出的结果
- example（例子）: 说明性示例
- remark（注记）: 附加说明或观察

所有类型按演示顺序分别自动编号。
-->

## 定义和例子

<Theorem type="definition" title="极限">

设函数 $f$ 在包含点 $a$ 的某个开区间上有定义。如果对于任意 $\epsilon > 0$，存在 $\delta > 0$ 使得当 $0 < |x - a| < \delta$ 时，有 $|f(x) - L| < \epsilon$，则称 $\lim_{x \to a} f(x) = L$。

</Theorem>

<Theorem type="example">

考虑函数 $f(x) = x^2$：

- $f(0) = 0$
- $f(1) = 1$
- $f(2) = 4$

</Theorem>

---
layout: default
title: 更多定理类型
---

<!--
多语言支持：
组件会根据您的 frontmatter 自动翻译标签：
- lang: zh → "定理"、"引理"、"定义" 等
- lang: en → "Theorem"、"Lemma"、"Definition" 等
- lang: fr → "Théorème"、"Lemme"、"Définition" 等
支持更多语言！
-->

## 命题和注记

<Theorem type="proposition">

如果 $f$ 和 $g$ 在点 $a$ 处连续，则 $f + g$ 在点 $a$ 处也连续。

</Theorem>

<Theorem type="corollary">

有限个连续函数的和仍然是连续函数。

</Theorem>

<Theorem type="remark">

注意：此结果对于连续函数的乘积同样成立。

</Theorem>

---
layout: default
title: 手动编号示例
subtitle: 需要时覆盖自动编号
---

<!--
自定义编号：
有时您需要特定的编号（如 "3.1" 表示第三章第一个定理）。
使用 `number` 属性覆盖自动编号。

要完全隐藏编号，使用 `:autoNumber="false"`（注意冒号表示布尔值）
-->

## 自定义编号

<Theorem type="theorem" number="3.1" title="特殊情况">

有时我们需要使用特定的编号，比如 3.1 表示第三章第一个定理。

</Theorem>

<Theorem type="theorem" :autoNumber="false" title="无编号定理">

这个定理没有编号，因为设置了 `autoNumber={false}`。

</Theorem>

---
layout: default
title: 全局配置示例
subtitle: 自定义主题行为
---

<!--
全局配置深入讲解：

1. 多作者支持：
   - 使用 `authors` 数组列出多个作者
   - 每个作者包含：name、institution、email
   - 页脚会根据作者数量自动调整格式

2. 单作者模式：
   - 只需使用 `author: 你的名字`
   - 更简单的配置

3. 页脚自定义：
   - footerLeft: 覆盖左侧内容（通常显示作者）
   - footerMiddle: 中间内容（会议、活动名称）
   - footerRight: 自动显示页码（无需配置）

4. 定理配置：
   - theoremNumberFormat: 控制编号显示方式
   - lang: 控制定理类型的语言

提示：所有这些配置都在第一页的 frontmatter 中设置一次，
然后自动应用于整个演示文稿！
-->

## 配置说明

本演示使用的全局配置：

```yaml
---
theme: ./
footerMiddle: Slidev 学术主题演示
lang: zh
theoremNumberFormat: '{number}'
authors:
  - name: 张三
    institution: 某某大学
    email: zhangsan@example.edu
  - name: 李四
    institution: 另一所大学
    email: lisi@example.edu
---
```

这些设置会自动应用到所有幻灯片！

---
layout: default
title: 更多功能
subtitle: 探索其他可能性
---

<!--
其他实用功能：

1. 页面级覆盖：
   - 任何幻灯片都可以覆盖 title、subtitle、header
   - 使用 footerLeft 可以为特定幻灯片自定义页脚

2. 代码高亮：
   - 支持多种编程语言
   - 自动语法高亮
   - 可以使用行号和高亮特定行

3. 数学公式：
   - 内联公式：$a^2 + b^2 = c^2$
   - 块级公式：$$\int_a^b f(x)dx$$
   - 使用 KaTeX 渲染

4. Vue 组件：
   - 可以嵌入自定义 Vue 组件
   - Theorem 组件就是一个例子
   - 可以创建交互式内容
-->

## 实用技巧

### 代码高亮
```python {2,4-6}
def fibonacci(n):
    if n <= 1:  # 这行会被高亮
        return n
    else:       # 这几行也会被高亮
        return fibonacci(n-1) + fibonacci(n-2)
```

### 数学公式
内联公式：$E = mc^2$

块级公式：
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

---
layout: center
---

<!--
结束幻灯片
这是一个使用 center 布局的简单结束幻灯片。
非常适合"谢谢"、问答或联系信息。
-->

## 谢谢！

有问题吗？

[Slidev 文档](https://sli.dev) / [GitHub 仓库](https://github.com/slidevjs/slidev)
