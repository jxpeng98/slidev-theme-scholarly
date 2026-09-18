# __PROJECT_NAME__

This academic starter includes BibTeX citation support.

Use Node.js 24 LTS and pnpm 10.

## Start

```bash
pnpm install
pnpm run dev
```

## Notes

- Add references to `references.bib`.
- Use `@citekey` in slides.
- Add a `layout: references` slide where you want the bibliography to appear.

Edit `slides.md` while the preview runs. `pnpm run build` writes a static site to `dist/`; upload that directory to your host to publish it. For PDF export, install Playwright and Chromium first. See the [quick-start guide](https://scholarly-docs.jxpeng.dev/en/guide/quick-start#check-and-export).
