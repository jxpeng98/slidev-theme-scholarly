# Academic Theme Roadmap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `slidev-theme-scholarly` from a polished academic Slidev theme into a reliable academic presentation toolkit with stable theme semantics, stronger visual QA, richer academic layouts/components, smoother authoring workflows, and clearer docs.

**Architecture:** Keep the theme package as the source of truth for runtime UI (`components/`, `layouts/`, `styles/`, `setup/`, `utils/`), keep shared metadata in `shared/`, mirror authoring affordances into `cli/` and `vscode-extension/`, and document every stable feature in `docs/` plus screenshots generated from examples.

**Tech Stack:** Slidev 52.x, Vue 3 single-file components, CSS custom properties, Vite/VitePress, Node ESM scripts, Playwright/Slidev export for screenshot QA, VS Code extension TypeScript.

---

## Priority Order

1. **P0: Reliability foundation** - freeze theme tokens, add visual regression coverage, define public configuration contracts, and make releases safer.
2. **P1: Academic authoring surface** - add high-value layouts and components used in paper talks, seminars, defenses, and reading groups.
3. **P2: Workflow integration** - make CLI, VS Code extension, templates, docs, and generated screenshots consume the same metadata.
4. **P3: Advanced academic automation** - add data-driven patterns, citation-aware workflows, and optional addon-style integrations after the core API is stable.

---

## Current State

- Runtime theme code lives in `components/`, `layouts/`, `styles/`, `setup/`, and `utils/`.
- Public metadata already exists in `shared/themes.json` and `shared/layouts.json`.
- CLI entrypoint is `cli/scholarly.mjs`.
- VS Code extension entrypoint and providers live in `vscode-extension/src/`.
- Docs are VitePress pages under `docs/en/` and `docs/zh/`.
- Screenshot scripts already exist under `scripts/`.
- The latest color-mode fix added `scripts/check-color-mode-styles.mjs` and normalized quote/code/highlight/table colors around content tokens.
- P0 implementation commit `44fd945` added semantic component tokens, the release gate, theme matrix dry-run coverage, public theme config types, and updated documentation.
- Follow-up P0 visual verification repaired the local Playwright headless shell cache, completed the full theme matrix PNG export, and added footer-specific contrast tokens.
- P1.1 academic layout work is complete with all eight planned layouts: `paper-summary`, `related-work-matrix`, `method-pipeline`, `result-highlight`, `experiment-grid`, `limitation`, `defense-question`, and `appendix-index`.

## Status Snapshot: 2026-06-13

| Area | Status | Evidence |
|------|--------|----------|
| P0.1 Theme token contract | Complete | `pnpm run check` passes `scripts/check-color-mode-styles.mjs` |
| P0.2 Theme matrix visual script | Complete | `node scripts/check-theme-matrix.mjs --dry-run` covers all theme/mode combinations |
| P0.2 Full PNG visual export | Complete | `pnpm run check:visual` passes; 72 PNGs exported under `/private/tmp/scholarly-theme-matrix` |
| P0.3 Public theme config types | Complete | `index.d.ts` added; docs explain `colorSchema` vs `themeConfig.colorMode` |
| P0.4 Release gate | Complete | `pnpm run check` runs token checks, docs build, CLI doctor, VS Code compile, and matrix dry-run |
| P1.1 Academic layout pack | Complete | Eight layouts added; `pnpm run check` and `pnpm run export:layout-screenshots` pass with 34 layout PNGs |
| P1.2 Evidence components batch 1 | Complete | `MetricCard`, `MetricGrid`, `EvidenceBlock`, and `EquationBlock` added; `pnpm run check` and `pnpm run export:component-screenshots` pass with 13 component PNGs |

Current decision: P0, P1.1, and the first P1.2 evidence component batch are complete. Continue P1.2 with dataset/paper/contribution/caveat components unless component API feedback requires a follow-up.

---

## P0: Reliability Foundation

### Task 0.1: Expand the Theme Token Contract

**Goal:** Make color, chrome, content, academic accent, and interaction states explicit so light/dark mode and theme presets cannot drift.

**Files:**

- `styles/themes/mode.css`
- `styles/themes/colors.css`
- `styles/themes/section-mode.css`
- `styles/layout.css`
- `components/*.vue`
- `scripts/check-color-mode-styles.mjs`
- `docs/en/guide/themes.md`
- `docs/zh/guide/themes.md`

**Steps:**

