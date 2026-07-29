---
title: 文献综述工作流
---

# 文献综述工作流

适合读书会、综述报告或研讨课中比较已有工作的部分。

```bash
npx -y slidev-theme-scholarly init reading-session --template reading-group
```

## 推荐布局

- [paper-summary](../../layouts/academic#paper-summary---论文摘要) 用于单篇论文概览。
- [related-work-matrix](../../layouts/academic#related-work-matrix---相关工作矩阵) 用于横向比较。
- [compare](../../layouts/academic#compare) 用于两类方法对比。
- [timeline](../../layouts/academic#timeline) 用于领域发展线索。
- [references](../../layouts/academic#references) 用于参考文献。

## 推荐组件

- [PaperCard](../../components/paper-card) 展示论文元信息。
- [ContributionList](../../components/contribution-list) 拆分贡献。
- [CaveatList](../../components/caveat-list) 梳理局限与空白。
- [Keywords](../../components/keywords) 展示分类标签。
- [Cite](../../components/cite) 添加解释性引用说明。

## 常用片段

```bash
pnpm exec sch snippet append cite --file slides.md
pnpm exec sch workflow apply seminar --file slides.md
```

写作早期就保留 references 页，便于及时发现未解析的引用 key。

## 主题模式与对比度

文献综述通常引用密集。建议使用 `contentMode: light` 搭配 `chromeMode: match`，
避免在浅色页面上放大面积深色 quote，Highlight 只用于短语。详见[主题模式与对比度](../theme-mode-contrast)。
