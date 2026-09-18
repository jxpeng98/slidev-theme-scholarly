---
title: 升级说明
description: 更新 Slidev 和 Scholarly，迁移旧配置，并检查已有演示。
---

# 升级说明

升级需要更新演示项目中的依赖，并检查渲染结果。只更新 VS Code 插件，不会同时更新项目里的主题和 Slidev。

## 升级前

将演示文件、`package.json` 和锁文件一起保存或提交，方便恢复到可用版本。先阅读所跨版本的[发布说明](https://github.com/jxpeng98/slidev-theme-scholarly/releases)和[更新日志](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/CHANGELOG.md)。

本仓库和起步模板使用 Slidev **52.19.1**。文档中的操作建议使用 Node.js 24 LTS 和 pnpm 10，详见[环境准备](./quick-start#_1-准备环境)。已有项目实际使用的版本，由安装的包和锁文件决定。

## 更新项目

在演示项目目录中运行：

```bash
pnpm list @slidev/cli slidev-theme-scholarly
pnpm add -D @slidev/cli@52.19.1 slidev-theme-scholarly@latest
pnpm exec sch doctor
pnpm run dev
```

主题会安装配套的 Slidev client 和类型依赖。如果项目还直接声明了 `@slidev/client` 或 `@slidev/types`，请将它们与 CLI 版本对齐。沿用项目原有的包管理器，并检查锁文件中的变化。

## 核对旧配置

| 旧配置 | 当前建议 |
|---|---|
| `themeConfig.colorMode` | 仍然兼容。新演示建议分别设置 `contentMode` 和 `chromeMode`，详见[模式迁移](./theme-mode-contrast#旧演示迁移与优先级)。 |
| `outlineSidebar`、`outlineSidebarOpen` | 在 `themeConfig` 中仍然兼容，建议改用 `outlineToc`、`outlineTocOpen`。 |
| `figure` 页的 `src` | 改用 `image`；Slidev 将 `src` 保留给外部幻灯片文件。 |
| 首页 `toc` 的 `title: false` | `title` 保留为演示名称，隐藏目录标题请用 `heading: false`，详见[目录布局](../layouts/structure#toc)。 |
| 项目级引用插件配置 | Scholarly 已从主题加载引用支持。移除重复注册的引用插件，保留其他 Vite 插件。 |

这些说明对应当前实现的兼容行为。安装其他版本时，还需查看相应发布说明中的迁移要求。

## 分享前验证

1. 打开演示，检查封面、章节页、内容较多的结果页和参考文献页。
2. 检查图片、公式、引用、注脚和内部链接。
3. 按[快速开始中的导出步骤](./quick-start#check-and-export)生成 PDF，并构建静态网站。
4. 与升级前的结果对照，尤其留意字体、画幅和明暗模式的变化。

如果升级导致演示不可用，先一起恢复保存的 `package.json` 和锁文件，重新安装依赖，再排查新版问题。

## 试用预发布版本

先查看 npm 上实际存在的发布渠道：

```bash
pnpm view slidev-theme-scholarly dist-tags
```

如果列表中有 `next`，可以用 `pnpm add -D slidev-theme-scholarly@next` 安装。运行 `pnpm add -D slidev-theme-scholarly@latest` 可切回稳定渠道。建议在演示副本或独立分支中测试预发布版本。