- [x] Add comments in `styles/themes/mode.css` that group tokens into:
  - `chrome-*` for Slidev frame/navigation UI.
  - `content-*` for readable slide body surfaces.
  - `accent-*` for theme identity.
  - `semantic-*` for quote/code/table/highlight/theorem/block states.
- [x] Extend `scripts/check-color-mode-styles.mjs` to fail when:
  - `:root.dark` or `html.dark` appears in theme runtime CSS.
  - content selectors use raw dark backgrounds instead of semantic tokens.
  - a content token exists in light mode but has no dark-mode override.
  - `components/Highlight.vue` uses hard-coded foreground/background colors for variants.
- [x] Move remaining repeated raw colors in `styles/layout.css` and academic components into tokens when they affect readability.
- [x] Add a token reference table to both English and Chinese theme docs.
- [x] Run:

```bash
node scripts/check-color-mode-styles.mjs
git diff --check -- styles components scripts docs
```

**Acceptance Criteria:**

- No runtime CSS depends on `.dark` class selectors for Slidev color mode.
- Quote, code, inline code, table, highlight, footnote, theorem, and block colors are token-driven.
- New theme presets can be checked mechanically before screenshots.

**Suggested Commit:**

```text
test: expand scholarly theme token checks
```

### Task 0.2: Add a Theme Matrix Visual Regression Script

**Goal:** Generate screenshots for important content states across color modes and theme presets before release.

**Files:**

- `scripts/check-theme-matrix.mjs`
- `scripts/README.md`
- `examples/example-all-themes.md`
- `examples/example-themes.md`
- `package.json`

**Steps:**

- [x] Add `scripts/check-theme-matrix.mjs` that:
  - Reads `shared/themes.json`.
  - Builds a temporary deck in `/private/tmp/scholarly-theme-matrix`.
  - Includes slides for blockquote, inline code, code block, tables, `Highlight`, `Block`, `Theorem`, references, footnotes, and section pages.
  - Runs Slidev export for each color theme in both `light` and `dark` mode.
  - Writes output to `/private/tmp/scholarly-theme-matrix/<theme>/<mode>/`.
- [x] Add `theme:matrix` to `package.json`:

```json
"theme:matrix": "node scripts/check-theme-matrix.mjs"
```

- [x] Document required local dependency setup:

```bash
pnpm exec playwright install chromium
```

- [x] Run the full PNG matrix after the local Playwright headless shell install is repaired:

```bash
node scripts/check-color-mode-styles.mjs
pnpm run theme:matrix
```

Current verification:

```bash
pnpm run check
pnpm run check:visual
```

Result: passes with matrix dry-run and full PNG export. The matrix currently exports 72 PNGs for 9 theme presets across light/dark mode.

**Acceptance Criteria:**

- Every color theme can be rendered in both light and dark mode.
- The generated matrix includes at least one slide that catches dark highlight backgrounds on light text and the reverse.
- Output paths are stable so screenshots can be attached to issues or PRs.

**Suggested Commit:**

```text
test: add scholarly theme matrix screenshots
```

### Task 0.3: Define Public Theme Configuration Types

**Goal:** Make `themeConfig` easier to use and harder to misuse.

**Files:**

- `setup/main.ts`
- `shared/themes.json`
- `shared/layouts.json`
- `index.d.ts` or new `types/theme-config.d.ts`
- `docs/en/guide/configurations.md`
- `docs/zh/guide/configurations.md`

**Steps:**

- [x] Audit current `themeConfig` keys used in layouts/components.
- [x] Define public `ScholarlyThemeConfig` and `ScholarlySlideConfig` types with:
  - `colorTheme`
  - `fontTheme`
  - `colorMode`
  - `sectionMode`
  - `author`
  - `conference`
  - footer/header/navigation options already supported by the theme.
- [x] Export types from the package entry used by consumers.
- [x] Add docs that distinguish Slidev `colorSchema` from Scholarly `themeConfig.colorMode`.
- [x] Add examples for:
  - light slides with dark section separators.
  - dark deck with light academic content slides.
  - high-contrast preset.
- [x] Run:

```bash
pnpm run docs:build
node scripts/check-color-mode-styles.mjs
```

**Acceptance Criteria:**

- Users can discover the supported config shape without reading component internals.
- Docs explain the difference between Slidev light/dark mode and theme preset colors.
- Invalid or legacy config names are documented or aliased deliberately.

**Suggested Commit:**

```text
docs: document scholarly theme configuration
```

### Task 0.4: Establish a Release Gate

