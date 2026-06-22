# Color Control Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the overloaded Scholarly color mode model with separate controls for brand colors, content surfaces, chrome surfaces, and section slides while keeping existing decks compatible.

**Architecture:** Add a small resolver layer that turns `themeConfig.contentMode`, `themeConfig.chromeMode`, legacy `themeConfig.colorMode`, Slidev dark state, and per-slide `sectionMode` into resolved `light` or `dark` modes. Expose resolved state through root data attributes and CSS custom properties, then let CSS cascade handle rendering for content, chrome, semantic components, and sections. Keep `themeColors` as an advanced color override, not a mode selector.

**Tech Stack:** Slidev 52.x, Vue 3, TypeScript utilities, CSS custom properties, Node ESM tests, VitePress docs, CLI metadata in `shared/themes.json` and `cli/scholarly.mjs`.

---

## Target Public API

Recommended deck frontmatter:

```yaml
themeConfig:
  colorTheme: classic-blue
  contentMode: light
  chromeMode: dark
  sectionMode: dark
```

Supported values:

```ts
type ScholarlyMode = 'light' | 'dark'
type ScholarlySurfaceMode = 'light' | 'dark' | 'match' | 'inverse'
```

Compatibility rule:

```text
contentMode > legacy colorMode > Slidev/html.dark > 'light'
chromeMode > legacy colorMode as match > 'dark'
sectionMode > 'dark'
```

Root attributes after resolution:

```html
<html
  data-color-theme="classic-blue"
  data-content-mode="light"
  data-chrome-mode="dark"
  data-section-mode="dark"
  data-color-mode="light"
>
```

`data-color-mode` stays as a legacy mirror of resolved `contentMode` during this release so existing user CSS selectors do not break.

---

## File Structure

- Create `utils/themeModes.ts`: normalize and resolve content/chrome/section modes.
- Modify `utils/colorMode.ts`: either remove after migration or leave as a compatibility wrapper that delegates to `utils/themeModes.ts`.
- Modify `setup/main.ts`: apply `data-content-mode`, `data-chrome-mode`, `data-section-mode`, legacy `data-color-mode`, `html.dark`, and browser `color-scheme`.
- Modify `layouts/section.vue`: resolve per-slide `sectionMode` using the same resolver instead of accepting only `light`/`dark`.
- Create `styles/themes/content-mode.css`: ordinary slide canvas, content surfaces, quote, code, table, footnote, Highlight, Block, and Theorem tokens.
- Create `styles/themes/chrome-mode.css`: header, footer, page number, nav, TOC, toolbar, and chrome interaction tokens.
- Modify `styles/themes/mode.css`: keep as a compatibility import file for the two new mode files.
- Modify `styles/themes/section-mode.css`: support resolved section modes and root defaults.
- Modify `styles/themes/index.css`: ensure the new mode files are loaded through `mode.css`.
- Modify `styles/layout.css`: consume `--scholarly-canvas-*`, content tokens, chrome tokens, and section tokens without mixing responsibilities.
- Modify `components/Highlight.vue`, `components/Block.vue`, `components/Theorem.vue`, footer/TOC components only where they still rely on legacy selectors.
- Modify `index.d.ts`: expose new public config keys and keep legacy `colorMode`.
- Modify `shared/themes.json` and `vscode-extension/shared/themes.json`: list content/chrome/section modes for CLI and VS Code metadata.
- Modify `cli/scholarly.mjs`: accept new flags, preserve `--mode` as a deprecated alias, and validate new mode values.
- Modify templates under `cli/templates/**/slides.md`: write new mode fields.
- Modify examples under `examples/`: update representative examples to use the new API.
- Modify docs under `docs/en/guide/*` and `docs/zh/guide/*`: document the new model and migration path.
- Modify tests under `tests/`: add resolver tests and update interaction/config tests.
- Modify `scripts/check-theme-matrix.mjs`: render combinations using `contentMode` + `chromeMode`.
- Modify release checks if they inspect `colorMode` selectors.

---

## Task 1: Add Failing Resolver Tests

**Files:**
- Create: `tests/themeModes.test.mjs`
- Test: `tests/themeModes.test.mjs`

- [ ] **Step 1: Write resolver behavior tests**

Create `tests/themeModes.test.mjs` with these tests:

```js
import assert from 'node:assert/strict'
import test from 'node:test'

const modes = await import('../utils/themeModes.ts').catch((error) => {
  assert.fail(`Expected ../utils/themeModes.ts to export theme mode helpers, got ${error.message}`)
})

test('normalizes base modes and surface modes', () => {
  assert.equal(modes.normalizeScholarlyMode('light'), 'light')
  assert.equal(modes.normalizeScholarlyMode(' DARK '), 'dark')
  assert.equal(modes.normalizeScholarlyMode('system'), null)
  assert.equal(modes.normalizeScholarlySurfaceMode('match'), 'match')
  assert.equal(modes.normalizeScholarlySurfaceMode('inverse'), 'inverse')
  assert.equal(modes.normalizeScholarlySurfaceMode('auto'), null)
})

test('resolves explicit contentMode before legacy colorMode and Slidev dark state', () => {
  assert.deepEqual(
    modes.resolveScholarlyModes({
      themeConfig: { contentMode: 'light', colorMode: 'dark' },
      slidevDark: true,
    }),
    { contentMode: 'light', chromeMode: 'dark', sectionMode: 'dark', source: 'contentMode' },
  )
})

test('uses legacy colorMode for content and chrome when new modes are absent', () => {
  assert.deepEqual(
    modes.resolveScholarlyModes({
      themeConfig: { colorMode: 'light' },
      slidevDark: true,
    }),
    { contentMode: 'light', chromeMode: 'light', sectionMode: 'dark', source: 'colorMode' },
  )
})

test('defaults content to Slidev dark state and chrome to dark', () => {
  assert.deepEqual(
    modes.resolveScholarlyModes({
      themeConfig: {},
      slidevDark: false,
    }),
    { contentMode: 'light', chromeMode: 'dark', sectionMode: 'dark', source: 'slidev' },
  )
})

test('resolves match and inverse surface modes from content mode', () => {
  assert.deepEqual(
    modes.resolveScholarlyModes({
      themeConfig: { contentMode: 'dark', chromeMode: 'inverse', sectionMode: 'match' },
      slidevDark: false,
    }),
    { contentMode: 'dark', chromeMode: 'light', sectionMode: 'dark', source: 'contentMode' },
  )
})

test('per-slide sectionMode overrides the global section mode', () => {
  assert.equal(
    modes.resolveScholarlySectionMode({
      localSectionMode: 'inverse',
      globalSectionMode: 'match',
      contentMode: 'light',
    }),
    'dark',
  )
})
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
node --test tests/themeModes.test.mjs
```

