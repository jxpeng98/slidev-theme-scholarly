---
title: 色彩与字体主题
---

# 色彩与字体主题

Slidev Theme Scholarly v2.0 引入了可定制的色彩和字体主题，以匹配您机构的品牌或个人偏好。

## 主题预览

<div class="theme-gallery">
  <div class="theme-section">
    <h3>经典蓝（默认）</h3>
    <div class="theme-slides">
      <img src="/images/themes/classic-blue/1.png" alt="经典蓝 - 封面" />
      <img src="/images/themes/classic-blue/2.png" alt="经典蓝 - 章节" />
      <img src="/images/themes/classic-blue/3.png" alt="经典蓝 - 内容" />
      <img src="/images/themes/classic-blue/4.png" alt="经典蓝 - 引用" />
    </div>
  </div>

  <div class="theme-section">
    <h3>牛津酒红</h3>
    <div class="theme-slides">
      <img src="/images/themes/oxford/1.png" alt="牛津 - 封面" />
      <img src="/images/themes/oxford/2.png" alt="牛津 - 章节" />
      <img src="/images/themes/oxford/3.png" alt="牛津 - 内容" />
      <img src="/images/themes/oxford/4.png" alt="牛津 - 引用" />
    </div>
  </div>

  <div class="theme-section">
    <h3>剑桥绿</h3>
    <div class="theme-slides">
      <img src="/images/themes/cambridge/1.png" alt="剑桥 - 封面" />
      <img src="/images/themes/cambridge/2.png" alt="剑桥 - 章节" />
      <img src="/images/themes/cambridge/3.png" alt="剑桥 - 内容" />
      <img src="/images/themes/cambridge/4.png" alt="剑桥 - 引用" />
    </div>
  </div>

  <div class="theme-section">
    <h3>耶鲁蓝</h3>
    <div class="theme-slides">
      <img src="/images/themes/yale/1.png" alt="耶鲁 - 封面" />
      <img src="/images/themes/yale/2.png" alt="耶鲁 - 章节" />
      <img src="/images/themes/yale/3.png" alt="耶鲁 - 内容" />
      <img src="/images/themes/yale/4.png" alt="耶鲁 - 引用" />
    </div>
  </div>

  <div class="theme-section">
    <h3>普林斯顿橙</h3>
    <div class="theme-slides">
      <img src="/images/themes/princeton/1.png" alt="普林斯顿 - 封面" />
      <img src="/images/themes/princeton/2.png" alt="普林斯顿 - 章节" />
      <img src="/images/themes/princeton/3.png" alt="普林斯顿 - 内容" />
      <img src="/images/themes/princeton/4.png" alt="普林斯顿 - 引用" />
    </div>
  </div>

  <div class="theme-section">
    <h3>北欧蓝</h3>
    <div class="theme-slides">
      <img src="/images/themes/nordic/1.png" alt="北欧 - 封面" />
      <img src="/images/themes/nordic/2.png" alt="北欧 - 章节" />
      <img src="/images/themes/nordic/3.png" alt="北欧 - 内容" />
      <img src="/images/themes/nordic/4.png" alt="北欧 - 引用" />
    </div>
  </div>

  <div class="theme-section">
    <h3>单色</h3>
    <div class="theme-slides">
      <img src="/images/themes/monochrome/1.png" alt="单色 - 封面" />
      <img src="/images/themes/monochrome/2.png" alt="单色 - 章节" />
      <img src="/images/themes/monochrome/3.png" alt="单色 - 内容" />
      <img src="/images/themes/monochrome/4.png" alt="单色 - 引用" />
    </div>
  </div>

  <div class="theme-section">
    <h3>暖棕褐色</h3>
    <div class="theme-slides">
      <img src="/images/themes/sepia/1.png" alt="棕褐色 - 封面" />
      <img src="/images/themes/sepia/2.png" alt="棕褐色 - 章节" />
      <img src="/images/themes/sepia/3.png" alt="棕褐色 - 内容" />
      <img src="/images/themes/sepia/4.png" alt="棕褐色 - 引用" />
    </div>
  </div>

  <div class="theme-section">
    <h3>高对比度</h3>
    <div class="theme-slides">
      <img src="/images/themes/high-contrast/1.png" alt="高对比度 - 封面" />
      <img src="/images/themes/high-contrast/2.png" alt="高对比度 - 章节" />
      <img src="/images/themes/high-contrast/3.png" alt="高对比度 - 内容" />
      <img src="/images/themes/high-contrast/4.png" alt="高对比度 - 引用" />
    </div>
  </div>
