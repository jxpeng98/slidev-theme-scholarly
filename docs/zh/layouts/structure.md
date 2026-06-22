---
title: 结构布局
---

# 结构布局

用于组织演示文稿结构的布局 - 标题页、章节和结束页。

## cover - 标题页

**用于：** 演示文稿的第一张幻灯片

![封面布局示例](/images/layouts/cover.png)

```markdown
---
layout: cover
authors:
  - name: 你的名字
    institution: 你的大学
    email: you@example.edu
footerMiddle: 2025 年会议名称
---

# 你的演示标题
副标题或描述
```

**显示内容：**

- 居中的大标题
- 带有单位和邮箱的作者信息
- 带有作者、会议、页码和放映态导航按钮的页脚

---

## default - 标准内容

**用于：** 大部分幻灯片（这是自动的！）

![默认布局示例](/images/layouts/default.png)

```markdown
---
title: 我的幻灯片标题
subtitle: 可选的副标题
---

# 主要内容

- 要点 1
- 要点 2

你可以添加文本、图片、代码、数学公式等。
```

**显示内容：**

- 可选的带有标题和副标题的页眉
- 中间的内容
- 底部带页码和放映态导航按钮的页脚

---

## intro - 章节介绍

**用于：** 开始报告的新部分

![章节介绍布局示例](/images/layouts/intro.png)

```markdown
---
layout: intro
---

# 第二部分：研究方法

让我们讨论我们的方法
```

**显示内容：**

- 大字号、居中的文本
- 无页眉（为标题留出更多空间）
- 底部的页脚

---

## section - 章节分隔符

**用于：** 演示中的重大转换

![章节布局示例](/images/layouts/section.png)

```markdown
---
layout: section
sectionMode: dark  # dark、light、match 或 inverse（可选，默认：dark）
---

# 研究结果
```

**显示内容：**

- 非常大的居中标题
- 无页眉
- 底部的页脚
- 完美的戏剧性章节分隔

**sectionMode 选项：**

| 值 | 描述 |
|-------|-------------|
| `dark` | 深色背景配浅色文字（默认） |
| `light` | 浅色背景配深色文字 |
| `match` | 跟随全局 `contentMode` |
| `inverse` | 使用与全局 `contentMode` 相反的模式 |

**全局与单页配置：**

你可以在首页的 headmatter 中设置全局默认值：

```yaml
---
theme: scholarly
themeConfig:
  contentMode: light
  sectionMode: match  # 所有 section 默认跟随全局内容模式
---
```

然后在特定幻灯片上覆盖：

```yaml
---
layout: section
sectionMode: inverse  # 覆盖全局设置
---

# 此章节使用反向模式
```

---

## toc - 目录（Table of Contents）

**用于：** 目录/大纲页（自动从 `layout: section` 的章节页生成）

![目录布局示例](/images/layouts/toc.png)

```markdown
---
layout: toc
title: 目录            # 设为 false 可隐藏
showNumbers: true      # 可选，默认：true
highlightCurrent: true # 可选，默认：true
---
```

**显示内容：**

- 标题（默认会根据 `lang` 显示 `Outline` 或 `目录`）
- 自动汇总所有 `layout: section` 的章节页（可点击跳转）

**属性：**

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `title` | `string \| false` | `目录` | 标题文本，设为 `false` 可隐藏 |
| `showNumbers` | `boolean` | `true` | 是否显示序号圆点 |
| `highlightCurrent` | `boolean` | `true` | 是否高亮当前章节 |
| `sections` | `string[]` | - | 手动指定章节标题（覆盖自动提取） |

---

## center - 居中内容

**用于：** 简短信息或关键要点

![居中布局示例](/images/layouts/center.png)

```markdown
---
layout: center
---

# 核心结论

这是最重要的观点
```

**显示内容：**

- 所有内容水平和垂直居中
- 非常适合强调

---

## auto-center - 自动调整内容

**用于：** 需要自动调整字体大小的内容

![自动居中布局示例](/images/layouts/auto-center.png)

```markdown
---
layout: auto-center
title: 标题
subtitle: 副标题
---

## 自动居中内容

此布局会自动调整字体大小以适应内容。
```

**显示内容：**

- 根据内容长度自动调整字体大小
- 内容垂直居中
- 在居中块内保持文本左对齐

---

## auto-size - 页面自适应的默认布局

**用于：** 希望保留默认布局阅读流，同时让页面行为更接近 LaTeX Beamer frame 的内容页

```markdown
---
layout: auto-size
title: 标题
subtitle: 副标题
autoSizeGrow: true
autoSizeAlign: top
autoSizePadding: normal
minFontSize: 14
maxFontSize: 30
---

## 自动适应页面的正文

这个布局会保留 default 的阅读流，
同时自动调整 main matter 的字号以适应页面。
```

**显示内容：**

- 保留默认布局的 header 和 footer
- 根据可用宽高自动调整 main matter
- 正文保持自上而下展开，不做垂直居中
- 支持使用 `minFontSize` 和 `maxFontSize` frontmatter 约束字号范围

**配置入口：**

- `autoSizeGrow: true | false` - 稀疏内容是否允许放大，或只在需要时缩小
- `autoSizeAlign: top | center` - main matter 是贴顶部展示，还是在可用区域内垂直居中
- `autoSizePadding: compact | normal` - 切换更紧凑或更常规的正文内边距

---

## end - 致谢页

**用于：** 带有联系信息的专业结束幻灯片

![致谢页布局示例](/images/layouts/end.png)

```markdown
---
layout: end
email: zhangsan@tsinghua.edu.cn
website: https://example.com/project
subtitle: 问题？
qrcode: https://example.com/qr.png
qrcodeLabel: 扫码获取论文
---

感谢您的聆听！
```

**属性：**
- `thankYou`：自定义感谢文本（默认："谢谢！"）
- `subtitle`：副标题文本
- `email`：联系邮箱
- `website`：项目/个人网站
- `qrcode`：二维码图片 URL
- `qrcodeLabel`：二维码标签
