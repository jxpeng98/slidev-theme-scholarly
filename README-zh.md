# Slidev Theme Scholarly

[Slidev Theme Scholarly](https://scholarly-docs.jxpeng.dev/zh/) 是一套用于论文报告、学位答辩、课程讲义和研究汇报的 Slidev 主题。用 Markdown 编写幻灯片，用布局和组件组织研究内容，再用 BibTeX 管理引用。主题附带命令行工具，也可以搭配 VS Code 插件使用。

[![npm](https://img.shields.io/npm/v/slidev-theme-scholarly?label=npm&color=1F4E79)](https://www.npmjs.com/package/slidev-theme-scholarly)
[![VS Code](https://img.shields.io/visual-studio-marketplace/v/jxpeng98.slidev-scholarly-snippets?label=VS%20Code&color=2E5A88)](https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets)
[![license](https://img.shields.io/github/license/jxpeng98/slidev-theme-scholarly?color=4B5563)](./LICENSE)

[文档](https://scholarly-docs.jxpeng.dev/zh/) | [在线演示](https://scholarly.jxpeng.dev/) | [English](./README.md)

![使用 Slidev Theme Scholarly 制作的研究报告](https://scholarly-docs.jxpeng.dev/images/themes/classic-blue/1.png)

## 主要功能

- 适用于论文报告、答辩、课程讲义和研究汇报的模板与布局
- 展示定理、指标、证据、图片和论文摘要的组件
- BibTeX 引用与参考文献页
- 配色、字体和浅色/深色显示模式
- 创建、编辑、检查和导出演示的命令行工具与 VS Code 插件

> 正在升级已有演示？请先阅读[升级说明](https://scholarly-docs.jxpeng.dev/zh/guide/upgrade)。

## 快速开始

### 1. 创建项目

建议使用 Node.js 24 LTS 和 pnpm 10。尚未安装 pnpm 时，先运行 `npm install -g pnpm@10`，再创建项目：

```bash
npx -y slidev-theme-scholarly init my-talk --template academic
cd my-talk
pnpm install
```

拿不准时，先用 `academic`。要比较其他模板，运行：

```bash
npx -y slidev-theme-scholarly template list
```

### 2. 预览并编写

```bash
pnpm run dev
```

命令会自动打开浏览器；之后每次保存 `slides.md`，预览都会刷新。

用 `---` 分隔幻灯片：

```markdown
---
theme: scholarly
authors:
  - name: 你的名字
    institution: 你的大学
---

# 演示标题

希望听众记住的核心内容

---
layout: section
---

# 研究方法
```

### 3. 添加结构和内容

先列出可用的布局、组件和片段：

```bash
pnpm exec sch layout list
pnpm exec sch component list
pnpm exec sch snippet list
```

例如，在文件末尾追加一个定理块：

```bash
pnpm exec sch snippet append theorem --file slides.md
```

具体写法见[布局文档](https://scholarly-docs.jxpeng.dev/zh/layouts/)和[组件文档](https://scholarly-docs.jxpeng.dev/zh/components/)。

### 4. 检查并导出

```bash
pnpm exec sch doctor
pnpm add -D playwright-chromium
pnpm exec playwright install chromium
pnpm run export
```

CLI 导出前需要完成一次 Playwright 安装。导出结束后，终端会显示 PDF 路径。`pnpm run build` 会把静态网站写入 `dist/`，再将该目录部署到网站托管服务。详见[导出与部署](https://scholarly-docs.jxpeng.dev/zh/guide/quick-start#check-and-export)。

## 添加到已有 Slidev 项目

```bash
pnpm add -D slidev-theme-scholarly
```

在 `slides.md` 的第一个 YAML 配置块中设置 `theme: scholarly`，继续使用原项目的预览和构建命令。引用还需要 BibTeX 文件，具体步骤见[引用配置](https://scholarly-docs.jxpeng.dev/zh/components/cite)。Scholarly 会自行加载引用支持，无需额外创建 `vite.config.ts`。

## 在 VS Code 中使用

安装 [Slidev Scholarly for VS Code](https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets) 后，打开一个 Markdown 文件，再在右侧 Secondary Side Bar 中打开 **Slidev Scholarly**。

从侧边栏选择模板可创建完整项目；Deck Builder 用于整理大纲并生成 Markdown，也可以向已有文件追加页面。常用命令面板操作包括：

- `Slidev Scholarly: Create Presentation`
- `Slidev Scholarly: Open Deck Builder`
- `Slidev Scholarly: Insert Citation`

其余用法见 [VS Code 插件指南](https://scholarly-docs.jxpeng.dev/zh/guide/vscode-extension)。

## 按需求查阅文档

| 目标 | 阅读 |
|---|---|
| 准备论文报告、答辩、综述、结果报告或课程讲义 | [学术工作流](https://scholarly-docs.jxpeng.dev/zh/guide/workflows/) |
| 选择整张幻灯片的结构 | [布局](https://scholarly-docs.jxpeng.dev/zh/layouts/) |
| 添加定理、指标或证据 | [组件](https://scholarly-docs.jxpeng.dev/zh/components/) |
| 添加 BibTeX 参考文献 | [引用](https://scholarly-docs.jxpeng.dev/zh/components/cite) |
| 修改颜色、字体或页面明暗 | [配置](https://scholarly-docs.jxpeng.dev/zh/guide/configurations) |
| 复制完整演示 | [示例](https://scholarly-docs.jxpeng.dev/zh/examples) |
| 查看源文件 | [研究报告示例](./examples/example-academic.md)和[布局画廊](./examples/example-academic-gallery.md) |

运行 `pnpm exec sch help` 可以查看全部 CLI 命令。只有需要在项目外使用 `sch` 时，才需要全局安装：`npm i -g slidev-theme-scholarly`。

## 参与贡献

```bash
pnpm install --frozen-lockfile
pnpm --dir vscode-extension install --frozen-lockfile
pnpm run dev
# 停止预览后再运行检查。
pnpm run check
```

请先阅读[贡献指南](https://scholarly-docs.jxpeng.dev/zh/contributing)。项目使用 [MIT](./LICENSE) 许可证。
