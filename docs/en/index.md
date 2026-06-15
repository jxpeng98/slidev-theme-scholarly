---
title: Home
---

# Slidev Theme Scholarly

<div class="flex flex-wrap items-center justify-center gap-2 mb-2">
  <a href="https://www.npmjs.com/package/slidev-theme-scholarly" target="_blank">
    <img src="https://img.shields.io/npm/v/slidev-theme-scholarly?style=for-the-badge&logo=npm&color=1F4E79" alt="NPM Version">
  </a>
  <a href="https://www.npmjs.com/package/slidev-theme-scholarly" target="_blank">
    <img src="https://img.shields.io/npm/dm/slidev-theme-scholarly?style=for-the-badge&logo=npm&label=downloads&color=355C7D" alt="NPM Downloads">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets" target="_blank">
    <img src="https://img.shields.io/visual-studio-marketplace/v/jxpeng98.slidev-scholarly-snippets?style=for-the-badge&label=VS%20Code%20Extension&logo=visualstudiocode&color=2E5A88&cacheSeconds=86400" alt="VS Code Extension Version">
  </a>
  <a href="https://www.npmjs.com/package/slidev-theme-scholarly/v/next" target="_blank">
    <img src="https://img.shields.io/npm/v/slidev-theme-scholarly/next?style=for-the-badge&label=pre-release&logo=npm&color=5C6B73" alt="NPM Next">
  </a>
</div>

<div class="flex flex-wrap items-center justify-center gap-2 mb-4">
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/jxpeng98/slidev-theme-scholarly?style=for-the-badge&logo=github&label=issues&color=4B5563" alt="GitHub issues">
  </a>
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly/pulls" target="_blank">
    <img src="https://img.shields.io/github/issues-pr/jxpeng98/slidev-theme-scholarly?style=for-the-badge&logo=github&label=pull%20requests&color=4B5563" alt="GitHub pull requests">
  </a>
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly" target="_blank">
    <img src="https://img.shields.io/github/stars/jxpeng98/slidev-theme-scholarly?style=for-the-badge&logo=github&label=stars&color=374151" alt="GitHub stars">
  </a>
  <a href="https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/jxpeng98/slidev-theme-scholarly?style=for-the-badge&label=license&color=4B5563" alt="License">
  </a>
</div>

A professional presentation theme for [Slidev](https://sli.dev), designed specifically for academic presentations with LaTeX Beamer-inspired styling.

[Live Demo](https://scholarly.jxpeng.dev/) · [Academic Workflows](./guide/workflows/) · [Quick Start](./guide/quick-start) · [GitHub](https://github.com/jxpeng98/slidev-theme-scholarly)

> **Heads up: major upgrade in progress**
>
> Upcoming versions may include breaking changes that affect existing decks (dependencies, theme config, layouts/components). Please read the [Upgrade Notes](./guide/upgrade) before updating.
>
> **Try the pre-release:** `npm i -D slidev-theme-scholarly@next`

## ✨ Key Features

### 🎓 Professional & Academic
LaTeX Beamer-inspired design with Classic Academic Blue and modern typography. Perfect for conferences, lectures, and research presentations.

### 📐 34 Specialized Layouts
Organized into four categories for easy discovery:

- **Structure Layouts** (7) - Framework and organization
- **Content Layouts** (6) - Information presentation
- **Emphasis Layouts** (4) - Highlighting key messages
- **Academic Layouts** (15) - Research-specific workflows and evidence slides

### 🧩 Rich Components
Built-in academic components with simple syntax:

- **Theorem** - Theorems, lemmas, definitions, proofs
- **Block** - Beamer-style colored information blocks
- **Citations** - BibTeX integration with automatic bibliography
- **Steps** - Workflow and process visualization
- **Keywords** - Keyword tags for papers
- **Columns** - Flexible multi-column layouts
- **Highlight** - Text highlighting and emphasis

### 🎨 Customizable Themes
Mix and match from multiple theme dimensions:

- **9 Color Themes** - Classic Blue, Oxford Burgundy, Cambridge Green, Yale Blue, Princeton Orange, Nordic Gray, Monochrome, High Contrast, Sepia
- **7 Font Themes** - Classic, Modern, Minimal, Elegant, Tech, Academic, Contemporary
- **Color Modes** - Light and dark mode support
- **Section Modes** - Independent light/dark section dividers

### 📝 Developer-Friendly
- **Pure Markdown** - No coding required
- **Syntax Sugar** - Simplified component syntax
- **Type Safety** - Full TypeScript support
- **VS Code Extension** - Snippets and preview support
- **Hot Reload** - Instant preview during development

## 🚀 Quick Start

Install the theme:

```bash
npm install slidev-theme-scholarly
```

Create your presentation:

```yaml
---
theme: scholarly
---

# Your Presentation Title
Subtitle or description
```

[View Full Guide →](./guide/quick-start)

## 📸 Preview

![Classic Blue Theme](/images/themes/classic-blue/1.png)

[Explore All Themes →](./guide/themes)

## 📚 Documentation

### Getting Started

- [Quick Start](./guide/quick-start) - Get started in 5 minutes
- [Academic Workflows](./guide/workflows/) - Choose the right starting path for a paper talk, defense, review, results talk, or lecture
- [Features](./guide/features) - Overview of all features
- [VS Code Extension](./guide/vscode-extension) - Install snippets and tools
- [Theme Mode and Contrast](./guide/theme-mode-contrast) - Keep quote, Highlight, and semantic surfaces readable
- [Color & Typography Themes](./guide/themes) - Explore theme options

### Layouts

- [Structure Layouts](./layouts/structure) - Cover, sections, and navigation
- [Content Layouts](./layouts/content) - Text, images, and columns
- [Emphasis Layouts](./layouts/emphasis) - Quotes, facts, and highlights
- [Academic Layouts](./layouts/academic) - Methodology, results, and references

### Components

- [Theorem](./components/theorem) - Mathematical theorems and proofs
- [Block](./components/block) - Information blocks
- [Citations](./components/cite) - BibTeX citations and bibliography
- [Steps](./components/steps) - Process visualization
- [Keywords](./components/keywords) - Keyword tags
- [Columns](./components/columns) - Multi-column layouts
- [Highlight](./components/highlight) - Text highlighting
- [MetricCard](./components/metric-card) - Key result metrics
- [EvidenceBlock](./components/evidence-block) - Claims with evidence and sources

## 👥 Who is this for?

- 👨‍🎓 **PhD students** presenting dissertations and research
- 👩‍🏫 **Professors** creating course lectures and seminars
- 🔬 **Researchers** preparing conference talks and papers
- 🏢 **Professionals** delivering technical presentations
- 📊 **Anyone** needing polished academic presentations

**No programming experience required!**

## 🌟 Why Choose Scholarly?

### Academic Excellence
Designed by researchers, for researchers. Every layout and component follows academic presentation best practices.

### Time-Saving
Stop fighting with PowerPoint. Write in Markdown, preview instantly, and export to PDF or host online.

### Version Control
Your presentations are plain text files. Track changes with Git, collaborate with GitHub, and never lose work.

### Modern Stack
Built on Slidev, powered by Vue and Vite. Export to PDF, host anywhere, or present directly in the browser.

## 🤝 Contributing

We welcome contributions! Check out our [Contributing Guide](./contributing) to get started.

## 📄 License

MIT License - see [LICENSE](https://github.com/jxpeng98/slidev-theme-scholarly/blob/main/LICENSE) for details.

---

**Ready to create beautiful academic presentations?**

[Get Started →](./guide/quick-start) · [View Examples →](https://scholarly.jxpeng.dev/)
