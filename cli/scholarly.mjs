#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { analyzeCitationProject } from '../shared/citations.mjs'
import {
  buildPaperMetadataWarnings,
  extractPaperMetadata,
  findBibEntry,
  parseBibEntries,
  renderPaperMarkdown,
} from '../shared/bibtex.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packageJsonPath = path.join(rootDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const cliName = path.parse(path.basename(process.argv[1] || 'scholarly')).name

// ── Shared data (Single Source of Truth) ────────────────────────────────────
const __sharedDir = path.resolve(__dirname, '..', 'shared')
const __themesData = JSON.parse(fs.readFileSync(path.join(__sharedDir, 'themes.json'), 'utf8'))
const __layoutsData = JSON.parse(fs.readFileSync(path.join(__sharedDir, 'layouts.json'), 'utf8'))
const __templatesData = JSON.parse(fs.readFileSync(path.join(__sharedDir, 'templates.json'), 'utf8'))

const COLOR_THEMES = __themesData.colorThemes.map(t => ({ id: t.id, label: t.label }))
const FONT_THEMES = __themesData.fontThemes.map(t => ({ id: t.id, label: t.label }))
const THEME_PRESETS = __themesData.themePresets
const CONTENT_MODES = ['light', 'dark']
const SURFACE_MODES = ['light', 'dark', 'match', 'inverse']
const LAYOUT_GROUPS = __layoutsData.layoutGroups
const COMPONENT_LIST = __layoutsData.componentNames
const TEMPLATE_META = Object.fromEntries(
  __templatesData.templates.map(template => [template.id, { description: template.description }]),
)
const TEMPLATE_ALIAS = __templatesData.aliases

const SNIPPETS = {
  theorem: `<Theorem type="theorem" title="Sample Theorem">
For every epsilon > 0, there exists delta > 0.
</Theorem>`,
  block: `<Block type="info" title="Key Insight">
Your concise explanation here.
</Block>`,
  cite: `Recent work shows strong gains @smith2025llm.

<!-- remember to set:
bibFile: ./references.bib
bibStyle: apa
-->`,
  cover: `---
layout: cover
---

# Presentation Title

Subtitle`,
  section: `---
layout: section
---

# Section Title`,
  methodology: `---
layout: methodology
title: Methodology
---

## Pipeline

1. Data collection
2. Modeling
3. Evaluation`,
  results: `---
layout: results
title: Main Results
---

## Key Outcomes

- Metric A: +12%
- Metric B: +8%
- Metric C: +4%`,
  references: `---
layout: references
---

# References`,
}

const WORKFLOWS = [
  {
    id: 'paper',
    label: 'Academic Paper Talk',
    snippets: ['cover', 'section', 'methodology', 'results', 'references'],
  },
  {
    id: 'seminar',
    label: 'Seminar Structure',
    snippets: ['cover', 'section', 'methodology', 'results'],
  },
  {
    id: 'quick',
    label: 'Quick Talk',
    snippets: ['cover', 'results', 'references'],
  },
]

function printHelp() {
  console.log(`${cliName} v${packageJson.version}

Usage:
  ${cliName} init [dir] [--template <name>] [--force]
  ${cliName} new [dir] [--template <name>] [--force]
  ${cliName} template list [--json]
  ${cliName} theme list [--json]
  ${cliName} theme preset list [--json]
  ${cliName} theme preset apply <preset> [--font <font-theme>] [--content-mode <light|dark>] [--chrome-mode <light|dark|match|inverse>] [--section-mode <light|dark|match|inverse>] [--file <slides.md>]
  ${cliName} theme apply <color-theme> [--font <font-theme>] [--content-mode <light|dark>] [--chrome-mode <light|dark|match|inverse>] [--section-mode <light|dark|match|inverse>] [--file <slides.md>]
  ${cliName} layout list [--json]
  ${cliName} component list [--json]
  ${cliName} snippet list [--json]
  ${cliName} snippet show <name>
  ${cliName} snippet append <name> [--file <slides.md>]
  ${cliName} workflow list [--json]
  ${cliName} workflow apply <name> [--file <slides.md>]
  ${cliName} paper summary --bib <references.bib> --key <citekey> [--layout <paper-summary|paper-card>] [--json]
  ${cliName} dev [entry.md] [slidev options]
  ${cliName} build [entry.md] [slidev options]
  ${cliName} export [entry.md] [slidev options]
  ${cliName} doctor
  ${cliName} help [command]
  ${cliName} --help
  ${cliName} --version

Commands:
  init/new/create   Create a new presentation project from a template
  template list     Print available templates
  theme             List/apply Scholarly color and font themes
  workflow          Apply curated Scholarly slide structures
  paper summary     Generate paper-summary or PaperCard Markdown from BibTeX
  layout list       List built-in Scholarly layouts
  component list    List built-in Scholarly components
  snippet           Show/append Scholarly snippet blocks
  dev               Start Slidev dev server (default entry: slides.md)
  build             Build static slides (default entry: slides.md)
  export            Export slides to PDF/PNG (default entry: slides.md)
  doctor            Check local environment and project readiness
  help              Show help for a specific command

Examples:
  ${cliName} init my-talk --template academic
  ${cliName} dev slides.md --open
  ${cliName} build slides.md
  ${cliName} export slides.md --format pdf
  ${cliName} theme preset apply oxford --file slides.md
  ${cliName} workflow apply paper --file slides.md
  ${cliName} paper summary --bib references.bib --key sample2026
  ${cliName} theme apply oxford-burgundy --font traditional
  ${cliName} snippet append theorem --file slides.md
  ${cliName} help init
`)
}

function printInitHelp() {
  console.log(`Usage:
  ${cliName} init [dir] [--template <name>] [--force]

Options:
  -t, --template <name>  Template name (basic, academic, paper-talk, seminar, thesis-defense, reading-group, conference-lightning, zh)
  -f, --force            Allow writing into non-empty directory
  -h, --help             Show help
`)
}

function printTemplateHelp() {
  console.log(`Usage:
  ${cliName} template list [--json]

Subcommands:
  list        Print available templates

Options:
  --json      Output template list as JSON
  -h, --help  Show help
`)
}

function printThemeHelp() {
  console.log(`Usage:
  ${cliName} theme list [--json]
  ${cliName} theme preset list [--json]
  ${cliName} theme preset apply <preset> [--font <font-theme>] [--content-mode <light|dark>] [--chrome-mode <light|dark|match|inverse>] [--section-mode <light|dark|match|inverse>] [--file <slides.md>]
  ${cliName} theme apply <color-theme> [--font <font-theme>] [--content-mode <light|dark>] [--chrome-mode <light|dark|match|inverse>] [--section-mode <light|dark|match|inverse>] [--file <slides.md>]

Subcommands:
  list         Print available color/font themes
  preset       Apply curated preset combos
  apply        Update themeConfig in slide frontmatter

Legacy --mode is accepted as an alias for --content-mode.

Examples:
  ${cliName} theme list
  ${cliName} theme preset list
  ${cliName} theme preset apply cambridge --file slides.md
  ${cliName} theme apply cambridge-green --font elegant
  ${cliName} theme apply high-contrast --content-mode light --file slides.md
`)
}

