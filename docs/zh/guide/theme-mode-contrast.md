---
title: 主题模式与对比度
---

# 主题模式与对比度

`colorTheme` 决定整体配色，另外三个选项分别控制不同区域的明暗：
`contentMode` 控制正文页面，`chromeMode` 控制页眉、页脚、导航和工具栏，
`sectionMode` 控制章节页。

| 设置 | 可选值 |
|---|---|
| `contentMode` | `light`、`dark` |
| `chromeMode` | `light`、`dark`、`match`、`inverse` |
| `sectionMode` | `light`、`dark`、`match`、`inverse` |

## 推荐默认值

模板默认不设置 `contentMode`，让演示跟随 Slidev 当前的明暗状态。如果无法提前确定现场显示条件，请明确指定各区域的模式：

```yaml
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  contentMode: light
  chromeMode: dark
  sectionMode: dark
```

- 引用、正文或图表较多时，优先使用 `contentMode: light`。
- 需要更清楚的导航和页脚时，使用 `chromeMode: dark`。
- 章节分隔页可以使用 `sectionMode: dark`，前提是文字足够大。
- 全浅色或全深色演示可使用 `sectionMode: match`。需要让章节页与正文形成对比时，使用 `sectionMode: inverse`。
- 明亮会议室或投影效果不稳定时使用 `high-contrast`。
- 页面主要展示截图、图表或代码时，可以使用 `monochrome`。

## 旧演示迁移与优先级

`colorMode` 是已经弃用的 `contentMode` 别名。迁移时应分别设置正文和界面区域：

```yaml
# 迁移前
themeConfig:
  colorMode: dark

# 迁移后
themeConfig:
  contentMode: dark
  chromeMode: match
```

模式按下面的顺序解析：

```text
contentMode > 旧配置 colorMode > Slidev 当前明暗状态
chromeMode > 未设置 contentMode 时的旧配置 colorMode > dark
单页 sectionMode > 全局 sectionMode > dark
```

`match` 跟随 `contentMode`，`inverse` 则使用相反模式。要单独调整某个章节页，
请在该页的 frontmatter 中覆盖：

```yaml
---
layout: section
sectionMode: inverse
---
```

## 避免低对比度

最容易看不清的情况，是深色文字落在同样偏深的 quote、Highlight 或内容块背景上。
主题会自动处理常见组合，但仍应避免在浅色页面中使用大面积深色高亮。

推荐做法：

- [Highlight](../components/highlight) 只用于短语，不用于整段。
- 需要标题和正文时用 [Block](../components/block) 或 [EvidenceBlock](../components/evidence-block)。
- `type="warning"` 只用于真正的警告；普通强调优先用 `type="info"` 或 `type="primary"`。
- 投影环境较差时，导出前用 `high-contrast` 检查一次可读性。

## 快速检查

分享前运行检查并生成主题预览：

```bash
pnpm exec sch doctor
pnpm run theme:matrix
```

如果只想确认主题预览能否生成：

```bash
node scripts/check-theme-matrix.mjs --dry-run
```
