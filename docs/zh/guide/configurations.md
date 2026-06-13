---
title: 配置指南
---

# 配置指南

## 设置你的演示文稿

在 `slides.md` 文件的最顶部, 添加一个配置部分：

```yaml
---
theme: scholarly
lang: zh  # 或 'en' 表示英文
footerMiddle: 2025 年会议名称
authors:
  - name: 张三
    institution: 清华大学
    email: zhangsan@tsinghua.edu.cn
  - name: 李四
    institution: 北京大学
    email: lisi@pku.edu.cn
---
```

## 配置选项

### 基本设置

| 选项 | 作用 | 示例 |
|------|------|------|
| `theme` | 告诉 Slidev 使用这个主题 | `scholarly` |
| `lang` | 定理的语言 | `zh` 或 `en` |
| `aspectRatio` | 幻灯片尺寸 | `16/9` 或 `4/3` |

### 作者信息

**单个作者：**

```yaml
author: 张三
```

**多个作者（推荐）：**

```yaml
authors:
  - name: 张三
    institution: 清华大学
    email: zhangsan@tsinghua.edu.cn
  - name: 李四
    institution: 北京大学
```

### 页脚配置

| 选项 | 控制内容 | 示例 |
|------|---------|------|
| `footerLeft` | 页脚左侧 | `自定义文本` |
| `footerMiddle` | 页脚中间 | `2025 年会议` |
| `footerRight` | 页脚右侧（自动） | 页码 |

**默认行为（如果未指定）：**

- 左侧：显示作者姓名
- 中间：空（或你的自定义文本）
- 右侧：页码（自动）

### 主题配置

可以通过 `themeConfig` 控制主题级行为：

```yaml
themeConfig:
  colorTheme: oxford-burgundy
  fontTheme: traditional
  colorMode: light
  sectionMode: dark
  beamerNav: false  # 隐藏页脚导航按钮
  outlineToc: true
  outlineTocOpen: false
```

| 选项 | 控制内容 | 默认值 |
|------|---------|--------|
| `themeConfig.colorTheme` | Scholarly 配色预设 id，例如 `classic-blue`、`oxford-burgundy` 或 `high-contrast` | `classic-blue` |
| `themeConfig.fontTheme` | Scholarly 字体预设 id，例如 `classic`、`traditional` 或 `technical` | `classic` |
| `themeConfig.colorMode` | Scholarly 的语义 token 模式，影响页眉、页脚、highlight、引用、代码、表格、Block 和 Theorem 的可读颜色 | 跟随 Slidev 深色模式，默认深色外壳 |
| `themeConfig.sectionMode` | `layout: section` 页面默认外观 | `dark` |
| `themeConfig.beamerNav` | 在放映视图中显示 beamer 风格页脚导航按钮 | `true` |
| `themeConfig.outlineToc` | 在页脚显示一个紧凑 TOC 按钮，点击后唤起目录面板 | `false` |
| `themeConfig.outlineTocOpen` | 初始加载时默认展开目录面板 | `false` |
| `themeConfig.footnoteDisplay` | 脚注静态显示和 hover 行为：`both`、`hover-only` 或 `notes-only` | `both` |

说明：

- 这些按钮只会出现在实际放映视图中。
- 在概览、嵌入和打印/导出视图中会自动隐藏。
- TOC 面板会按 `layout: section` 分组，并列出组内可跳转页面。
- 在桌面端放映视图中，如果设备支持 hover 且视口足够宽，悬停或键盘聚焦 TOC 条目时会在面板左侧显示对应页面预览。
- TOC 打开时会默认预览当前页；如果当前页被 `hideInToc: true` 隐藏，则自动回退到第一个可见目录项。
- 单页设置 `hideInToc: true` 时会自动隐藏该页。
- `outlineSidebar` / `outlineSidebarOpen` 旧配置仍然兼容，但新配置建议使用 `outlineToc` / `outlineTocOpen`。

### Slidev Color Schema 与 Scholarly Color Mode

Slidev 的 `colorSchema` 控制 Slidev 内置的浅色/深色切换，以及播放器是否允许切换模式。Scholarly 的 `themeConfig.colorMode` 控制本主题的语义 CSS token，包括外壳、highlight、引用、代码、表格、Block 和 Theorem 的表面颜色。

当你希望 Slidev UI 支持两种模式时，使用 `colorSchema: both`。当你希望整套 Scholarly 可读 token 固定在某个模式时，使用 `themeConfig.colorMode`。

```yaml
---
theme: scholarly
colorSchema: both
themeConfig:
  colorTheme: high-contrast
  colorMode: light
  sectionMode: dark
---
```

常见组合：

