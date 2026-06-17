# Footer Outline Compact Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the footer outline usable for long decks by automatically switching to a compact, section-first view with expandable sections and quick jumps to the current and final section.

**Architecture:** Keep the UI inside `components/FooterTocControl.vue` because the feature is specific to the footer outline panel and its existing hover preview behavior. Add a small pure helper module for compact-mode calculations so threshold, range, and count behavior can be tested without mounting Vue. Preserve the current outline data source, navigation, and preview card contracts.

**Tech Stack:** Vue 3 `<script setup>`, Slidev client navigation, native `node:test`, existing Scholarly theme scripts.

---

## File Structure

- Create: `utils/footerToc.ts`
  - Pure helper functions for counting outline items, deciding compact mode, formatting section ranges, and formatting slide counts.
  - No Vue imports. This keeps behavior testable with `node --test`.
- Create: `tests/footerToc.test.mjs`
  - Regression tests for compact-mode threshold and section metadata formatting.
- Modify: `components/FooterTocControl.vue`
  - Add compact-mode state and section expansion behavior.
  - Add quick action buttons in the panel header.
  - Render section range/count metadata.
  - Preserve hover/focus preview behavior and slide navigation.
- Optional modify: `docs/en/guide/configurations.md`
  - Add one sentence documenting that long footer outlines use compact mode automatically.
- Optional modify: `docs/zh/guide/configurations.md`
  - Add the matching Chinese note.

## Behavior Contract

- Compact mode activates automatically when visible outline items exceed `32`.
- In compact mode:
  - Section rows remain visible.
  - The active section expands automatically.
  - Users can expand or collapse any section.
  - Section rows show a page range and slide count, for example `12-24 · 13 slides`.
  - The panel header includes buttons for the active outline item and the final section.
- In normal mode:
  - Existing section and slide rendering remains effectively unchanged.
  - All section slides remain visible.
- Hover/focus preview still works for section rows and slide rows.
- Clicking a section title still navigates to that section slide.
- Clicking a slide row still navigates to that slide and closes the panel.

## Task 1: Add Pure Footer TOC Helpers

**Files:**
- Create: `utils/footerToc.ts`
- Create: `tests/footerToc.test.mjs`

- [ ] **Step 1: Write the failing tests**

Create `tests/footerToc.test.mjs`:

```js
import assert from 'node:assert/strict'
import test from 'node:test'

const {
  COMPACT_OUTLINE_ITEM_THRESHOLD,
  countOutlineItems,
  formatSectionRange,
  formatSlideCount,
  shouldUseCompactOutline,
} = await import('../utils/footerToc.ts').catch((error) => {
  assert.fail(`Expected ../utils/footerToc.ts to export footer TOC helpers, got ${error.message}`)
})

test('counts each section and visible slide as outline items', () => {
  const groups = [
    { no: 1, title: 'Opening', active: false, slides: [{ no: 2, title: 'Context', active: false }] },
    {
      no: 5,
      title: 'Methods',
      active: true,
      slides: [
        { no: 6, title: 'Dataset', active: false },
        { no: 7, title: 'Model', active: true },
      ],
    },
  ]

  assert.equal(countOutlineItems(groups), 5)
})

test('enables compact mode only after the threshold is exceeded', () => {
  const groupsAtThreshold = [
    {
      no: 1,
      title: 'Long Section',
      active: false,
      slides: Array.from({ length: COMPACT_OUTLINE_ITEM_THRESHOLD - 1 }, (_, index) => ({
        no: index + 2,
        title: `Slide ${index + 2}`,
        active: false,
      })),
    },
  ]

  const groupsOverThreshold = [
    {
      no: 1,
      title: 'Long Section',
      active: false,
      slides: Array.from({ length: COMPACT_OUTLINE_ITEM_THRESHOLD }, (_, index) => ({
        no: index + 2,
        title: `Slide ${index + 2}`,
        active: false,
      })),
    },
  ]

  assert.equal(shouldUseCompactOutline(groupsAtThreshold), false)
  assert.equal(shouldUseCompactOutline(groupsOverThreshold), true)
})

test('formats section ranges from the next section boundary or total slide count', () => {
  const section = { no: 12, title: 'Results', active: false, slides: [] }
  const nextSection = { no: 25, title: 'Discussion', active: false, slides: [] }
  const finalSection = { no: 25, title: 'Discussion', active: false, slides: [] }

  assert.equal(formatSectionRange(section, nextSection, 40), '12-24')
  assert.equal(formatSectionRange(finalSection, undefined, 40), '25-40')
})

test('formats singular and plural slide counts', () => {
  assert.equal(formatSlideCount(1, 'slide', 'slides'), '1 slide')
  assert.equal(formatSlideCount(13, 'slide', 'slides'), '13 slides')
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
node --test tests/footerToc.test.mjs
```

