# Slidev 学术主题 (Scholarly Theme)

<p align="center">
  <a href="https://www.npmjs.com/package/slidev-theme-scholarly">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/slidev-theme-scholarly?style=for-the-badge&logo=npm&color=1F4E79" />
  </a>
  <a href="https://www.npmjs.com/package/slidev-theme-scholarly">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/slidev-theme-scholarly?style=for-the-badge&logo=npm&label=downloads&color=355C7D" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets">
    <img alt="VS Code Extension Version" src="https://img.shields.io/visual-studio-marketplace/v/jxpeng98.slidev-scholarly-snippets?style=for-the-badge&label=VS%20Code%20Extension&logo=visualstudiocode&color=2E5A88&cacheSeconds=86400" />
  </a>
  <a href="https://www.npmjs.com/package/slidev-theme-scholarly/v/next">
    <img alt="NPM Next" src="https://img.shields.io/npm/v/slidev-theme-scholarly/next?style=for-the-badge&label=pre-release&logo=npm&color=5C6B73" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/jxpeng98/slidev-theme-scholarly?style=for-the-badge&logo=github&label=issues&color=4B5563" />
  </a>
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly/pulls">
    <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/jxpeng98/slidev-theme-scholarly?style=for-the-badge&logo=github&label=pull%20requests&color=4B5563" />
  </a>
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/jxpeng98/slidev-theme-scholarly?style=for-the-badge&logo=github&label=stars&color=374151" />
  </a>
  <a href="./LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/jxpeng98/slidev-theme-scholarly?style=for-the-badge&label=license&color=4B5563" />
  </a>
</p>

