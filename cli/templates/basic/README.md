# __PROJECT_NAME__

This starter contains a minimal Scholarly presentation.

Use Node.js 24 LTS and pnpm 10.

## Start

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

## Notes

- This minimal template has no bibliography file. To add citations, create `references.bib`, set `bibFile`, and add a `layout: references` slide.

Edit `slides.md` while the preview runs. `pnpm run build` writes a static site to `dist/`; upload that directory to your host to publish it. For PDF export, install Playwright and Chromium first. See the [quick-start guide](https://scholarly-docs.jxpeng.dev/en/guide/quick-start#check-and-export).
