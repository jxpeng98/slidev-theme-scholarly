---
title: 快速开始
description: 创建 Scholarly 项目，编写幻灯片，再导出 PDF 或构建网站。
---

# 快速开始

本页从新建文件夹开始，带你完成一份可运行的演示。已有 Slidev 项目可以直接跳到[添加主题](#添加到已有-slidev-项目)。如果习惯在编辑器中操作，请参阅 [VS Code 插件](./vscode-extension)。

## 1. 准备环境

建议使用 **Node.js 24 LTS** 和 **pnpm 10**。先检查版本：

```bash
node --version
pnpm --version
```

尚未安装 pnpm 时，运行：

```bash
npm install -g pnpm@10
```

当前 Slidev/Vite 工具链要求 Node.js `^20.19.0 || >=22.12.0`，并非所有 Node 20 或 22 版本都可用。新项目建议直接使用 Node 24。详见 [Vite 环境要求](https://vite.dev/guide/)和 [Node.js 版本计划](https://nodejs.org/en/about/previous-releases)。

## 2. 创建项目

先使用带参考文献文件的 `academic` 模板：

```bash
npx -y slidev-theme-scholarly init my-talk --template academic
cd my-talk
pnpm install
```

CLI 会创建 `slides.md`、`package.json` 和 README；含引用的模板还会带上 `references.bib`。目标文件夹非空时，命令会停止，不会覆盖已有内容。

想换一个起点，可以运行 `npx -y slidev-theme-scholarly template list`。[学术工作流](./workflows/)列出了论文报告、答辩、综述、结果报告和课程讲义的模板选择建议。

## 3. 预览并编写

```bash
pnpm run dev
```

保持终端运行。浏览器会自动打开，之后每次保存 `slides.md`，预览都会更新。

文件开头的第一个 YAML 块设置整份演示，后续配置块设置单张幻灯片。用 `---` 分隔页面：

```markdown
---
theme: scholarly
lang: zh
---

# 演示标题

希望听众记住的内容

---
layout: section
---

# 研究方法
```

[布局](../layouts/)安排整张幻灯片，[组件](../components/)则在布局中加入定理、指标等内容。在 Vue 组件标签内编写 Markdown 时，请在正文前后保留空行。

## 4. 添加内容

先查看可用的布局、组件和片段：

```bash
pnpm exec sch layout list
pnpm exec sch component list
pnpm exec sch snippet list
```

在 `slides.md` 末尾追加一个定理片段：

```bash
pnpm exec sch snippet append theorem --file slides.md
```

`snippet append` 在文件末尾追加内容，不会跟随编辑器光标，也不一定新建一页。`workflow apply` 则追加一组片段；追加后先检查内容，再决定是否添加其他工作流：

```bash
pnpm exec sch workflow list
pnpm exec sch workflow apply paper --file slides.md
```

主题命令会更新文件开头的 YAML 配置：

```bash
pnpm exec sch theme preset apply oxford --file slides.md
```

## 5. 检查并导出 {#check-and-export}

运行项目检查，并按提示处理问题：

```bash
pnpm exec sch doctor
```

修复所有 `ERROR`，再检查与当前项目有关的 `WARN`。doctor 检查环境和引用配置；是否溢出、图片是否缺失、文字是否易读，仍需查看实际幻灯片。

### 导出 PDF

CLI 导出需要 Playwright 和 Chromium。在演示项目中安装一次，再运行导出：

```bash
pnpm add -D playwright-chromium
pnpm exec playwright install chromium
pnpm run export
```

终端会显示 PDF 路径。不方便安装浏览器时，也可以在基于 Chromium 的浏览器中打开 Slidev 的 **Export** 页面。PNG、PPTX、页码范围等选项见 [Slidev 导出文档](https://sli.dev/guide/exporting)。

### 构建网站

```bash
pnpm run build
```

命令会将静态网站写入 `dist/`。将该目录上传到静态托管服务后，网站才会对外发布。部署到子路径时，还需设置 Slidev 的 `--base` 选项，详见 [Slidev 托管文档](https://sli.dev/guide/hosting)。

## 添加到已有 Slidev 项目

```bash
pnpm add -D slidev-theme-scholarly
```

在 `slides.md` 的第一个 YAML 块中设置 `theme: scholarly`，保留其他配置，并继续使用原项目的预览和构建命令。如果同时更新 Slidev，请先查看[升级说明](./upgrade)。

主题会自动加载引用支持，无需额外创建 `vite.config.ts`。添加 BibTeX 文件和参考文献页的步骤见[引用](../components/cite)。

## 可选的全局 CLI

项目内的 `pnpm exec sch` 使用当前项目安装的主题版本。项目外可以使用前面的 `npx -y slidev-theme-scholarly`，也可以全局安装：

```bash
npm i -g slidev-theme-scholarly
sch help
```
