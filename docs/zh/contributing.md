---
title: 贡献指南
---

# 贡献指南

## 配置仓库

克隆仓库后，在仓库根目录运行以下命令。建议使用 Node.js 24 LTS 和 pnpm 10，与主要 CI 检查环境保持一致：

```bash
git clone https://github.com/jxpeng98/slidev-theme-scholarly.git
cd slidev-theme-scholarly
pnpm install --frozen-lockfile
pnpm --dir vscode-extension install --frozen-lockfile
```

主题和 VS Code 插件需要分别安装依赖，仓库检查会同时覆盖两部分。

## 按改动类型开发

| 改动 | 预览 | 验证 |
|---|---|---|
| 主题布局、组件或样式 | `pnpm run dev` | 查看示例演示，再运行 `pnpm run check` |
| 文档 | `pnpm run docs:dev` | `pnpm run check:docs-workflows` 和 `pnpm run docs:build` |
| VS Code 插件 | `pnpm run vscode:compile`，再启动扩展开发宿主 | `pnpm --dir vscode-extension run test` 和 `pnpm run check` |

文档开发请使用仓库根目录的 `docs:*` 命令，与 CI 保持一致。英文页面在 `docs/en/`，简体中文页面在 `docs/zh/`。两种语言应同步修改，保留已有页面地址和显式锚点，并保证代码示例可运行。`docs/superpowers/` 中的历史计划不会发布到文档站。

运行浏览器检查前，先停止开发服务器。改动影响渲染结果时，安装 Chromium 并运行视觉检查：

```bash
pnpm exec playwright install chromium
pnpm run check:visual
```

`check` 包括打包、目录数据、CLI、示例解析、文档构建和单元测试；`check:visual` 还会检查浏览器操作和幻灯片导出。需要更新预览图时，按[脚本说明](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/scripts/README-zh.md)只重新生成受影响的部分。

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