**Goal:** Make every release run the same checks and avoid stale screenshots/docs.

**Files:**

- `scripts/check-exports.sh`
- `scripts/release-ready.mjs`
- `package.json`
- `VERSIONING.md`
- `CHANGELOG.md`

**Steps:**

- [x] Add `scripts/release-ready.mjs` that runs:
  - token checks.
  - docs build.
  - CLI doctor.
  - VS Code extension compile.
  - optional screenshot matrix when `SCHOLARLY_FULL_VISUAL=1`.
- [x] Add package scripts:

```json
"check": "node scripts/check-color-mode-styles.mjs && pnpm run docs:build && pnpm run vscode:compile",
"check:visual": "SCHOLARLY_FULL_VISUAL=1 node scripts/release-ready.mjs"
```

- [x] Update `VERSIONING.md` with the release checklist.
- [x] Run:

```bash
pnpm run check
```

**Acceptance Criteria:**

- A maintainer has one command for normal release readiness.
- Full screenshot export remains opt-in because it is slower and depends on Playwright browser availability.

**Suggested Commit:**

```text
build: add scholarly release readiness checks
```

---

## P1: Academic Authoring Surface

### Task 1.1: Add High-Value Academic Layouts

**Goal:** Cover common academic presentation structures without forcing users to manually compose every slide.

**New Layouts:**

- `paper-summary`
- `related-work-matrix`
- `method-pipeline`
- `experiment-grid`
- `result-highlight`
- `limitation`
- `defense-question`
- `appendix-index`

**Files:**

- `layouts/paper-summary.vue`
- `layouts/related-work-matrix.vue`
- `layouts/method-pipeline.vue`
- `layouts/experiment-grid.vue`
- `layouts/result-highlight.vue`
- `layouts/limitation.vue`
- `layouts/defense-question.vue`
- `layouts/appendix-index.vue`
- `shared/layouts.json`
- `vscode-extension/shared/layouts.json`
- `vscode-extension/snippets/layouts.json`
- `vscode-extension/snippets/layouts.vscode.json`
- `docs/en/layouts/academic.md`
- `docs/zh/layouts/academic.md`

**Steps:**

- [x] Add first-batch layouts with token-based surfaces and no hard-coded light/dark colors:
  - `paper-summary`
  - `related-work-matrix`
  - `method-pipeline`
  - `result-highlight`
- [x] Add remaining planned layouts:
  - `experiment-grid`
  - `limitation`
  - `defense-question`
  - `appendix-index`
- [x] Keep layouts usable with plain Markdown slots first; add props only when they remove repeated markup.
- [x] Update `shared/layouts.json` as the source metadata.
- [x] Run existing sync scripts:

```bash
node vscode-extension/scripts/sync-shared-data.mjs
node vscode-extension/scripts/sync-snippets.mjs
```

- [x] Add example slides to `examples/example-academic.md`.
- [x] Export layout screenshots:

```bash
pnpm run export:layout-screenshots
```

- [x] Run:

```bash
node scripts/check-color-mode-styles.mjs
pnpm run docs:build
pnpm run vscode:compile
pnpm run check
```

**Acceptance Criteria:**

- Layouts work in both light and dark modes.
- VS Code snippets and docs are generated from updated shared metadata.
- Academic examples show real use, not only placeholder boxes.

**Suggested Commit:**

```text
feat(layouts): add academic presentation patterns
```

### Task 1.2: Add Academic Components for Evidence Slides

**Goal:** Provide reusable, readable components for claims, metrics, equations, datasets, and citations.

**New Components:**

- `MetricCard.vue`
- `MetricGrid.vue`
- `EvidenceBlock.vue`
- `EquationBlock.vue`
- `DatasetCard.vue`
- `PaperCard.vue`
- `ContributionList.vue`
- `CaveatList.vue`

**Files:**

- `components/*.vue`
- `utils/useFontSizeStyles.ts`
- `utils/theorem.ts` if shared heading logic is useful.
- `shared/layouts.json`
- `vscode-extension/snippets/components.json`
- `vscode-extension/snippets/components.vscode.json`
- `docs/en/components/*.md`
- `docs/zh/components/*.md`
- `examples/example-academic.md`

**Steps:**

- [x] Implement batch 1 components with semantic tokens from P0:
  - `MetricCard.vue`
  - `MetricGrid.vue`
  - `EvidenceBlock.vue`
  - `EquationBlock.vue`
