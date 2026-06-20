---
title: 快速开始
---

# 快速开始

## 前置要求

安装 Node.js 20 或更新版本。生成的项目使用 `pnpm`。

## 创建演示

不需要全局安装 CLI：

```bash
npx -y --package slidev-theme-scholarly sch init my-talk
cd my-talk
pnpm install
pnpm run dev
```

浏览器会打开 Slidev 实时预览。编辑 `slides.md` 即可开始写作。

## 选择模板

查看可用模板：

```bash
npx -y --package slidev-theme-scholarly sch template list
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
npx -y --package slidev-theme-scholarly sch init paper-session --template paper-talk
npx -y --package slidev-theme-scholarly sch init defense --template thesis-defense
```

如果不确定该选哪个模板，先看[学术工作流指南](./workflows/)。

## 常用 CLI 命令

查看主题提供的资源：

```bash
npx sch theme list
npx sch layout list
npx sch component list
npx sch snippet list
```

应用主题预设或追加常用内容：

```bash
npx sch theme preset apply cambridge --file slides.md
npx sch snippet append theorem --file slides.md
npx sch workflow apply paper --file slides.md
```

检查项目配置：

```bash
npx sch doctor
npx sch doctor --json
```

`sch doctor` 会用 `OK`、`WARN` 和 `ERROR` 报告检查结果，并给出可执行的下一步。
如果要给 CI、脚本或编辑器集成消费同一份诊断，使用 `--json`。

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
