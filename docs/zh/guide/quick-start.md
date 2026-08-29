---
title: 快速开始
description: 创建、编写、检查并导出 Scholarly 演示。
---

# 快速开始

按下面五步操作，就能从空目录创建一份可预览、可导出的演示。开始前请确认 Node.js 版本不低于 20。

## 1. 准备环境

```bash
node --version
pnpm --version
```

如果没有 `pnpm`，运行 `npm install -g pnpm`。

## 2. 创建项目

### 选择模板

```bash
npx -y slidev-theme-scholarly template list
```

拿不准时，先用 `academic`。其他模板分别适合论文报告、研讨会、学位答辩、读书会、短报告和中文演示；选择建议见[学术工作流](./workflows/)。

### 生成项目

```bash
npx -y slidev-theme-scholarly init my-talk --template academic
cd my-talk
pnpm install
```

## 3. 预览并编写

### 启动预览

```bash
pnpm run dev
```

命令会自动打开浏览器；之后每次保存 `slides.md`，页面都会刷新。

### 编辑 slides.md

编辑 `slides.md`，用 `---` 分隔幻灯片：

```markdown
---
theme: scholarly
---

# 演示标题

希望听众记住的内容

---
layout: section
---

# 研究方法
```

## 4. 选择并添加内容

### 查看布局、组件和片段

```bash
pnpm exec sch layout list
pnpm exec sch component list
pnpm exec sch snippet list
```

[布局](../layouts/)决定整张幻灯片的结构，[组件](../components/)负责定理、指标、证据等页面内容。

### 应用片段、工作流或主题

```bash
pnpm exec sch snippet append theorem --file slides.md
pnpm exec sch workflow apply paper --file slides.md
pnpm exec sch theme preset apply oxford --file slides.md
```

这些命令都会直接修改 `slides.md`，按需要选择一条运行。

## 5. 检查并导出

### 检查项目

```bash
pnpm exec sch doctor
```

演示前请修复所有 `ERROR`。`WARN` 是建议项，可以按实际需要处理。

### 导出 PDF 或网站

```bash
pnpm run export  # 导出 PDF
pnpm run build   # 构建网站到 dist/
```

## 添加到已有 Slidev 项目

```bash
pnpm add -D slidev-theme-scholarly
```

在 `slides.md` 中启用主题，然后继续使用原项目的命令：

```markdown
---
theme: scholarly
---
```

Scholarly 会从主题包加载引用支持，不需要项目级 `vite.config.ts`。

## 可选的全局 CLI

正常使用不需要全局安装。只有需要在项目外运行 `sch` 时，才执行：

```bash
npm i -g slidev-theme-scholarly
sch help
```