| 场景 | 配置 |
|------|------|
| 浅色学术内容 + 深色章节页 | `themeConfig.colorMode: light` 和 `themeConfig.sectionMode: dark` |
| 深色页眉/页脚 + 可读内容强调 | `themeConfig.colorMode: dark` |
| 优先保证可访问性 | `themeConfig.colorTheme: high-contrast` 并显式设置 `themeConfig.colorMode` |

### 定理编号格式

自定义定理编号的显示方式：

```yaml
theoremNumberFormat: '{number}'      # 1, 2, 3（默认）
theoremNumberFormat: '({number})'    # (1), (2), (3)
theoremNumberFormat: '[{number}]'    # [1], [2], [3]
theoremNumberFormat: '{number}.'     # 1., 2., 3.
```

### 字体大小配置

你可以全局或按页面自定义正文和标题（h1, h2, h3）的字体大小.

**全局字体大小（应用于所有幻灯片）：**

```yaml
---
theme: scholarly
fontsize:
  body: 18px    # 正文的基础字体大小
  h1: 48px      # h1 标题的字体大小
  h2: 36px      # h2 标题的字体大小
  h3: 28px      # h3 标题的字体大小
---
```

**单页字体大小覆盖：**

你可以通过在该幻灯片的 frontmatter 中添加 `fontsize` 配置来覆盖单个幻灯片的字体大小：

```markdown
---
fontsize:
  body: 20px
  h1: 50px
  h2: 40px
  h3: 30px
---

# 此幻灯片具有自定义字体大小

## 具有自定义 h2 大小的副标题

### 具有自定义 h3 大小的次级副标题

此幻灯片上的正文将为 20px.
```

**仅更改封面幻灯片的字体大小：**

由于第一张幻灯片自动使用封面布局, 而全局 frontmatter 中的设置会应用到所有幻灯片, 自定义封面幻灯片字体大小的最佳方法是使用内联 CSS 样式.

在封面幻灯片的注释部分添加 `<style>` 标签：

```markdown
---
theme: scholarly
authors:
  - name: 你的名字
    institution: 你的大学
---

# 你的演示标题
副标题文本

<style>
.slidev-layout.cover h1 {
  font-size: 64px;
}

.slidev-layout.cover h2 {
  font-size: 40px;
}
</style>

---

# 引言

此幻灯片使用默认字体大小.
```

你可以用这种方式自定义封面幻灯片的任何 CSS 属性：

```markdown
<style>
.slidev-layout.cover h1 {
  font-size: 72px;
  color: #5d8392;
  font-weight: bold;
}

.slidev-layout.cover .author-name {
  font-size: 24px;
}

.slidev-layout.cover .author-institution {
  font-size: 20px;
}
</style>
```

**替代方案：对内容幻灯片使用 fontsize：**

如果你希望大多数幻灯片使用自定义字体大小, 但保持封面使用默认大小, 可以在每张内容幻灯片上设置 `fontsize`：

```markdown
---
theme: scholarly
---

# 封面幻灯片（默认大字体）

---
fontsize:
  body: 16px
  h1: 36px
---

# 幻灯片 2（自定义字体）

---
fontsize:
  body: 16px
  h1: 36px
---

# 幻灯片 3（自定义字体）
```

**灵活的格式：**

字体大小接受多种格式：

```yaml
fontsize:
  body: 18px      # 像素
  h1: 3rem        # rem 单位
  h2: 2.5em       # em 单位
  h3: 32          # 数字（视为像素）
```

**字体大小注意事项：**

- 所有字体大小选项都是可选的 - 你可以设置任意组合
- 单页设置会覆盖全局设置
- 如果未指定, 主题使用为每种布局优化的默认字体大小
- 字体大小使用 CSS 变量应用, 以实现最大兼容性

### 注脚显示模式配置

你可以在首页 headmatter 中设置全局注脚显示模式，并在单页 frontmatter 中按需覆盖。

**全局注脚显示模式（默认应用到所有页面）：**

```yaml
---
theme: scholarly
footnoteDisplay: hover-only
---
```

**单页注脚显示模式覆盖：**

```markdown
---
footnoteDisplay: notes-only
---
```

优先级顺序：

- 单页 `footnoteDisplay`
- 首页 headmatter `footnoteDisplay`
- 兼容旧配置 `themeConfig.footnoteDisplay`
- 默认值 `both`

可用取值：

- `both`：同时保留底部注脚和行内 hover / click 预览
- `hover-only`：隐藏底部注脚，只保留行内预览
- `notes-only`：保留底部注脚，并关闭 hover / click 浮窗

## 单页设置

你可以为单独的幻灯片覆盖设置：

```markdown
---
title: 特殊幻灯片
subtitle: 带有自定义页眉
---

# 这里是内容
```
