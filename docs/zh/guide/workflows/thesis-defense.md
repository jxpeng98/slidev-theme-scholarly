---
title: 学位答辩工作流
---

# 学位答辩工作流

答辩需要把论点和证据连起来，也要交代局限，并为提问和备份材料留出位置。可以从下面的模板开始：

```bash
npx -y slidev-theme-scholarly init defense --template thesis-defense
```

## 推荐布局

- [paper-summary](../../layouts/academic#paper-summary)：说明研究定位。
- [experiment-grid](../../layouts/academic#experiment-grid)：比较多组实验。
- [result-highlight](../../layouts/academic#result-highlight)：强调核心结论。
- [limitation](../../layouts/academic#limitation)：交代已知限制。
- [defense-question](../../layouts/academic#defense-question)：提前准备问答。
- [appendix-index](../../layouts/academic#appendix-index)：导航备份页。

## 推荐组件

- [EvidenceBlock](../../components/evidence-block) 串联结论、证据和来源。
- [MetricGrid](../../components/metric-grid) 汇总实验指标。
- [CaveatList](../../components/caveat-list) 展示研究局限和有效性威胁。
- [EquationBlock](../../components/equation-block) 展示关键目标函数或推导。
- [DatasetCard](../../components/dataset-card) 说明数据集和评测基准。

## 常用片段

```bash
pnpm exec sch snippet append methodology --file slides.md
pnpm exec sch snippet append results --file slides.md
pnpm exec sch snippet append references --file slides.md
```

附录页尽量简短，并在正文中用清晰的标签链接过去。

## 主题模式与对比度

答辩现场的灯光和投影往往难以预料。优先使用 `high-contrast` 或 `classic-blue`，
密集证据页保持 `contentMode: light` 并搭配 `chromeMode: match`，章节页再使用
`sectionMode: dark`。详见[主题模式与对比度](../theme-mode-contrast)。
