# __PROJECT_NAME__

这是一份可直接修改的 Scholarly 中文演示模板。

建议使用 Node.js 24 LTS 和 pnpm 10。

## 启动

```bash
pnpm install
pnpm run dev
```

## 构建

```bash
pnpm run build
```

## 说明

- 此模板不包含参考文献文件。使用引用时，请先创建 `references.bib`、设置 `bibFile`，再添加 `layout: references` 页面。

预览启动后，编辑 `slides.md` 即可查看更新。`pnpm run build` 会将静态网站写入 `dist/`，上传该目录后才能对外发布。导出 PDF 前需要安装 Playwright 和 Chromium，详见[快速开始](https://scholarly-docs.jxpeng.dev/zh/guide/quick-start#check-and-export)。
