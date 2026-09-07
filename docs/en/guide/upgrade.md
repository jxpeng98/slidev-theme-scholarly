---
title: Upgrade Notes
description: Update Slidev and Scholarly, migrate older settings, and verify an existing deck.
---

# Upgrade Notes

Upgrade the presentation project's dependencies, then check its rendered output. Updating the VS Code extension alone does not update the theme or Slidev installed in that project.

## Before updating

Save or commit the deck, `package.json`, and lockfile together so you can restore a working version. Read the [theme releases](https://github.com/jxpeng98/slidev-theme-scholarly/releases) and [changelog](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/CHANGELOG.md) for the versions you are moving between.

This repository and its starter templates use Slidev **52.19.1**. Use Node.js 24 LTS and pnpm 10 for the documented workflow; see [environment setup](./quick-start#_1-prepare-the-environment). The installed package and your lockfile determine the versions in an existing project.

## Update the project

From the presentation directory:

```bash
pnpm list @slidev/cli slidev-theme-scholarly
pnpm add -D @slidev/cli@52.19.1 slidev-theme-scholarly@latest
pnpm exec sch doctor
pnpm run dev
```

The theme installs its matching Slidev client and type dependencies. If your project also declares `@slidev/client` or `@slidev/types` directly, align those with the CLI version. Keep using your existing package manager and review the lockfile changes.

## Check older settings

| Older configuration | Current guidance |
|---|---|
| `themeConfig.colorMode` | Still supported. Use `contentMode` and `chromeMode` explicitly for new decks; see [mode migration](./theme-mode-contrast#legacy-decks-and-precedence). |
| `outlineSidebar`, `outlineSidebarOpen` | Still supported inside `themeConfig`. Prefer `outlineToc`, `outlineTocOpen`. |
| `src` on a `figure` slide | Use `image`; Slidev reserves `src` for importing slide files. |
| `title: false` on a first-page `toc` | Keep `title` as the presentation name and use `heading: false`; see [TOC](../layouts/structure#toc). |
| Project-level citation plugin setup | Scholarly now loads citation hooks from the theme. Remove duplicate citation registration while keeping unrelated Vite plugins. |

These notes describe current compatibility behavior. Check the release notes for any additional migration required by the version you install.

## Verify before sharing

1. Open the deck and inspect cover, section, dense result, and reference slides.
2. Check images, equations, citations, footnotes, and internal links.
3. Export a PDF and build the static site using [the quick-start export steps](./quick-start#check-and-export).
4. Compare the output with the saved version, especially if fonts, aspect ratio, or light/dark modes changed.

If the upgrade breaks the deck, restore the saved `package.json` and lockfile together, reinstall dependencies, and return to the working version while you investigate.

## Test a prerelease

Check which npm channels exist before selecting one:

```bash
pnpm view slidev-theme-scholarly dist-tags
```

If a `next` tag is listed, install it with `pnpm add -D slidev-theme-scholarly@next`. To return to the stable channel, run `pnpm add -D slidev-theme-scholarly@latest`. Test prereleases in a copy or branch of the deck.