- [x] Prefer slots for body content and typed props for labels, values, variants, and references in batch 1.
- [x] Add component snippets with realistic academic examples for batch 1.
- [x] Add docs pages and update the component index with examples for batch 1.
- [x] Export component screenshots for batch 1:

```bash
pnpm run export:component-screenshots
```

- [x] Run:

```bash
node scripts/check-color-mode-styles.mjs
pnpm run docs:build
pnpm run vscode:compile
```

Current batch verification:

```bash
pnpm run check:components
pnpm run export:component-screenshots
pnpm run check
```

Next batch:

- [ ] Implement `DatasetCard.vue`.
- [ ] Implement `PaperCard.vue`.
- [ ] Implement `ContributionList.vue`.
- [ ] Implement `CaveatList.vue`.
- [ ] Extend `scripts/check-academic-components.mjs` when each component graduates to stable docs/snippets/screenshots.

**Acceptance Criteria:**

- Components improve dense academic slides without decorative card-heavy layouts.
- Components remain readable under all existing color themes.
- Snippets, docs, and screenshots stay in sync.

**Suggested Commit:**

```text
feat(components): add academic evidence components
```

### Task 1.3: Improve Citation and Reference Ergonomics

**Goal:** Make citation-heavy decks easier to build and preview.

**Files:**

- `components/Cite.vue`
- `layouts/references.vue`
- `setup/transformers.ts`
- `vscode-extension/src/bibtex.ts`
- `vscode-extension/src/providers.ts`
- `docs/en/components/cite.md`
- `docs/zh/components/cite.md`

**Steps:**

- [ ] Add examples for inline citation, grouped citation, footnote-like citation, and references slide.
- [ ] Verify the current citation plugin behavior for missing keys and duplicate keys.
- [ ] Add a CLI doctor check for missing `bibFile`, missing `.bib`, and unresolved citation keys.
- [ ] Add VS Code diagnostics or quick actions only after CLI doctor behavior is stable.
- [ ] Run:

```bash
node cli/scholarly.mjs doctor
pnpm run docs:build
pnpm run vscode:compile
```

**Acceptance Criteria:**

- Missing citation setup fails clearly in CLI doctor.
- VS Code helpers rely on the same parsing rules as the CLI.
- Docs cover the common failure modes.

**Suggested Commit:**

```text
feat(citations): improve scholarly citation workflow
```

---

## P2: Workflow Integration

### Task 2.1: Add Curated Deck Templates

**Goal:** Let users start from real academic workflows instead of one generic deck.

**Templates:**

- `paper-talk`
- `seminar`
- `thesis-defense`
- `reading-group`
- `conference-lightning`

**Files:**

- `cli/templates/*`
- `cli/scholarly.mjs`
- `shared/layouts.json`
- `docs/en/guide/quick-start.md`
- `docs/zh/guide/quick-start.md`

**Steps:**

- [ ] Add template folders with `package.json`, `README.md`, `slides.md`, optional `references.bib`, and `_gitignore`.
- [ ] Add template metadata to `TEMPLATE_META`.
- [ ] Add aliases only when they are unambiguous.
- [ ] Test each template:

```bash
node cli/scholarly.mjs init /private/tmp/scholarly-paper-talk --template paper-talk --force
node cli/scholarly.mjs init /private/tmp/scholarly-defense --template thesis-defense --force
```

- [ ] Run:

```bash
node cli/scholarly.mjs template list --json
pnpm run docs:build
```

**Acceptance Criteria:**

- Every template can initialize in `/private/tmp`.
- Templates use stable layouts/components from P1.
- Templates include minimal but realistic academic content.

**Suggested Commit:**

```text
feat(cli): add curated academic deck templates
```

### Task 2.2: Make CLI Doctor Actionable

**Goal:** Convert common project problems into concrete diagnostics.

**Files:**

- `cli/scholarly.mjs`
- `scripts/README.md`
- `docs/en/guide/quick-start.md`
- `docs/zh/guide/quick-start.md`

**Checks to Add:**

- Node version below package `engines.node`.
- Missing `slides.md`.
- Missing `references.bib` when citations are present.
- Missing theme package dependency in generated projects.
- Unknown `themeConfig.colorTheme`, `fontTheme`, `colorMode`, or `sectionMode`.
- Missing Playwright browser when export workflows are requested.

**Steps:**

- [ ] Factor doctor checks into small pure functions inside `cli/scholarly.mjs` or `cli/doctor.mjs`.
- [ ] Return consistent severity: `ok`, `warn`, `error`.
- [ ] Add `--json` output for automated tooling.
- [ ] Add docs with example failure output.
- [ ] Run:

```bash
node cli/scholarly.mjs doctor
node cli/scholarly.mjs doctor --json
```

**Acceptance Criteria:**

- Users can fix common setup issues without reading source code.
- VS Code extension can call the same CLI command later.

**Suggested Commit:**

```text
feat(cli): make scholarly doctor actionable
```

### Task 2.3: Synchronize VS Code Extension Metadata and Previews

**Goal:** Keep extension commands, snippets, previews, and shared metadata aligned.

**Files:**

- `vscode-extension/src/providers.ts`
- `vscode-extension/src/snippetCompletion.ts`
- `vscode-extension/src/commands.ts`
- `vscode-extension/shared/themes.json`
- `vscode-extension/shared/layouts.json`
- `vscode-extension/scripts/sync-shared-data.mjs`
- `vscode-extension/scripts/sync-previews.mjs`
- `vscode-extension/media/previews/**`

**Steps:**

- [ ] Ensure extension views read generated `vscode-extension/shared/*.json` rather than duplicating labels.
- [ ] Add preview freshness checks comparing source image mtimes or hashes.
- [ ] Add commands for new templates and P1 components.
- [ ] Run:

```bash
node vscode-extension/scripts/sync-shared-data.mjs
node vscode-extension/scripts/sync-snippets.mjs
node vscode-extension/scripts/sync-previews.mjs
pnpm run vscode:compile
```

**Acceptance Criteria:**

- Adding a layout/component/theme in shared metadata updates the extension with minimal manual edits.
- Extension previews do not silently drift from generated screenshots.

**Suggested Commit:**

```text
feat(vscode): sync scholarly metadata and previews
```

### Task 2.4: Improve Documentation Information Architecture

**Goal:** Make docs answer "what should I use for this academic talk?" instead of listing features only.

**Files:**

- `docs/en/index.md`
- `docs/zh/index.md`
- `docs/en/guide/*.md`
- `docs/zh/guide/*.md`
- `docs/en/layouts/*.md`
- `docs/zh/layouts/*.md`
- `docs/en/components/*.md`
- `docs/zh/components/*.md`

**Steps:**

- [ ] Add workflow pages:
  - paper talk.
  - thesis defense.
  - literature review.
  - results-heavy presentation.
  - course lecture.
- [ ] Link each workflow to recommended layouts, components, snippets, and templates.
- [ ] Add "theme mode and contrast" guidance based on the P0 token model.
- [ ] Run:

```bash
pnpm run docs:build
```

**Acceptance Criteria:**

- New users can choose a starting workflow in under two clicks.
- Existing component/layout docs remain available as reference pages.

**Suggested Commit:**

```text
docs: add academic workflow guides
```

---

## P3: Advanced Academic Automation

### Task 3.1: Add Data-Driven Slide Patterns

**Goal:** Support repeatable result slides from structured data without turning the theme into a full charting framework.

**Files:**

- `components/MetricGrid.vue`
- `components/ResultTable.vue`
- `utils/data.ts`
- `docs/en/guide/features.md`
- `docs/zh/guide/features.md`
- `examples/example-academic.md`

**Steps:**

- [ ] Add lightweight CSV/JSON loading helpers only if Slidev/Vite patterns support them cleanly.
- [ ] Support a narrow use case first: metrics and result tables.
- [ ] Avoid bundling a charting dependency until there is a proven component API.
- [ ] Add docs for static Markdown fallback.
- [ ] Run:

```bash
pnpm run build
pnpm run docs:build
```

**Acceptance Criteria:**

- Users can keep results in a small data file and render them consistently.
- The feature remains optional and does not slow normal decks.

**Suggested Commit:**

```text
feat(data): add lightweight academic result helpers
```

### Task 3.2: Add Paper Metadata and BibTeX Utilities

**Goal:** Make reading-group and paper-talk decks easier to scaffold from bibliographic metadata.

**Files:**

- `cli/scholarly.mjs`
- `cli/bibtex.mjs`
- `components/PaperCard.vue`
- `vscode-extension/src/bibtex.ts`
- `docs/en/guide/features.md`
- `docs/zh/guide/features.md`

**Steps:**

- [ ] Add a parser utility that extracts title, authors, year, venue, DOI, and URL from BibTeX entries.
- [ ] Add CLI command:

```bash
node cli/scholarly.mjs paper summary --bib references.bib --key sample2026
```

