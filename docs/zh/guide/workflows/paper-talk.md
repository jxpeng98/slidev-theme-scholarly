---
title: 论文报告工作流
---

# 论文报告工作流

适合会议报告、组会汇报，或围绕一篇论文展开的读书会报告。

```bash
npx -y slidev-theme-scholarly init paper-session --template paper-talk
```

## 推荐布局

- [paper-summary](../../layouts/academic#paper-summary---论文摘要) 用于论文概览。
- [method-pipeline](../../layouts/academic#method-pipeline---方法流程) 用于方法流程。
- [result-highlight](../../layouts/academic#result-highlight---结果高亮) 用于核心结果。
- [limitation](../../layouts/academic#limitation---局限性) 用于平衡讨论。
- [references](../../layouts/academic#references) 用于参考文献。

## 推荐组件

- [PaperCard](../../components/paper-card) 展示标题、作者、会议和贡献。
- [ContributionList](../../components/contribution-list) 拆分论文贡献。
- [EvidenceBlock](../../components/evidence-block) 把结论和证据放在一起。
- [MetricCard](../../components/metric-card) 或 [MetricGrid](../../components/metric-grid) 展示关键数字。
- [Cite](../../components/cite) 和 BibTeX 标记处理引用。

## 常用片段

```bash
pnpm exec sch snippet append cite --file slides.md
pnpm exec sch snippet append methodology --file slides.md
pnpm exec sch snippet append results --file slides.md
```

在 VS Code 侧边栏中用预览快速判断某一页更适合布局还是组件。

## 主题模式与对比度

论文报告通常有密集文字、公式和结果高亮。引用密集页面建议使用
`contentMode: light` 搭配 `chromeMode: match`，章节分隔页再使用
`sectionMode: dark`。使用 quote 或 Highlight 前先检查[主题模式与对比度](../theme-mode-contrast)。