function printLayoutHelp() {
  console.log(`Usage:
  ${cliName} layout list [--json]

Subcommands:
  list         Print built-in Scholarly layouts by category
`)
}

function printComponentHelp() {
  console.log(`Usage:
  ${cliName} component list [--json]

Subcommands:
  list         Print built-in Scholarly components
`)
}

function printSnippetHelp() {
  console.log(`Usage:
  ${cliName} snippet list [--json]
  ${cliName} snippet show <name>
  ${cliName} snippet append <name> [--file <slides.md>]

Subcommands:
  list         Print available snippet names
  show         Print a snippet to stdout
  append       Append a snippet into a markdown file

Examples:
  ${cliName} snippet list
  ${cliName} snippet show theorem
  ${cliName} snippet append methodology --file slides.md
`)
}

function printWorkflowHelp() {
  console.log(`Usage:
  ${cliName} workflow list [--json]
  ${cliName} workflow apply <name> [--file <slides.md>]

Subcommands:
  list         Print available workflows
  apply        Append a full workflow snippet sequence

Examples:
  ${cliName} workflow list
  ${cliName} workflow apply paper --file slides.md
`)
}

function printRunHelp(mode) {
  const exampleTail = mode === 'dev' ? '--open' : mode === 'export' ? '--format pdf' : '--base /slides/'
  console.log(`Usage:
  ${cliName} ${mode} [entry.md] [slidev options]

Examples:
  ${cliName} ${mode}
  ${cliName} ${mode} slides.md
  ${cliName} ${mode} slides.md ${exampleTail}

Notes:
  - If entry is omitted, CLI looks for slides.md, then slides/index.md, then example.md.
  - Any extra flags are passed through to Slidev directly.
`)
}

function printDoctorHelp() {
  console.log(`Usage:
  ${cliName} doctor [--json]

Checks:
  - Node.js version (must be >= 20)
  - Package managers (pnpm/npm)
  - Slidev availability
  - Local project files (slides.md, package.json)
  - Theme dependency presence
  - themeConfig values
  - Citation setup, bibliography file, unresolved keys, and references slide
  - Playwright browser availability when export scripts are configured

Options:
  --json      Output structured diagnostics for automation
`)
}

function printPaperHelp() {
  console.log(`Usage:
  ${cliName} paper summary --bib <references.bib> --key <citekey> [--layout <paper-summary|paper-card>] [--json]

Options:
  --bib <path>       BibTeX file to read
  --key <citekey>    BibTeX entry key to render
  --layout <layout>  Output layout (paper-summary, paper-card). Default: paper-summary
  --json            Output metadata, warnings, and markdown as JSON
  -h, --help        Show help

Examples:
  ${cliName} paper summary --bib references.bib --key sample2026
  ${cliName} paper summary --bib references.bib --key sample2026 --layout paper-card
  ${cliName} paper summary --bib references.bib --key sample2026 --json
`)
}

function parseInitArgs(args) {
  const result = {
    targetDir: '.',
    template: 'basic',
    force: false,
  }

  let hasTargetDir = false

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]

    if (arg === '-h' || arg === '--help') {
      printInitHelp()
      process.exit(0)
    }

    if (arg === '-f' || arg === '--force') {
      result.force = true
      continue
    }

    if (arg === '-t' || arg === '--template') {
      const next = args[i + 1]
      if (!next || next.startsWith('-')) {
        throw new Error('Missing value for --template.')
      }
      result.template = next
      i += 1
      continue
    }

    if (arg.startsWith('--template=')) {
      const value = arg.split('=', 2)[1]
      if (!value) {
        throw new Error('Missing value for --template.')
      }
      result.template = value
      continue
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`)
    }

    if (hasTargetDir) {
      throw new Error(`Unexpected extra argument: ${arg}`)
    }

    result.targetDir = arg
    hasTargetDir = true
  }

  const normalizedTemplate = normalizeTemplateName(result.template)
  if (!normalizedTemplate) {
    throw new Error(
      `Unknown template "${result.template}". Run "${cliName} template list" to view available templates.`,
    )
  }

  result.template = normalizedTemplate
  return result
}

function parseTemplateArgs(args) {
  const result = {
    subcommand: 'list',
    json: false,
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]

    if (arg === '-h' || arg === '--help') {
      printTemplateHelp()
      process.exit(0)
    }

    if (arg === '--json') {
      result.json = true
      continue
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`)
    }

    if (result.subcommand !== 'list') {
      throw new Error(`Unexpected extra argument: ${arg}`)
    }

    result.subcommand = arg
  }

  return result
}

