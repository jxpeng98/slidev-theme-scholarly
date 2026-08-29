---
title: 色彩与字体主题
---

# 色彩与字体主题

Scholarly 提供可组合的配色和字体主题，方便匹配机构风格或演示场景。

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

共有 9 组配色可供选择：

### 经典学术蓝（默认）

默认配色取自传统学术机构常用的蓝色与金色。

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

以牛津酒红为主色，搭配低饱和金色。

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

传统的耶鲁蓝，适合风格正式的学术报告。

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

醒目的橙色，适合需要较强视觉节奏的演示。

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

以灰度为主，适合截图、图表和文字较多的页面。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: monochrome
---
```

### 暖棕褐色

偏暖、带有复古感的棕褐色。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: warm-sepia
---
```

### 北欧蓝

清冷克制的蓝色系，带有斯堪的纳维亚设计风格。

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: nordic-blue
---
```

### 高对比度（无障碍）

适合无障碍要求较高场景的高对比度配色。请根据目标 WCAG 等级，检查最终内容中的文字、强调色和背景组合。

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

共有 8 组字体搭配可供选择：

### 经典 Palatino（默认）

以 Palatino 衬线字体为主，搭配 Helvetica 无衬线字体。

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

以 Garamond 呈现经典的书籍式排版。

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

以无衬线字体为主，风格简洁现代。

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

偏精致典雅的衬线字体组合。

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

配色和字体可以自由组合：

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

## 各区域的明暗模式

`colorTheme` 决定配色；`contentMode`、`chromeMode` 和 `sectionMode` 分别控制正文、
放映控件和章节页。推荐组合、旧 `colorMode` 迁移、优先级和单页覆盖方式请参阅
[主题模式与对比度](./theme-mode-contrast)。

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

预设颜色来自 `themeConfig.colorTheme` 选中的 CSS 规则。通过 `themeColors` 设置的颜色会同时应用到 `<html>` 和 `<body>`，因此在 Slidev 各个界面区域中拥有更高优先级。

## 实时示例

可以通过对应的示例文件在本地预览每组配色：

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

`examples/` 下的示例文档使用 `theme: ../`，这样可以直接在本仓库中运行 Slidev。通过 npm 安装主题时，请改用 `theme: scholarly`。

主题实现和预览图重新生成方法请参阅
[贡献指南](../contributing#theme-and-preview-changes)。