Expected: FAIL because `../utils/themeModes.ts` does not exist.

- [ ] **Step 3: Commit the failing test**

Run:

```bash
git add tests/themeModes.test.mjs
git commit -m "test(theme): cover resolved color control modes"
```

---

## Task 2: Implement the Theme Mode Resolver

**Files:**
- Create: `utils/themeModes.ts`
- Modify: `utils/colorMode.ts`
- Test: `tests/themeModes.test.mjs`

- [ ] **Step 1: Create the resolver implementation**

Create `utils/themeModes.ts`:

```ts
export type ScholarlyMode = 'light' | 'dark'
export type ScholarlySurfaceMode = ScholarlyMode | 'match' | 'inverse'
export type ScholarlyModeSource = 'contentMode' | 'colorMode' | 'slidev'

export interface ScholarlyModeConfig {
  contentMode?: unknown
  chromeMode?: unknown
  sectionMode?: unknown
  colorMode?: unknown
}

export interface ScholarlyModeResolution {
  contentMode: ScholarlyMode
  chromeMode: ScholarlyMode
  sectionMode: ScholarlyMode
  source: ScholarlyModeSource
}

export function normalizeScholarlyMode(value: unknown): ScholarlyMode | null {
  if (typeof value !== 'string')
    return null

  const normalized = value.trim().toLowerCase()
  return normalized === 'light' || normalized === 'dark' ? normalized : null
}

export function normalizeScholarlySurfaceMode(value: unknown): ScholarlySurfaceMode | null {
  const baseMode = normalizeScholarlyMode(value)
  if (baseMode)
    return baseMode

  if (typeof value !== 'string')
    return null

  const normalized = value.trim().toLowerCase()
  return normalized === 'match' || normalized === 'inverse' ? normalized : null
}

export function invertScholarlyMode(mode: ScholarlyMode): ScholarlyMode {
  return mode === 'dark' ? 'light' : 'dark'
}

export function resolveScholarlySurfaceMode(
  value: unknown,
  contentMode: ScholarlyMode,
  fallback: ScholarlySurfaceMode,
): ScholarlyMode {
  const surfaceMode = normalizeScholarlySurfaceMode(value) ?? fallback
  if (surfaceMode === 'match')
    return contentMode
  if (surfaceMode === 'inverse')
    return invertScholarlyMode(contentMode)
  return surfaceMode
}

export function resolveScholarlySectionMode(options: {
  localSectionMode?: unknown
  globalSectionMode?: unknown
  contentMode: ScholarlyMode
}): ScholarlyMode {
  return resolveScholarlySurfaceMode(
    options.localSectionMode ?? options.globalSectionMode,
    options.contentMode,
    'dark',
  )
}

export function resolveScholarlyModes(options: {
  themeConfig?: ScholarlyModeConfig | null
  slidevDark: boolean
}): ScholarlyModeResolution {
  const config = options.themeConfig ?? {}
  const explicitContentMode = normalizeScholarlyMode(config.contentMode)
  const legacyColorMode = normalizeScholarlyMode(config.colorMode)

  const contentMode = explicitContentMode
    ?? legacyColorMode
    ?? (options.slidevDark ? 'dark' : 'light')

  const source: ScholarlyModeSource = explicitContentMode
    ? 'contentMode'
    : legacyColorMode
      ? 'colorMode'
      : 'slidev'

  const chromeFallback: ScholarlySurfaceMode = legacyColorMode && !explicitContentMode
    ? 'match'
    : 'dark'

  return {
    contentMode,
    chromeMode: resolveScholarlySurfaceMode(config.chromeMode, contentMode, chromeFallback),
    sectionMode: resolveScholarlySurfaceMode(config.sectionMode, contentMode, 'dark'),
    source,
  }
}
```

- [ ] **Step 2: Keep `utils/colorMode.ts` as a compatibility wrapper**

Replace `utils/colorMode.ts` with:

```ts
import {
  normalizeScholarlyMode,
  resolveScholarlyModes,
  type ScholarlyMode,
  type ScholarlyModeSource,
} from './themeModes'

export type ScholarlyColorMode = ScholarlyMode
export type ScholarlyColorModeSource = ScholarlyModeSource

export interface ScholarlyColorModeResolution {
  mode: ScholarlyColorMode
  source: ScholarlyColorModeSource
}

export interface ScholarlyColorModeRoot {
  style: {
    colorScheme?: string
  }
  classList: {
    contains(name: string): boolean
    toggle(name: string, force?: boolean): boolean
  }
  setAttribute(name: string, value: string): void
}

export function normalizeScholarlyColorMode(value: unknown): ScholarlyColorMode | null {
  return normalizeScholarlyMode(value)
}

export function resolveScholarlyColorMode(
  configuredMode: unknown,
  slidevDark: boolean,
): ScholarlyColorModeResolution {
  const resolution = resolveScholarlyModes({
    themeConfig: { contentMode: configuredMode },
    slidevDark,
  })

  return {
    mode: resolution.contentMode,
    source: resolution.source,
  }
}

export function applyRootColorMode(
  root: ScholarlyColorModeRoot,
  resolution: ScholarlyColorModeResolution,
) {
  root.setAttribute('data-color-mode', resolution.mode)
  root.setAttribute('data-content-mode', resolution.mode)
  root.classList.toggle('dark', resolution.mode === 'dark')
  root.style.colorScheme = resolution.mode
}
```

