---
title: 布局
description: 为学术演示的每个部分选择合适的页面结构。
---

# 布局

布局控制整张幻灯片的结构。Scholarly 提供 34 种布局，并按用途分为四组。

## 按任务选择

| 页面任务 | 推荐布局 | 参考文档 |
|---|---|---|
| 开始、分隔或结束报告 | `cover`、`section`、`toc`、`end` | [结构布局](./structure) |
| 排列文字、图片或分栏 | `default`、`two-cols`、`figure`、`image-right` | [内容布局](./content) |
| 突出一个核心信息 | `focus`、`fact`、`quote`、`statement` | [强调布局](./emphasis) |
| 展示方法、证据或结果 | `method-pipeline`、`experiment-grid`、`results`、`references` | [学术布局](./academic) |

## 使用布局

在当前幻灯片的 frontmatter 中设置 `layout`：

```markdown
---
layout: figure
image: /results.png
caption: 三个数据集上的验证准确率
---

# 主要结果
```

布局选项写在同一个 frontmatter 中。每个分类页面都列出了可用选项和渲染效果。

## 一个简单原则

先选择最符合页面主要任务的布局。只有布局本身没有提供某类内容时，再添加组件。
