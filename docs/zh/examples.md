---
title: 示例
---

# 示例

可以从完整研究报告、布局画廊或最小演示开始。示例中的论文信息和结果用于说明排版，正式演示时请替换为自己的研究内容。

## 完整演示

| 示例 | 适合用来 |
|---|---|
| [学术研究报告](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example-academic.md) | 参考从研究问题到方法、证据、数据和引用的完整组织方式 |
| [学术布局画廊](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example-academic-gallery.md) | 逐页比较研究布局 |
| [英文示例](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example.md) | 浏览常用布局和组件 |
| [中文示例](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/examples/example-zh.md) | 参考中文内容和标签的写法 |

按[贡献指南](./contributing)安装仓库后，在根目录运行：

```bash
pnpm run dev -- examples/example-academic.md
```

仓库示例使用 `theme: ../`。复制到自己的项目时，请改为 `theme: scholarly`，并一同复制参考文献、图片和导入的数据文件，检查它们相对新文件的路径。`../utils/data` 等仓库内部导入应改为包导出路径 `slidev-theme-scholarly/utils/data`。如果希望直接生成文件齐全的项目，请使用[快速开始](./guide/quick-start)。

## 最小完整示例

```markdown
---
theme: scholarly
author: 你的名字
footerMiddle: 我的报告 2025
---

# 我的研究

简要概述

---

# 引言

这里用一句话说明研究问题。

- 要点 1
- 要点 2

---
layout: section
---

# 研究方法

---

# 我们的方法

<Theorem type="theorem">

我们证明了这个算法的时间复杂度为 $O(n \log n)$。

</Theorem>

---

# 感谢聆听

有问题吗？
```
