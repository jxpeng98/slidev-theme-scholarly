# Layout Screenshots Generator

这个目录包含用于生成所有布局截图的脚本。

## 文件说明

- `generate-layout-screenshots.md` - 包含所有 34 个布局示例的 Slidev 演示文稿
- `export-layout-screenshots.mjs` - 自动化导出脚本（推荐）
- `generate-screenshots.js` - 备选 Node.js 脚本
- `generate-screenshots.sh` - 备选 Bash 脚本

## 使用方法

### Theme matrix QA

```bash
# Generate light/dark readability screenshots for every color theme.
pnpm run theme:matrix
```

This command builds temporary decks in `/private/tmp/scholarly-theme-matrix/_work`
and exports PNGs to:

```text
/private/tmp/scholarly-theme-matrix/<color-theme>/<color-mode>/
```

Use a dry run when you only need to verify that the matrix can be generated
without launching Playwright:

```bash
node scripts/check-theme-matrix.mjs --dry-run
```

Before exporting PNGs, make sure the Playwright browser is available:

```bash
pnpm exec playwright install chromium
```

### CLI doctor diagnostics

Use the Scholarly doctor before release or when a generated deck behaves unexpectedly:

```bash
node cli/scholarly.mjs doctor
node cli/scholarly.mjs doctor --json
```

The text output is optimized for humans and includes concrete actions for warnings.
The JSON output is intended for automation and editor integrations:

```json
{
  "status": "warn",
  "checks": [
    {
      "id": "theme-config-color-theme",
      "label": "themeConfig.colorTheme",
      "severity": "warn",
      "summary": "unknown value: mystery-blue",
      "action": "Use one of: classic-blue, oxford-burgundy, cambridge-green..."
    }
  ]
}
```

Supported severities are `ok`, `warn`, and `error`. Only `error` should fail the command.

### VS Code metadata and preview sync

The VS Code extension consumes generated shared metadata and compressed previews.
Run these commands after changing templates, layouts, components, themes, or
source screenshots:

```bash
node vscode-extension/scripts/sync-shared-data.mjs
node vscode-extension/scripts/sync-snippets.mjs
node vscode-extension/scripts/sync-previews.mjs
node scripts/check-vscode-metadata-previews.mjs
```

`sync-previews.mjs` writes `vscode-extension/media/previews/manifest.json` with
source and output SHA-256 hashes. Use the read-only freshness check in CI or
before release:

```bash
node vscode-extension/scripts/sync-previews.mjs --check
```

### 方法 1：使用 pnpm 脚本（推荐）

```bash
# 从项目根目录运行
pnpm run export:layout-screenshots
```

这个命令会：

1. 导出所有 34 个布局为 PNG 图片
2. 自动重命名为对应的布局名称
3. 保存到 `docs/public/images/layouts/` 目录

### 方法 2：直接运行脚本

```bash
# 从项目根目录运行
node scripts/export-layout-screenshots.mjs
```

### 方法 3：手动生成

```bash
# 1. 进入 scripts 目录
cd scripts

# 2. 启动 Slidev 预览
npx slidev generate-layout-screenshots.md

# 3. 在浏览器中打开，手动截图每个布局
# 或者使用 Slidev 的导出功能
npx slidev export --format png generate-layout-screenshots.md
```

## 先决条件

确保已安装以下依赖：

```bash
# 安装 Slidev（如果还没有）
npm install

# 安装 Playwright（用于 PNG 导出）
npx playwright install chromium
```

## 输出

所有截图将保存到：

```text
docs/public/images/layouts/
├── cover.png
├── default.png
├── intro.png
├── section.png
├── center.png
├── auto-center.png
├── end.png
├── two-cols.png
├── image-left.png
├── image-right.png
├── bullets.png
├── figure.png
├── split-image.png
├── quote.png
├── fact.png
├── statement.png
├── focus.png
├── compare.png
├── methodology.png
├── results.png
├── timeline.png
├── agenda.png
├── acknowledgments.png
└── references.png
```

## 布局列表

### Structure Layouts (7)

1. cover - 封面/标题页
2. default - 默认内容布局
3. intro - 章节介绍
4. section - 章节分隔符
5. center - 居中内容
6. auto-center - 自动调整居中
7. end - 致谢页

### Content Layouts (6)

1. two-cols - 两栏布局
2. image-left - 图片在左
3. image-right - 图片在右
4. bullets - 要点列表
5. figure - 图片+标题
6. split-image - 分屏图片

### Emphasis Layouts (4)

1. quote - 引用
2. fact - 关键事实
3. statement - 声明
4. focus - 聚焦

### Academic Layouts (7)

1. compare - 对比
2. methodology - 方法论
3. results - 结果展示
4. timeline - 时间线
5. agenda - 议程
6. acknowledgments - 致谢
7. references - 参考文献

## 故障排查

### 错误：Cannot find module 'playwright'

```bash
npx playwright install
```

### 错误：slidev command not found

```bash
npm install
```

### 截图质量问题

编辑 `generate-layout-screenshots.md` 文件中的内容，调整示例文本和样式。

### 手动调整截图

如果自动生成的截图不理想，可以：

1. 运行 `npx slidev generate-layout-screenshots.md`
2. 在浏览器中打开
3. 导航到每个布局
4. 使用浏览器的截图功能手动截图
5. 保存到 `docs/public/images/layouts/` 目录