function parseListArgs(args, helpPrinter) {
  const result = {
    subcommand: 'list',
    json: false,
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]

    if (arg === '-h' || arg === '--help') {
      helpPrinter()
      process.exit(0)
    }

    if (arg === '--json') {
      result.json = true
      continue
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`)
    }

    if (result.subcommand !== 'list') {
      throw new Error(`Unexpected extra argument: ${arg}`)
    }

    result.subcommand = arg
  }

  return result
}

function parseDoctorArgs(args) {
  const result = {
    json: false,
  }

  for (const arg of args) {
    if (arg === '-h' || arg === '--help') {
      printDoctorHelp()
      process.exit(0)
    }

    if (arg === '--json') {
      result.json = true
      continue
    }

    throw new Error(`Unknown doctor option: ${arg}`)
  }

  return result
}

function parsePaperArgs(args) {
  const subcommand = args[0] || ''

  if (subcommand === '-h' || subcommand === '--help') {
    printPaperHelp()
    process.exit(0)
  }

  if (subcommand !== 'summary') {
    throw new Error(`Unknown paper subcommand: ${subcommand || '(missing)'}`)
  }

  const result = {
    subcommand,
    bib: '',
    key: '',
    layout: 'paper-summary',
    json: false,
  }

  for (let i = 1; i < args.length; i += 1) {
    const arg = args[i]

    if (arg === '-h' || arg === '--help') {
      printPaperHelp()
      process.exit(0)
    }

    if (arg === '--json') {
      result.json = true
      continue
    }

    if (arg === '--bib') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --bib.')
      }
      result.bib = value
      i += 1
      continue
    }

    if (arg.startsWith('--bib=')) {
      result.bib = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--key') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --key.')
      }
      result.key = value
      i += 1
      continue
    }

    if (arg.startsWith('--key=')) {
      result.key = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--layout') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --layout.')
      }
      result.layout = value
      i += 1
      continue
    }

    if (arg.startsWith('--layout=')) {
      result.layout = arg.split('=', 2)[1] || ''
      continue
    }

    throw new Error(`Unknown paper option: ${arg}`)
  }

  if (!result.bib)
    throw new Error('Missing required option --bib.')
  if (!result.key)
    throw new Error('Missing required option --key.')
  if (result.layout !== 'paper-summary' && result.layout !== 'paper-card')
    throw new Error('Invalid --layout value. Use "paper-summary" or "paper-card".')

  return result
}

function parseThemeApplyArgs(args) {
  const result = {
    colorTheme: '',
    fontTheme: '',
    colorMode: '',
    contentMode: '',
    chromeMode: '',
    sectionMode: '',
    file: 'slides.md',
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]

    if (!arg) {
      continue
    }

    if (arg === '-h' || arg === '--help') {
      printThemeHelp()
      process.exit(0)
    }

    if (!arg.startsWith('-') && !result.colorTheme) {
      result.colorTheme = arg
      continue
    }

    if (arg === '--font') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --font.')
      }
      result.fontTheme = value
      i += 1
      continue
    }

    if (arg.startsWith('--font=')) {
      result.fontTheme = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--mode') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --mode.')
      }
      result.colorMode = value
      i += 1
      continue
    }

    if (arg.startsWith('--mode=')) {
      result.colorMode = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--content-mode') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --content-mode.')
      }
      result.contentMode = value
      i += 1
      continue
    }

    if (arg.startsWith('--content-mode=')) {
      result.contentMode = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--chrome-mode') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --chrome-mode.')
      }
      result.chromeMode = value
      i += 1
      continue
    }

    if (arg.startsWith('--chrome-mode=')) {
      result.chromeMode = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--section-mode') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --section-mode.')
      }
      result.sectionMode = value
      i += 1
      continue
    }

    if (arg.startsWith('--section-mode=')) {
      result.sectionMode = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--file') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --file.')
      }
      result.file = value
      i += 1
      continue
    }

    if (arg.startsWith('--file=')) {
      result.file = arg.split('=', 2)[1] || ''
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  if (!result.colorTheme) {
    throw new Error('Missing required argument <color-theme>.')
  }

  if (!result.contentMode && result.colorMode) {
    result.contentMode = result.colorMode
  }

  return result
}

function parseThemePresetApplyArgs(args) {
  const result = {
    preset: '',
    fontTheme: '',
    colorMode: '',
    contentMode: '',
    chromeMode: '',
    sectionMode: '',
    file: 'slides.md',
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]

    if (!arg) {
      continue
    }

    if (arg === '-h' || arg === '--help') {
      printThemeHelp()
      process.exit(0)
    }

    if (!arg.startsWith('-') && !result.preset) {
      result.preset = arg
      continue
    }

    if (arg === '--font') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --font.')
      }
      result.fontTheme = value
      i += 1
      continue
    }

    if (arg.startsWith('--font=')) {
      result.fontTheme = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--mode') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --mode.')
      }
      result.colorMode = value
      i += 1
      continue
    }

    if (arg.startsWith('--mode=')) {
      result.colorMode = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--content-mode') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --content-mode.')
      }
      result.contentMode = value
      i += 1
      continue
    }

    if (arg.startsWith('--content-mode=')) {
      result.contentMode = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--chrome-mode') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --chrome-mode.')
      }
      result.chromeMode = value
      i += 1
      continue
    }

    if (arg.startsWith('--chrome-mode=')) {
      result.chromeMode = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--section-mode') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --section-mode.')
      }
      result.sectionMode = value
      i += 1
      continue
    }

    if (arg.startsWith('--section-mode=')) {
      result.sectionMode = arg.split('=', 2)[1] || ''
      continue
    }

    if (arg === '--file') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        throw new Error('Missing value for --file.')
      }
      result.file = value
      i += 1
      continue
    }

    if (arg.startsWith('--file=')) {
      result.file = arg.split('=', 2)[1] || ''
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  if (!result.preset) {
    throw new Error('Missing required argument <preset>.')
  }

  if (!result.contentMode && result.colorMode) {
    result.contentMode = result.colorMode
  }

  return result
}

function parseThemeArgs(args) {
  const subcommand = args[0] || 'list'
  if (subcommand === 'list') {
    return {
      subcommand,
      options: parseListArgs(args.slice(1), printThemeHelp),
    }
  }

  if (subcommand === 'apply') {
    return {
      subcommand,
      options: parseThemeApplyArgs(args.slice(1)),
    }
  }

  if (subcommand === 'preset' || subcommand === 'presets') {
    const next = args[1] || 'list'
    if (next === 'list') {
      return {
        subcommand: 'preset-list',
        options: parseListArgs(args.slice(2), printThemeHelp),
      }
    }

    if (next === 'apply') {
      return {
        subcommand: 'preset-apply',
        options: parseThemePresetApplyArgs(args.slice(2)),
      }
    }

    return {
      subcommand: 'preset-apply',
      options: parseThemePresetApplyArgs(args.slice(1)),
    }
  }

  if (subcommand === '-h' || subcommand === '--help') {
    printThemeHelp()
    process.exit(0)
  }

  throw new Error(`Unknown theme subcommand: ${subcommand}`)
}

function parseWorkflowArgs(args) {
  const subcommand = args[0] || 'list'

  if (subcommand === '-h' || subcommand === '--help') {
    printWorkflowHelp()
    process.exit(0)
  }

  if (subcommand === 'list') {
    const options = parseListArgs(args.slice(1), printWorkflowHelp)
    return {
      subcommand: 'list',
      options,
      name: '',
      file: 'slides.md',
    }
  }

  if (subcommand === 'apply') {
    const name = args[1]
    if (!name || name.startsWith('-')) {
      throw new Error('Missing workflow name for "workflow apply".')
    }

    const result = {
      subcommand: 'apply',
      options: { json: false, subcommand: 'list' },
      name,
      file: 'slides.md',
    }

    for (let i = 2; i < args.length; i += 1) {
      const arg = args[i]
      if (arg === '--file') {
        const value = args[i + 1]
        if (!value || value.startsWith('-')) {
          throw new Error('Missing value for --file.')
        }
        result.file = value
        i += 1
        continue
      }

      if (arg.startsWith('--file=')) {
        result.file = arg.split('=', 2)[1] || ''
        continue
      }

      if (arg === '-h' || arg === '--help') {
        printWorkflowHelp()
        process.exit(0)
      }

      throw new Error(`Unknown option: ${arg}`)
    }

    return result
  }

  throw new Error(`Unknown workflow subcommand: ${subcommand}`)
}

function parseSnippetArgs(args) {
  const subcommand = args[0] || 'list'

  if (subcommand === '-h' || subcommand === '--help') {
    printSnippetHelp()
    process.exit(0)
  }

  if (subcommand === 'list') {
    let json = false
    for (let i = 1; i < args.length; i += 1) {
      const arg = args[i]
      if (arg === '--json') {
        json = true
        continue
      }

      throw new Error(`Unknown option: ${arg}`)
    }

    return {
      subcommand,
      json,
      name: '',
      file: 'slides.md',
    }
  }

  if (subcommand === 'show') {
    const name = args[1]
    if (!name || name.startsWith('-')) {
      throw new Error('Missing snippet name for "snippet show".')
    }
    return {
      subcommand,
      json: false,
      name,
      file: 'slides.md',
    }
  }

  if (subcommand === 'append' || subcommand === 'insert') {
    const name = args[1]
    if (!name || name.startsWith('-')) {
      throw new Error(`Missing snippet name for "snippet ${subcommand}".`)
    }

    const result = {
      subcommand: 'append',
      json: false,
      name,
      file: 'slides.md',
    }

    for (let i = 2; i < args.length; i += 1) {
      const arg = args[i]
      if (arg === '--file') {
        const value = args[i + 1]
        if (!value || value.startsWith('-')) {
          throw new Error('Missing value for --file.')
        }
        result.file = value
        i += 1
        continue
      }

      if (arg.startsWith('--file=')) {
        result.file = arg.split('=', 2)[1] || ''
        continue
      }

      if (arg === '-h' || arg === '--help') {
        printSnippetHelp()
        process.exit(0)
      }

      throw new Error(`Unknown option: ${arg}`)
    }

    return result
  }

  throw new Error(`Unknown snippet subcommand: ${subcommand}`)
}

function normalizeTemplateName(name) {
  if (!name) {
    return null
  }

  const normalized = name.toLowerCase()
  if (TEMPLATE_META[normalized]) {
    return normalized
  }

  return TEMPLATE_ALIAS[normalized] || null
}

function ensureTargetDirectory(targetPath, force) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
    return
  }

  const stats = fs.statSync(targetPath)
  if (!stats.isDirectory()) {
    throw new Error(`Target path is not a directory: ${targetPath}`)
  }

  const existingEntries = fs.readdirSync(targetPath)
  if (existingEntries.length > 0 && !force) {
    throw new Error(
      `Target directory is not empty: ${targetPath}\nUse --force if you want to continue.`,
    )
  }
}

function applyReplacements(content, replacements) {
  let next = content
  for (const [token, value] of Object.entries(replacements)) {
    next = next.split(token).join(value)
  }
  return next
}

function copyTemplate(sourceDir, targetDir, replacements) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)
    const targetName = entry.name === '_gitignore' ? '.gitignore' : entry.name
    const targetPath = path.join(targetDir, targetName)

    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true })
      copyTemplate(sourcePath, targetPath, replacements)
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    const raw = fs.readFileSync(sourcePath, 'utf8')
    const rendered = applyReplacements(raw, replacements)
    fs.writeFileSync(targetPath, rendered, 'utf8')
  }
}

function toPackageName(raw) {
  const normalized = raw
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

  return normalized || 'scholarly-presentation'
}

function createProject(options) {
  const targetPath = path.resolve(process.cwd(), options.targetDir)
  const templatePath = path.join(__dirname, 'templates', options.template)

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template folder not found: ${templatePath}`)
  }

  ensureTargetDirectory(targetPath, options.force)

  const dirName = path.basename(targetPath)
  const packageName = toPackageName(dirName === '.' ? 'scholarly-presentation' : dirName)
  const replacements = {
    __PROJECT_NAME__: packageName,
    __SCHOLARLY_VERSION__: `^${packageJson.version}`,
  }

  copyTemplate(templatePath, targetPath, replacements)

  const relativePath = path.relative(process.cwd(), targetPath) || '.'
  const cdTarget = relativePath.startsWith('..') ? targetPath : relativePath
  const cdStep = cdTarget === '.' ? '' : `  cd ${cdTarget}\n`

  console.log(`Created "${options.template}" template at ${targetPath}

Next steps:
${cdStep}  pnpm install
  pnpm run dev
`)
}

