# Manual Layout Screenshot Guide

[中文说明](./SCREENSHOT-GUIDE-zh.md)

Prefer `pnpm run export:layout-screenshots`. Use this browser workflow only
when the automated Playwright export is unavailable.

## Export in the browser

1. Start the preview from the repository root:

   ```bash
   pnpm exec slidev scripts/generate-layout-screenshots.md
   ```

2. Open the `/export` page at the address printed in the terminal.
3. Export the deck as PNG and extract the downloaded archive.
4. Copy and rename the 34 numbered files using this mapping:

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

Save the renamed files in `docs/public/images/layouts/`.

## Verify the result

```bash
find docs/public/images/layouts -maxdepth 1 -name '*.png' | wc -l
```

The command should print `34`. Then inspect the images for clipped text,
incorrect colors, and unreadable contrast.
