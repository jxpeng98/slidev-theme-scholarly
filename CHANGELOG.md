# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0-beta.6] - 2026-07-14

### Added

- **VS Code layout catalog**: Documented all 34 layouts and 17 canonical components with use cases, configuration types, required values, defaults, options, features, and slots across the tree, preview, and GUI Builder.
- **GUI Builder configuration editing**: Added layout-aware configuration and named-slot editors with required-field validation, typed serialization, deck metadata synchronization, and ResultTable previews.

### Changed

- **Theme-aware extension UI**: Unified Extension webviews around VS Code semantic color tokens and expanded the responsive layout library, filtering, inspector, theme swatches, and slide reordering experience.
- **Display mode ownership**: Let slide content follow Slidev's resolved light/dark state while keeping content, chrome, and section surfaces independently configurable.

### Fixed

- **Theme contrast**: Routed layout and component colors through semantic foreground tokens, including accessible Block, Theorem, code-tab, TOC badge, Fact, and Princeton Orange combinations.
- **Builder output correctness**: Preserved string configuration values, validated structured JSON and required props, synchronized deck title/subtitle with the cover, and retained default slot content.

## [1.4.0-beta.5] - 2026-07-07

### Fixed

- **Footer outline**: Restored presentation focus when closing the outline preview so keyboard arrow navigation resumes immediately.

## [1.4.0-beta.3] - 2026-06-22

### Fixed

- **Long decks**: Reduced runtime work for large presentations by avoiding full internal-anchor registry rebuilds on every slide navigation and lazy-loading footer outline slide previews.
- **Color mode isolation**: Made explicit `themeConfig.colorMode` authoritative over Slidev/system dark mode by synchronizing `html.dark`, `data-color-mode`, and browser `color-scheme`.

## [1.4.0-beta.1] - 2026-06-19

### Added

- **Academic layout pack**: Added research-focused layouts for paper summaries, related work matrices, method pipelines, highlighted results, experiment grids, limitations, defense questions, and appendix indexes.
- **Academic evidence components**: Added MetricCard, MetricGrid, EvidenceBlock, EquationBlock, DatasetCard, PaperCard, ContributionList, and CaveatList for result-heavy academic decks.
- **Curated starter templates**: Added paper talk, seminar, thesis defense, reading group, and conference lightning templates with BibTeX examples.
- **CLI workflows**: Added paper summary scaffolding from BibTeX, data-driven result helpers, actionable doctor diagnostics, and release readiness checks.
- **VS Code support**: Added citation diagnostics, the GUI Builder, and synchronized metadata, snippets, and preview assets for the expanded layout/component set.

### Changed

- **Documentation**: Expanded English and Chinese docs for academic workflows, configuration, layouts, components, and theme contrast guidance.
- **Footer outline**: Reworked the footer TOC into a compact section-grouped panel with current/last-section jumps and long-deck navigation support.
- **Preview assets**: Regenerated layout and component screenshots for docs and the VS Code extension.
- **Release process**: Aligned stable theme and VS Code versions while keeping VS Code pre-releases on explicit Marketplace-compatible version mappings.

### Fixed

- **Heading anchors**: Hide trailing Markdown heading IDs such as `{#sec-foundations}` from rendered TOC and footer outline labels.
- **Color modes**: Improved light/dark semantic token coverage and footer contrast.
- **Scrollable content**: Avoid showing vertical scrollbars on non-overflowing slide content while preserving scrolling when content exceeds its container.

## [1.3.2] - 2026-04-20

### Fixed

- **TOC layout**: Resolved an issue where the `toc` layout could fail to render if the presentation had no section titles, by adding a fallback mechanism that generates section entries based on slide frontmatter or content structure

## [1.3.1] - 2026-03-17

This stable release rolls up all changes shipped after `v1.0.3`, including the `v1.1.x`, `v1.2.x`, and `v1.3.0-beta.1` prerelease series.

### Upgrade Notes

- **Runtime requirements**: Scholarly now targets **Node.js 20+** and **Slidev v52+**
- **Citations**: Scholarly citations and bibliography generation are now handled directly by the theme; a project-level citation Vite bridge is no longer required for normal usage
- **Figure layout**: Use `image:` instead of `src:` in `layout: figure` frontmatter, because `src:` is reserved by Slidev and can break build/export

### Added

- **Scholarly CLI**: Added `scholarly`, `sch`, and `sts` commands with starter templates (`academic`, `basic`, `zh`), theme/layout/component listing, snippet appenders, workflow helpers, and doctor commands
- **Expanded layout library**: Grew the theme to **26 layouts**, including `toc`, `auto-size`, `agenda`, `methodology`, `results`, `timeline`, `acknowledgments`, and `references`
- **Interactive presentation navigation**: Added Beamer-style footer navigation controls, outline/TOC drawer, section grouping, and hover previews in play mode
- **Academic footnotes**: Added Markdown footnote popovers with `both`, `hover-only`, and `notes-only` display modes, plus global and per-slide configuration
- **Internal anchor navigation**: Added slide-aware jumps for bibliography entries and generic `href="#..."` links, with a `Back to source` return action
- **VS Code extension upgrades**: Added preview panels, synced layout/theme/component data, richer snippets, BibTeX completion and hover, internal anchor completion, references insertion commands, CLI actions, and dev-mode diagnostics
- **Preview asset pipeline**: Added generated screenshots for layouts, themes, and components, and synced these assets into the documentation site and VS Code extension