function printTemplateList(asJson = false) {
  const items = Object.entries(TEMPLATE_META).map(([name, meta]) => ({
    name,
    description: meta.description,
  }))

  if (asJson) {
    console.log(JSON.stringify(items, null, 2))
    return
  }

  console.log('Available templates:')
  for (const item of items) {
    console.log(`  - ${item.name}: ${item.description}`)
  }
}

function printLayoutList(asJson = false) {
  if (asJson) {
    console.log(JSON.stringify(LAYOUT_GROUPS, null, 2))
    return
  }

  console.log('Scholarly layouts:')
  for (const group of LAYOUT_GROUPS) {
    console.log(`- ${group.name}: ${group.items.join(', ')}`)
  }
}

function printComponentList(asJson = false) {
  if (asJson) {
    console.log(JSON.stringify(COMPONENT_LIST, null, 2))
    return
  }

  console.log('Scholarly components:')
  for (const item of COMPONENT_LIST) {
    console.log(`- ${item}`)
  }
}

function printThemeList(asJson = false) {
  const data = {
    colors: COLOR_THEMES,
    fonts: FONT_THEMES,
  }

  if (asJson) {
    console.log(JSON.stringify(data, null, 2))
    return
  }

  console.log('Color themes:')
  for (const item of COLOR_THEMES) {
    console.log(`- ${item.id} (${item.label})`)
  }

  console.log('\nFont themes:')
  for (const item of FONT_THEMES) {
    console.log(`- ${item.id} (${item.label})`)
  }
}

function getThemePreset(name) {
  const key = normalizeId(name)
  return THEME_PRESETS.find(item => item.id === key) || null
}

function printThemePresetList(asJson = false) {
  if (asJson) {
    console.log(JSON.stringify(THEME_PRESETS, null, 2))
    return
  }

  console.log('Theme presets:')
  for (const preset of THEME_PRESETS) {
    console.log(`- ${preset.id} (${preset.label}): ${preset.colorTheme} + ${preset.fontTheme}`)
  }
}

function normalizeId(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function hasId(list, id) {
  return list.some(item => item.id === id)
}

function assertValidContentMode(value, label) {
  if (value && !CONTENT_MODES.includes(value))
    throw new Error(`Invalid ${label} value. Use "light" or "dark".`)
}

function assertValidSurfaceMode(value, label) {
  if (value && !SURFACE_MODES.includes(value))
    throw new Error(`Invalid ${label} value. Use "light", "dark", "match", or "inverse".`)
}

function detectLineEnding(text) {
  return text.includes('\r\n') ? '\r\n' : '\n'
}

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    return null
  }

  const full = match[0]
  const body = match[1]
  const rest = content.slice(full.length)
  return { body, rest, full }
}

function countIndent(line) {
  const match = line.match(/^(\s*)/)
  return match ? match[1].length : 0
}

function findTopLevelKeyLine(lines, key) {
  const pattern = new RegExp(`^${key}:\\s*`)
  return lines.findIndex(line => countIndent(line) === 0 && pattern.test(line))
}

function findNestedBlockRange(lines, key) {
  const index = lines.findIndex(line => line.trim() === `${key}:`)
  if (index < 0) {
    return { start: -1, end: -1, indent: 0 }
  }

  const indent = countIndent(lines[index])
  let end = lines.length
  for (let i = index + 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.trim()) {
      continue
    }
    const lineIndent = countIndent(line)
    if (lineIndent <= indent) {
      end = i
      break
    }
  }

  return { start: index, end, indent }
}