</div>

<style>
.theme-gallery {
  margin: 2rem 0;
}
.theme-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
.theme-section h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}
.theme-slides {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.theme-slides img {
  width: 100%;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: transform 0.2s, box-shadow 0.2s;
}
.theme-slides img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
@media (max-width: 768px) {
  .theme-slides {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .theme-slides {
    grid-template-columns: 1fr;
  }
}
</style>

## 色彩主题

从 9 种专业设计的调色板中选择：

### 经典学术蓝（默认）

受传统学术机构启发的默认主题。

```yaml
---
theme: scholarly
# 经典蓝是默认主题，无需额外配置
---
```

**颜色：**
- 主色：`#1e3a5f`（深学术蓝）
- 强调色：`#b8860b`（学术金）
- 背景：`#fdfbf7`（暖象牙白）

### 牛津酒红

受牛津大学启发的丰富酒红色。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: oxford-burgundy
---
```

**颜色：**
- 主色：`#862633`（牛津酒红）
- 强调色：`#c5a572`（古董金）
- 背景：`#faf8f5`（米白色）

### 剑桥绿

让人联想到剑桥大学的经典绿色。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: cambridge-green
---
```

**颜色：**
- 主色：`#00543c`（剑桥绿）
- 强调色：`#d4af37`（金色）

### 耶鲁蓝

传统耶鲁蓝，呈现出色外观。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: yale-blue
---
```

**颜色：**
- 主色：`#0f4d92`（耶鲁蓝）
- 强调色：`#d4af37`（金色）

### 普林斯顿橙

充满活力的橙色，适合富有激情的演示。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: princeton-orange
---
```

**颜色：**
- 主色：`#e87722`（普林斯顿橙）
- 强调色：`#1c1c1c`（黑色）

### 单色专业

简洁、专业的灰度主题。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: monochrome
---
```

### 暖棕褐色

温暖、复古风格的棕褐色调。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: warm-sepia
---
```

### 北欧蓝

清爽、斯堪的纳维亚风格的蓝色调色板。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: nordic-blue
---
```

### 高对比度（无障碍）

最大对比度主题，满足无障碍需求。符合 WCAG AAA 标准。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: high-contrast
---
```

**颜色：**
- 主色：`#000000`（黑色）
- 强调色：`#0066cc`（蓝色）
- 背景：`#ffffff`（白色）

## 字体主题

从 8 种精心策划的字体组合中选择：

### 经典 Palatino（默认）

传统学术排版，使用 Palatino 衬线和 Helvetica 无衬线。

```yaml
---
theme: scholarly
# Classic 是默认字体主题
---
```

**字体：**
- 衬线：Palatino Linotype, Book Antiqua, Palatino
- 无衬线：Helvetica Neue, Helvetica, Arial

### 现代学术

使用 Georgia 和 Source Sans Pro 的现代学术风格。

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: modern
---
```

**字体：**
- 衬线：Georgia, Cambria
- 无衬线：Source Sans Pro, Segoe UI, Roboto

### 传统 Garamond

使用 Garamond 的经典图书排版。

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: traditional
---
```

**字体：**
- 衬线：Garamond, Baskerville
- 无衬线：Gill Sans, Optima, Helvetica

### 当代无衬线

简洁、现代、以无衬线字体为主的设计。

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: contemporary
---
```

**字体：**
- 衬线：Charter, Georgia, Cambria
- 无衬线：Inter, SF Pro Display, Segoe UI

### 人文主义

温暖、易读的人文主义字体。

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: humanist
---
```

**字体：**
- 衬线：Crimson Text, Libre Baskerville, Georgia
- 无衬线：Open Sans, Noto Sans

### 技术风格

受 LaTeX 启发的技术排版。

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: technical
---
```

**字体：**
- 衬线：Computer Modern, Latin Modern
- 无衬线：IBM Plex Sans, Roboto

### 优雅衬线

精致、优雅的衬线排版。

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: elegant
---
```

**字体：**
- 衬线：Cormorant Garamond, EB Garamond
- 无衬线：Montserrat, Lato

### 无衬线默认

以无衬线字体为主的现代演示风格。

```yaml
---
theme: scholarly
themeConfig:
  fontTheme: sans-default
---
```

**字体：**
- 无衬线：Inter, SF Pro Display, system-ui
- 衬线：Georgia, Cambria（备用）

## 组合主题

您可以组合色彩和字体主题：

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: oxford-burgundy
  fontTheme: traditional
  contentMode: light # 普通幻灯片和可读内容表面
  chromeMode: dark   # 页眉、页脚、TOC 和工具栏表面
  sectionMode: dark  # 章节页外观
---
```

## 表面模式

分别控制可读内容表面、播放器外壳和章节分隔页：

| 选项 | 控制范围 | 可选值 |
|-------|----------|--------|
| `contentMode` | 普通幻灯片画布、引用、代码、表格、注脚、Highlight、Block 和 Theorem | `light`、`dark` |
| `chromeMode` | 页眉、页脚、页码、导航按钮、TOC 和工具栏表面 | `light`、`dark`、`match`、`inverse` |
| `sectionMode` | 默认章节页外观 | `light`、`dark`、`match`、`inverse` |

旧配置 `colorMode` 仍作为 `contentMode` 的废弃别名保留。未设置 `contentMode`
时，Scholarly 会先读取 `colorMode`，再跟随 Slidev 当前的浅色/深色状态。为了兼容旧
演示，未设置 `contentMode` 和 `chromeMode` 时，`colorMode` 也会继续驱动外壳模式。

### 迁移示例

```yaml
# 迁移前
themeConfig:
  colorTheme: classic-blue
  colorMode: dark
  sectionMode: dark

# 迁移后
themeConfig:
  colorTheme: classic-blue
  contentMode: light
  chromeMode: dark
  sectionMode: dark
```

```yaml
# 全浅色演示
themeConfig:
  colorTheme: high-contrast
  contentMode: light
  chromeMode: match
  sectionMode: match
```

```yaml
# 全深色演示
themeConfig:
  colorTheme: nordic-blue
  contentMode: dark
  chromeMode: match
  sectionMode: match
```

### 全局默认值

在首页 headmatter 中设置：

```yaml
---
theme: scholarly
themeConfig:
  contentMode: light
  chromeMode: dark
  sectionMode: dark
---
```

### 优先级链

```
contentMode > 旧配置 colorMode > Slidev 当前浅色/深色状态
chromeMode > 未设置 contentMode 时的旧配置 colorMode > 'dark'
sectionMode > 'dark'
```

| 值 | 描述 |
|-------|-------------|
| `light` | 浅色表面配深色文字 |
| `dark` | 深色表面配浅色文字 |
| `match` | 跟随 `contentMode` |
| `inverse` | 与 `contentMode` 相反；适用于 `chromeMode` 和 `sectionMode` |

## 章节模式

独立控制 section 布局幻灯片的外观：

### 全局默认值

在首页的 headmatter 中设置所有 section 幻灯片的默认值：

```yaml
---
theme: scholarly
themeConfig:
  sectionMode: inverse  # light、dark、match 或 inverse
---
```

### 单页覆盖

在单个 section 幻灯片上覆盖全局设置：

```yaml
---
layout: section
sectionMode: dark  # light、dark、match 或 inverse
---

# 此章节使用深色模式
```

### 优先级链

```
单页 sectionMode > 全局 themeConfig.sectionMode > 'dark'（默认）
```

| 值 | 描述 |
|-------|-------------|
| `dark` | 深色渐变背景配浅色文字（默认） |
| `light` | 浅色背景配深色文字 |
| `match` | 使用解析后的 `contentMode` |
| `inverse` | 使用与解析后 `contentMode` 相反的模式 |

## 自定义颜色

在使用主题时覆盖特定颜色：

```yaml
---
theme: scholarly
themeColors:
  primary: '#your-custom-color'
  accent: '#your-accent-color'
---
```

如果要自定义颜色，请使用 `themeColors`。预设值由 `themeConfig.colorTheme` 选中的 CSS 规则提供；显式 `themeColors` 覆盖会同步到 `<html>` 和 `<body>`，确保它们在各个 Slidev 表面保持最高优先级。

## 实时示例

每个色彩主题都有专门的示例文件展示其实际效果：

| 主题 | 命令 |
|------|------|
| 经典蓝 | `pnpm run dev -- examples/example-classic-blue.md` |
| 牛津酒红 | `pnpm run dev -- examples/example-oxford.md` |
| 剑桥绿 | `pnpm run dev -- examples/example-cambridge.md` |
| 耶鲁蓝 | `pnpm run dev -- examples/example-yale.md` |
| 普林斯顿橙 | `pnpm run dev -- examples/example-princeton.md` |
| 北欧蓝 | `pnpm run dev -- examples/example-nordic.md` |
| 单色 | `pnpm run dev -- examples/example-monochrome.md` |
| 暖棕褐色 | `pnpm run dev -- examples/example-sepia.md` |
| 高对比度 | `pnpm run dev -- examples/example-high-contrast.md` |

`examples/` 下的示例文档使用了 `theme: ../`，以便在本仓库中直接运行 Slidev 进行开发预览。如果你是通过 npm 安装的主题，请将其改为 `theme: scholarly`。

## 实现细节

主题使用 CSS 自定义属性和数据属性应用：

- 色彩主题使用 `[data-color-theme="theme-name"]`
- 字体主题使用 `[data-font-theme="theme-name"]`
- 内容模式使用 `[data-content-mode="dark/light"]`
- 外壳模式使用 `[data-chrome-mode="dark/light"]`
- 章节模式使用 `[data-section-mode="dark/light"]`

`data-color-mode` 保留为 `data-content-mode` 的旧镜像。

这允许无缝切换主题，无需重新加载演示文稿。

### 语义 Token 分组

Scholarly 会把可读内容颜色和主题识别色分开管理。新增配色主题或调整浅色/深色行为时，应优先使用这些 token 分组，而不是在组件里写死颜色：

| Token 分组 | 用途 | 示例 |
|------------|------|------|
| Chrome tokens | 页眉、页脚、工具栏和导航表面 | `--scholarly-chrome-bg`、`--scholarly-toolbar-hover` |
| Content tokens | 正文内容表面、边框、代码、引用和表格颜色 | `--scholarly-content-surface`、`--scholarly-code-bg`、`--scholarly-quote-fg` |
| Accent tokens | 配色预设或 `themeColors` 提供的主题识别色 | `--slidev-theme-primary`、`--slidev-theme-primary-light`、`--scholarly-accent` |
| Semantic tokens | highlight、Block、Theorem 等变体的可读状态 | `--scholarly-highlight-warning-bg`、`--scholarly-block-info-border`、`--scholarly-theorem-definition-accent` |
| Interaction tokens | hover、focus、pinned、active 和弱化 UI 反馈 | `--scholarly-toolbar-hover`、`--scholarly-content-fg-muted` |

核心规则是背景 token 和前景 token 必须成对变化。例如 `Highlight` 使用 `--scholarly-highlight-*-bg` 与 `--scholarly-highlight-*-fg`，这样浅色模式下的深色 highlight 背景不会再意外继承深色正文文本。

## 重新生成主题截图

将每个主题示例的前 4 页导出到 `images/themes/*`（并同步到 `docs/public/images/themes/*`）：

```bash
pnpm run export:theme-images
```
