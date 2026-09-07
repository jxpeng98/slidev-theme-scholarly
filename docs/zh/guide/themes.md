---
title: 色彩与字体主题
---

# 色彩与字体主题

配色和字体可以分别选择。在 `slides.md` 的第一个 YAML 块中设置：

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: oxford-burgundy
  fontTheme: traditional
---
```

默认组合是 `classic-blue` 配色与 `classic` 字体。Oxford、Cambridge 等名称用于标识本主题的预设，并非高校官方模板。

## 色彩主题

| `colorTheme` | 主色 | 强调色 | 浅色背景 |
|---|---|---|---|
| <span id="经典学术蓝-默认"></span>`classic-blue` | `#1e3a5f` | `#b8860b` | `#fdfbf7` |
| <span id="牛津酒红"></span>`oxford-burgundy` | `#862633` | `#c5a572` | `#faf8f5` |
| <span id="剑桥绿"></span>`cambridge-green` | `#00543c` | `#d4af37` | `#f8faf7` |
| <span id="耶鲁蓝"></span>`yale-blue` | `#0f4d92` | `#d4af37` | `#f7f9fc` |
| <span id="普林斯顿橙"></span>`princeton-orange` | `#e87722` | `#1c1c1c` | `#fffbf5` |
| <span id="北欧蓝"></span>`nordic-blue` | `#2e5266` | `#d4a762` | `#f5f8fa` |
| <span id="暖棕褐色"></span>`warm-sepia` | `#5d4037` | `#d4a574` | `#faf6f1` |
| <span id="单色专业"></span>`monochrome` | `#2d3748` | `#718096` | `#ffffff` |
| <span id="高对比度-无障碍"></span>`high-contrast` | `#000000` | `#0066cc` | `#ffffff` |

上表列出配色基础值，页面实际颜色还受正文和界面明暗模式影响。包括 `high-contrast` 在内，都应结合最终背景检查图表、链接和文字。

## 字体主题

每种预设定义一组字体候选，浏览器会使用首个可用字体，因此不同电脑上的效果可能不同。选择预设不会安装其中的全部字体；导出前请确认所需字体可用。

| `fontTheme` | 正文字体类型 | 衬线字体优先候选 | 无衬线字体优先候选 |
|---|---|---|---|
| <span id="经典-palatino-默认"></span>`classic` | 衬线 | Palatino Linotype, Book Antiqua, Palatino | Helvetica Neue, Helvetica, Arial |
| <span id="现代学术"></span>`modern` | 无衬线 | Georgia, Cambria | Source Sans Pro, Segoe UI, Roboto |
| <span id="传统-garamond"></span>`traditional` | 衬线 | Garamond, Baskerville | Gill Sans, Optima, Helvetica |
| <span id="当代无衬线"></span>`contemporary` | 无衬线 | Charter, Georgia, Cambria | Inter, SF Pro Display, Segoe UI |
| <span id="人文主义"></span>`humanist` | 无衬线 | Crimson Text, Libre Baskerville, Georgia | Open Sans, Noto Sans |
| <span id="技术风格"></span>`technical` | 无衬线 | Computer Modern, Latin Modern | IBM Plex Sans, Roboto |
| <span id="优雅衬线"></span>`elegant` | 衬线 | Cormorant Garamond, EB Garamond | Montserrat, Lato |
| <span id="无衬线默认"></span>`sans-default` | 无衬线 | Georgia, Cambria | Inter, SF Pro Display, 系统字体 |

## 组合主题

CLI 还提供四种配色与字体组合：`classic`、`oxford`、`cambridge` 和 `modern`。

```bash
pnpm exec sch theme preset list
pnpm exec sch theme preset apply oxford --file slides.md
```

分别选择配色和字体时，可按本页开头的示例编辑 `themeConfig`，或运行 `pnpm exec sch theme apply oxford-burgundy --font traditional --file slides.md`。

## 各区域的明暗模式

`colorTheme` 决定配色，`contentMode`、`chromeMode` 和 `sectionMode` 分别控制正文、页眉与放映控件、章节页。常用组合和单个章节页的设置见[主题模式与对比度](./theme-mode-contrast)。

## 自定义颜色

将 `themeColors` 放在顶层，与 `themeConfig` 并列：

```yaml
---
theme: scholarly
themeConfig:
  colorTheme: classic-blue
themeColors:
  primary: '#254b64'
  accent: '#875d20'
---
```

支持的字段包括 `primary`、`primaryLight`、`accent`、`bgWarm`、`textPrimary`、`headerBg`、`footerLeftBg`、`footerCenterBg` 和 `footerRightBg`。它们会覆盖文档根节点和 body 上的配色变量。修改后请在实际使用的明暗模式下检查前景与背景的组合。