Expected: FAIL because `utils/footerToc.ts` does not exist yet or does not export the helpers.

- [ ] **Step 3: Implement the minimal helper module**

Create `utils/footerToc.ts`:

```ts
export const COMPACT_OUTLINE_ITEM_THRESHOLD = 32

export interface FooterTocSlideItem {
  no: number
  title: string
  active: boolean
}

export interface FooterTocSectionGroup {
  no: number
  title: string
  active: boolean
  slides: FooterTocSlideItem[]
}

export function countOutlineItems(groups: FooterTocSectionGroup[]): number {
  return groups.reduce((total, group) => total + 1 + group.slides.length, 0)
}

export function shouldUseCompactOutline(
  groups: FooterTocSectionGroup[],
  threshold = COMPACT_OUTLINE_ITEM_THRESHOLD,
): boolean {
  return countOutlineItems(groups) > threshold
}

export function formatSectionRange(
  section: FooterTocSectionGroup,
  nextSection: FooterTocSectionGroup | undefined,
  totalSlides: number,
): string {
  const end = Math.max(section.no, (nextSection?.no ?? totalSlides + 1) - 1)
  return section.no === end ? `${section.no}` : `${section.no}-${end}`
}

export function formatSlideCount(count: number, singularLabel: string, pluralLabel: string): string {
  return `${count} ${count === 1 ? singularLabel : pluralLabel}`
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run:

```bash
node --test tests/footerToc.test.mjs
```

Expected: PASS with 4 tests passing.

- [ ] **Step 5: Commit the helper**

```bash
git add utils/footerToc.ts tests/footerToc.test.mjs
git commit -m "feat(outline): add footer toc compact helpers"
```

## Task 2: Add Compact State and Quick Jump Logic

**Files:**
- Modify: `components/FooterTocControl.vue`

- [ ] **Step 1: Extend imports and local interfaces**

In `components/FooterTocControl.vue`, add imports after the existing utility imports:

```ts
import {
  formatSectionRange,
  formatSlideCount,
  shouldUseCompactOutline,
  type FooterTocSectionGroup,
  type FooterTocSlideItem,
} from '../utils/footerToc'
```

Replace the local `TocSlideItem` and `TocSectionGroup` interfaces with aliases:

```ts
type TocSlideItem = FooterTocSlideItem

interface TocSectionGroup extends FooterTocSectionGroup {
  range: string
  slideCountLabel: string
}
```

- [ ] **Step 2: Add labels for quick actions and section controls**

In the Chinese label branch, return these additional keys:

```ts
current: '当前',
last: '末尾',
expandSection: '展开 section',
collapseSection: '折叠 section',
slideSingular: '页',
slidePlural: '页',
```

In the English label branch, return these additional keys:

```ts
current: 'Current',
last: 'Last',
expandSection: 'Expand section',
collapseSection: 'Collapse section',
slideSingular: 'slide',
slidePlural: 'slides',
```

- [ ] **Step 3: Add compact and expansion state**

Add these refs and computed values near the existing `previewAnchorEl` state:

```ts
const expandedSectionNos = ref<Set<number>>(new Set())
const lastCompactMode = ref(false)
```

Add these computed values after `sectionGroups`:

```ts
const compactOutline = computed(() => shouldUseCompactOutline(sectionGroups.value))