- [ ] Output Markdown suitable for `PaperCard` and `paper-summary`.
- [ ] Add VS Code command only after CLI output is stable.
- [ ] Run:

```bash
node cli/scholarly.mjs paper summary --bib references.bib --key sample2026
pnpm run vscode:compile
```

**Acceptance Criteria:**

- CLI can generate a paper-summary block from a BibTeX key.
- Missing fields produce warnings, not broken slides.

**Suggested Commit:**

```text
feat(cli): scaffold paper summaries from bibtex
```

### Task 3.3: Evaluate Addon Split After Core Stabilizes

**Goal:** Decide whether advanced features should stay in the theme or move to optional addons.

**Decision Inputs:**

- Package size impact.
- Runtime dependency impact.
- Whether features are useful to most theme users.
- Whether features need network access.
- Whether features should work outside Scholarly.

**Candidate Addons:**

- `slidev-addon-scholarly-citations`
- `slidev-addon-scholarly-data`
- `slidev-addon-scholarly-notes`

**Steps:**

- [ ] Measure current package size.
- [ ] List dependencies required by P3 features.
- [ ] Keep no-network, style-only features in the theme.
- [ ] Move heavy parsing or charting features into addons only if they add dependencies or broad API surface.
- [ ] Document the decision in `docs/en/guide/features.md` and `docs/zh/guide/features.md`.

**Acceptance Criteria:**

- The base theme stays stable and easy to install.
- Optional features have a clear install story.

**Suggested Commit:**

```text
docs: evaluate scholarly addon boundaries
```

---

## Cross-Cutting Standards

### Visual Standards

- Use theme tokens for all surfaces, borders, text, and semantic variants.
- Do not introduce layout-level dark backgrounds inside light content slides unless foreground tokens are changed with them.
- Check dense academic slides at 4:3 and 16:9 before release.
- Keep repeated cards compact; avoid nested card compositions for academic workflows.

### Accessibility Standards

- Preserve readable contrast for text on highlight, quote, code, theorem, block, and table backgrounds.
- Add high-contrast mode examples to docs and screenshot exports.
- Keep interactive controls keyboard-accessible in VS Code extension views.

### API Standards

- Prefer shared metadata in `shared/*.json` over duplicating lists in CLI/docs/extension.
- Prefer slots for long academic content and props for labels, state, and variants.
- Avoid introducing new dependencies unless the use case is common and the API is stable.

### Verification Commands

Run these for normal PRs:

```bash
node scripts/check-color-mode-styles.mjs
git diff --check -- .
pnpm run docs:build
pnpm run vscode:compile
```

Run these for visual or release-sensitive PRs:

```bash
pnpm exec playwright install chromium
pnpm run theme:matrix
pnpm run export:all-screenshots
```

Run these for CLI changes:

```bash
node cli/scholarly.mjs --help
node cli/scholarly.mjs template list --json
node cli/scholarly.mjs theme list --json
node cli/scholarly.mjs doctor
```

---

## Recommended Execution Sequence

1. Start P1 evidence components now that the Academic Layout Pack is complete and screenshots export cleanly.
2. Reuse the new layout use cases to shape `MetricCard`, `MetricGrid`, `EvidenceBlock`, and `EquationBlock`.
3. Update shared metadata before VS Code snippets/previews so tooling stays generated from source.
4. Add docs in the same PR as each user-facing feature.
5. Re-run `pnpm run check:visual` after batches that change rendered surfaces.
6. Keep P3 behind explicit decisions; avoid making heavy automation part of the base theme until P0-P2 are stable.

## First Three PRs

1. **P1 Academic Layout Pack**
   - Complete. Eight planned layouts are implemented, documented, and covered by layout screenshots.

2. **P1 Academic Evidence Components**
   - Complete batch 1 with `MetricCard`, `MetricGrid`, `EvidenceBlock`, and `EquationBlock`.
   - Next batch: `DatasetCard`, `PaperCard`, `ContributionList`, and `CaveatList`.
   - Reuse P0 semantic tokens for all surfaces and states.

3. **P1 Academic Interaction Polish**
   - Add authoring examples for common paper-talk flows.
   - Tighten responsive behavior and screenshot coverage for new layouts/components.

## Stop Conditions

- Stop and redesign if a new component needs raw theme colors instead of semantic tokens.
- Stop and split scope if a feature requires a new runtime dependency that affects all users.
- Stop and document migration if a public `themeConfig` key must be renamed or removed.
- Stop and fix QA first if screenshot export cannot run on a clean local setup.