## 主题预览

每组依次展示封面、章节、正文和引语页面。预览对应一组固定配置；实际效果还受明暗模式和已安装字体影响。

<div class="theme-gallery">
  <div class="theme-section">
    <h3>经典蓝（默认）</h3>
    <div class="theme-slides">
      <img src="/images/themes/classic-blue/1.png" alt="经典蓝 - 封面" loading="lazy" />
      <img src="/images/themes/classic-blue/2.png" alt="经典蓝 - 章节" loading="lazy" />
      <img src="/images/themes/classic-blue/3.png" alt="经典蓝 - 内容" loading="lazy" />
      <img src="/images/themes/classic-blue/4.png" alt="经典蓝 - 引用" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>牛津酒红</h3>
    <div class="theme-slides">
      <img src="/images/themes/oxford/1.png" alt="牛津 - 封面" loading="lazy" />
      <img src="/images/themes/oxford/2.png" alt="牛津 - 章节" loading="lazy" />
      <img src="/images/themes/oxford/3.png" alt="牛津 - 内容" loading="lazy" />
      <img src="/images/themes/oxford/4.png" alt="牛津 - 引用" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>剑桥绿</h3>
    <div class="theme-slides">
      <img src="/images/themes/cambridge/1.png" alt="剑桥 - 封面" loading="lazy" />
      <img src="/images/themes/cambridge/2.png" alt="剑桥 - 章节" loading="lazy" />
      <img src="/images/themes/cambridge/3.png" alt="剑桥 - 内容" loading="lazy" />
      <img src="/images/themes/cambridge/4.png" alt="剑桥 - 引用" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>耶鲁蓝</h3>
    <div class="theme-slides">
      <img src="/images/themes/yale/1.png" alt="耶鲁 - 封面" loading="lazy" />
      <img src="/images/themes/yale/2.png" alt="耶鲁 - 章节" loading="lazy" />
      <img src="/images/themes/yale/3.png" alt="耶鲁 - 内容" loading="lazy" />
      <img src="/images/themes/yale/4.png" alt="耶鲁 - 引用" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>普林斯顿橙</h3>
    <div class="theme-slides">
      <img src="/images/themes/princeton/1.png" alt="普林斯顿 - 封面" loading="lazy" />
      <img src="/images/themes/princeton/2.png" alt="普林斯顿 - 章节" loading="lazy" />
      <img src="/images/themes/princeton/3.png" alt="普林斯顿 - 内容" loading="lazy" />
      <img src="/images/themes/princeton/4.png" alt="普林斯顿 - 引用" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>北欧蓝</h3>
    <div class="theme-slides">
      <img src="/images/themes/nordic/1.png" alt="北欧 - 封面" loading="lazy" />
      <img src="/images/themes/nordic/2.png" alt="北欧 - 章节" loading="lazy" />
      <img src="/images/themes/nordic/3.png" alt="北欧 - 内容" loading="lazy" />
      <img src="/images/themes/nordic/4.png" alt="北欧 - 引用" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>单色</h3>
    <div class="theme-slides">
      <img src="/images/themes/monochrome/1.png" alt="单色 - 封面" loading="lazy" />
      <img src="/images/themes/monochrome/2.png" alt="单色 - 章节" loading="lazy" />
      <img src="/images/themes/monochrome/3.png" alt="单色 - 内容" loading="lazy" />
      <img src="/images/themes/monochrome/4.png" alt="单色 - 引用" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>暖棕褐色</h3>
    <div class="theme-slides">
      <img src="/images/themes/sepia/1.png" alt="棕褐色 - 封面" loading="lazy" />
      <img src="/images/themes/sepia/2.png" alt="棕褐色 - 章节" loading="lazy" />
      <img src="/images/themes/sepia/3.png" alt="棕褐色 - 内容" loading="lazy" />
      <img src="/images/themes/sepia/4.png" alt="棕褐色 - 引用" loading="lazy" />
    </div>
  </div>

  <div class="theme-section">
    <h3>高对比度</h3>
    <div class="theme-slides">
      <img src="/images/themes/high-contrast/1.png" alt="高对比度 - 封面" loading="lazy" />
      <img src="/images/themes/high-contrast/2.png" alt="高对比度 - 章节" loading="lazy" />
      <img src="/images/themes/high-contrast/3.png" alt="高对比度 - 内容" loading="lazy" />
      <img src="/images/themes/high-contrast/4.png" alt="高对比度 - 引用" loading="lazy" />
    </div>
  </div>
</div>


## 实时示例

按[贡献指南](../contributing)克隆并安装仓库后，在仓库根目录运行相应配色示例：

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
