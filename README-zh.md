# Slidev 学术主题 (Scholarly Theme)

[![NPM version](https://img.shields.io/npm/v/slidev-theme-scholarly?color=3AB9D4&label=)](https://www.npmjs.com/package/slidev-theme-scholarly)
[English Version](./README.md)

一个专为学术演示设计的 [Slidev](https://github.com/slidevjs/slidev) 专业主题，采用 LaTeX Beamer 风格的设计。

---

## 📖 目录

- [这是什么？](#这是什么)
- [谁应该使用？](#谁应该使用)
- [快速开始](#快速开始)
- [核心特性](#核心特性)
- [理解布局系统](#理解布局系统)
- [定理组件](#定理组件)
- [配置指南](#配置指南)
- [示例](#示例)
- [贡献指南](#贡献指南)

---

## 这是什么？

这是一个用于 [Slidev](https://sli.dev) 的**主题**（设计模板）。Slidev 是一个使用简单文本文件创建演示幻灯片的工具。可以把它想象成 PowerPoint，但不是点击和拖拽，而是用一种叫做 Markdown 的简单格式编写内容。

**为什么使用这个主题？**

- 🎓 外观专业、学术化（灵感来自 LaTeX Beamer）
- 🎯 完美适配研究报告、讲座和会议演讲
- ✨ 处理复杂内容，如数学公式和定理
- 🚀 一旦掌握基础，速度远超 PowerPoint

**无需编程经验！** 如果你会写邮件，就能用这个主题创建演示文稿。

---

## 谁应该使用？

这个主题专为以下人群设计：

- 👨‍🎓 **博士生** - 展示研究成果
- 👩‍🏫 **教授** - 制作讲座幻灯片
- 🔬 **研究人员** - 准备会议报告
- 📊 **任何人** - 需要专业学术演示的人

**你不需要是程序员！** 学习曲线平缓，几分钟内就能创建精美的幻灯片。

---

## 快速开始

### 第一步：安装 Slidev

首先，确保已安装 [Node.js](https://nodejs.org/)（从 nodejs.org 下载）。然后打开终端（Windows 上是命令提示符，Mac/Linux 上是终端）并运行：

```bash
npm install -g @slidev/cli
```

> **这是做什么的？** 这会在你的电脑上安装 Slidev，使你可以在任何地方使用它。

### 第二步：创建你的第一个演示文稿

```bash
# 为演示文稿创建一个新文件夹
mkdir my-talk
cd my-talk

# 创建幻灯片文件
echo "---
theme: scholarly
---

# 我的第一个学术报告

你的名字

---

# 引言

- 要点 1
- 要点 2
- 要点 3
" > slides.md
```

### 第三步：预览你的演示文稿

```bash
slidev slides.md
```

浏览器会自动打开并显示你的演示文稿！按右箭头键在幻灯片之间切换。

> **提示：** 保持终端运行。你对 `slides.md` 所做的任何更改都会立即显示在浏览器中！

---

## 核心特性

### 🎨 专业设计

- 简洁的学术美学，灵感来自 LaTeX Beamer
- 所有幻灯片自动添加页眉和页脚
- 整个演示文稿样式一致

### 👥 多作者支持

优雅地显示一位、两位或整个研究团队：

- 1 位作者："张三"
- 2 位作者："张三 & 李四"  
- 3 位作者："张三，李四，王五"
- 4+ 位作者："张三等"

### 🔢 智能定理编号

插入定理、引理、定义并自动编号：

- 每种类型（定理、引理等）都有自己的计数器
- 支持中文和英文
- 可自定义编号格式

### 📐 11 种布局选项

针对不同需求的不同布局：

- 标题幻灯片
- 内容幻灯片
- 章节分隔符
- 图片 + 文字组合
- 还有更多！

### 🌍 多语言支持

支持中文和英文的数学内容。

---

## 理解布局系统

**什么是布局？**
布局就像 PowerPoint 中的幻灯片模板。它决定了内容在幻灯片上的排列方式。

### 如何选择布局

在每张幻灯片的顶部，添加：

```yaml
---
layout: 布局名称
---
```

如果不指定布局，Slidev 会自动使用 `default` 布局。

### 可用布局

#### 1️⃣ **cover** - 标题幻灯片

**用于：** 演示文稿的第一张幻灯片

```markdown
---
layout: cover
authors:
  - name: 你的名字
    institution: 你的大学
    email: you@example.edu
footerMiddle: 2025 年会议名称
---

# 你的演示标题
副标题或描述
```

**显示内容：**

- 居中的大标题
- 带有单位和邮箱的作者信息
- 带有作者、会议和页码的页脚

---

#### 2️⃣ **default** - 标准内容

**用于：** 大部分幻灯片（这是自动的！）

```markdown
---
title: 我的幻灯片标题
subtitle: 可选的副标题
---

# 主要内容

- 要点 1
- 要点 2

你可以添加文本、图片、代码、数学公式等。
```

**显示内容：**

- 可选的带有标题和副标题的页眉
- 中间的内容
- 底部的页脚

---

#### 3️⃣ **intro** - 章节介绍

**用于：** 开始报告的新部分

```markdown
---
layout: intro
---

# 第二部分：研究方法

让我们讨论我们的方法
```

**显示内容：**

- 大字号、居中的文本
- 无页眉（为标题留出更多空间）
- 底部的页脚

---

#### 4️⃣ **section** - 章节分隔符

**用于：** 演示中的重大转换

```markdown
---
layout: section
---

# 研究结果
```

**显示内容：**

- 非常大的居中标题
- 无页眉
- 底部的页脚
- 完美的戏剧性章节分隔

---

#### 5️⃣ **center** - 居中内容

**用于：** 简短信息或关键要点

```markdown
---
layout: center
---

# 核心结论

这是最重要的观点
```

**显示内容：**

- 所有内容水平和垂直居中
- 非常适合强调

---

#### 6️⃣ **quote** - 引用

**用于：** 突出显示引用

```markdown
---
layout: quote
---

生活就像一盒巧克力，你永远不知道下一颗是什么味道。

— 阿甘正传
```

**显示内容：**

- 大字号、样式化的引用
- 下方的出处

---

#### 7️⃣ **fact** - 单个事实/统计数据

**用于：** 突出重要数字或事实

```markdown
---
layout: fact
---

# 95%

我们方法的成功率
```

**显示内容：**

- 非常大的数字或短文本
- 下方较小的描述

---

#### 8️⃣ **statement** - 重要陈述

**用于：** 突出关键陈述

```markdown
---
layout: statement
---

# 我们的方法达到了最先进的结果

超越了所有以前的方法
```

**显示内容：**

- 大字号陈述文本，居中
- 中等宽度以提高可读性

---

#### 9️⃣ **image-left** - 左图右文

**用于：** 用文字解释视觉内容

```markdown
---
layout: image-left
image: ./path/to/image.png
---

# 实验设置

- 设备 A
- 设备 B  
- 设备 C

设置的描述...
```

**显示内容：**

- 左半部分的全高度图片
- 右半部分的内容

---

#### 🔟 **image-right** - 左文右图

**用于：** 文字配支持性视觉内容

```markdown
---
layout: image-right
image: https://example.com/image.jpg
---

# 结果分析

我们的发现显示...

- 发现 1
- 发现 2
```

**显示内容：**

- 左半部分的内容
- 右半部分的全高度图片

---

#### 1️⃣1️⃣ **two-cols** - 双栏

**用于：** 比较或显示并行内容

```markdown
---
layout: two-cols
---

# 方法 A

- 优势 1
- 优势 2
- 优势 3

::right::

# 方法 B

- 优势 1
- 优势 2
- 优势 3
```

**显示内容：**

- 左栏内容（`::right::` 之前）
- 右栏内容（`::right::` 之后）
- 等宽列

---

## 定理组件

### 什么是定理组件？

在学术演示中，你经常需要展示正式的陈述，如定理、引理或定义。这个主题提供了一个特殊的组件，可以：

- 自动为定理编号
- 专业的样式设计
- 支持多种语言

### 基本用法

```markdown
<Theorem type="theorem" title="勾股定理">

对于直角三角形，设两直角边为 $a$ 和 $b$，斜边为 $c$：

$$a^2 + b^2 = c^2$$

</Theorem>
```

**结果：** 一个格式精美的框，标题为"定理 1（勾股定理）"，内部是你的内容。

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

每个有界序列都有一个收敛的子序列。

</Theorem>
```

**带标题的定理：**

```markdown
<Theorem type="definition" title="连续性">

函数 $f$ 在 $x = a$ 处连续，如果...

</Theorem>
```

**手动编号：**

```markdown
<Theorem type="lemma" number="3.2">

这将被编号为"引理 3.2"，而不是自动编号。

</Theorem>
```

**无编号：**

```markdown
<Theorem type="remark" :autoNumber="false">

此注记没有编号。

</Theorem>
```

---

## 配置指南

### 设置你的演示文稿

在 `slides.md` 文件的最顶部，添加一个配置部分：

```yaml
---
theme: scholarly
lang: zh  # 或 'en' 表示英文
footerMiddle: 2025 年会议名称
authors:
  - name: 张三
    institution: 清华大学
    email: zhangsan@tsinghua.edu.cn
  - name: 李四
    institution: 北京大学
    email: lisi@pku.edu.cn
---
```

### 配置选项

#### 基本设置

| 选项 | 作用 | 示例 |
|------|------|------|
| `theme` | 告诉 Slidev 使用这个主题 | `scholarly` |
| `lang` | 定理的语言 | `zh` 或 `en` |
| `aspectRatio` | 幻灯片尺寸 | `16/9` 或 `4/3` |

#### 作者信息

**单个作者：**

```yaml
author: 张三
```

**多个作者（推荐）：**

```yaml
authors:
  - name: 张三
    institution: 清华大学
    email: zhangsan@tsinghua.edu.cn
  - name: 李四
    institution: 北京大学
```

#### 页脚配置

| 选项 | 控制内容 | 示例 |
|------|---------|------|
| `footerLeft` | 页脚左侧 | `自定义文本` |
| `footerMiddle` | 页脚中间 | `2025 年会议` |
| `footerRight` | 页脚右侧（自动） | 页码 |

**默认行为（如果未指定）：**

- 左侧：显示作者姓名
- 中间：空（或你的自定义文本）
- 右侧：页码（自动）

#### 定理编号格式

自定义定理编号的显示方式：

```yaml
theoremNumberFormat: '{number}'      # 1, 2, 3（默认）
theoremNumberFormat: '({number})'    # (1), (2), (3)
theoremNumberFormat: '[{number}]'    # [1], [2], [3]
theoremNumberFormat: '{number}.'     # 1., 2., 3.
```

### 单页设置

你可以为单独的幻灯片覆盖设置：

```markdown
---
title: 特殊幻灯片
subtitle: 带有自定义页眉
---

# 这里是内容
```

---

## 示例

### 完整的最小示例

```markdown
---
theme: scholarly
author: 你的名字
footerMiddle: 我的报告 2025
---

# 我的研究

简要概述

---

# 引言

这是我关于...的研究

- 要点 1
- 要点 2

---
layout: section
---

# 研究方法

---

# 我们的方法

<Theorem type="theorem">

我们证明了我们的算法在 $O(n \log n)$ 时间内运行。

</Theorem>

---

# 谢谢

有问题吗？
```

### 所有功能的示例

查看 [`example-zh.md`](./example-zh.md) 了解所有布局和功能的完整演示。

### 英文示例

查看 [`example.md`](./example.md) 了解完整的英文示例。

---

## 贡献指南

我们欢迎贡献！要开发这个主题：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 将演示导出为 PDF
npm run export

# 生成预览截图
npm run screenshot
```

编辑 `example.md` 或 `example-zh.md` 来测试你的更改。

---

## 许可证

MIT 许可证 - 详见 [LICENSE](./LICENSE)。

---

## 支持

- 📖 **文档**: [Slidev 文档](https://sli.dev)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/pengjiaxin/slidev-theme-scholarly/issues)
- 💬 **讨论**: [GitHub Discussions](https://github.com/slidevjs/slidev/discussions)

---

## 详细功能说明

### Cover 布局（标题页）

封面布局专为演示文稿的标题幻灯片设计。它支持：

- 居中的标题和副标题
- 多个作者，包含姓名、单位和邮箱
- Beamer 风格的带有渐变色的页脚
- 可自定义的页脚部分

**使用多个作者（authors 数组）：**

```yaml
---
theme: scholarly
footerMiddle: 会议名称
authors:
  - name: 第一作者
    institution: 大学一
    email: first@example.edu
  - name: 第二作者
    institution: 大学二
    email: second@example.edu
  - name: 第三作者
    institution: 大学三
    email: third@example.edu
---

# 你的演示标题

你的副标题或描述
```

**使用单个作者：**

```yaml
---
theme: scholarly
author: 你的名字
footerMiddle: 会议或活动名称
---

# 你的演示标题

你的副标题或描述
```

**页脚配置：**

页脚分为三个部分：

- **左侧**：作者信息（自动生成或可自定义）
- **中间**：自定义文本（例如会议名称、活动名称）
- **右侧**：页码（自动生成）

**页脚配置选项：**

```yaml
---
theme: scholarly
footerLeft: 自定义作者文本    # 可选：覆盖作者显示
footerMiddle: 会议名称        # 可选：中间部分文本
authors:
  - name: 第一作者
    institution: 大学一
  - name: 第二作者
    institution: 大学二
---
```

**重要提示：**

- **全局配置**：在 slides.md 文件开头定义的所有 frontmatter 字段（authors、footerLeft、footerMiddle 等）在所有幻灯片中全局可用
- **默认布局**：如果幻灯片未指定布局，将自动使用 `default` 布局
- 使用 `author`（单个作者）或 `authors` 数组（多个作者）
- 不要同时使用 `author` 和 `authors`
- 使用 `authors` 数组时，每个作者可以有 `name`、`institution` 和 `email` 字段
- 作者信息将显示在封面幻灯片的中心
- **页脚配置是全局的**：在演示文稿顶部的 frontmatter 中定义的页脚设置（footerLeft、footerMiddle、authors）将在所有幻灯片上使用
- **页脚左侧部分显示规则：**
  - 1 位作者：显示作者姓名
  - 2 位作者：显示"作者1 & 作者2"
  - 3 位作者：显示"作者1，作者2，作者3"
  - 4+ 位作者：显示"第一作者等"
- 你可以通过在 frontmatter 中设置 `footerLeft` 来覆盖页脚左侧部分
- `conference` 字段已弃用，请使用 `footerMiddle`（向后兼容）

**完整演示示例：**

```markdown
---
theme: scholarly
footerMiddle: "2025 年我的会议"
authors:
  - name: 第一作者
    institution: 大学一
    email: first@example.edu
  - name: 第二作者
    institution: 大学二
    email: second@example.edu
---

# 我的演示标题

副标题文本

---

# 第二张幻灯片

此幻灯片将自动使用默认布局并显示带有作者信息的页脚。

---
layout: intro
---

# 章节介绍

所有布局（cover、default、intro）都将显示在顶部配置的相同页脚。
```

### 其他布局

此主题中的所有布局都包含带有作者和会议信息的 Beamer 风格页脚。

- **`default`** - 带有内容和页脚的默认幻灯片布局
- **`intro`** - 带有大字号文本的介绍幻灯片布局
- **`center`** - 居中内容布局
- **`section`** - 带有大标题的章节分隔符
- **`quote`** - 带有样式化引用的引用布局
- **`fact`** - 带有大字号文本的单个事实或数字
- **`statement`** - 带有中大字号文本的陈述布局
- **`image-left`** - 图片在左侧的双栏布局
- **`image-right`** - 图片在右侧的双栏布局
- **`two-cols`** - 用于一般内容的双栏布局

**使用示例：**

```markdown
---
layout: section
---

# 章节标题

---
layout: image-right
image: https://example.com/image.jpg
---

# 内容标题

内容在这里

---
layout: quote
---

这是一段引用

— 出处

---
layout: two-cols
---

# 左栏

左侧的内容

::right::

# 右栏

右侧的内容
```

**重要提示**：所有布局都自动包含页脚。你不需要手动添加。

### 创建自定义布局

如果需要在演示文稿中创建自定义布局，请确保包含 `<ScholarlyFooter />` 组件以保持一致性：

```vue
<template>
  <div class="slidev-layout my-custom-layout">
    <!-- 你的自定义内容 -->
    <slot />
    
    <!-- 导入页脚组件 -->
    <ScholarlyFooter />
  </div>
</template>

<script setup lang="ts">
import ScholarlyFooter from '@slidev-theme-scholarly/components/ScholarlyFooter.vue'
</script>
```

这确保了无论布局如何，所有幻灯片都显示统一的带有作者和会议信息的页脚。

## 组件

此主题提供以下组件：

### Theorem 组件（定理组件）

`Theorem` 组件允许你在幻灯片中插入数学定理、引理、命题和其他正式陈述，并具有自动编号和多语言支持。

**属性：**

- `type`：陈述类型 - `'theorem'` | `'lemma'` | `'proposition'` | `'corollary'` | `'definition'` | `'example'` | `'remark'`（默认：`'theorem'`）
- `number`：可选的手动编号（字符串或数字）。如果提供，此定理的自动编号将被禁用。
- `title`：定理的可选标题
- `autoNumber`：启用/禁用自动编号（默认：`true`）

**多语言支持：**

在 frontmatter 中设置 `lang` 字段以使用不同的语言：

```yaml
---
theme: scholarly
lang: zh  # 中文 - 默认
# 或
lang: en  # 英文
---
```

**自定义编号格式：**

你可以使用 `theoremNumberFormat` 字段自定义定理编号的显示方式：

```yaml
---
theme: scholarly
lang: zh
theoremNumberFormat: '{number}'  # 默认：仅数字（例如 "1"、"2"、"3"）
# 或
theoremNumberFormat: '({number})'  # 括号（例如 "(1)"、"(2)"、"(3)"）
# 或
theoremNumberFormat: '[{number}]'  # 方括号（例如 "[1]"、"[2]"、"[3]"）
# 或
theoremNumberFormat: '{number}.'  # 带句点（例如 "1."、"2."、"3."）
---
```

`{number}` 占位符将被替换为实际的定理编号。

**自动编号：**

默认情况下，定理会自动编号。每种类型（定理、引理等）都有自己的计数器：

```markdown
---
theme: scholarly
lang: zh
---

# 数学结果

<Theorem type="theorem" title="勾股定理">

对于直角三角形，设两直角边为 $a$ 和 $b$，斜边为 $c$：

$$a^2 + b^2 = c^2$$

</Theorem>
<!-- 显示："定理 1（勾股定理）" -->

<Theorem type="theorem">

另一个定理在这里。

</Theorem>
<!-- 显示："定理 2" -->

<Theorem type="lemma">

一个有用的引理。

</Theorem>
<!-- 显示："引理 1" -->
```

**手动编号：**

你可以通过提供 `number` 属性来覆盖自动编号：

```markdown
<Theorem type="theorem" number="3.1" title="特殊情况">

内容在这里。

</Theorem>
<!-- 显示："定理 3.1（特殊情况）" -->
```

**禁用编号：**

```markdown
<Theorem type="remark" :autoNumber="false">

此注记没有编号。

</Theorem>
<!-- 显示："注"（无编号）" -->
```

**语言示例：**

中文（zh）：

```markdown
<Theorem type="theorem" title="勾股定理">
内容...
</Theorem>
<!-- 显示："定理 1（勾股定理）" -->
```

英文（en）：

```markdown
<Theorem type="theorem" title="Pythagorean Theorem">
Content...
</Theorem>
<!-- 显示："Theorem 1 (Pythagorean Theorem)" -->
```

**更多示例：**

```markdown
<Theorem type="lemma" number="2.1">

闭区间上的每个连续函数都是一致连续的。

</Theorem>

<Theorem type="definition" title="极限">

设 $f$ 是在包含 $a$ 的某个开区间上定义的函数。我们说：

$$\lim_{x \to a} f(x) = L$$

如果对于每个 $\epsilon > 0$，存在 $\delta > 0$ 使得...

</Theorem>

<Theorem type="example">

考虑函数 $f(x) = x^2$。那么：
- $f(0) = 0$
- $f(1) = 1$
- $f(2) = 4$

</Theorem>
```

**可用类型及其颜色：**

- `theorem` - 蓝色（定理）
- `lemma` - 紫色（引理）
- `proposition` - 青色（命题）
- `corollary` - 绿色（推论）
- `definition` - 琥珀色（定义）
- `example` - 粉色（例）
- `remark` - 灰色（注）

每种类型都有独特的配色方案，以帮助在演示中直观地区分它们。

---

**用 ❤️ 为全世界的学者制作**
