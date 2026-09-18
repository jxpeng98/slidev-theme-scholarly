# __PROJECT_NAME__

This template is designed for presenting a single paper.

Use Node.js 24 LTS and pnpm 10.

## Start

```bash
pnpm install
pnpm run dev
```

## Structure

- `slides.md` contains a paper summary, motivation, method pipeline, main result, limitations, and references.
- `references.bib` contains starter BibTeX entries used by the citations in the deck.
- Replace placeholder metadata before presenting.

Edit `slides.md` while the preview runs. `pnpm run build` writes a static site to `dist/`; upload that directory to your host to publish it. For PDF export, install Playwright and Chromium first. See the [quick-start guide](https://scholarly-docs.jxpeng.dev/en/guide/quick-start#check-and-export).
