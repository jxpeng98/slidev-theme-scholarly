---
title: 学位答辩工作流
---

# 学位答辩工作流

适合需要系统论证、展示证据、回应局限和准备答辩问题的演示。

```bash
sch init defense --template thesis-defense
```

## 推荐布局

- [paper-summary](../../layouts/academic#paper-summary---论文摘要) 用于研究定位。
- [experiment-grid](../../layouts/academic#experiment-grid---实验矩阵) 用于多实验对比。
- [result-highlight](../../layouts/academic#result-highlight---结果高亮) 用于核心结论。
- [limitation](../../layouts/academic#limitation---局限性) 用于已知限制。
- [defense-question](../../layouts/academic#defense-question---答辩问题) 用于预设问答。
- [appendix-index](../../layouts/academic#appendix-index---附录索引) 用于备份页导航。

## 推荐组件

- [EvidenceBlock](../../components/evidence-block) 串联结论、证据和来源。
- [MetricGrid](../../components/metric-grid) 汇总实验指标。
- [CaveatList](../../components/caveat-list) 展示局限和威胁。
- [EquationBlock](../../components/equation-block) 展示关键目标函数或推导。
- [DatasetCard](../../components/dataset-card) 说明数据集和 benchmark。

## 常用片段

```bash
sch snippet append methodology --file slides.md
sch snippet append results --file slides.md
sch snippet append references --file slides.md
```

附录页保持短小，并从主线页面用清楚的标签跳转。

## 主题模式与对比度

答辩环境的投影条件不稳定。优先使用 `high-contrast` 或 `classic-blue`，
密集证据页保持 `contentMode: light` 并搭配 `chromeMode: match`，章节页再使用
`sectionMode: dark`。详见[主题模式与对比度](../theme-mode-contrast)。
