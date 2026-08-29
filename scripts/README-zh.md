# 预览图与发布脚本

[English](./README.md)

以下命令都应在仓库根目录运行。

## 安装工具

```bash
pnpm install
pnpm exec playwright install chromium
```

只有导出 PNG 或 PDF 时才需要安装浏览器。

## 生成预览图

| 命令 | 输出 |
|---|---|
| `pnpm run export:layout-screenshots` | `docs/public/images/layouts/` 中的 34 张布局图 |
| `pnpm run export:component-screenshots` | `docs/public/images/components/` 中的组件图 |
| `pnpm run export:theme-images` | `docs/public/images/themes/` 中的主题图 |
| `pnpm run export:all-screenshots` | 上述三组图片 |

布局导出脚本读取 `generate-layout-screenshots.md`，按幻灯片顺序映射布局名称，
并且只在完整导出后替换已发布图片。如果自动导出不可用，请参阅
[手动布局截图指南](./SCREENSHOT-GUIDE-zh.md)。

## 检查主题组合

```bash
pnpm run theme:matrix
```

明暗模式预览会写入
`/private/tmp/scholarly-theme-matrix/<color-theme>/<color-mode>/`。只检查矩阵配置、
不启动 Playwright 时，运行：

```bash
node scripts/check-theme-matrix.mjs --dry-run
```

## 检查演示文稿

```bash
node cli/scholarly.mjs doctor
node cli/scholarly.mjs doctor --json
```

文本格式会解释警告并给出处理建议，JSON 格式则供自动化和编辑器集成使用。
出现警告时命令仍会成功，出现错误则会失败。

## 同步 VS Code 预览

修改布局、组件、主题、模板或源截图后，运行：

```bash
node vscode-extension/scripts/sync-shared-data.mjs
node vscode-extension/scripts/sync-snippets.mjs
node vscode-extension/scripts/sync-previews.mjs
node scripts/check-vscode-metadata-previews.mjs
```

要在不修改文件的前提下检查预览是否过期，请在 CI 或发布前运行：

```bash
node vscode-extension/scripts/sync-previews.mjs --check
```

## 故障排查

- 提示 `Cannot find module 'playwright'`：运行 `pnpm install`。
- 缺少 Chromium：运行 `pnpm exec playwright install chromium`。
- 预览图难以阅读：修改对应源演示，重新生成相关图片，并在提交前检查结果。
