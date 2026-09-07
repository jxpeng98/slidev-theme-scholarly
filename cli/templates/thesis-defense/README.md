# __PROJECT_NAME__

This template is designed for a thesis defense.

Use Node.js 24 LTS and pnpm 10.

## Start

```bash
pnpm install
pnpm run dev
```

## Structure

- Use the opening summary to state the thesis contribution.
- Keep experiments, limitations, and defense questions explicit.
- Use the appendix index as a backup-slide map for committee discussion.

Edit `slides.md` while the preview runs. `pnpm run build` writes a static site to `dist/`; upload that directory to your host to publish it. For PDF export, install Playwright and Chromium first. See the [quick-start guide](https://scholarly-docs.jxpeng.dev/en/guide/quick-start#check-and-export).
