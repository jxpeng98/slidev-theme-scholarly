---
title: 结构布局
---

# 结构布局

这些布局负责演示的整体结构，包括封面、章节页、目录和结束页。

## cover - 标题页 {#cover}

**适合：** 演示的第一张幻灯片

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
- 作者、单位和邮箱
- 作者、会议、页码和放映导航组成的页脚

**属性：**

- `authors`：`{ name, institution?, email? }` 数组；未设置时使用全局 `authors`
- `footerLeft`：页脚左侧文字
- `footerMiddle`：页脚中间文字

---

## default - 标准内容 {#default}

**适合：** 大多数正文页面，也是默认布局

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

- 可选的标题和副标题
- 页面正文
- 带页码和放映导航的页脚

**属性：**

- `title`、`subtitle`：可选页眉内容
- `density`：`auto`、`compact`、`normal` 或 `relaxed`

---

## intro - 章节介绍 {#intro}

**适合：** 引出报告的新部分

![章节介绍布局示例](/images/layouts/intro.png)

```markdown
---
layout: intro
---

# 第二部分：研究方法

下面介绍研究方法
```

**显示内容：**

- 大字号、居中的文本
- 无页眉（为标题留出更多空间）
- 底部的页脚

**属性：**

- `align`：`left` 或 `center`（默认：`left`）
- `density`：`auto`、`compact`、`normal` 或 `relaxed`

---

## section - 章节分隔符 {#section}

**适合：** 分隔演示中的主要章节

![章节布局示例](/images/layouts/section.png)

```markdown
---
layout: section
sectionMode: dark  # dark、light、match 或 inverse（可选，默认：dark）
---

# 研究结果
```

**显示内容：**

- 大字号居中标题
- 无页眉
- 底部的页脚
- 醒目的章节分隔

**sectionMode 选项：**

| 值 | 描述 |
|-------|-------------|
| `dark` | 深色背景配浅色文字（默认） |
| `light` | 浅色背景配深色文字 |
| `match` | 跟随全局 `contentMode` |
| `inverse` | 使用与全局 `contentMode` 相反的模式 |

**全局与单页配置：**

可以在文件开头的 headmatter 中设置全局默认值：

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

# 本章节使用反向模式
```

---

## toc - 目录（Table of Contents） {#toc}

**适合：** 自动生成目录或大纲

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

## center - 居中内容 {#center}

**适合：** 简短信息或关键要点

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
- 让简短内容成为视觉焦点

---

## auto-center - 自动调整内容 {#auto-center}

**适合：** 需要根据内容自动调整字号的页面

![自动居中布局示例](/images/layouts/auto-center.png)

```markdown
---
layout: auto-center
title: 标题
subtitle: 副标题
---

## 自动居中内容

布局会根据内容量自动调整字号。
```

**显示内容：**

- 根据内容长度自动调整字体大小
- 内容垂直居中
- 在居中块内保持文本左对齐

**属性：**

- `title`、`subtitle`：可选页眉内容
- `minFontSize`、`maxFontSize`：字号上下限，单位为像素

---

## auto-size - 页面自适应的默认布局 {#auto-size}

**适合：** 内容多少不固定，但仍希望保持默认阅读顺序的页面

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

这个布局会保留默认阅读顺序，
同时自动调整正文字号以适应页面。
```

**显示内容：**

- 保留默认布局的页眉和页脚
- 根据可用空间自动调整正文
- 正文保持自上而下展开，不做垂直居中
- 可通过 `minFontSize` 和 `maxFontSize` 限制字号范围

**属性：**

- `title`、`subtitle`：可选页眉内容
- `density`：`auto`、`compact`、`normal` 或 `relaxed`
- `minFontSize`、`maxFontSize`：字号上下限，单位为像素
- `autoSizeGrow`：稀疏内容是否允许放大，或只在需要时缩小
- `autoSizeAlign`：`top` 或 `center`
- `autoSizePadding`：`compact` 或 `normal`

---

## end - 致谢页 {#end}

**适合：** 带联系信息的结束页

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

感谢聆听！
```

**属性：**
- `thankYou`：自定义感谢文本（默认："谢谢！"）
- `subtitle`：副标题文本
- `email`：联系邮箱
- `website`：项目/个人网站
- `qrcode`：二维码图片 URL
- `qrcodeLabel`：二维码标签
