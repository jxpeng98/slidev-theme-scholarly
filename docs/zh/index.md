---
title: 首页
---

# Slidev Theme Scholarly

<div class="flex flex-wrap items-center justify-center gap-2 mb-2">
  <a href="https://www.npmjs.com/package/slidev-theme-scholarly" target="_blank">
    <img src="https://img.shields.io/npm/v/slidev-theme-scholarly?style=for-the-badge&logo=npm&color=1F4E79" alt="NPM Version">
  </a>
  <a href="https://www.npmjs.com/package/slidev-theme-scholarly" target="_blank">
    <img src="https://img.shields.io/npm/dm/slidev-theme-scholarly?style=for-the-badge&logo=npm&label=downloads&color=355C7D" alt="NPM Downloads">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets" target="_blank">
    <img src="https://img.shields.io/visual-studio-marketplace/v/jxpeng98.slidev-scholarly-snippets?style=for-the-badge&label=VS%20Code%20Extension&logo=visualstudiocode&color=2E5A88&cacheSeconds=86400" alt="VS Code Extension Version">
  </a>
  <a href="https://www.npmjs.com/package/slidev-theme-scholarly/v/next" target="_blank">
    <img src="https://img.shields.io/npm/v/slidev-theme-scholarly/next?style=for-the-badge&label=pre-release&logo=npm&color=5C6B73" alt="NPM Next">
  </a>
</div>

<div class="flex flex-wrap items-center justify-center gap-2 mb-4">
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/jxpeng98/slidev-theme-scholarly?style=for-the-badge&logo=github&label=issues&color=4B5563" alt="GitHub issues">
  </a>
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly/pulls" target="_blank">
    <img src="https://img.shields.io/github/issues-pr/jxpeng98/slidev-theme-scholarly?style=for-the-badge&logo=github&label=pull%20requests&color=4B5563" alt="GitHub pull requests">
  </a>
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly" target="_blank">
    <img src="https://img.shields.io/github/stars/jxpeng98/slidev-theme-scholarly?style=for-the-badge&logo=github&label=stars&color=374151" alt="GitHub stars">
  </a>
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/jxpeng98/slidev-theme-scholarly?style=for-the-badge&label=license&color=4B5563" alt="License">
  </a>
</div>

