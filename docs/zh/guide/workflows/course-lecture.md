---
title: 课程讲义工作流
---

# 课程讲义工作流

课程讲义往往要在概念讲解、示例和阶段性总结之间切换。可以从 `basic` 模板开始：

```bash
npx -y slidev-theme-scholarly init lecture --template basic
```

## 推荐布局

- [toc](../../layouts/structure#toc)：课程大纲。
- [section](../../layouts/structure#section)：分隔课程模块。
- [two-cols](../../layouts/content#two-cols)：并排讲解概念和例子。
- [auto-size](../../layouts/structure#auto-size)：容纳文字较多的讲解页。
- [focus](../../layouts/emphasis#focus)：强调关键结论。

## 推荐组件

- [Theorem](../../components/theorem)：定义、引理和证明。
- [Block](../../components/block)：提示、警告和例子。
- [Steps](../../components/steps)：分步讲解流程。
- [Columns](../../components/columns)：并排展示例子和解释。
- [Highlight](../../components/highlight)：高亮短语，不建议用于整段文字。

## 常用片段

```bash
pnpm exec sch snippet append theorem --file slides.md
pnpm exec sch snippet append block --file slides.md
pnpm exec sch snippet append section --file slides.md
```

尽早加入例子，把可选推导放到附录或备份页。

## 主题模式与对比度

坐在教室后排也应该看得清幻灯片。讲解页建议使用 `contentMode: light` 和
`chromeMode: match`，章节页可以使用 `sectionMode: dark`。同时注意检查 quote 和
Highlight 的对比度。详见[主题模式与对比度](../theme-mode-contrast)。
