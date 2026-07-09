---
title: 配置指南
---

# 配置指南

多数演示只需要一个简短的 frontmatter。把它放在 `slides.md` 顶部：

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

使用 `footerLeft`、`footerMiddle` 或 `footerRight` 可以覆盖显示文本。

## 主题配置

使用 `themeConfig` 控制视觉和放映行为：

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
| `fontTheme` | 字体预设 id | `classic` |
| `beamerNav` | 放映模式页脚导航按钮 | `true` |
| `outlineToc` | 页脚 TOC 按钮和大纲面板 | `false` |
| `outlineTocOpen` | 加载后默认打开大纲面板 | `false` |
| `footnoteDisplay` | `both`、`hover-only` 或 `notes-only` | `both` |

色彩和表面控制：

| 选项 | 控制范围 | 默认值 |
| --- | --- | --- |
| `colorTheme` | 品牌调色板：主色、强调色、纸张色调和基础文字色 | `classic-blue` |
| `contentMode` | 普通幻灯片画布、可读内容表面、引用、代码、表格、注脚、Highlight、Block 和 Theorem | 先跟随 `colorMode`，再跟随 Slidev 深色状态 |
| `chromeMode` | 页眉、页脚、页码、导航按钮、TOC 和工具栏表面 | `dark` |
| `sectionMode` | `layout: section` 幻灯片的默认外观 | `dark` |
| `colorMode` | `contentMode` 的旧别名 | 已废弃 |
| `themeColors` | 品牌色和页脚颜色的高级 CSS 变量覆盖 | 未设置 |

说明：

- 导航按钮会在概览、嵌入和打印/导出视图中隐藏。
- 页脚 TOC 会按 `layout: section` 分组。
- 长演示会切换为更紧凑的 section 优先视图。
- 设置了 `hideInToc: true` 的页面不会出现在 TOC 中。
- 旧配置 `outlineSidebar` 和 `outlineSidebarOpen` 仍兼容；新演示建议使用 `outlineToc` 和 `outlineTocOpen`。

## 色彩表面模式

Slidev 的 `colorSchema` 控制播放器层面的浅色/深色切换。Scholarly 将主题表面拆成显式控制项：

- `contentMode` 控制普通幻灯片画布和可读内容表面。
- `chromeMode` 控制页眉、页脚、页码、导航、TOC 和工具栏表面。
- `sectionMode` 控制 `layout: section` 幻灯片，可取 `light`、`dark`、`match` 和 `inverse`。

`contentMode` 可取 `light` 和 `dark`。`chromeMode` 可取 `light`、`dark`、`match`
和 `inverse`。旧配置 `colorMode` 仍作为 `contentMode` 的兼容别名保留；未显式设置
`contentMode` 且未显式设置 `chromeMode` 时，它也会保留旧的外壳模式行为。新演示应使用
`contentMode` 和 `chromeMode`。

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
| 浅色学术内容配深色外壳和章节页 | `contentMode: light`、`chromeMode: dark`、`sectionMode: dark` |
| 全浅色演示 | `contentMode: light`、`chromeMode: match`、`sectionMode: match` |
| 全深色演示 | `contentMode: dark`、`chromeMode: match`、`sectionMode: match` |
| 优先保证可访问性 | `colorTheme: high-contrast` 并显式设置各表面模式 |

## 定理编号

自定义自动定理编号格式：

```yaml
theoremNumberFormat: '{number}'      # 1, 2, 3
theoremNumberFormat: '({number})'    # (1), (2), (3)
theoremNumberFormat: '[{number}]'    # [1], [2], [3]
theoremNumberFormat: '{number}.'     # 1., 2., 3.
```

使用 `number` prop 可以设置单个手动编号，使用 `:autoNumber="false"` 可以关闭某个陈述的编号。

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

接受 `px`、`rem`、`em` 和数字。数字会按像素处理。单页设置会覆盖全局设置。

如果只想调整封面字号，可以在封面页使用 scoped CSS：

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
| `both` | 底部注脚加行内 hover/click 预览 |
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

页面级 props 和示例见[布局](../layouts/)与[组件](../components/)。