function upsertTopLevelKey(lines, key, value) {
  const idx = findTopLevelKeyLine(lines, key)
  const nextLine = `${key}: ${value}`
  if (idx >= 0) {
    lines[idx] = nextLine
    return
  }

  lines.push(nextLine)
}

function removeNestedKeys(lines, range, keys) {
  for (let i = range.end - 1; i > range.start; i -= 1) {
    if (countIndent(lines[i]) <= range.indent) {
      continue
    }

    if (keys.some(key => new RegExp(`^\\s*${key}:\\s*`).test(lines[i]))) {
      lines.splice(i, 1)
      range.end -= 1
    }
  }
}

function upsertThemeConfig(lines, kv, removeKeys = []) {
  let range = findNestedBlockRange(lines, 'themeConfig')
  if (range.start < 0) {
    lines.push('themeConfig:')
    range = findNestedBlockRange(lines, 'themeConfig')
  }

  removeNestedKeys(lines, range, removeKeys)

  const nestedIndent = ' '.repeat(range.indent + 2)
  for (const [key, value] of Object.entries(kv)) {
    if (!value) {
      continue
    }

    const pattern = new RegExp(`^\\s*${key}:\\s*`)
    let found = -1
    for (let i = range.start + 1; i < range.end; i += 1) {
      if (pattern.test(lines[i])) {
        found = i
        break
      }
    }

    const rendered = `${nestedIndent}${key}: ${value}`
    if (found >= 0) {
      lines[found] = rendered
    } else {
      lines.splice(range.end, 0, rendered)
      range.end += 1
    }
  }
}

function applyThemeToFile(options) {
  const colorTheme = normalizeId(options.colorTheme)
  const fontTheme = normalizeId(options.fontTheme)
  const contentMode = normalizeId(options.contentMode || options.colorMode)
  const chromeMode = normalizeId(options.chromeMode)
  const sectionMode = normalizeId(options.sectionMode)
  const targetFile = path.resolve(process.cwd(), options.file || 'slides.md')

  if (!hasId(COLOR_THEMES, colorTheme)) {
    throw new Error(`Unknown color theme: ${options.colorTheme}`)
  }

  if (fontTheme && !hasId(FONT_THEMES, fontTheme)) {
    throw new Error(`Unknown font theme: ${options.fontTheme}`)
  }

  assertValidContentMode(contentMode, options.contentMode ? '--content-mode' : '--mode')
  assertValidSurfaceMode(chromeMode, '--chrome-mode')
  assertValidSurfaceMode(sectionMode, '--section-mode')

  const exists = fs.existsSync(targetFile)
  const original = exists ? fs.readFileSync(targetFile, 'utf8') : ''
  const eol = detectLineEnding(original || '\n')
  const fm = extractFrontmatter(original)

  let lines = []
  let rest = original

  if (fm) {
    lines = fm.body.split(/\r?\n/)
    rest = fm.rest
  } else {
    lines = []
    rest = original
  }

  upsertTopLevelKey(lines, 'theme', 'scholarly')
  upsertThemeConfig(lines, {
    colorTheme,
    fontTheme,
    contentMode,
    chromeMode,
    sectionMode,
  }, ['colorMode'])

  const frontmatter = `---${eol}${lines.join(eol)}${eol}---${eol}`
  const trimmedRest = rest ? rest.replace(/^\s+/, '') : ''
  const content = trimmedRest ? `${frontmatter}${trimmedRest}` : frontmatter
  fs.writeFileSync(targetFile, content, 'utf8')

  console.log(`Applied theme config to ${targetFile}`)
}

function applyThemePresetToFile(options) {
  const preset = getThemePreset(options.preset)
  if (!preset) {
    throw new Error(`Unknown theme preset: ${options.preset}`)
  }

  applyThemeToFile({
    colorTheme: preset.colorTheme,
    fontTheme: options.fontTheme || preset.fontTheme,
    colorMode: options.colorMode,
    contentMode: options.contentMode,
    chromeMode: options.chromeMode,
    sectionMode: options.sectionMode,
    file: options.file,
  })

  console.log(`Applied theme preset "${preset.id}" (${preset.colorTheme} + ${options.fontTheme || preset.fontTheme})`)
}

function getSnippet(name) {
  const key = normalizeId(name)
  return SNIPPETS[key] || ''
}

function printSnippetList(asJson = false) {
  const names = Object.keys(SNIPPETS)
  if (asJson) {
    console.log(JSON.stringify(names, null, 2))
    return
  }

  console.log('Available snippets:')
  for (const name of names) {
    console.log(`- ${name}`)
  }
}

function showSnippet(name) {
  const snippet = getSnippet(name)
  if (!snippet) {
    throw new Error(`Unknown snippet: ${name}`)
  }
  console.log(snippet)
}

function appendSnippet(name, file) {
  const snippet = getSnippet(name)
  if (!snippet) {
    throw new Error(`Unknown snippet: ${name}`)
  }

  const targetFile = path.resolve(process.cwd(), file || 'slides.md')
  const exists = fs.existsSync(targetFile)
  if (!exists) {
    fs.writeFileSync(targetFile, `${snippet}\n`, 'utf8')
    console.log(`Created ${targetFile} with snippet "${name}"`)
    return
  }

  const source = fs.readFileSync(targetFile, 'utf8')
  if (!source.trim()) {
    fs.writeFileSync(targetFile, `${snippet}\n`, 'utf8')
    console.log(`Wrote snippet "${name}" to empty file ${targetFile}`)
    return
  }

  const sep = source.endsWith('\n') ? '\n' : '\n\n'
  fs.writeFileSync(targetFile, `${source}${sep}${snippet}\n`, 'utf8')
  console.log(`Appended snippet "${name}" to ${targetFile}`)
}

function printWorkflowList(asJson = false) {
  if (asJson) {
    console.log(JSON.stringify(WORKFLOWS, null, 2))
    return
  }

  console.log('Available workflows:')
  for (const workflow of WORKFLOWS) {
    console.log(`- ${workflow.id} (${workflow.label}): ${workflow.snippets.join(' -> ')}`)
  }
}

function applyWorkflow(name, file) {
  const key = normalizeId(name)
  const workflow = WORKFLOWS.find(item => item.id === key)
  if (!workflow) {
    throw new Error(`Unknown workflow: ${name}`)
  }

  const blocks = workflow.snippets.map(snippetName => {
    const snippet = getSnippet(snippetName)
    if (!snippet) {
      throw new Error(`Snippet "${snippetName}" is missing for workflow "${workflow.id}"`)
    }
    return snippet
  })

  const targetFile = path.resolve(process.cwd(), file || 'slides.md')
  const payload = blocks.join('\n\n')
  const exists = fs.existsSync(targetFile)

  if (!exists) {
    fs.writeFileSync(targetFile, `${payload}\n`, 'utf8')
    console.log(`Created ${targetFile} with workflow "${workflow.id}"`)
    return
  }

  const source = fs.readFileSync(targetFile, 'utf8')
  if (!source.trim()) {
    fs.writeFileSync(targetFile, `${payload}\n`, 'utf8')
    console.log(`Wrote workflow "${workflow.id}" to empty file ${targetFile}`)
    return
  }

  const sep = source.endsWith('\n') ? '\n' : '\n\n'
  fs.writeFileSync(targetFile, `${source}${sep}${payload}\n`, 'utf8')
  console.log(`Appended workflow "${workflow.id}" to ${targetFile}`)
}

