---
title: 贡献指南
---

# 贡献指南

欢迎提交修复和改进。先安装仓库依赖：

```bash
pnpm install
```

开发时启动示例演示：

```bash
pnpm run dev
```

停止开发服务器后，先运行仓库检查：

```bash
pnpm run check
```

如果改动会影响幻灯片的渲染结果或预览图，再重新导出并生成截图：

```bash
pnpm run export
pnpm run screenshot
```

修改 `examples/example.md` 或 `examples/example-zh.md`，确认改动在实际演示中正常显示。

## 主题与预览图修改 {#theme-and-preview-changes}

主题通过数据属性选择：

- `[data-color-theme="..."]` 和 `[data-font-theme="..."]` 选择预设。
- `[data-content-mode="..."]`、`[data-chrome-mode="..."]` 和
  `[data-section-mode="..."]` 选择最终采用的区域明暗模式。
- `data-color-mode` 只作为 `data-content-mode` 的旧兼容镜像保留。

请使用现有的界面、正文、强调、语义和交互 CSS 变量，不要在组件中写死颜色。
背景变量和前景变量应成对修改，确保组合仍然可读。

修改主题后，重新生成每个主题的前四张预览图：

```bash
pnpm run export:theme-images
```

仓库的[脚本说明](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/scripts/README-zh.md)
列出了布局、组件、主题矩阵和 VS Code 预览流程。

## 许可证

项目使用 MIT 许可证，详见 [LICENSE](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/LICENSE)。

## 支持

- **文档：** [Slidev 文档](https://sli.dev)
- **问题反馈：** [GitHub Issues](https://github.com/jxpeng98/slidev-theme-scholarly/issues)
- **讨论：** [GitHub Discussions](https://github.com/slidevjs/slidev/discussions)
