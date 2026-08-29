---
title: 内容布局
---

# 内容布局

这些布局负责组织图片、分栏和列表内容。

## two-cols - 双栏 {#two-cols}

**适合：** 比较两组内容，或并排展示相关信息

![双栏布局示例](/images/layouts/two-cols.png)

```markdown
---
layout: two-cols
ratio: "2:3"
title: 双栏布局
---

## 左栏（2fr）

左栏占可用宽度的五分之二。

- 要点 1
- 要点 2

::right::

## 右栏（3fr）

右栏占可用宽度的五分之三。
```

**属性：**
- `ratio`：列宽比例，如 "1:1"、"2:3"（默认："1:1"）
- `gap`：两栏之间的 CSS 间距（默认：`1rem`）
- `title`、`subtitle`：可选的页眉内容

**显示内容：**

- 左栏内容（`::right::` 之前）
- 右栏内容（`::right::` 之后）
- 可配置的宽度比例

---

## image-left - 左图右文 {#image-left}

**适合：** 以图片为主、文字说明为辅的页面

![左图右文布局示例](/images/layouts/image-left.png)

```markdown
---
layout: image-left
image: ./path/to/image.png
ratio: "1:2"
title: 左图布局
---

## 右侧内容（2fr）

- 设备 A
- 设备 B
- 设备 C

补充说明……
```

**属性：**
- `image`：图片 URL 或路径
- `ratio`：图片:内容比例（默认："1:1"）
- `fit`：`cover`、`contain`、`fill`（默认：`cover`）
- `position`：图片的 CSS 定位（默认：`center`）
- `title`、`subtitle`：可选的页眉内容

**显示内容：**

- 左侧全高度图片
- 右侧内容

---

## image-right - 左文右图 {#image-right}

**适合：** 先讲文字，再用右侧图片补充说明

![左文右图布局示例](/images/layouts/image-right.png)

```markdown
---
layout: image-right
image: https://example.com/image.jpg
ratio: "3:2"
fit: contain
title: 右图布局
---

## 左侧内容（3fr）

在这里概括主要发现。

- 发现 1
- 发现 2
```

**属性：**
- `image`：图片 URL 或路径
- `ratio`：内容:图片比例（默认："1:1"）
- `fit`：`cover`、`contain`、`fill`（默认：`cover`）
- `position`：图片的 CSS 定位（默认：`center`）
- `title`、`subtitle`：可选的页眉内容

**显示内容：**

- 左侧内容
- 右侧全高度图片

---

## bullets - 增强列表 {#bullets}

**适合：** 展示一组层次清楚的要点

![增强列表布局示例](/images/layouts/bullets.png)

```markdown
---
layout: bullets
title: 要点
subtitle: 总结
icon: "→"
---

## 主要发现

- **要点 1** - 描述
- **要点 2** - 描述
- **要点 3** - 描述
```

**属性：**
- `title`：幻灯片标题
- `subtitle`：可选副标题
- `icon`：自定义项目符号字符（默认：`▸`）

**特点：**
- 自定义项目符号标记
- 带圆形徽章的编号列表
- 支持嵌套列表

---

## figure - 学术图片 {#figure}

**适合：** 展示带编号和说明的学术图片

![学术图片布局示例](/images/layouts/figure.png)

```markdown
---
layout: figure
image: ./images/architecture.png
caption: 我们提出的系统架构概览。
label: "图 1："
title: 系统架构
height: 60%
---

图片下方的额外描述。
```

在 Slidev 的 frontmatter 中请使用 `image`，不要使用 `src`。`src` 是留给外部幻灯片源的字段，误用后 figure 页面可能不会出现在构建和导出结果中。

**属性：**
- `image`：图片 URL 或路径
- `caption`：图片说明
- `label`：标签前缀（如 "图 1："）
- `title`：幻灯片标题
- `subtitle`：可选副标题
- `height`：图片高度（默认：`60%`）
- `fit`：`contain`、`cover`、`fill`（默认：`contain`）

---

## split-image - 图片对比 {#split-image}

**适合：** 并排比较多张图片，并为每张图片添加说明

![图片对比布局示例](/images/layouts/split-image.png)

```markdown
---
layout: split-image
images:
  - ./before.png
  - ./after.png
captions:
  - 优化前
  - 优化后
title: 视觉对比
---
```

**属性：**
- `images`：图片 URL 数组
- `captions`：说明文字数组
- `title`、`subtitle`：页眉内容