一个专为学术演示设计的 [Slidev](https://sli.dev) 专业主题，采用 LaTeX Beamer 风格的设计。

[在线演示](https://scholarly.jxpeng.dev/) · [学术工作流](./guide/workflows/) · [快速开始](./guide/quick-start) · [GitHub](https://github.com/jxpeng98/slidev-theme-scholarly)

> **注意：即将发布重大升级**
>
> 接下来的版本可能包含不兼容变更（依赖版本、主题配置、布局/组件等），可能影响已有演示文稿。升级前请先阅读[重大升级说明](./guide/upgrade)。
>
> **抢先体验预发布版本：** `npm i -D slidev-theme-scholarly@next`

## ✨ 主要特性

### 🎓 专业学术风格

LaTeX Beamer 风格设计，经典学术蓝配色和现代排版。完美适用于会议、讲座和研究演示。

### 📐 34 种专业布局

按功能分为四个类别，便于查找：

- **结构布局** (7) - 框架和组织
- **内容布局** (6) - 信息展示
- **强调布局** (4) - 突出重点信息
- **学术布局** (15) - 研究工作流与证据展示页面

### 🧩 丰富的组件

内置学术组件，使用简单：

- **定理 (Theorem)** - 定理、引理、定义、证明
- **信息块 (Block)** - Beamer 风格的彩色信息块
- **引用 (Citations)** - BibTeX 集成，自动生成参考文献
- **步骤 (Steps)** - 工作流程和过程可视化
- **关键词 (Keywords)** - 论文关键词标签
- **多栏 (Columns)** - 灵活的多栏布局
- **高亮 (Highlight)** - 文本高亮和强调

### 🎨 可定制主题

从多个维度自由组合主题：

- **9 种配色主题** - 经典蓝、牛津酒红、剑桥绿、耶鲁蓝、普林斯顿橙、北欧灰、单色、高对比度、棕褐色
- **7 种字体主题** - 经典、现代、极简、优雅、科技、学术、当代
- **明暗模式** - 支持浅色和深色模式
- **章节模式** - 独立的明暗章节分隔符

### 📝 开发者友好

- **纯 Markdown** - 无需编码
- **语法糖** - 简化的组件语法
- **类型安全** - 完整的 TypeScript 支持
- **VS Code 扩展** - 代码片段和预览支持
- **热重载** - 开发时即时预览

## 🚀 快速开始

安装主题：

```bash
npm install slidev-theme-scholarly
```

创建演示文稿：

```yaml
---
theme: scholarly
---

# 你的演示标题
副标题或描述
```

[查看完整指南 →](./guide/quick-start)

## 📸 预览

![经典蓝主题](/images/themes/classic-blue/1.png)

[探索所有主题 →](./guide/themes)

## 📚 文档

### 入门指南

- [快速开始](./guide/quick-start) - 5 分钟上手
- [学术工作流](./guide/workflows/) - 按论文报告、答辩、综述、结果报告或课程讲义选择起点
- [主要功能](./guide/features) - 功能概览
- [VS Code 扩展](./guide/vscode-extension) - 安装代码片段和工具
- [主题模式与对比度](./guide/theme-mode-contrast) - 保证 quote、Highlight 和语义块在明暗模式下可读
- [配色与字体主题](./guide/themes) - 探索主题选项

### 布局

- [结构布局](./layouts/structure) - 封面、章节和导航
- [内容布局](./layouts/content) - 文字、图片和分栏
- [强调布局](./layouts/emphasis) - 引用、事实和高亮
- [学术布局](./layouts/academic) - 方法论、结果和参考文献

### 组件

- [定理 (Theorem)](./components/theorem) - 数学定理和证明
- [信息块 (Block)](./components/block) - 信息块
- [引用 (Citations)](./components/cite) - BibTeX 引用和参考文献
- [步骤 (Steps)](./components/steps) - 流程可视化
- [关键词 (Keywords)](./components/keywords) - 关键词标签
- [多栏 (Columns)](./components/columns) - 多栏布局
- [高亮 (Highlight)](./components/highlight) - 文本高亮
- [MetricCard](./components/metric-card) - 关键结果指标
- [EvidenceBlock](./components/evidence-block) - 结论、证据与来源

## 👥 适用人群

- 👨‍🎓 **博士生** - 展示论文和研究成果
- 👩‍🏫 **教授** - 制作课程讲座和研讨会
- 🔬 **研究人员** - 准备会议报告和论文
- 🏢 **专业人士** - 进行技术演示
- 📊 **任何人** - 需要精美学术演示的人

**无需编程经验！**

## 🌟 为什么选择 Scholarly？

### 学术卓越

由研究人员设计，为研究人员服务。每个布局和组件都遵循学术演示的最佳实践。

### 节省时间

不再与 PowerPoint 搏斗。用 Markdown 编写，即时预览，导出为 PDF 或在线托管。

### 版本控制

你的演示文稿是纯文本文件。使用 Git 跟踪更改，通过 GitHub 协作，永不丢失工作。

### 现代技术栈

基于 Slidev 构建，由 Vue 和 Vite 驱动。导出为 PDF，随处托管，或直接在浏览器中演示。

## 🤝 贡献

欢迎贡献！查看我们的[贡献指南](./contributing)开始贡献。

## 📄 许可证

MIT 许可证 - 查看 [LICENSE](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/LICENSE) 了解详情。

---

**准备好创建精美的学术演示了吗？**

[开始使用 →](./guide/quick-start) · [查看示例 →](https://scholarly.jxpeng.dev/)
