---
title: Upgrade Notes
---

# Upgrade Notes

Scholarly is preparing for a major upgrade. Upcoming releases may introduce breaking changes for existing decks.

## What might be affected

Depending on your setup, upgrading may require changes in one or more areas:

- **Slidev / Node.js requirements**: ensure your local environment matches the versions required by the theme.
- **Theme configuration**: some frontmatter keys and `themeConfig` options may change.
- **Layouts / components**: layout names, props, defaults, or styling tokens may change.
- **Build/export behavior**: PDF export and asset handling may be affected by upstream Slidev changes.

## Recommended upgrade checklist

1. Check your Node.js version (the theme requires Node.js 20+):

   ```bash
   node -v
   ```

2. Upgrade Slidev to a compatible version:

   ```bash
   npm i -D @slidev/cli
   ```

3. Upgrade the theme:

   ```bash
   npm i -D slidev-theme-scholarly
   ```

4. Start Slidev and fix any reported errors:

   ```bash
   npx slidev
   ```

If something breaks, pin the previous version temporarily while you migrate.

## Using pre-releases (for early testing)

We publish **pre-releases** so changes can be tested before the stable release.

### Tag / version format

| Type | Tag format | Example |
|------|-----------|---------|
| Stable | `vX.Y.Z` | `v2.0.0` |
| Pre-release | `vX.Y.Z-<pre>` | `v2.0.0-beta.1`, `v2.0.0-rc.0` |

Pre-releases follow SemVer and **must include** the `-<pre>` prerelease segment; otherwise, the CI will treat them as stable releases.

- Install the current pre-release channel:

  ```bash
  npm i -D slidev-theme-scholarly@next
  ```

- Return to the stable channel:

  ```bash
  npm i -D slidev-theme-scholarly
  ```

## Where to find the detailed changes

- [GitHub Releases](https://github.com/jxpeng98/slidev-theme-scholarly/releases)
- [Changelog](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/CHANGELOG.md)