- [ ] **Step 3: Run resolver tests**

Run:

```bash
node --test tests/themeModes.test.mjs tests/colorMode.test.mjs
```

Expected: PASS for both files.

- [ ] **Step 4: Commit the resolver**

Run:

```bash
git add utils/themeModes.ts utils/colorMode.ts tests/themeModes.test.mjs
git commit -m "feat(theme): resolve separate content chrome and section modes"
```

---

## Task 3: Apply Resolved Modes at Runtime

**Files:**
- Modify: `setup/main.ts`
- Modify: `tests/colorMode.test.mjs`
- Modify: `tests/interactionUi.test.mjs`
- Test: `tests/colorMode.test.mjs`, `tests/interactionUi.test.mjs`

- [ ] **Step 1: Extend the internal theme config type**

In `setup/main.ts`, update `ThemeConfig` to include the new keys:

```ts
type ThemeConfig = {
  colorTheme?: string
  fontTheme?: string
  contentMode?: 'light' | 'dark'
  chromeMode?: 'light' | 'dark' | 'match' | 'inverse'
  colorMode?: 'light' | 'dark'
  sectionMode?: 'light' | 'dark' | 'match' | 'inverse'
  beamerNav?: boolean
  outlineSidebar?: boolean
  outlineSidebarOpen?: boolean
  outlineToc?: boolean
  outlineTocOpen?: boolean
  footnoteDisplay?: 'both' | 'hover-only' | 'notes-only'
}
```

- [ ] **Step 2: Replace the color-mode import**

In `setup/main.ts`, replace:

```ts
import { applyRootColorMode, resolveScholarlyColorMode } from '../utils/colorMode'
```

with:

```ts
import { resolveScholarlyModes } from '../utils/themeModes'
```

- [ ] **Step 3: Replace `syncColorModeWithDark`**

Replace the existing `syncColorModeWithDark` function with:

```ts
const syncThemeModesWithDark = (config?: ThemeConfig | null) => {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  const resolution = resolveScholarlyModes({
    themeConfig: config,
    slidevDark: root.classList.contains('dark'),
  })

  root.setAttribute('data-content-mode', resolution.contentMode)
  root.setAttribute('data-chrome-mode', resolution.chromeMode)
  root.setAttribute('data-section-mode', resolution.sectionMode)
  root.setAttribute('data-color-mode', resolution.contentMode)
  root.classList.toggle('dark', resolution.contentMode === 'dark')
  root.style.colorScheme = resolution.contentMode
}
```

- [ ] **Step 4: Update call sites**

In `applyThemePresets`, replace:

```ts
syncColorModeWithDark(config)
```

with:

```ts
syncThemeModesWithDark(config)
```

In `setupDarkModeSync`, replace both calls to `syncColorModeWithDark(config)` with:

```ts
syncThemeModesWithDark(config)
```

Update the nearby comment to:

```ts
  // Watch Slidev's dark class. Explicit Scholarly modes restore the resolved
  // content/chrome/section attributes if Slidev or the system toggles dark mode.
```

- [ ] **Step 5: Update source-level interaction tests**

In `tests/interactionUi.test.mjs`, replace the old explicit color-mode test with:

```js
test('explicit theme modes sync content chrome and section attributes', () => {
  assert.match(files.mainSetup, /resolveScholarlyModes/)
  assert.match(files.mainSetup, /data-content-mode/)
  assert.match(files.mainSetup, /data-chrome-mode/)
  assert.match(files.mainSetup, /data-section-mode/)
  assert.match(files.mainSetup, /data-color-mode/)
  assert.doesNotMatch(files.mainSetup, /if \(config\?\.colorMode\) return/)
})
```

- [ ] **Step 6: Run tests**

Run:

```bash
node --test tests/themeModes.test.mjs tests/colorMode.test.mjs tests/interactionUi.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit runtime mode sync**

Run:

```bash
git add setup/main.ts tests/colorMode.test.mjs tests/interactionUi.test.mjs
git commit -m "feat(runtime): apply resolved theme surface modes"
```

---

## Task 4: Split Content and Chrome CSS Tokens

**Files:**
- Create: `styles/themes/content-mode.css`
- Create: `styles/themes/chrome-mode.css`
- Modify: `styles/themes/mode.css`
- Modify: `styles/themes/section-mode.css`
- Modify: `styles/layout.css`
- Test: `tests/interactionUi.test.mjs`

- [ ] **Step 1: Create content mode tokens**

Create `styles/themes/content-mode.css` by moving content-related tokens from `styles/themes/mode.css` into these selectors:

```css
/* ==========================================================================
 * Content Mode
 * Controls ordinary slide canvas, readable content surfaces, and semantic
 * components. Chrome and section surfaces must not depend on this file.
 * ========================================================================== */

