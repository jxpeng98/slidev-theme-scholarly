# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-10-30

### Fixed

- Update `.npmrc` configuration for Bun package manager (removed pnpm-specific settings)
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