### Changed

- **Citation pipeline**: Moved bibliography handling into the theme package and markdown transformers, simplifying normal project setup
- **Shared metadata**: Centralized layouts and themes into shared JSON sources and reused them across docs, CLI, screenshots, and the VS Code extension
- **Documentation**: Reworked English and Chinese docs, examples, screenshots, and quick-start guides to match the current feature set
- **Release tooling**: Added dedicated version bump/sync scripts and separated the release/versioning flow for the npm theme and VS Code extension
- **Component coverage**: Expanded and refined Theorem, Highlight, Columns, Keywords, Steps, Cite, and ThemePreview behavior and documentation

### Removed

- **Standalone citation bridge workflow**: Removed the old `setup vite` / citation helper flow and related preparser-based setup that is no longer needed in standard Scholarly projects

### Fixed

- **Theorem and slide state**: Improved theorem numbering stability, cached lookup logic, fixed-click handling, and slide frontmatter synchronization
- **Footnote and typography behavior**: Fixed footnote positioning, short-slide layout behavior, dense-slide font sizing, and `auto-size` rendering consistency
- **Navigation and anchors**: Fixed cross-slide citation jumps, internal anchor lookup, return-button placement, and generic internal link handling
- **Preview correctness**: Fixed layout/component screenshot mismatches, stale export artifacts, preview image paths, and VS Code preview consistency
- **Figure export reliability**: Resolved the `figure` frontmatter `src` conflict that caused missing slides and shifted screenshot mappings during build/export

## [1.0.0-beta.1] - 2026-01-07

### ⚠️ Breaking Changes

This is a major upgrade with breaking changes. Please read the [Upgrade Notes](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/docs/en/guide/upgrade.md) before updating.

### Changed

- **Node.js**: Now requires Node.js 20+
- **Slidev**: Updated to Slidev v52+
- **Release workflow**: Added prerelease support (`@next` dist-tag for beta versions)

### Added

- **Documentation**: Added upgrade notes for major version migration
- **CI/CD**: Prerelease workflow for `vX.Y.Z-*` tags (published to `@next`)

---

## [0.1.2] - 2025-12-18

### Added

- **Quote Layout**: New `author` and `source` props for better attribution display
- **Bullets Layout**: New `icon` prop for customizable bullet characters (default: ▸)
- **Fact Layout**: Added `purple` color variant for consistency with Focus layout
- **CSS Variables**: Added semantic tokens (`--scholarly-header-height`, `--scholarly-footer-height`, `--scholarly-accent-color`, `--scholarly-border-radius`)
- **Booktabs Table**: Academic three-line table styling (三线表) - removes vertical lines, keeps horizontal rules
- **Code Block Styling**: Improved with light gray background and monospace fonts
- **Citation/Footnote Styling**: Visual hierarchy with smaller font size and gray color

### Fixed

- **VSCode Extension**: Corrected color options in snippets
  - `fact`: Added `primary` as default color option
  - `focus`: Added `primary` and `purple` color options
  - `compare`: Fixed `amber` to `gray` to match actual layout implementation
- **VSCode Extension**: Updated snippets with new layout props (quote, bullets, fact)
- **VSCode Extension**: BibTeX Integration (v0.3.6)
  - New **References** panel showing all citations from `.bib` file
  - Auto-complete for `@citekey` from BibTeX file
  - Hover preview showing citation details (author, title, year)
  - Refresh button to reload references

---

## [0.1.1] - 2025-10-30

### Fixed

- Update `.npmrc` configuration for pnpm package manager
- Remove Slidev configuration settings from VSCode settings
- Update language to English and translate example content

## [0.1.0] - 2025-10-29

### Added

- Initial release of slidev-theme-scholarly
- LaTeX Beamer-style footer with gradient backgrounds
- Multi-author support with intelligent display
- Global footer configuration system
- 11 layout variants: cover, default, intro, center, fact, statement, section, quote, two-cols, image-left, image-right
- Scholarly header system with title/subtitle
- Theorem component with auto-numbering
- Multi-language support (zh/en) for theorem components
- Customizable theorem numbering format
- Optimized layout system using CenteredLayout component

### Features

- **Cover Layout**: Title slide with multi-author support and Beamer-style footer
- **Default Layout**: Standard content layout with header and footer
- **Intro Layout**: Introduction layout with left-aligned content
- **Center Layout**: Centered content with full width
- **Fact/Statement Layouts**: Centered content with constrained width
- **Section Layout**: Chapter divider without header
- **Quote Layout**: Special styling for quotations
- **Two-Cols Layout**: Two-column grid layout
- **Image-Left/Right Layouts**: Full-height image with text side-by-side
- **Theorem Component**: Auto-numbered theorems, lemmas, propositions, etc.

### Configuration

- Global frontmatter configuration for footer
- Per-page title and subtitle
- Customizable author information
- Language selection (zh/en)
- Custom theorem numbering format
