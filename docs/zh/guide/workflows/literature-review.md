---
title: 文献综述工作流
---

# 文献综述工作流

准备读书会、综述报告，或需要在研讨课中比较已有工作时，可以从 `reading-group` 模板开始：

```bash
npx -y slidev-theme-scholarly init reading-session --template reading-group
```

## 推荐布局

- [paper-summary](../../layouts/academic#paper-summary)：概括单篇论文。
- [related-work-matrix](../../layouts/academic#related-work-matrix)：横向比较多篇工作。
- [compare](../../layouts/academic#compare)：对比两类方法。
- [timeline](../../layouts/academic#timeline)：梳理领域发展线索。
- [references](../../layouts/academic#references)：整理参考文献。

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

从初稿开始就保留参考文献页，便于尽早发现无法解析的引用 key。

## 主题模式与对比度

文献综述往往包含大量引用。建议使用 `contentMode: light` 和 `chromeMode: match`，
避免在浅色页面上使用大面积深色 quote，Highlight 只用于短语。详见[主题模式与对比度](../theme-mode-contrast)。
