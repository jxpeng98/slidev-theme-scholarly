---
title: 重大升级说明
---

# 重大升级说明

Scholarly 正在准备一次重大升级。后续版本可能包含不兼容变更，已有的 Slidev 演示也可能需要相应调整。

## 可能受影响的内容

不同项目情况不同，但常见影响点包括：

- **Slidev 和 Node.js 版本**：本地环境需要满足新版要求。
- **主题配置**：部分 frontmatter 字段和 `themeConfig` 选项可能调整。
- **布局和组件**：名称、属性、默认行为或样式变量可能变化。
- **构建和导出**：PDF 导出和资源路径可能随 Slidev 调整。

## 升级步骤

1. 检查 Node.js 版本（本主题要求 Node.js 20+）：

   ```bash
   node -v
   ```

2. 升级到兼容的 Slidev 版本：

   ```bash
   npm i -D @slidev/cli
   ```

3. 升级主题：

   ```bash
   npm i -D slidev-theme-scholarly
   ```

4. 启动 Slidev，根据报错逐项修复：

   ```bash
   npx slidev
   ```

如果暂时无法完成迁移，可以先固定在旧版本，准备好后再升级。

## 提前试用预发布版本

重大改动会先通过预发布版本验证，再进入正式版。

### 标签和版本号

| 类型 | 标签格式 | 示例 |
|------|----------|------|
| 正式版 | `vX.Y.Z` | `v2.0.0` |
| 预发布 | `vX.Y.Z-<pre>` | `v2.0.0-beta.1`、`v2.0.0-rc.0` |

预发布版本遵循 SemVer，版本号必须包含 `-<pre>` 标识，否则 CI 会将其视为正式版本。

- 安装预发布版（`next`）：

  ```bash
  npm i -D slidev-theme-scholarly@next
  ```

- 切回稳定版（`latest`）：

  ```bash
  npm i -D slidev-theme-scholarly
  ```

## 查看变更详情

- [GitHub Releases](https://github.com/jxpeng98/slidev-theme-scholarly/releases)
- [更新日志](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/CHANGELOG.md)
