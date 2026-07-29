---
title: 快速开始
---

# 快速开始

## 前置要求

安装 Node.js 20 或更新版本。生成的项目使用 `pnpm`。

## 创建演示

不需要全局安装 CLI：

```bash
npx -y slidev-theme-scholarly init my-talk
cd my-talk
pnpm install
pnpm run dev
```

浏览器会打开 Slidev 实时预览。编辑 `slides.md` 即可开始写作。

第一次运行 `npx` 时，npm 可能需要先下载 Scholarly 才能执行 CLI。这个临时
安装保存在 npm 缓存中，不会写入当前项目，也不是全局安装。`-y` 会自动确认
这次缓存安装，避免交互式询问。

## 选择模板

查看可用模板：

```bash
npx -y slidev-theme-scholarly template list
```

常用选择：

| 模板 | 适用场景 |
| --- | --- |
| `basic` | 最小英文起步模板 |
| `academic` | 带 BibTeX 的通用学术演示 |
| `paper-talk` | 论文报告：摘要、方法、结果与参考文献 |
| `seminar` | 学术研讨：议程、相关工作、方法与讨论 |
| `thesis-defense` | 学位答辩：实验、局限、问答与附录索引 |
| `reading-group` | 论文批判和小组讨论 |
| `conference-lightning` | 聚焦单个结果的短报告 |
| `zh` | 最小中文起步模板 |

用指定模板创建：

```bash
npx -y slidev-theme-scholarly init paper-session --template paper-talk
npx -y slidev-theme-scholarly init defense --template thesis-defense
```

如果不确定该选哪个模板，先看[学术工作流指南](./workflows/)。

## 常用 CLI 命令

执行 `pnpm install` 后，通过 `pnpm exec` 调用项目本地的 `sch` 命令。
这样使用的 CLI 版本会与项目声明的版本保持一致。

查看主题提供的资源：

```bash
pnpm exec sch theme list
pnpm exec sch layout list
pnpm exec sch component list
pnpm exec sch snippet list
```

应用主题预设或追加常用内容：

```bash
pnpm exec sch theme preset apply cambridge --file slides.md
pnpm exec sch snippet append theorem --file slides.md
pnpm exec sch workflow apply paper --file slides.md
```

检查项目配置：

```bash
pnpm exec sch doctor
pnpm exec sch doctor --json
```

`sch doctor` 会用 `OK`、`WARN` 和 `ERROR` 报告检查结果，并给出可执行的下一步。
如果要给 CI、脚本或编辑器集成消费同一份诊断，使用 `--json`。

使用 npm 时，请先在项目中安装 `slidev-theme-scholarly`，再运行 `npx sch`。
全局安装是可选的：

```bash
npm i -g slidev-theme-scholarly
sch template list
```

## 手动方式

安装主题：

```bash
npm i -D slidev-theme-scholarly
```

在 `slides.md` 的 frontmatter 中设置：

```markdown
---
theme: scholarly
bibFile: references.bib
bibStyle: apa
---
```

运行 Slidev：

```bash
npx slidev
```

Scholarly 会从主题包内部注册 citation hook。正常使用时不需要项目级 `vite.config.ts`。

添加参考文献页：

```markdown
---
layout: references
---
```

只有当你需要精确控制 bibliography 在该页中的插入位置时，才需要写 `[[bibliography]]`。