const activeSectionNo = computed(() => {
  return sectionGroups.value.find(section => section.active)?.no ?? null
})

const lastSectionNo = computed(() => {
  return sectionGroups.value.at(-1)?.no ?? null
})
```

- [ ] **Step 4: Add section expansion helpers**

Add these functions after `sectionGroups` and before `previewableSlideNos`:

```ts
const isSectionExpanded = (section: TocSectionGroup) => {
  return !compactOutline.value || expandedSectionNos.value.has(section.no)
}

const setSectionExpanded = (sectionNo: number, expanded: boolean) => {
  const next = new Set(expandedSectionNos.value)
  if (expanded)
    next.add(sectionNo)
  else
    next.delete(sectionNo)
  expandedSectionNos.value = next
}

const toggleSectionExpanded = (sectionNo: number) => {
  setSectionExpanded(sectionNo, !expandedSectionNos.value.has(sectionNo))
}

const ensureSectionExpanded = (sectionNo: number | null) => {
  if (!sectionNo)
    return
  setSectionExpanded(sectionNo, true)
}
```

- [ ] **Step 5: Update section metadata inside `sectionGroups`**

After the loop that sets `group.active`, add a second loop to populate display metadata:

```ts
for (let i = 0; i < groups.length; i++) {
  const group = groups[i]
  const nextGroup = groups[i + 1]
  group.range = formatSectionRange(group, nextGroup, allSlides.value.length)
  group.slideCountLabel = formatSlideCount(
    group.slides.length,
    labels.value.slideSingular,
    labels.value.slidePlural,
  )
}
```

- [ ] **Step 6: Add watchers for automatic active-section expansion**

Add this watcher after `compactOutline`, `activeSectionNo`, and `lastSectionNo` are defined:

```ts
watch(
  [compactOutline, activeSectionNo],
  ([compact, activeNo]) => {
    if (!compact) {
      expandedSectionNos.value = new Set()
      lastCompactMode.value = false
      return
    }

    if (!lastCompactMode.value) {
      expandedSectionNos.value = new Set(activeNo ? [activeNo] : [])
      lastCompactMode.value = true
      return
    }

    ensureSectionExpanded(activeNo)
  },
  { immediate: true },
)
```

- [ ] **Step 7: Add quick scroll helpers**

Replace `scrollToActiveItem` with a reusable function plus an active wrapper:

```ts
const scrollToPreviewNo = async (slideNo: number | null, block: ScrollLogicalPosition = 'center') => {
  await nextTick()
  if (!slideNo || !panelRef.value)
    return

  const body = panelRef.value.querySelector('.footer-toc-panel-body')
  if (!body)
    return

  const target = body.querySelector<HTMLElement>(`[data-preview-no="${slideNo}"]`)
  if (target) {
    target.scrollIntoView({ block, behavior: 'smooth' })
    await syncPreviewToTargetNo(slideNo)
  }
}

const scrollToActiveItem = async () => {
  ensureSectionExpanded(activeSectionNo.value)
  await scrollToPreviewNo(currentPage.value, 'center')
}
```

Add quick action handlers near `togglePanel`:

```ts
const jumpToCurrentOutlineItem = async () => {
  ensureSectionExpanded(activeSectionNo.value)
  await scrollToPreviewNo(currentPage.value, 'center')
}

