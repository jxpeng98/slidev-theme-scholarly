---
title: 主题模式与对比度
---

# 主题模式与对比度

Scholarly 将配色身份和可读性 token 分开处理。用 `colorTheme` 控制品牌感，
用 `contentMode` 控制普通页面背景，用 `chromeMode` 控制页眉、页脚、导航、TOC
和工具栏表面，用 `sectionMode` 控制章节分隔页。

## 推荐默认值

起始模板默认省略 `contentMode`，让新演示自动跟随 Slidev 的明暗状态。如果投影环境需要始终稳定的浅色纸张表面，可显式固定为下面这组配置。

```yaml
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  contentMode: light
  chromeMode: dark
  sectionMode: dark
```

- 引用、正文、图表密集的页面优先使用 `contentMode: light`。
- 需要 Beamer 风格导航和页脚对比度时使用 `chromeMode: dark`。
- 章节分隔页可以使用 `sectionMode: dark`，前提是文字足够大。
- 全浅色或全深色演示可使用 `sectionMode: match`；需要和内容表面形成对比时使用 `sectionMode: inverse`。
- 明亮会议室或投影效果不稳定时使用 `high-contrast`。
- 截图、图表或代码应成为视觉主体时可使用 `monochrome`。

## quote 与 Highlight 安全规则

最容易出问题的组合是：页面正文为深色文字，但 quote、Highlight 或语义块背景也偏深。
P0 token 模型已经把 quote、Highlight、Block 和组件 surface 映射到 mode-aware semantic
tokens，但写作者仍应避免在浅色页面上使用大面积深色高亮。

推荐做法：

- [Highlight](../components/highlight) 只用于短语，不用于整段。
- 需要标题和正文时用 [Block](../components/block) 或 [EvidenceBlock](../components/evidence-block)。
- `type="warning"` 只用于真正的警告；普通强调优先用 `type="info"` 或 `type="primary"`。
- 导出前用 `high-contrast` 做一次可访问性检查。

## 快速检查

分享前运行 doctor 和视觉导出：

```bash
pnpm exec sch doctor
pnpm run theme:matrix
```

如果只需要快速检查 matrix 是否可生成：

```bash
node scripts/check-theme-matrix.mjs --dry-run
```
