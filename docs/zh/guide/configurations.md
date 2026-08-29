---
title: 配置指南
---

# 配置指南

大多数演示只需在 `slides.md` 顶部加入一小段 frontmatter：

```yaml
---
theme: scholarly
lang: zh
footerMiddle: 会议名称 2026
authors:
  - name: 张三
    institution: 清华大学
    email: zhangsan@tsinghua.edu.cn
  - name: 李四
    institution: 北京大学
    email: lisi@pku.edu.cn
themeConfig:
  colorTheme: classic-blue
  fontTheme: classic
  chromeMode: dark
  sectionMode: dark
---
```

## 基本选项

| 选项 | 作用 | 示例 |
| --- | --- | --- |
| `theme` | 启用主题 | `scholarly` |
| `lang` | 定理和证明标签语言 | `zh`、`en` |
| `aspectRatio` | 幻灯片尺寸 | `16/9`、`4/3` |
| `bibFile` | BibTeX 来源 | `./references.bib` |
| `bibStyle` | 参考文献样式 | `apa`、`ieee`、`chicago` |

## 作者和页脚

单作者可以使用 `author`，多作者建议使用结构化的 `authors`：

```yaml
authors:
  - name: 张三
    institution: 清华大学
    email: zhangsan@tsinghua.edu.cn
  - name: 李四
    institution: 北京大学
```

页脚默认值：

| 位置 | 默认内容 |
| --- | --- |
| 左侧 | 作者姓名 |
| 中间 | 空，除非设置了 `footerMiddle` |
| 右侧 | 页码 |

要修改页脚内容，请设置 `footerLeft`、`footerMiddle` 或 `footerRight`。

## 主题配置

`themeConfig` 集中管理颜色、字体、页脚导航和大纲：

```yaml
themeConfig:
  colorTheme: oxford-burgundy
  fontTheme: traditional
  chromeMode: dark
  sectionMode: dark
  beamerNav: false
  outlineToc: true
  outlineTocOpen: false
```

| 选项 | 作用 | 默认值 |
| --- | --- | --- |
| `fontTheme` | 字体预设 ID | `classic` |
| `beamerNav` | 放映模式页脚导航按钮 | `true` |
| `outlineToc` | 页脚 TOC 按钮和大纲面板 | `false` |
| `outlineTocOpen` | 加载后默认打开大纲面板 | `false` |
| `footnoteDisplay` | `both`、`hover-only` 或 `notes-only` | `both` |

配色和区域明暗设置：

| 选项 | 控制范围 | 默认值 |
| --- | --- | --- |
| `colorTheme` | 整体配色：主色、强调色、背景和文字颜色 | `classic-blue` |
| `contentMode` | 普通幻灯片画布、可读内容表面、引用、代码、表格、注脚、Highlight、Block 和 Theorem | 先跟随 `colorMode`，再跟随 Slidev 深色状态 |
| `chromeMode` | 页眉、页脚、页码、导航按钮、TOC 和工具栏表面 | `dark` |
| `sectionMode` | `layout: section` 幻灯片的默认外观 | `dark` |
| `colorMode` | `contentMode` 的旧别名 | 已废弃 |
| `themeColors` | 品牌色和页脚颜色的高级 CSS 变量覆盖 | 未设置 |

说明：

- 导航按钮会在概览、嵌入和打印/导出视图中隐藏。
- 页脚 TOC 会按 `layout: section` 分组。
- 演示较长时，大纲会优先显示章节，并采用更紧凑的间距。
- 设置了 `hideInToc: true` 的页面不会出现在 TOC 中。
- 旧配置 `outlineSidebar` 和 `outlineSidebarOpen` 仍兼容；新演示建议使用 `outlineToc` 和 `outlineTocOpen`。

## 页面明暗模式

Slidev 的 `colorSchema` 控制整体的浅色和深色切换。Scholarly 还可以分别设置不同页面区域：

- `contentMode` 控制普通幻灯片画布和可读内容表面。
- `chromeMode` 控制页眉、页脚、页码、导航、TOC 和工具栏表面。
- `sectionMode` 控制 `layout: section` 幻灯片，可取 `light`、`dark`、`match` 和 `inverse`。

`contentMode` 可设为 `light` 或 `dark`，`chromeMode` 可设为 `light`、`dark`、
`match` 或 `inverse`。旧的 `colorMode` 仍然可用；新演示请直接设置 `contentMode`
和 `chromeMode`。如果两项都没有设置，`colorMode` 还会沿用旧版的界面明暗逻辑。

```yaml
colorSchema: both
themeConfig:
  colorTheme: high-contrast
  contentMode: light
  chromeMode: dark
  sectionMode: dark
```

常见组合：

| 目标 | 配置 |
| --- | --- |
| 浅色正文配深色界面和章节页 | `contentMode: light`、`chromeMode: dark`、`sectionMode: dark` |
| 全浅色演示 | `contentMode: light`、`chromeMode: match`、`sectionMode: match` |
| 全深色演示 | `contentMode: dark`、`chromeMode: match`、`sectionMode: match` |
| 优先保证无障碍可读性 | `colorTheme: high-contrast` 并明确设置各区域模式 |

## 定理编号

自定义自动定理编号格式：

```yaml
theoremNumberFormat: '{number}'      # 1, 2, 3
theoremNumberFormat: '({number})'    # (1), (2), (3)
theoremNumberFormat: '[{number}]'    # [1], [2], [3]
theoremNumberFormat: '{number}.'     # 1., 2., 3.
```

使用 `number` 属性可以手动设置单个编号；使用 `:autoNumber="false"` 可以关闭某条陈述的编号。

## 字体大小

设置全局字体大小：

```yaml
fontsize:
  body: 18px
  h1: 48px
  h2: 36px
  h3: 28px
```

单页覆盖：

```markdown
---
fontsize:
  body: 20px
  h1: 50px
---

# 自定义字号页面
```

字号可以使用 `px`、`rem` 或 `em`，也可以直接写数字；纯数字按像素处理。单页设置的优先级高于全局设置。

如果只想调整封面字号，可以在封面页加入局部 CSS：

```markdown
<style>
.slidev-layout.cover h1 {
  font-size: 64px;
}
</style>
```

## 注脚

设置全局注脚显示模式：

```yaml
footnoteDisplay: hover-only
```

单页覆盖：

```markdown
---
footnoteDisplay: notes-only
---
```

优先级：

1. 单页 `footnoteDisplay`
2. 全局 headmatter `footnoteDisplay`
3. 兼容旧配置 `themeConfig.footnoteDisplay`
4. 默认值 `both`

模式：

| 模式 | 行为 |
| --- | --- |
| `both` | 同时显示底部注脚和行内悬停、点击预览 |
| `hover-only` | 只保留行内预览 |
| `notes-only` | 只保留底部注脚 |

## 单页元数据

在单页 frontmatter 中设置标题、副标题、布局选项或局部覆盖：

```markdown
---
layout: figure
title: 模型概览
subtitle: 编码器与适配器路径
hideInToc: true
---
```

页面属性和示例见[布局](../layouts/)与[组件](../components/)。