const jumpToLastSection = async () => {
  ensureSectionExpanded(lastSectionNo.value)
  await scrollToPreviewNo(lastSectionNo.value, 'end')
}
```

- [ ] **Step 8: Run the existing helper tests**

Run:

```bash
node --test tests/footerToc.test.mjs
```

Expected: PASS. This task mostly changes Vue state wiring, but the helper behavior should remain stable.

- [ ] **Step 9: Commit compact state logic**

```bash
git add components/FooterTocControl.vue
git commit -m "feat(outline): add compact outline state"
```

## Task 3: Update Footer Outline Markup and Styles

**Files:**
- Modify: `components/FooterTocControl.vue`

- [ ] **Step 1: Update the panel header template**

Replace the close-only button area in the panel header with actions plus close:

```vue
<div class="footer-toc-panel-actions">
  <button
    type="button"
    class="footer-toc-panel-action"
    :title="labels.current"
    :aria-label="labels.current"
    @click="jumpToCurrentOutlineItem"
  >
    <span class="footer-toc-panel-action-dot" aria-hidden="true" />
    <span class="footer-toc-panel-action-label">{{ labels.current }}</span>
  </button>
  <button
    type="button"
    class="footer-toc-panel-action"
    :title="labels.last"
    :aria-label="labels.last"
    @click="jumpToLastSection"
  >
    <svg class="footer-toc-panel-action-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3V12" />
      <path d="M4.5 8.5L8 12L11.5 8.5" />
      <path d="M4 13H12" />
    </svg>
    <span class="footer-toc-panel-action-label">{{ labels.last }}</span>
  </button>
  <button
    type="button"
    class="footer-toc-panel-close"
    :aria-label="labels.close"
    @click="closePanel"
  >
    <svg
      class="footer-toc-panel-close-icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M5 5L11 11" />
      <path d="M11 5L5 11" />
    </svg>
  </button>
</div>
```

- [ ] **Step 2: Update section row markup**

Replace the section header `<button class="footer-toc-section-header">...</button>` with:

```vue
<div
  class="footer-toc-section-header"
  :class="{ 'is-collapsed': compactOutline && !isSectionExpanded(section) }"
>
  <button
    type="button"
    class="footer-toc-section-jump"
    :data-preview-no="section.no"
    @mouseenter="setPreviewTarget(section.no, $event)"
    @focus="setPreviewTarget(section.no, $event)"
    @click="navigateToSlide(section.no)"
  >
    <span class="footer-toc-section-index">{{ section.no }}</span>
    <span class="footer-toc-section-copy">
      <span class="footer-toc-section-title">{{ section.title }}</span>
      <span class="footer-toc-section-meta">
        {{ section.range }} · {{ section.slideCountLabel }}
      </span>
    </span>
  </button>
  <button
    v-if="compactOutline"
    type="button"
    class="footer-toc-section-toggle"
    :aria-expanded="isSectionExpanded(section) ? 'true' : 'false'"
    :aria-label="isSectionExpanded(section) ? labels.collapseSection : labels.expandSection"
    @click="toggleSectionExpanded(section.no)"
  >
    <svg class="footer-toc-section-toggle-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.5 6.5L8 9L10.5 6.5" />
    </svg>
  </button>
</div>
```

- [ ] **Step 3: Gate slide list rendering by expansion state**

Change the slide container condition from:

```vue
v-if="section.slides.length > 0"
```

to:

```vue
v-if="section.slides.length > 0 && isSectionExpanded(section)"
```

- [ ] **Step 4: Add panel action styles**

Add these styles after `.footer-toc-panel-heading`:

```css
.footer-toc-panel-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.24rem;
  flex-shrink: 0;
}

