# 手动生成布局截图

[English](./SCREENSHOT-GUIDE.md)

优先使用 `pnpm run export:layout-screenshots`。只有自动 Playwright 导出不可用时，
才需要下面的浏览器流程。

## 在浏览器中导出

1. 在仓库根目录启动预览：

   ```bash
   pnpm exec slidev scripts/generate-layout-screenshots.md
   ```

2. 根据终端输出的地址打开 `/export` 页面。
3. 选择 PNG 格式导出，并解压下载的压缩包。
4. 按照下面的映射复制并重命名 34 个编号文件：

```text
001 cover                 018 statement
002 default               019 focus
003 intro                 020 compare
004 section               021 methodology
005 center                022 results
006 auto-center           023 timeline
007 auto-size             024 agenda
008 toc                   025 acknowledgments
009 end                   026 references
010 two-cols              027 paper-summary
011 image-left            028 related-work-matrix
012 image-right           029 method-pipeline
013 bullets               030 result-highlight
014 figure                031 experiment-grid
015 split-image           032 limitation
016 quote                 033 defense-question
017 fact                  034 appendix-index
```

把重命名后的文件保存到 `docs/public/images/layouts/`。

## 验证结果

```bash
find docs/public/images/layouts -maxdepth 1 -name '*.png' | wc -l
```

命令应输出 `34`。随后检查图片是否存在文字裁切、颜色错误或对比度不足。