[English](./README.md) · [在线演示](https://scholarly.jxpeng.dev/) · [文档](https://scholarly-docs.jxpeng.dev/zh/)

一个专为学术演示设计的 [Slidev](https://sli.dev) 专业主题，采用 LaTeX Beamer 风格的设计。

> **⚠️ 注意事项**
>
> 接下来的版本可能包含不兼容变更。升级前请先阅读[重大升级说明](https://scholarly-docs.jxpeng.dev/zh/guide/upgrade.html)。
>
> **抢先体验预发布版本：**
> ```bash
> npm i -D slidev-theme-scholarly@next
> ```

---

## ✨ 主要特性

| 特性 | 说明 |
|------|------|
| 🎓 **专业设计** | LaTeX Beamer 风格，学术感十足 |
| 📐 **34 种布局** | 结构、内容、强调、学术四大类别 |
| 🧩 **丰富组件** | 定理、信息块、引用、指标、证据、论文卡片、列表 |
| 🎨 **9 种配色主题** | 经典蓝、牛津、剑桥、耶鲁、普林斯顿、北欧、单色、棕褐、高对比度 |
| 🌓 **显式表面模式** | 分别控制 `contentMode`、`chromeMode` 和 `sectionMode` |
| 📚 **引用与注脚** | 支持 BibTeX 参考文献，以及带内联预览的学术化 Markdown 注脚 |
| 📝 **语法糖** | 简化的 Markdown 指令语法 |
| 🔧 **VS Code 扩展** | 代码片段、预览、BibTeX 集成 |

---

## 🚀 快速开始

### 前置要求

安装 Node.js 20 或更新版本。

### 使用 CLI 创建（推荐）

一次性使用 `npx` 时，请使用完整包名：

```bash
npx -y slidev-theme-scholarly init my-talk --template academic
cd my-talk
pnpm install
pnpm run dev
```

`npx` 必须先取得 CLI 代码才能执行。当本地尚未安装这个包时，npm 会把它
临时安装到自己的缓存目录，不会写入当前项目，也不是全局安装。`-y` 会自动
确认这次缓存安装，避免出现交互式询问。

不创建项目，直接查看可用模板：

```bash
npx -y slidev-theme-scholarly template list
```

初始化模板已经内建 Scholarly 的 citation 支持。正常使用这个主题时，不需要再额外维护项目级 `vite.config`。

### 使用项目本地 CLI

生成的项目已经把 Scholarly 声明为开发依赖。已有 Slidev 项目需要先安装：

```bash
pnpm add -D slidev-theme-scholarly
```

然后通过项目的包管理器执行短命令 `sch`：

```bash
pnpm exec sch --version
```

使用 npm 时，执行 `npm i -D slidev-theme-scholarly`，再使用 `npx sch`。
`sts` 和 `scholarly` 都是 `sch` 的别名。

常用命令：

```bash
# 查看帮助
pnpm exec sch help
pnpm exec sch help theme

# 查看 Scholarly 主题资产
pnpm exec sch theme list
pnpm exec sch layout list
pnpm exec sch component list
pnpm exec sch snippet list

# 一键写入 Scholarly 主题预设到 frontmatter
pnpm exec sch theme apply oxford-burgundy --font traditional --file slides.md
pnpm exec sch theme preset apply oxford --file slides.md

# 追加学术片段到 slides
pnpm exec sch snippet append theorem --file slides.md
pnpm exec sch snippet append references --file slides.md

# 追加整套学术演示骨架
pnpm exec sch workflow list
pnpm exec sch workflow apply paper --file slides.md

# 根据 BibTeX 生成论文摘要
pnpm exec sch paper summary --bib references.bib --key sample2026

# 检查环境和项目状态（包含 Scholarly 检查）
pnpm exec sch doctor
pnpm exec sch doctor --json
```

### 可选的全局 CLI

不需要全局安装也能使用 Scholarly CLI。如果希望在项目外直接使用短命令：

```bash
npm i -g slidev-theme-scholarly
sch template list
# 别名：sts、scholarly
```

### 手动创建演示文稿

```markdown
---
theme: scholarly
authors:
  - name: 你的名字
    institution: 你的大学
themeConfig:
  colorTheme: classic-blue
  chromeMode: dark
  sectionMode: dark
footerMiddle: 2026 年会议
---

# 你的演示标题

副标题或描述

---

# 引言

- 要点 1
- 要点 2
- 要点 3
```

启用主题后，BibTeX 引用和 `references` 布局会自动工作。直接使用 `layout: references` 就能生成参考文献页；只有在你想自定义 bibliography 的插入位置时，才需要手动写 `[[bibliography]]`。

### 预览

```bash
npx slidev
```

---

## 📐 布局

布局分为**四个类别**：

### 结构布局

| 布局 | 说明 |
|------|------|
| `cover` | 带作者的标题页 |
| `default` | 标准内容页 |
| `intro` | 章节介绍 |
| `section` | 章节分隔符 |
| `center` | 居中内容 |
| `auto-center` | 自动居中内容 |
| `auto-size` | 保留默认流式正文的自适应字号 |
| `end` | 结束页 |

### 内容布局

| 布局 | 说明 |
|------|------|
| `two-cols` | 双栏布局 |
| `image-left` | 左图右文 |
| `image-right` | 左文右图 |
| `bullets` | 增强列表 |
| `figure` | 带标题的学术图片 |
| `split-image` | 分割图片布局 |

### 强调布局

| 布局 | 说明 |
|------|------|
| `quote` | 样式化引用 |
| `fact` | 单个事实/统计数据 |
| `statement` | 重要陈述 |
| `focus` | 带图标的聚焦陈述 |

### 学术布局

| 布局 | 说明 |
|------|------|
| `compare` | 并排对比 |
| `methodology` | 研究方法 |
| `results` | 研究结果 |
| `timeline` | 时间线可视化 |
| `agenda` | 演示议程 |
| `acknowledgments` | 致谢 |
| `references` | 参考文献 |

**用于：** 开始报告的新部分
[查看布局文档 →](https://scholarly-docs.jxpeng.dev/zh/layouts/structure.html)

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
## 🧩 组件

---
| 组件 | 说明 | 示例 |
|------|------|------|
| **Theorem** | 定理、引理、定义 | `<Theorem type="theorem">...</Theorem>` |
| **Block** | Beamer 风格信息块 | `<Block type="info">...</Block>` |
| **Citations** | BibTeX 引用 | `@citekey` 或 `!@citekey` |
| **Steps** | 流程可视化 | `<Steps :steps="[...]" />` |
| **Keywords** | 关键词标签 | `<Keywords :keywords="[...]" />` |
| **Columns** | 多栏布局 | `<Columns :columns="2">...</Columns>` |
| **Highlight** | 文本高亮 | `<Highlight>文本</Highlight>` |

[查看组件文档 →](https://scholarly-docs.jxpeng.dev/zh/components/index.html)

---

## 🎨 主题预览

<details open>
<summary><b>经典蓝（默认）</b></summary>
<table>
  <tr>
    <td><img src="./images/themes/classic-blue/1.png" width="220" alt="封面"/></td>
    <td><img src="./images/themes/classic-blue/2.png" width="220" alt="章节"/></td>
    <td><img src="./images/themes/classic-blue/3.png" width="220" alt="内容"/></td>
    <td><img src="./images/themes/classic-blue/4.png" width="220" alt="引用"/></td>
  </tr>
</table>
</details>

<details>
<summary><b>牛津酒红</b></summary>
<table>
  <tr>
    <td><img src="./images/themes/oxford/1.png" width="220" alt="封面"/></td>
    <td><img src="./images/themes/oxford/2.png" width="220" alt="章节"/></td>
    <td><img src="./images/themes/oxford/3.png" width="220" alt="内容"/></td>
    <td><img src="./images/themes/oxford/4.png" width="220" alt="引用"/></td>
  </tr>
</table>
</details>

<details>
<summary><b>剑桥绿</b></summary>
<table>
  <tr>
    <td><img src="./images/themes/cambridge/1.png" width="220" alt="封面"/></td>
    <td><img src="./images/themes/cambridge/2.png" width="220" alt="章节"/></td>
    <td><img src="./images/themes/cambridge/3.png" width="220" alt="内容"/></td>
    <td><img src="./images/themes/cambridge/4.png" width="220" alt="引用"/></td>
  </tr>
</table>
</details>

<details>
<summary><b>更多主题...</b></summary>

- 耶鲁蓝
- 普林斯顿橙
- 北欧蓝
- 单色
- 暖棕褐
- 高对比度

[查看所有主题 →](https://scholarly-docs.jxpeng.dev/zh/guide/themes.html)
</details>

---

## 📚 文档

### 入门指南

- [快速开始](https://scholarly-docs.jxpeng.dev/zh/guide/quick-start.html) - 5 分钟上手
- [重大升级说明](https://scholarly-docs.jxpeng.dev/zh/guide/upgrade.html) - 版本迁移指南
- [主要功能](https://scholarly-docs.jxpeng.dev/zh/guide/features.html) - 功能概览
- [配置](https://scholarly-docs.jxpeng.dev/zh/guide/configurations.html) - 主题配置选项
- [主题](https://scholarly-docs.jxpeng.dev/zh/guide/themes.html) - 配色和字体主题

### 布局

- [结构布局](https://scholarly-docs.jxpeng.dev/zh/layouts/structure.html) - 封面、章节、导航
- [内容布局](https://scholarly-docs.jxpeng.dev/zh/layouts/content.html) - 文字、图片、分栏
- [强调布局](https://scholarly-docs.jxpeng.dev/zh/layouts/emphasis.html) - 引用、事实、高亮
- [学术布局](https://scholarly-docs.jxpeng.dev/zh/layouts/academic.html) - 方法论、结果、参考文献

### 组件

- [定理 (Theorem)](https://scholarly-docs.jxpeng.dev/zh/components/theorem.html) - 数学定理
- [信息块 (Block)](https://scholarly-docs.jxpeng.dev/zh/components/block.html) - 信息块
- [引用 (Citations)](https://scholarly-docs.jxpeng.dev/zh/components/cite.html) - BibTeX 引用
- [步骤 (Steps)](https://scholarly-docs.jxpeng.dev/zh/components/steps.html) - 流程可视化
- [关键词 (Keywords)](https://scholarly-docs.jxpeng.dev/zh/components/keywords.html) - 关键词标签
- [多栏 (Columns)](https://scholarly-docs.jxpeng.dev/zh/components/columns.html) - 多栏布局
- [高亮 (Highlight)](https://scholarly-docs.jxpeng.dev/zh/components/highlight.html) - 文本高亮

### 进阶

- [语法糖](https://scholarly-docs.jxpeng.dev/zh/syntax-sugar.html) - Markdown 指令
- [VS Code 扩展](https://scholarly-docs.jxpeng.dev/zh/guide/vscode-extension.html) - 代码片段和工具
- [示例](https://scholarly-docs.jxpeng.dev/zh/examples.html) - 完整示例

---

## 👥 适用人群

- 👨‍🎓 **博士生** - 展示论文和研究成果
- 👩‍🏫 **教授** - 制作课程讲座
- 🔬 **研究人员** - 准备会议报告
- 📊 **任何人** - 需要精美学术演示的人

**无需编程经验！**

---

## 🔧 VS Code 扩展

使用我们的 VS Code 扩展提高效率：

- 🎯 侧边栏面板，快速访问布局/组件
- ✨ 代码片段：输入 `ss-` 插入布局/组件
- ⚡ 智能补全：`layout:`、`themeConfig`、`<组件>`、`:::` 指令可直接候选
- 📚 BibTeX 集成，自动补全
- 👁️ **可视化预览**：在侧边栏直接预览各种布局、组件和主题的实际效果

[从 Releases 下载 →](https://github.com/jxpeng98/slidev-theme-scholarly/releases)

---

## 🤝 贡献

欢迎贡献！

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

[查看贡献指南 →](https://scholarly-docs.jxpeng.dev/zh/contributing.html)

---

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](./LICENSE)。

---

## 🙏 致谢

Slidev Theme Scholarly 的视觉设计灵感源自
[LaTeX Beamer](https://ctan.org/pkg/beamer)。

特别感谢 [linux.do 社区](https://linux.do/) 在 AI 工具实践方面的经验分享、
深入讨论与宝贵反馈。

---

## 🔗 链接

- [📖 文档](https://scholarly-docs.jxpeng.dev/zh/)
- [🎬 在线演示](https://scholarly.jxpeng.dev/)
- [🐛 问题反馈](https://github.com/jxpeng98/slidev-theme-scholarly/issues)
- [💬 讨论](https://github.com/slidevjs/slidev/discussions)
- [📦 NPM 包](https://www.npmjs.com/package/slidev-theme-scholarly)

---
