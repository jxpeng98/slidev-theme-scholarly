---
title: 配置指南
---

# 配置指南

文件开头的第一个 YAML 块称为 headmatter，用于设置整份演示；后续 YAML 块用于单张幻灯片。配色和字体预设写在 `themeConfig` 下，`authors`、`bibFile`、`fontsize`、`themeColors` 等字段则直接写在顶层：

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
| `aspectRatio` | 幻灯片尺寸 | `16/9`、`4/3`（默认 `4/3`） |
| `bibFile` | BibTeX 来源 | `./references.bib` |
| `bibStyle` | 参考文献样式 | `apa`、`ieee`、`chicago-author-date` |

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

要修改页脚内容，请设置 `footerLeft`、`footerMiddle` 或 `footerRight`。封面需要显示姓名和单位时，使用结构化的 `authors` 数组。

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
| `footnoteDisplay` | 旧配置位置；新演示请使用下文的顶层字段 | `both` |

配色和区域明暗设置：

| 选项 | 控制范围 | 默认值 |
| --- | --- | --- |
| `colorTheme` | 整体配色：主色、强调色、背景和文字颜色 | `classic-blue` |
| `contentMode` | 页面背景、正文、代码、表格和内容组件 | 先跟随 `colorMode`，再跟随 Slidev 深色状态 |
| `chromeMode` | 页眉、页脚、页码、导航、大纲和工具栏 | `dark` |
| `sectionMode` | `layout: section` 幻灯片的默认外观 | `dark` |
| `colorMode` | `contentMode` 的旧别名 | 已废弃 |

说明：

- 导航按钮会在概览、嵌入和打印/导出视图中隐藏。
- 页脚 TOC 会按 `layout: section` 分组。
- 演示较长时，大纲会优先显示章节，并采用更紧凑的间距。
- 设置了 `hideInToc: true` 的页面不会出现在 TOC 中。
- 旧配置 `outlineSidebar` 和 `outlineSidebarOpen` 仍兼容；新演示建议使用 `outlineToc` 和 `outlineTocOpen`。

## 页面明暗模式

`contentMode` 控制正文，`chromeMode` 控制页眉和放映控件，`sectionMode` 控制章节页。未设置 `contentMode` 时，正文先读取旧配置 `colorMode`，再跟随 Slidev 当前的明暗状态。

```yaml
colorSchema: both
themeConfig:
  colorTheme: high-contrast
  contentMode: light
  chromeMode: dark
  sectionMode: dark
```

可选值、优先级和单个章节页的覆盖方式见[主题模式与对比度](./theme-mode-contrast)。自定义配色使用顶层的 [`themeColors`](./themes#自定义颜色)。

## 定理编号

自定义自动定理编号格式：

```yaml
theoremNumberFormat: '({number})'
```

每次只设置一种格式：

| 格式 | 显示结果 |
|---|---|
| `'{number}'` | 1, 2, 3 |
| `'({number})'` | (1), (2), (3) |
| `'[{number}]'` | [1], [2], [3] |
| `'{number}.'` | 1., 2., 3. |

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