:root,
:root[data-content-mode="light"] {
  --scholarly-canvas-bg: var(--scholarly-bg-warm, #fdfbf7);
  --scholarly-canvas-fg: var(--scholarly-text-primary, #2d3748);
  --scholarly-content-surface: #ffffff;
  --scholarly-content-surface-muted: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 4%, #ffffff 96%);
  --scholarly-content-border: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 14%, #dbe3ec 86%);
  --scholarly-content-fg: var(--scholarly-text-primary, #2d3748);
  --scholarly-content-fg-muted: color-mix(in srgb, var(--scholarly-text-primary, #2d3748) 68%, #ffffff 32%);
  --scholarly-footnote-fg: color-mix(in srgb, var(--scholarly-text-primary, #2d3748) 86%, #ffffff 14%);
  --scholarly-footnote-link-fg: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 84%, #000000 16%);
  --scholarly-footnote-backref-fg: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 62%, transparent);
  --scholarly-footnote-sep: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 26%, transparent);
  --scholarly-footnote-popover-bg: linear-gradient(180deg, #ffffff, color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 5%, #ffffff 95%));
  --scholarly-footnote-popover-fg: color-mix(in srgb, var(--scholarly-text-primary, #2d3748) 92%, #000000 8%);
  --scholarly-footnote-popover-border: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 18%, #dbe3ec 82%);
  --scholarly-footnote-popover-shadow: 0 18px 44px rgba(15, 23, 42, 0.14), 0 4px 14px rgba(15, 23, 42, 0.07);
  --scholarly-footnote-label-bg: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 10%, #ffffff 90%);
  --scholarly-footnote-label-fg: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 88%, #000000 12%);
  --scholarly-code-bg: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 5%, #ffffff 95%);
  --scholarly-code-fg: color-mix(in srgb, var(--scholarly-text-primary, #2d3748) 90%, var(--slidev-theme-primary, #1e3a5f) 10%);
  --scholarly-inline-code-bg: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 7%, #ffffff 93%);
  --scholarly-quote-fg: color-mix(in srgb, var(--scholarly-text-primary, #2d3748) 84%, #ffffff 16%);
  --scholarly-quote-border: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 82%, #ffffff 18%);
  --scholarly-table-rule: color-mix(in srgb, var(--scholarly-text-primary, #2d3748) 88%, var(--slidev-theme-primary, #1e3a5f) 12%);
  --scholarly-highlight-primary-bg: color-mix(in srgb, var(--slidev-theme-primary, #5d8392) 16%, white 84%);
  --scholarly-highlight-primary-fg: color-mix(in srgb, var(--slidev-theme-primary, #4a6b7a) 82%, black 18%);
  --scholarly-highlight-success-bg: color-mix(in srgb, #10b981 18%, white 82%);
  --scholarly-highlight-success-fg: color-mix(in srgb, #059669 84%, black 16%);
  --scholarly-highlight-warning-bg: color-mix(in srgb, #f59e0b 20%, white 80%);
  --scholarly-highlight-warning-fg: color-mix(in srgb, #b45309 88%, black 12%);
  --scholarly-highlight-danger-bg: color-mix(in srgb, #ef4444 16%, white 84%);
  --scholarly-highlight-danger-fg: color-mix(in srgb, #dc2626 86%, black 14%);
  --scholarly-highlight-info-bg: color-mix(in srgb, #06b6d4 18%, white 82%);
  --scholarly-highlight-info-fg: color-mix(in srgb, #0891b2 84%, black 16%);
  --scholarly-block-default-header-bg: linear-gradient(to right, var(--slidev-theme-primary, #4a6b7a), var(--slidev-theme-primary-light, #5d8392));
  --scholarly-block-default-header-fg: #ffffff;
  --scholarly-block-default-content-bg: color-mix(in srgb, var(--slidev-theme-primary, #5d8392) 10%, transparent);
  --scholarly-block-default-border: color-mix(in srgb, var(--slidev-theme-primary, #5d8392) 30%, transparent);
}

:root[data-content-mode="dark"] {
  --scholarly-canvas-bg: #0f172a;
  --scholarly-canvas-fg: #e5edf7;
  --scholarly-content-surface: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 34%, #0f172a 66%);
  --scholarly-content-surface-muted: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 24%, #111827 76%);
  --scholarly-content-border: color-mix(in srgb, var(--slidev-theme-primary-light, #2c5282) 38%, #94a3b8 20%, transparent);
  --scholarly-content-fg: #e5edf7;
  --scholarly-content-fg-muted: rgba(226, 232, 240, 0.72);
  --scholarly-footnote-fg: rgba(226, 232, 240, 0.78);
  --scholarly-footnote-link-fg: color-mix(in srgb, var(--slidev-theme-primary-light, #93c5fd) 62%, #dbeafe 38%);
  --scholarly-footnote-backref-fg: rgba(191, 219, 254, 0.72);
  --scholarly-footnote-sep: rgba(148, 163, 184, 0.34);
  --scholarly-footnote-popover-bg: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
  --scholarly-footnote-popover-fg: rgba(226, 232, 240, 0.94);
  --scholarly-footnote-popover-border: rgba(148, 163, 184, 0.3);
  --scholarly-footnote-popover-shadow: 0 22px 52px rgba(2, 6, 23, 0.5), 0 4px 14px rgba(2, 6, 23, 0.28);
  --scholarly-footnote-label-bg: rgba(59, 130, 246, 0.18);
  --scholarly-footnote-label-fg: rgba(219, 234, 254, 0.96);
  --scholarly-code-bg: rgba(15, 23, 42, 0.78);
  --scholarly-code-fg: rgba(226, 232, 240, 0.94);
  --scholarly-inline-code-bg: rgba(148, 163, 184, 0.16);
  --scholarly-quote-fg: rgba(226, 232, 240, 0.84);
  --scholarly-quote-border: color-mix(in srgb, var(--slidev-theme-primary-light, #93c5fd) 70%, #ffffff 30%);
  --scholarly-table-rule: rgba(226, 232, 240, 0.78);
  --scholarly-highlight-primary-bg: color-mix(in srgb, var(--slidev-theme-primary-light, #8fb3c2) 28%, transparent);
  --scholarly-highlight-primary-fg: color-mix(in srgb, var(--slidev-theme-primary-light, #8fb3c2) 72%, white 28%);
  --scholarly-highlight-success-bg: color-mix(in srgb, #10b981 30%, transparent);
  --scholarly-highlight-success-fg: #34d399;
  --scholarly-highlight-warning-bg: color-mix(in srgb, #f59e0b 30%, transparent);
  --scholarly-highlight-warning-fg: #fbbf24;
  --scholarly-highlight-danger-bg: color-mix(in srgb, #ef4444 30%, transparent);
  --scholarly-highlight-danger-fg: #f87171;
  --scholarly-highlight-info-bg: color-mix(in srgb, #06b6d4 30%, transparent);
  --scholarly-highlight-info-fg: #22d3ee;
  --scholarly-block-default-header-bg: linear-gradient(to right, var(--slidev-theme-primary, #4a6b7a), var(--slidev-theme-primary-light, #5d8392));
  --scholarly-block-default-header-fg: #ffffff;
  --scholarly-block-default-content-bg: color-mix(in srgb, var(--slidev-theme-primary, #5d8392) 12%, transparent);
  --scholarly-block-default-border: color-mix(in srgb, var(--slidev-theme-primary, #5d8392) 38%, transparent);
}
```

After writing the file, copy the existing non-default `--scholarly-block-*` and `--scholarly-theorem-*` variables from `styles/themes/mode.css` into both light and dark selectors, preserving their current light and dark values. The exact variable names are the existing names from `styles/themes/mode.css` lines containing `--scholarly-block-` and `--scholarly-theorem-`.

- [ ] **Step 2: Create chrome mode tokens**

Create `styles/themes/chrome-mode.css`:

```css
/* ==========================================================================
 * Chrome Mode
 * Controls header, footer, toolbar, TOC, navigation, and chrome interactions.
 * Content surfaces and semantic components must not depend on this file.
 * ========================================================================== */

:root,
:root[data-chrome-mode="dark"] {
  --scholarly-chrome-bg: linear-gradient(135deg, var(--slidev-theme-primary, #1e3a5f) 0%, var(--slidev-theme-primary-light, var(--slidev-theme-primary, #1e3a5f)) 100%);
  --scholarly-chrome-fg: #fff;
  --scholarly-chrome-fg-muted: rgba(255, 255, 255, 0.9);
  --scholarly-chrome-border: rgba(255, 255, 255, 0.2);
  --scholarly-footer-fg: #ffffff;
  --scholarly-footer-fg-muted: rgba(255, 255, 255, 0.88);
  --scholarly-footer-border: rgba(255, 255, 255, 0.18);
  --scholarly-toolbar-surface: linear-gradient(
    180deg,
    color-mix(in srgb, var(--slidev-theme-primary-light, var(--slidev-theme-primary, #1e3a5f)) 58%, var(--slidev-theme-primary, #1e3a5f) 42%) 0%,
    color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 74%, #11243c 26%) 100%
  );
  --scholarly-toolbar-fg: color-mix(in srgb, var(--scholarly-chrome-fg) 92%, var(--slidev-theme-primary-light, var(--slidev-theme-primary, #1e3a5f)) 8%);
  --scholarly-toolbar-border: color-mix(in srgb, var(--scholarly-chrome-fg) 12%, var(--slidev-theme-primary-light, var(--slidev-theme-primary, #1e3a5f)) 34%);
  --scholarly-toolbar-hover: color-mix(in srgb, var(--slidev-theme-primary-light, var(--slidev-theme-primary, #1e3a5f)) 34%, var(--scholarly-chrome-fg) 10%);
  --scholarly-toolbar-divider: color-mix(in srgb, var(--scholarly-chrome-fg) 12%, var(--slidev-theme-primary-light, var(--slidev-theme-primary, #1e3a5f)) 34%);
  --scholarly-toolbar-chip: color-mix(in srgb, var(--slidev-theme-primary-light, var(--slidev-theme-primary, #1e3a5f)) 26%, transparent);
}

:root[data-chrome-mode="light"] {
  --scholarly-chrome-bg: var(--scholarly-bg-warm, #fdfbf7);
  --scholarly-chrome-fg: var(--scholarly-text-primary, #2d3748);
  --scholarly-chrome-fg-muted: rgba(45, 55, 72, 0.75);
  --scholarly-chrome-border: rgba(45, 55, 72, 0.15);
  --scholarly-footer-fg: #ffffff;
  --scholarly-footer-fg-muted: rgba(255, 255, 255, 0.88);
  --scholarly-footer-border: rgba(255, 255, 255, 0.18);
  --scholarly-toolbar-surface: linear-gradient(
    180deg,
    color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 12%, white 88%) 0%,
    color-mix(in srgb, var(--slidev-theme-primary-light, var(--slidev-theme-primary, #1e3a5f)) 16%, var(--scholarly-bg-warm, #fdfbf7) 84%) 100%
  );
  --scholarly-toolbar-fg: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 42%, var(--scholarly-text-primary, #2d3748) 58%);
  --scholarly-toolbar-border: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 18%, #cbd5e0 82%);
  --scholarly-toolbar-hover: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 16%, #edf2f7 84%);
  --scholarly-toolbar-divider: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 22%, #cbd5e0 78%);
  --scholarly-toolbar-chip: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 10%, transparent);
}

:root[data-color-theme="princeton-orange"] {
  --scholarly-footer-fg: #1f2937;
  --scholarly-footer-fg-muted: rgba(31, 41, 55, 0.88);
  --scholarly-footer-border: rgba(31, 41, 55, 0.2);
}
```

- [ ] **Step 3: Convert `mode.css` to compatibility imports**

Replace `styles/themes/mode.css` with:

```css
/* Compatibility entrypoint for mode-related theme tokens. */
@import './content-mode.css';
@import './chrome-mode.css';
```

- [ ] **Step 4: Update section mode CSS**

In `styles/themes/section-mode.css`, add a root default selector above the existing section layout rules:

```css
:root,
:root[data-section-mode="dark"] {
  --scholarly-section-bg: linear-gradient(135deg, var(--slidev-theme-primary, #1e3a5f) 0%, var(--slidev-theme-primary-light, var(--slidev-theme-primary, #1e3a5f)) 100%);
  --scholarly-section-fg: #fff;
  --scholarly-section-fg-muted: rgba(255, 255, 255, 0.9);
  --scholarly-section-border: rgba(255, 255, 255, 0.2);
}

:root[data-section-mode="light"] {
  --scholarly-section-bg: var(--scholarly-bg-warm, #fdfbf7);
  --scholarly-section-fg: var(--scholarly-text-primary, #2d3748);
  --scholarly-section-fg-muted: rgba(45, 55, 72, 0.75);
  --scholarly-section-border: rgba(45, 55, 72, 0.15);
}
```

Keep the existing `.slidev-layout.section[data-section-mode="light"]` and `.slidev-layout.section[data-section-mode="dark"]` selectors so per-slide overrides still work.

- [ ] **Step 5: Switch ordinary slide canvas tokens**

In `styles/layout.css`, replace:

```css
.slidev-layout {
  font-size: var(--scholarly-font-size, 1rem);
  font-family: var(--scholarly-font-body);
  color: var(--scholarly-text-primary);
  background-color: var(--scholarly-bg-warm);
}
```

with:

```css
.slidev-layout {
  font-size: var(--scholarly-font-size, 1rem);
  font-family: var(--scholarly-font-body);
  color: var(--scholarly-canvas-fg, var(--scholarly-text-primary));
  background-color: var(--scholarly-canvas-bg, var(--scholarly-bg-warm));
}
```

- [ ] **Step 6: Update source-level tests for split CSS**

In `tests/interactionUi.test.mjs`, add:

```js
test('theme mode CSS is split into content and chrome token files', () => {
  assert.match(files.themeMode, /content-mode\.css/)
  assert.match(files.themeMode, /chrome-mode\.css/)
  assert.match(files.layoutCss, /--scholarly-canvas-bg/)
  assert.match(files.layoutCss, /--scholarly-canvas-fg/)
})
```

Update the file-loading helper at the top of `tests/interactionUi.test.mjs` so `files.themeMode` reads `styles/themes/mode.css` and `files.layoutCss` reads `styles/layout.css`.

- [ ] **Step 7: Run tests**

Run:

```bash
node --test tests/interactionUi.test.mjs tests/themeModes.test.mjs
git diff --check -- styles tests
```

Expected: PASS and no whitespace errors.

- [ ] **Step 8: Commit CSS split**

Run:

```bash
git add styles/themes/content-mode.css styles/themes/chrome-mode.css styles/themes/mode.css styles/themes/section-mode.css styles/layout.css tests/interactionUi.test.mjs
git commit -m "refactor(theme): split content and chrome color tokens"
```

---

## Task 5: Resolve Section Mode Per Slide

**Files:**
- Modify: `layouts/section.vue`
- Test: `tests/themeModes.test.mjs`

- [ ] **Step 1: Update `layouts/section.vue` imports**

Add this import:

```ts
import { resolveScholarlySectionMode, resolveScholarlyModes } from '../utils/themeModes'
```

- [ ] **Step 2: Replace section mode computed values**

Replace the existing `globalSectionMode` and `resolvedSectionMode` computed blocks with:

```ts
const themeConfig = computed(() => (($slidev.configs as any)?.themeConfig ?? {}) as {
  contentMode?: unknown
  chromeMode?: unknown
  colorMode?: unknown
  sectionMode?: unknown
})

const contentMode = computed(() => resolveScholarlyModes({
  themeConfig: themeConfig.value,
  slidevDark: typeof document !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : false,
}).contentMode)

const resolvedSectionMode = computed<'dark' | 'light'>(() => {
  return resolveScholarlySectionMode({
    localSectionMode: $frontmatter.value?.sectionMode,
    globalSectionMode: themeConfig.value.sectionMode,
    contentMode: contentMode.value,
  })
})
```

- [ ] **Step 3: Run tests and build**

Run:

```bash
node --test tests/themeModes.test.mjs
pnpm run build
```

Expected: tests pass and build completes with only existing dependency warnings.

- [ ] **Step 4: Commit section resolver**

Run:

```bash
git add layouts/section.vue
git commit -m "feat(layouts): resolve section mode from theme modes"
```

---

## Task 6: Update Public Types and Metadata

**Files:**
- Modify: `index.d.ts`
- Modify: `shared/themes.json`
- Modify: `vscode-extension/shared/themes.json`
- Test: `tests/versionSync.test.mjs` if metadata sync is covered there; otherwise `node --test tests/*.test.mjs`

- [ ] **Step 1: Update public TypeScript types**

In `index.d.ts`, replace the top mode types with:

```ts
export type ScholarlyMode = 'light' | 'dark'

export type ScholarlySurfaceMode = ScholarlyMode | 'match' | 'inverse'

export type ScholarlyColorMode = ScholarlyMode

export type ScholarlySectionMode = ScholarlySurfaceMode
```

In `ScholarlyThemeConfig`, add:

```ts
  contentMode?: ScholarlyMode
  chromeMode?: ScholarlySurfaceMode
```

Keep:

```ts
  colorMode?: ScholarlyColorMode
```

with a JSDoc comment:

```ts
  /** @deprecated Use contentMode, and chromeMode when frame styling differs from content. */
```

- [ ] **Step 2: Add mode metadata**

In both `shared/themes.json` and `vscode-extension/shared/themes.json`, replace the existing `colorModes` block with:

```json
"contentModes": [
  {
    "id": "light",
    "label": "Light Content",
    "description": "Light slide canvas with dark readable text"
  },
  {
    "id": "dark",
    "label": "Dark Content",
    "description": "Dark slide canvas with light readable text"
  }
],
"surfaceModes": [
  {
    "id": "dark",
    "label": "Dark",
    "description": "Dark surface with light text"
  },
  {
    "id": "light",
    "label": "Light",
    "description": "Light surface with dark text"
  },
  {
    "id": "match",
    "label": "Match Content",
    "description": "Use the resolved content mode"
  },
  {
    "id": "inverse",
    "label": "Inverse Content",
    "description": "Use the opposite of the resolved content mode"
  }
],
"colorModes": [
  {
    "id": "dark",
    "label": "Dark",
    "description": "Legacy alias for contentMode"
  },
  {
    "id": "light",
    "label": "Light",
    "description": "Legacy alias for contentMode"
  }
]
```

- [ ] **Step 3: Run tests**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Commit types and metadata**

Run:

```bash
git add index.d.ts shared/themes.json vscode-extension/shared/themes.json
git commit -m "feat(theme): expose content and surface mode types"
```

---

## Task 7: Update CLI Apply and Doctor Validation

**Files:**
- Modify: `cli/scholarly.mjs`
- Test: existing CLI tests under `tests/` and direct CLI smoke commands

- [ ] **Step 1: Extend CLI option parsing**

In the option objects returned by theme apply parsing, add:

```js
contentMode: '',
chromeMode: '',
```

Add flag handling for:

```js
--content-mode <light|dark>
--chrome-mode <light|dark|match|inverse>
```

Keep `--mode` and `--mode=value`, but map it to `contentMode` when `contentMode` is not already set.

- [ ] **Step 2: Validate new modes**

Add these helpers near the existing validators:

```js
const CONTENT_MODES = ['light', 'dark']
const SURFACE_MODES = ['light', 'dark', 'match', 'inverse']

function assertValidContentMode(value, label) {
  if (value && !CONTENT_MODES.includes(value))
    throw new Error(`Invalid ${label} value. Use "light" or "dark".`)
}

function assertValidSurfaceMode(value, label) {
  if (value && !SURFACE_MODES.includes(value))
    throw new Error(`Invalid ${label} value. Use "light", "dark", "match", or "inverse".`)
}
```

Use them in theme apply and preset apply validation:

```js
assertValidContentMode(contentMode, '--content-mode')
assertValidSurfaceMode(chromeMode, '--chrome-mode')
assertValidSurfaceMode(sectionMode, '--section-mode')
```

- [ ] **Step 3: Write new frontmatter keys**

When calling the existing `updateThemeConfig` path, include:

```js
contentMode,
chromeMode,
sectionMode,
```

Do not write `colorMode` for new CLI commands unless the input file already contains `themeConfig.colorMode` and the user invoked legacy `--mode`. For legacy `--mode`, write `contentMode` and remove `colorMode` from the updated config block.

- [ ] **Step 4: Update CLI help text**

Replace help examples that mention:

```text
--mode <light|dark>
```

with:

```text
--content-mode <light|dark> [--chrome-mode <light|dark|match|inverse>] [--section-mode <light|dark|match|inverse>]
```

Add one compatibility line:

```text
Legacy --mode is accepted as an alias for --content-mode.
```

- [ ] **Step 5: Run CLI smoke commands**

Run:

```bash
node cli/scholarly.mjs theme apply classic-blue --content-mode light --chrome-mode dark --section-mode inverse --file /private/tmp/scholarly-cli-mode-test.md
```

Expected: if the file does not exist, the CLI reports the same missing file error as existing `theme apply` behavior.

Create a temporary file using a normal editor or `cp` from `cli/templates/basic/slides.md`, then run:

```bash
cp cli/templates/basic/slides.md /private/tmp/scholarly-cli-mode-test.md
node cli/scholarly.mjs theme apply classic-blue --content-mode light --chrome-mode dark --section-mode inverse --file /private/tmp/scholarly-cli-mode-test.md
rg -n "contentMode|chromeMode|sectionMode|colorMode" /private/tmp/scholarly-cli-mode-test.md
```

Expected:

```text
contentMode: light
chromeMode: dark
sectionMode: inverse
```

No `colorMode:` line should remain in the updated file.

- [ ] **Step 6: Run tests**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit CLI migration**

Run:

```bash
git add cli/scholarly.mjs
git commit -m "feat(cli): apply explicit content and chrome modes"
```

---

## Task 8: Update Templates and Examples

**Files:**
- Modify: `cli/templates/**/slides.md`
- Modify: `examples/*.md`
- Test: `scripts/check-curated-templates.mjs`, `scripts/check-theme-matrix.mjs`

- [ ] **Step 1: Update template frontmatter**

For each `cli/templates/**/slides.md`, replace `colorMode` with these keys when a mode is present:

```yaml
contentMode: light
chromeMode: dark
sectionMode: dark
```

Use these defaults:

```text
basic: contentMode light, chromeMode dark, sectionMode dark
academic: contentMode light, chromeMode dark, sectionMode dark
paper-talk: contentMode light, chromeMode dark, sectionMode dark
reading-group: contentMode light, chromeMode dark, sectionMode dark
seminar: contentMode light, chromeMode dark, sectionMode dark
thesis-defense: contentMode light, chromeMode dark, sectionMode dark
conference-lightning: contentMode light, chromeMode dark, sectionMode dark
zh: contentMode light, chromeMode dark, sectionMode dark
```

- [ ] **Step 2: Update examples**

In `examples/example-*.md`, replace each top-level `themeConfig.colorMode` with `contentMode` and `chromeMode`.

Use these mappings:

```text
old colorMode: light -> contentMode: light, chromeMode: match
old colorMode: dark -> contentMode: light, chromeMode: dark
example-sepia -> contentMode: light, chromeMode: match, sectionMode: light
example-high-contrast -> contentMode: light, chromeMode: dark, sectionMode: dark
```

Keep `examples/example-themes.md` slides that demonstrate multiple themes, but update embedded snippets to use the new fields.

- [ ] **Step 3: Run template and theme checks**

Run:

```bash
node scripts/check-curated-templates.mjs
node scripts/check-theme-matrix.mjs --dry-run
```

Expected: PASS.

- [ ] **Step 4: Commit templates and examples**

Run:

```bash
git add cli/templates examples
git commit -m "docs(examples): use explicit theme surface modes"
```

---

## Task 9: Update Documentation and Migration Notes

**Files:**
- Modify: `docs/en/guide/configurations.md`
- Modify: `docs/zh/guide/configurations.md`
- Modify: `docs/en/guide/themes.md`
- Modify: `docs/zh/guide/themes.md`
- Modify: `docs/en/guide/theme-mode-contrast.md`
- Modify: `docs/zh/guide/theme-mode-contrast.md`
- Modify: `README.md`
- Modify: `README-zh.md`

- [ ] **Step 1: Replace the public model explanation**

In both configuration guides, add this table:

```markdown
| Option | Controls | Default |
| --- | --- | --- |
| `colorTheme` | Brand palette: primary, accent, paper tone, and base text color | `classic-blue` |
| `contentMode` | Ordinary slide canvas, readable content surfaces, quote, code, table, footnotes, Highlight, Block, and Theorem | Follows `colorMode`, then Slidev dark state |
| `chromeMode` | Header, footer, page number, navigation buttons, TOC, and toolbar surfaces | `dark` |
| `sectionMode` | Default appearance for `layout: section` slides | `dark` |
| `colorMode` | Legacy alias for `contentMode` | Deprecated |
| `themeColors` | Advanced CSS variable overrides for brand and footer colors | unset |
```

- [ ] **Step 2: Add migration examples**

Add these examples to English and Chinese theme docs:

```yaml
# Before
themeConfig:
  colorTheme: classic-blue
  colorMode: dark
  sectionMode: dark

# After
themeConfig:
  colorTheme: classic-blue
  contentMode: light
  chromeMode: dark
  sectionMode: dark
```

```yaml
# All-light deck
themeConfig:
  colorTheme: high-contrast
  contentMode: light
  chromeMode: match
  sectionMode: match
```

```yaml
# All-dark deck
themeConfig:
  colorTheme: nordic-blue
  contentMode: dark
  chromeMode: match
  sectionMode: match
```

- [ ] **Step 3: Update implementation details**

Replace references to:

```text
[data-color-mode="dark/light"]
```

with:

```text
[data-content-mode="dark/light"]
[data-chrome-mode="dark/light"]
[data-section-mode="dark/light"]
```

State that `data-color-mode` is a legacy mirror of `data-content-mode`.

- [ ] **Step 4: Run docs build**

Run:

```bash
pnpm --dir docs run build
```

Expected: VitePress build succeeds. Existing dependency warnings are acceptable if they match the current build warnings.

- [ ] **Step 5: Commit docs**

Run:

```bash
git add docs README.md README-zh.md
git commit -m "docs(theme): document explicit color surface controls"
```

---

## Task 10: Update Theme Matrix and Release Checks

**Files:**
- Modify: `scripts/check-theme-matrix.mjs`
- Modify: release check scripts that inspect mode selectors
- Modify: `package.json` only if script names change
- Test: `pnpm run check`, `pnpm run check:visual`

- [ ] **Step 1: Update generated matrix frontmatter**

In `scripts/check-theme-matrix.mjs`, generated decks should use:

```yaml
themeConfig:
  colorTheme: ${theme.id}
  contentMode: ${mode}
  chromeMode: ${mode === 'light' ? 'dark' : 'match'}
  sectionMode: ${mode === 'light' ? 'dark' : 'match'}
```

This keeps each matrix run testing both a content mode and a chrome/section contrast relationship.

- [ ] **Step 2: Update any selector checks**

If a release check searches for `data-color-mode`, update it to accept:

```text
data-content-mode
data-chrome-mode
data-section-mode
```

Keep `data-color-mode` accepted only as compatibility output, not as the primary implementation selector.

- [ ] **Step 3: Run release checks**

Run:

```bash
node --test tests/*.test.mjs
pnpm run build
CI=true pnpm run check
```

Expected: PASS.

- [ ] **Step 4: Run full visual check**

Run:

```bash
CI=true pnpm run check:visual
```

Expected: PASS. If the sandbox cannot bind local ports, rerun the same command with approved escalation and record that reason in the final implementation summary.

- [ ] **Step 5: Commit release check updates**

Run:

```bash
git add scripts package.json tests
git commit -m "test(theme): verify explicit surface mode matrix"
```

---

## Task 11: Final Compatibility Audit

**Files:**
- Inspect all changed files
- Modify only files with audit failures

- [ ] **Step 1: Search for stale public names**

Run:

```bash
rg -n "colorMode|data-color-mode|data-content-mode|data-chrome-mode|data-section-mode|contentMode|chromeMode|sectionMode" --glob '!node_modules/**' --glob '!dist/**'
```

Expected:

- `colorMode` remains in docs as deprecated compatibility.
- `data-color-mode` remains only as the legacy mirror and compatibility test coverage.
- Primary CSS selectors use `data-content-mode`, `data-chrome-mode`, and `data-section-mode`.

- [ ] **Step 2: Check no content selectors depend on chrome tokens**

Run:

```bash
rg -n "scholarly-chrome|scholarly-toolbar|scholarly-footer" styles/themes/content-mode.css components layouts styles/layout.css
```

Expected: no matches in `styles/themes/content-mode.css`. Matches in layout/footer/navigation files are acceptable.

- [ ] **Step 3: Check no chrome selectors depend on content tokens**

Run:

```bash
rg -n "scholarly-content|scholarly-code|scholarly-quote|scholarly-highlight|scholarly-block|scholarly-theorem" styles/themes/chrome-mode.css
```

Expected: no matches.

- [ ] **Step 4: Check worktree status**

Run:

```bash
git status --short
```

Expected: empty output.

- [ ] **Step 5: Create final integration commit only if audit required changes**

If Step 1-3 required edits, run:

```bash
git add utils/themeModes.ts utils/colorMode.ts setup/main.ts layouts/section.vue styles/themes/content-mode.css styles/themes/chrome-mode.css styles/themes/mode.css styles/themes/section-mode.css styles/layout.css index.d.ts shared/themes.json vscode-extension/shared/themes.json cli/scholarly.mjs cli/templates examples docs README.md README-zh.md scripts tests
git commit -m "fix(theme): align color mode compatibility references"
```

If no edits were required, do not create an empty commit.

---

## Acceptance Criteria

- New decks can use `contentMode`, `chromeMode`, and `sectionMode` independently.
- Existing decks using `themeConfig.colorMode` continue to render with compatible content and chrome modes.
- Ordinary slide canvas color comes from content mode tokens, not directly from `colorTheme`.
- Header/footer/nav/TOC color comes from chrome mode tokens.
- Section slides resolve independently and support `light`, `dark`, `match`, and `inverse`.
- `themeColors` remains an advanced override and does not decide modes.
- Docs explain the new model and give migration examples.
- `node --test tests/*.test.mjs`, `pnpm run build`, `CI=true pnpm run check`, and `CI=true pnpm run check:visual` pass.

## Self-Review

- Spec coverage: the plan covers public API, runtime resolution, CSS token split, section behavior, CLI, templates, docs, matrix checks, visual verification, and compatibility.
- Placeholder scan: no unresolved placeholders remain in commands or task descriptions.
- Type consistency: mode names are consistent across resolver, public types, runtime attributes, docs, and examples.
