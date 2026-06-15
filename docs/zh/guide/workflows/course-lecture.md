---
title: 课程讲义工作流
---

# 课程讲义工作流

适合课程、教程和结构化教学材料，重点是概念、例子和阶段性总结。

```bash
sch init lecture --template basic
```

## 推荐布局

- [toc](../../layouts/structure#toc) 用于课程大纲。
- [section](../../layouts/structure#section) 用于模块分隔。
- [two-cols](../../layouts/content#two-cols) 用于概念与例子并排。
- [auto-size](../../layouts/structure#auto-size) 用于文字较多的讲解页。
- [focus](../../layouts/emphasis#focus) 用于关键 takeaway。

## 推荐组件

- [Theorem](../../components/theorem) 用于定义、引理和证明。
- [Block](../../components/block) 用于提示、警告和例子。
- [Steps](../../components/steps) 用于流程。
- [Columns](../../components/columns) 用于例子与解释并排。
- [Highlight](../../components/highlight) 用于短词高亮，不建议高亮整段。

## 常用片段

```bash
sch snippet append theorem --file slides.md
sch snippet append block --file slides.md
sch snippet append section --file slides.md
```

尽早加入例子，把可选推导放到附录或备份页。

## 主题模式与对比度

课程页通常需要远距离阅读。讲解页保持 `colorMode: light`，章节页可使用
`sectionMode: dark`，避免低对比 quote 或 Highlight 组合。详见[主题模式与对比度](../theme-mode-contrast)。