function runPaperSummary(options) {
  const bibPath = path.resolve(process.cwd(), options.bib)
  if (!fs.existsSync(bibPath))
    throw new Error(`BibTeX file not found: ${options.bib}`)

  let entries
  try {
    entries = parseBibEntries(fs.readFileSync(bibPath, 'utf8'))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Unable to read BibTeX file ${options.bib}: ${message}`)
  }

  const entry = findBibEntry(entries, options.key)
  if (!entry)
    throw new Error(`BibTeX key not found: ${options.key}`)

  const metadata = extractPaperMetadata(entry)
  const warnings = buildPaperMetadataWarnings(metadata)
  const markdown = renderPaperMarkdown(metadata, { layout: options.layout })

  for (const warning of warnings)
    console.error(`Warning: ${warning}`)

  if (options.json) {
    console.log(JSON.stringify({ metadata, warnings, markdown }, null, 2))
    return
  }

  console.log(markdown)
}

function resolveDefaultEntry() {
  const candidates = ['slides.md', 'slides/index.md', 'example.md']
  for (const candidate of candidates) {
    if (fs.existsSync(path.resolve(process.cwd(), candidate))) {
      return candidate
    }
  }
  return 'slides.md'
}

function buildSlidevArgs(mode, args) {
  const entryIndex = args.findIndex(arg => arg.endsWith('.md'))
  const entry = entryIndex >= 0 ? args[entryIndex] : resolveDefaultEntry()
  const passthroughArgs = entryIndex >= 0 ? args.filter((_, i) => i !== entryIndex) : args

  if (mode === 'dev') {
    return [entry, ...passthroughArgs]
  }

  return [mode, entry, ...passthroughArgs]
}

function runCommand(binary, args, inherit = true) {
  const result = spawnSync(binary, args, {
    stdio: inherit ? 'inherit' : 'pipe',
    encoding: inherit ? undefined : 'utf8',
  })

  return {
    status: result.status ?? 1,
    error: result.error ?? null,
    stdout: typeof result.stdout === 'string' ? result.stdout.trim() : '',
    stderr: typeof result.stderr === 'string' ? result.stderr.trim() : '',
  }
}

function runSlidev(mode, args) {
  if (args.includes('-h') || args.includes('--help')) {
    printRunHelp(mode)
    return
  }

  const slidevArgs = buildSlidevArgs(mode, args)
  let result = runCommand('slidev', slidevArgs, true)

  if (result.error && result.error.code === 'ENOENT') {
    result = runCommand('npx', ['slidev', ...slidevArgs], true)
  }

  if (result.status !== 0) {
    process.exit(result.status)
  }
}

function checkBinary(binary) {
  const result = runCommand(binary, ['--version'], false)
  if (result.error && result.error.code === 'ENOENT') {
    return { ok: false, version: '' }
  }

  if (result.status !== 0) {
    return { ok: false, version: result.stderr || result.stdout || '' }
  }

  return { ok: true, version: result.stdout.split('\n')[0] || '' }
}

function readLocalPackageJson() {
  const localPkgPath = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(localPkgPath)) {
    return null
  }

  try {
    return JSON.parse(fs.readFileSync(localPkgPath, 'utf8'))
  } catch {
    return null
  }
}

function hasThemeDependency(pkg) {
  if (!pkg) {
    return false
  }

  const depGroups = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
  return depGroups.some(group => Boolean(pkg[group] && pkg[group]['slidev-theme-scholarly']))
}

function formatList(items, limit = 8) {
  if (items.length <= limit)
    return items.join(', ')

  return `${items.slice(0, limit).join(', ')} (+${items.length - limit} more)`
}

function createDoctorCheck(id, label, severity, summary, action, extra = {}) {
  return {
    id,
    label,
    severity,
    summary,
    action,
    ...extra,
  }
}

function collectCitationDoctorChecks() {
  const citation = analyzeCitationProject(process.cwd())
  const checks = []

  if (!citation.hasSlides) {
    checks.push(createDoctorCheck(
      'citation-setup',
      'Citation setup',
      'ok',
      'skipped (slides.md missing)',
      'Add citations after creating slides.md.',
    ))
    return checks
  }

  if (citation.citationKeys.length === 0) {
    checks.push(createDoctorCheck(
      'citation-keys',
      'Citation keys',
      'ok',
      'no citations found',
      'Add citations with @citekey when the deck needs a bibliography.',
    ))
    return checks
  }

  if (citation.missingSetup) {
    checks.push(createDoctorCheck(
      'citation-setup',
      'Citation setup',
      'warn',
      'citations found but no bibFile or references.bib',
      'Add bibFile: ./references.bib to frontmatter or create references.bib next to slides.md.',
    ))
    checks.push(createDoctorCheck(
      'references-slide',
      'References slide',
      citation.hasReferencesSlide ? 'ok' : 'warn',
      citation.hasReferencesSlide ? 'found' : 'missing; add layout: references',
      citation.hasReferencesSlide
        ? 'Keep the references slide when citations are used.'
        : 'Add a slide with layout: references.',
    ))
    return checks
  }

  checks.push(createDoctorCheck(
    'citation-setup',
    'Citation setup',
    'ok',
    citation.bibFileSource === 'frontmatter'
      ? `bibFile configured: ${citation.bibFile}`
      : 'using default references.bib',
    'Keep the bibliography file path valid.',
  ))

  if (!citation.bibFileExists) {
    checks.push(createDoctorCheck(
      'citation-bibliography',
      'Citation bibliography',
      'warn',
      `missing .bib file: ${citation.bibFile}`,
      `Create ${citation.bibFile} or update bibFile in slides.md frontmatter.`,
    ))
    checks.push(createDoctorCheck(
      'references-slide',
      'References slide',
      citation.hasReferencesSlide ? 'ok' : 'warn',
      citation.hasReferencesSlide ? 'found' : 'missing; add layout: references',
      citation.hasReferencesSlide
        ? 'Keep the references slide when citations are used.'
        : 'Add a slide with layout: references.',
    ))
    return checks
  }

  if (citation.duplicateKeys.length > 0) {
    checks.push(createDoctorCheck(
      'citation-bibliography',
      'Citation bibliography',
      'warn',
      `duplicate BibTeX keys: ${formatList(citation.duplicateKeys)}`,
      'Rename duplicate BibTeX keys so each entry has a unique cite key.',
    ))
  } else {
    checks.push(createDoctorCheck(
      'citation-bibliography',
      'Citation bibliography',
      'ok',
      `${citation.bibEntryCount} entries loaded from ${citation.bibFile}`,
      'Keep references.bib in sync with slide citations.',
    ))
  }

  if (citation.unresolvedKeys.length > 0) {
    checks.push(createDoctorCheck(
      'citation-keys',
      'Citation keys',
      'warn',
      `unresolved citation keys: ${formatList(citation.unresolvedKeys)}`,
      'Add missing BibTeX entries or correct the @citekey values in slides.md.',
    ))
  } else {
    checks.push(createDoctorCheck(
      'citation-keys',
      'Citation keys',
      'ok',
      `${citation.citationKeys.length} citation keys resolved`,
      'Keep citation keys aligned with the bibliography.',
    ))
  }

  checks.push(createDoctorCheck(
    'references-slide',
    'References slide',
    citation.hasReferencesSlide ? 'ok' : 'warn',
    citation.hasReferencesSlide ? 'found' : 'missing; add layout: references',
    citation.hasReferencesSlide
      ? 'Keep the references slide when citations are used.'
      : 'Add a slide with layout: references.',
  ))

  return checks
}

function stripYamlValue(raw) {
  return String(raw || '')
    .split('#')[0]
    .trim()
    .replace(/^['"]|['"]$/g, '')
}

function extractThemeConfigValuesFromSlides() {
  const slidesPath = path.resolve(process.cwd(), 'slides.md')
  if (!fs.existsSync(slidesPath)) {
    return {}
  }

  const source = fs.readFileSync(slidesPath, 'utf8')
  const fm = extractFrontmatter(source)
  if (!fm) {
    return {}
  }

  const lines = fm.body.split(/\r?\n/)
  const range = findNestedBlockRange(lines, 'themeConfig')
  if (range.start < 0) {
    return {}
  }

  const values = {}
  for (let i = range.start + 1; i < range.end; i += 1) {
    const line = lines[i]
    if (countIndent(line) <= range.indent)
      continue

    const match = line.match(/^\s*(colorTheme|fontTheme|contentMode|chromeMode|colorMode|sectionMode):\s*(.+?)\s*$/)
    if (match)
      values[match[1]] = stripYamlValue(match[2])
  }

  return values
}

function collectThemeConfigDoctorChecks(hasSlides) {
  if (!hasSlides) {
    return [
      createDoctorCheck(
        'theme-config',
        'themeConfig',
        'ok',
        'skipped (slides.md missing)',
        'Create slides.md before validating themeConfig.',
      ),
    ]
  }

  const values = extractThemeConfigValuesFromSlides()
  const checks = []
  const validators = [
    {
      key: 'colorTheme',
      id: 'theme-config-color-theme',
      label: 'themeConfig.colorTheme',
      valid: COLOR_THEMES.map(item => item.id),
    },
    {
      key: 'fontTheme',
      id: 'theme-config-font-theme',
      label: 'themeConfig.fontTheme',
      valid: FONT_THEMES.map(item => item.id),
    },
    {
      key: 'contentMode',
      id: 'theme-config-content-mode',
      label: 'themeConfig.contentMode',
      valid: CONTENT_MODES,
    },
    {
      key: 'chromeMode',
      id: 'theme-config-chrome-mode',
      label: 'themeConfig.chromeMode',
      valid: SURFACE_MODES,
    },
    {
      key: 'colorMode',
      id: 'theme-config-color-mode',
      label: 'themeConfig.colorMode (legacy alias)',
      valid: CONTENT_MODES,
    },
    {
      key: 'sectionMode',
      id: 'theme-config-section-mode',
      label: 'themeConfig.sectionMode',
      valid: SURFACE_MODES,
    },
  ]

  for (const validator of validators) {
    const value = values[validator.key]
    if (!value)
      continue

    if (validator.valid.includes(value)) {
      checks.push(createDoctorCheck(
        validator.id,
        validator.label,
        'ok',
        value,
        `Keep ${validator.label} set to a supported value.`,
      ))
      continue
    }

    checks.push(createDoctorCheck(
      validator.id,
      validator.label,
      'warn',
      `unknown value: ${value}`,
      `Use one of: ${formatList(validator.valid, 12)}.`,
      { value, validValues: validator.valid },
    ))
  }

  if (checks.length === 0) {
    checks.push(createDoctorCheck(
      'theme-config',
      'themeConfig',
      'ok',
      'no explicit themeConfig values to validate',
      'Optionally set themeConfig.colorTheme, fontTheme, contentMode, chromeMode, or sectionMode.',
    ))
  }

  return checks
}

function hasExportWorkflow(pkg) {
  if (!pkg || !pkg.scripts)
    return false

  return Object.entries(pkg.scripts).some(([name, command]) => {
    const text = `${name} ${command}`
    return /\b(export|screenshot|visual|theme:matrix)\b/.test(text)
  })
}

function checkPlaywrightBrowserAvailable() {
  const script = `
    import fs from 'node:fs'
    import { chromium } from 'playwright-chromium'
    process.exit(fs.existsSync(chromium.executablePath()) ? 0 : 1)
  `
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: rootDir,
    stdio: 'ignore',
  })

  return result.status === 0
}

function collectDoctorChecks() {
  const nodeVersion = process.versions.node
  const nodeMajor = Number(nodeVersion.split('.')[0] || 0)
  const nodeOk = Number.isFinite(nodeMajor) && nodeMajor >= 20
  const pnpmCheck = checkBinary('pnpm')
  const npmCheck = checkBinary('npm')
  const slidevCheck = checkBinary('slidev')
  const localPkg = readLocalPackageJson()
  const hasSlides = fs.existsSync(path.resolve(process.cwd(), 'slides.md'))
  const isThemeRepo = Boolean(localPkg && localPkg.name === 'slidev-theme-scholarly')
  const hasTheme = isThemeRepo || hasThemeDependency(localPkg)
  const checks = [
    createDoctorCheck(
      'node-version',
      'Node.js',
      nodeOk ? 'ok' : 'error',
      `v${nodeVersion} (required >= 20)`,
      'Use Node.js 20 or newer.',
      { version: nodeVersion, required: '>=20' },
    ),
    createDoctorCheck(
      'pnpm',
      'pnpm',
      pnpmCheck.ok ? 'ok' : 'warn',
      pnpmCheck.ok ? pnpmCheck.version : 'not found',
      pnpmCheck.ok ? 'Use pnpm install and pnpm run dev for generated projects.' : 'Install pnpm or use npm if your project is configured for npm.',
    ),
    createDoctorCheck(
      'npm',
      'npm',
      npmCheck.ok ? 'ok' : 'warn',
      npmCheck.ok ? npmCheck.version : 'not found',
      npmCheck.ok ? 'npm is available for fallback commands.' : 'Install npm with Node.js.',
    ),
    createDoctorCheck(
      'slidev-cli',
      'Slidev CLI',
      slidevCheck.ok ? 'ok' : 'warn',
      slidevCheck.ok ? slidevCheck.version : 'not found in PATH (you can still use npx slidev)',
      slidevCheck.ok ? 'Use slidev directly or through package scripts.' : 'Install @slidev/cli locally or run with npx slidev.',
    ),
    createDoctorCheck(
      'slides-file',
      'slides.md',
      hasSlides ? 'ok' : 'warn',
      hasSlides ? 'found' : 'missing in current directory',
      hasSlides ? 'Open slides.md to edit the deck.' : 'Create slides.md or run sch init to generate a Scholarly deck.',
    ),
    createDoctorCheck(
      'theme-dependency',
      'slidev-theme-scholarly dependency',
      hasTheme ? 'ok' : 'warn',
      isThemeRepo
        ? 'current repository is slidev-theme-scholarly'
        : hasTheme
          ? 'found in package.json'
          : 'not found in package.json',
      hasTheme ? 'Add slidev-theme-scholarly only for consumer projects.' : 'Run npm i -D slidev-theme-scholarly or pnpm add -D slidev-theme-scholarly.',
    ),
  ]

  checks.push(...collectThemeConfigDoctorChecks(hasSlides))
  checks.push(...collectCitationDoctorChecks())

  if (hasExportWorkflow(localPkg)) {
    const hasBrowser = checkPlaywrightBrowserAvailable()
    checks.push(createDoctorCheck(
      'playwright-browser',
      'Playwright browser',
      hasBrowser ? 'ok' : 'warn',
      hasBrowser ? 'Chromium available for export workflows' : 'Chromium not found for export workflows',
      hasBrowser ? 'Use export and screenshot workflows normally.' : 'Run pnpm exec playwright install chromium before exporting PNG/PDF screenshots.',
    ))
  }

  return {
    cwd: process.cwd(),
    cliVersion: packageJson.version,
    package: {
      name: localPkg?.name || '',
      hasPackageJson: Boolean(localPkg),
      isThemeRepo,
      hasThemeDependency: hasTheme,
    },
    checks,
  }
}

function summarizeDoctorStatus(checks) {
  if (checks.some(check => check.severity === 'error'))
    return 'error'
  if (checks.some(check => check.severity === 'warn'))
    return 'warn'
  return 'ok'
}

function renderDoctorJson(report) {
  const status = summarizeDoctorStatus(report.checks)
  console.log(JSON.stringify({ ...report, status }, null, 2))
}

function renderDoctorText(report) {
  console.log('Scholarly Doctor')
  for (const check of report.checks) {
    console.log(`- ${check.label}: [${check.severity.toUpperCase()}] ${check.summary}`)
    if (check.severity !== 'ok' && check.action)
      console.log(`  Action: ${check.action}`)
  }
}

function runDoctor(options = {}) {
  const report = collectDoctorChecks()
  const status = summarizeDoctorStatus(report.checks)

  if (options.json)
    renderDoctorJson(report)
  else
    renderDoctorText(report)

  if (status === 'error')
    process.exit(1)
}

function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command || command === '-h' || command === '--help') {
    printHelp()
    return
  }

  if (command === '-v' || command === '--version') {
    console.log(packageJson.version)
    return
  }

  if (command === 'help') {
    const topic = args[1]
    if (!topic) {
      printHelp()
      return
    }

    if (topic === 'init' || topic === 'new' || topic === 'create') {
      printInitHelp()
      return
    }

    if (topic === 'template' || topic === 'templates') {
      printTemplateHelp()
      return
    }

    if (topic === 'theme') {
      printThemeHelp()
      return
    }

    if (topic === 'workflow' || topic === 'flow') {
      printWorkflowHelp()
      return
    }

    if (topic === 'layout') {
      printLayoutHelp()
      return
    }

    if (topic === 'component' || topic === 'components') {
      printComponentHelp()
      return
    }

    if (topic === 'snippet' || topic === 'snippets') {
      printSnippetHelp()
      return
    }

    if (topic === 'paper') {
      printPaperHelp()
      return
    }

    if (topic === 'dev' || topic === 'build' || topic === 'export') {
      printRunHelp(topic)
      return
    }

    if (topic === 'doctor') {
      printDoctorHelp()
      return
    }

    throw new Error(`Unknown help topic: ${topic}`)
  }

  if (command === 'template' || command === 'templates') {
    const options = parseTemplateArgs(args.slice(1))
    if (options.subcommand === 'list') {
      printTemplateList(options.json)
      return
    }

    throw new Error(`Unknown template subcommand: ${options.subcommand}`)
  }

  if (command === 'theme') {
    const parsed = parseThemeArgs(args.slice(1))
    if (parsed.subcommand === 'list') {
      printThemeList(parsed.options.json)
      return
    }

    if (parsed.subcommand === 'apply') {
      applyThemeToFile(parsed.options)
      return
    }

    if (parsed.subcommand === 'preset-list') {
      printThemePresetList(parsed.options.json)
      return
    }

    if (parsed.subcommand === 'preset-apply') {
      applyThemePresetToFile(parsed.options)
      return
    }
  }

  if (command === 'layout' || command === 'layouts') {
    const options = parseListArgs(args.slice(1), printLayoutHelp)
    if (options.subcommand === 'list') {
      printLayoutList(options.json)
      return
    }

    throw new Error(`Unknown layout subcommand: ${options.subcommand}`)
  }

  if (command === 'component' || command === 'components') {
    const options = parseListArgs(args.slice(1), printComponentHelp)
    if (options.subcommand === 'list') {
      printComponentList(options.json)
      return
    }

    throw new Error(`Unknown component subcommand: ${options.subcommand}`)
  }

  if (command === 'snippet' || command === 'snippets') {
    const options = parseSnippetArgs(args.slice(1))
    if (options.subcommand === 'list') {
      printSnippetList(options.json)
      return
    }

    if (options.subcommand === 'show') {
      showSnippet(options.name)
      return
    }

    if (options.subcommand === 'append') {
      appendSnippet(options.name, options.file)
      return
    }
  }

  if (command === 'workflow' || command === 'workflows' || command === 'flow') {
    const options = parseWorkflowArgs(args.slice(1))
    if (options.subcommand === 'list') {
      printWorkflowList(options.options.json)
      return
    }

    if (options.subcommand === 'apply') {
      applyWorkflow(options.name, options.file)
      return
    }
  }

  if (command === 'paper') {
    const options = parsePaperArgs(args.slice(1))
    if (options.subcommand === 'summary') {
      runPaperSummary(options)
      return
    }
  }

  if (command === 'init' || command === 'new' || command === 'create') {
    const options = parseInitArgs(args.slice(1))
    createProject(options)
    return
  }

  if (command === 'dev' || command === 'build' || command === 'export') {
    runSlidev(command, args.slice(1))
    return
  }

  if (command === 'doctor') {
    const options = parseDoctorArgs(args.slice(1))
    runDoctor(options)
    return
  }

  throw new Error(`Unknown command: ${command}\nRun "${cliName} --help" to see available commands.`)
}

try {
  main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Error: ${message}`)
  process.exit(1)
}