.footer-toc-panel-action {
  height: 1.24rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0 0.34rem;
  border: 1px solid rgba(30, 58, 95, 0.1);
  border-radius: 999px;
  background: rgba(30, 58, 95, 0.06);
  color: var(--slidev-theme-primary, #1e3a5f);
  font-family: var(--scholarly-font-sans);
  font-size: 0.52rem;
  font-weight: 650;
  line-height: 1;
  transition: background-color 140ms ease, border-color 140ms ease, transform 140ms ease;
}

.footer-toc-panel-action-dot {
  width: 0.36rem;
  height: 0.36rem;
  border-radius: 999px;
  background: currentColor;
}

.footer-toc-panel-action-icon {
  width: 0.58rem;
  height: 0.58rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

- [ ] **Step 5: Replace section header styles**

Replace `.footer-toc-section-header` and related hover rules with:

```css
.footer-toc-section-header {
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 0.2rem;
  border-radius: 0.52rem;
  background: transparent;
}

.footer-toc-section.is-active .footer-toc-section-header {
  background: rgba(30, 58, 95, 0.07);
}

.footer-toc-section-jump {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.36rem;
  padding: 0.28rem 0.3rem;
  border: 0;
  border-radius: 0.52rem;
  background: transparent;
  color: inherit;
  text-align: left;
}

.footer-toc-section-copy {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 0.08rem;
}

.footer-toc-section-meta {
  font-size: 0.52rem;
  line-height: 1.12;
  color: rgba(45, 55, 72, 0.64);
}

.footer-toc-section-toggle {
  width: 1.32rem;
  min-height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.52rem;
  background: transparent;
  color: rgba(30, 58, 95, 0.76);
}

.footer-toc-section-toggle-icon {
  width: 0.68rem;
  height: 0.68rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 140ms ease;
}

.footer-toc-section-toggle[aria-expanded='true'] .footer-toc-section-toggle-icon {
  transform: rotate(180deg);
}
```

- [ ] **Step 6: Update hover/focus selector**

Replace the existing combined selector:

```css
.footer-toc-slide:hover,
.footer-toc-slide:focus-visible,
.footer-toc-section-header:hover,
.footer-toc-section-header:focus-visible,
.footer-toc-panel-close:hover,
.footer-toc-panel-close:focus-visible {
  outline: none;
  background: rgba(30, 58, 95, 0.12);
}
```

with:

```css
.footer-toc-slide:hover,
.footer-toc-slide:focus-visible,
.footer-toc-section-jump:hover,
.footer-toc-section-jump:focus-visible,
.footer-toc-section-toggle:hover,
.footer-toc-section-toggle:focus-visible,
.footer-toc-panel-action:hover,
.footer-toc-panel-action:focus-visible,
.footer-toc-panel-close:hover,
.footer-toc-panel-close:focus-visible {
  outline: none;
  background: rgba(30, 58, 95, 0.12);
}
```

Extend the transform hover rule:

```css
.footer-toc-panel-action:hover,
.footer-toc-panel-action:focus-visible,
.footer-toc-panel-close:hover,
.footer-toc-panel-close:focus-visible {
  border-color: rgba(30, 58, 95, 0.18);
  transform: translateY(-0.5px);
}
```

- [ ] **Step 7: Run component and build checks**

Run:

```bash
node scripts/check-academic-components.mjs
node scripts/check-academic-layout-pack.mjs
node scripts/slidev.mjs build
```

Expected:
- `Academic component checks passed.`
- `Academic layout pack checks passed.`
- Slidev build exits 0.

- [ ] **Step 8: Commit markup and styles**

```bash
git add components/FooterTocControl.vue
git commit -m "feat(outline): add compact footer outline controls"
```

## Task 4: Add Visual Regression Scenario

**Files:**
- Create: `examples/example-long-outline.md`
- Optional modify: `scripts/export-layout-screenshots.mjs` only if the existing screenshot script has an explicit layout whitelist that needs the new example.

- [ ] **Step 1: Create a long outline example deck**

Create `examples/example-long-outline.md`:

```md
---
themeConfig:
  outlineToc: true
  outlineTocOpen: true
---

# Long Outline Stress Test

---
layout: section
---

# Foundations

---

# Motivation

The outline should remain navigable when many slides are present.

---

# Definitions

This slide gives the first section more than one child.

---
layout: section
---

# Methods

---

# Data

Method slide 1.

---

# Model

Method slide 2.

---

# Training

Method slide 3.

---

# Evaluation

Method slide 4.

---
layout: section
---

# Results

---

# Main Result

Result slide 1.

---

# Ablation

Result slide 2.

---

# Error Analysis

Result slide 3.

---

# Robustness

Result slide 4.

---

# Transfer

Result slide 5.

---
layout: section
---

# Discussion

---

# Limitations

Discussion slide 1.

---

# Future Work

Discussion slide 2.

---

# Takeaways

Discussion slide 3.

---
layout: section
---

# Appendix

---

# Extra A

Appendix slide 1.

---

# Extra B

Appendix slide 2.

---

# Extra C

Appendix slide 3.

---

# Extra D

Appendix slide 4.

---

# Extra E

Appendix slide 5.

---

# Extra F

Appendix slide 6.

---

# Extra G

Appendix slide 7.

---

# Extra H

Appendix slide 8.

---

# Extra I

Appendix slide 9.

---

# Extra J

Appendix slide 10.

---

# Extra K

Appendix slide 11.

---

# Extra L

Appendix slide 12.
```

- [ ] **Step 2: Run the long outline deck in dev mode**

Run:

```bash
node scripts/slidev.mjs dev examples/example-long-outline.md --host 127.0.0.1 --port 3030
```

Expected: Slidev dev server starts and serves the long outline example.

- [ ] **Step 3: Verify behavior in the browser**

Open `http://127.0.0.1:3030`.

Check:
- Footer outline opens by default because `outlineTocOpen: true`.
- The panel shows section rows rather than every slide row expanded.
- The active section is expanded.
- The final `Appendix` section is reachable via the `Last` button.
- Expanding `Appendix` reveals its child slide rows.
- Hovering a section or slide row still shows the preview card on desktop.
- Clicking a slide row navigates and closes the panel.

- [ ] **Step 4: Stop the dev server**

Stop the process with `Ctrl-C`.

- [ ] **Step 5: Commit the visual scenario**

```bash
git add examples/example-long-outline.md
git commit -m "test(outline): add long outline example"
```

## Task 5: Document Compact Outline Behavior

**Files:**
- Modify: `docs/en/guide/configurations.md`
- Modify: `docs/zh/guide/configurations.md`

- [ ] **Step 1: Update English docs**

In `docs/en/guide/configurations.md`, in the outline TOC notes near the `outlineToc` configuration table, add:

```md
- For long decks, the footer TOC automatically switches to a compact section-first view with expandable sections and quick jumps to the current and final section.
```

- [ ] **Step 2: Update Chinese docs**

In `docs/zh/guide/configurations.md`, in the matching outline TOC notes, add:

```md
- 当页数较多时，页脚 TOC 会自动切换为紧凑的 section 优先视图，支持展开 section，并可快速跳到当前 section 或最后一个 section。
```

- [ ] **Step 3: Run docs workflow check**

Run:

```bash
node scripts/check-docs-workflows.mjs
```

Expected: docs workflow checks exit 0.

- [ ] **Step 4: Commit docs**

```bash
git add docs/en/guide/configurations.md docs/zh/guide/configurations.md
git commit -m "docs(outline): document compact footer toc"
```

## Task 6: Final Verification

**Files:**
- Read-only verification across changed files.

- [ ] **Step 1: Run all focused tests**

Run:

```bash
node --test tests/outlineTitle.test.mjs tests/footerToc.test.mjs
```

Expected: all tests pass.

- [ ] **Step 2: Run focused repository checks**

Run:

```bash
node scripts/check-academic-components.mjs
node scripts/check-academic-layout-pack.mjs
node scripts/check-docs-workflows.mjs
node scripts/slidev.mjs build
```

Expected:
- component checks pass.
- layout checks pass.
- docs workflow checks pass.
- Slidev build exits 0.

- [ ] **Step 3: Inspect final diff**

Run:

```bash
git status --short
git diff --stat
```

Expected:
- Only files from this plan are changed.
- No generated `dist/`, `.pnpm-store/`, or screenshot output is staged.

- [ ] **Step 4: Final commit if tasks were not committed individually**

If previous tasks were not committed individually, commit all feature changes together:

```bash
git add utils/footerToc.ts tests/footerToc.test.mjs components/FooterTocControl.vue examples/example-long-outline.md docs/en/guide/configurations.md docs/zh/guide/configurations.md
git commit -m "feat(outline): improve long deck footer navigation"
```

## Self-Review

- Spec coverage: The plan covers compact activation, default active-section expansion, manual expand/collapse, current/final quick actions, section range/count metadata, hover preview preservation, navigation preservation, docs, and verification.
- Placeholder scan: No `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: `FooterTocSectionGroup` and `FooterTocSlideItem` are defined in Task 1 and reused consistently in `FooterTocControl.vue`.
- Scope check: The plan only changes the footer outline overview and documentation. Search/filter and multi-column layout remain out of scope for a later phase.
