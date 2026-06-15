#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { analyzeCitationProject } from '../shared/citations.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packageJsonPath = path.join(rootDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const cliName = path.parse(path.basename(process.argv[1] || 'scholarly')).name

const TEMPLATE_META = {
  basic: {
    description: 'Minimal English starter deck',
  },
  academic: {
    description: 'Academic deck with BibTeX citations',
  },
  'paper-talk': {
    description: 'Paper presentation with summary, method, results, and references',
  },
  seminar: {
    description: 'Research seminar deck with agenda, related work, method, and discussion',
  },
  'thesis-defense': {
    description: 'Thesis defense deck with experiments, limitations, Q&A, and appendix map',
  },
  'reading-group': {
    description: 'Reading group deck for paper critique and discussion',
  },
  'conference-lightning': {
    description: 'Short conference talk focused on one claim and supporting evidence',
  },
  zh: {
    description: 'Chinese starter deck',
  },
}

const TEMPLATE_ALIAS = {
  default: 'basic',
  en: 'basic',
  english: 'basic',
  paper: 'paper-talk',
  talk: 'paper-talk',
  defense: 'thesis-defense',
  thesis: 'thesis-defense',
  reading: 'reading-group',
  lightning: 'conference-lightning',
  cn: 'zh',
  chinese: 'zh',
}

// ── Shared data (Single Source of Truth) ────────────────────────────────────
const __sharedDir = path.resolve(__dirname, '..', 'shared')
const __themesData = JSON.parse(fs.readFileSync(path.join(__sharedDir, 'themes.json'), 'utf8'))
const __layoutsData = JSON.parse(fs.readFileSync(path.join(__sharedDir, 'layouts.json'), 'utf8'))

const COLOR_THEMES = __themesData.colorThemes.map(t => ({ id: t.id, label: t.label }))
const FONT_THEMES = __themesData.fontThemes.map(t => ({ id: t.id, label: t.label }))
const THEME_PRESETS = __themesData.themePresets
const LAYOUT_GROUPS = __layoutsData.layoutGroups
const COMPONENT_LIST = __layoutsData.componentNames

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
  ${cliName} theme preset apply <preset> [--font <font-theme>] [--mode <light|dark>] [--section-mode <light|dark>] [--file <slides.md>]
  ${cliName} theme apply <color-theme> [--font <font-theme>] [--mode <light|dark>] [--section-mode <light|dark>] [--file <slides.md>]
  ${cliName} layout list [--json]
  ${cliName} component list [--json]
  ${cliName} snippet list [--json]
  ${cliName} snippet show <name>
  ${cliName} snippet append <name> [--file <slides.md>]
  ${cliName} workflow list [--json]
  ${cliName} workflow apply <name> [--file <slides.md>]
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
  ${cliName} theme preset apply <preset> [--font <font-theme>] [--mode <light|dark>] [--section-mode <light|dark>] [--file <slides.md>]
  ${cliName} theme apply <color-theme> [--font <font-theme>] [--mode <light|dark>] [--section-mode <light|dark>] [--file <slides.md>]

Subcommands:
  list         Print available color/font themes
  preset       Apply curated preset combos
  apply        Update themeConfig in slide frontmatter

Examples:
  ${cliName} theme list
  ${cliName} theme preset list
  ${cliName} theme preset apply cambridge --file slides.md
  ${cliName} theme apply cambridge-green --font elegant
  ${cliName} theme apply high-contrast --mode light --file slides.md
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
  ${cliName} doctor

Checks:
  - Node.js version (must be >= 20)
  - Package managers (pnpm/npm)
  - Slidev availability
  - Local project files (slides.md, package.json)
  - Theme dependency presence
  - Citation setup, bibliography file, unresolved keys, and references slide
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

function parseThemeApplyArgs(args) {
  const result = {
    colorTheme: '',
    fontTheme: '',
    colorMode: '',
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

  return result
}

function parseThemePresetApplyArgs(args) {
  const result = {
    preset: '',
    fontTheme: '',
    colorMode: '',
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

function upsertThemeConfig(lines, kv) {
  let range = findNestedBlockRange(lines, 'themeConfig')
  if (range.start < 0) {
    lines.push('themeConfig:')
    range = findNestedBlockRange(lines, 'themeConfig')
  }

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
  const colorMode = normalizeId(options.colorMode)
  const sectionMode = normalizeId(options.sectionMode)
  const targetFile = path.resolve(process.cwd(), options.file || 'slides.md')

  if (!hasId(COLOR_THEMES, colorTheme)) {
    throw new Error(`Unknown color theme: ${options.colorTheme}`)
  }

  if (fontTheme && !hasId(FONT_THEMES, fontTheme)) {
    throw new Error(`Unknown font theme: ${options.fontTheme}`)
  }

  if (colorMode && colorMode !== 'light' && colorMode !== 'dark') {
    throw new Error('Invalid --mode value. Use "light" or "dark".')
  }

  if (sectionMode && sectionMode !== 'light' && sectionMode !== 'dark') {
    throw new Error('Invalid --section-mode value. Use "light" or "dark".')
  }

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
    colorMode,
    sectionMode,
  })

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

function printDoctorLine(label, ok, details) {
  const status = ok ? 'OK' : 'WARN'
  console.log(`- ${label}: [${status}] ${details}`)
}

function formatList(items, limit = 8) {
  if (items.length <= limit)
    return items.join(', ')

  return `${items.slice(0, limit).join(', ')} (+${items.length - limit} more)`
}

function printCitationDoctorLines() {
  const citation = analyzeCitationProject(process.cwd())

  if (!citation.hasSlides) {
    printDoctorLine('Citation setup', true, 'skipped (slides.md missing)')
    return
  }

  if (citation.citationKeys.length === 0) {
    printDoctorLine('Citation keys', true, 'no citations found')
    return
  }

  if (citation.missingSetup) {
    printDoctorLine('Citation setup', false, 'citations found but no bibFile or references.bib')
    printDoctorLine('References slide', citation.hasReferencesSlide, citation.hasReferencesSlide ? 'found' : 'missing; add layout: references')
    return
  }

  printDoctorLine(
    'Citation setup',
    true,
    citation.bibFileSource === 'frontmatter'
      ? `bibFile configured: ${citation.bibFile}`
      : 'using default references.bib',
  )

  if (!citation.bibFileExists) {
    printDoctorLine('Citation bibliography', false, `missing .bib file: ${citation.bibFile}`)
    printDoctorLine('References slide', citation.hasReferencesSlide, citation.hasReferencesSlide ? 'found' : 'missing; add layout: references')
    return
  }

  if (citation.duplicateKeys.length > 0) {
    printDoctorLine('Citation bibliography', false, `duplicate BibTeX keys: ${formatList(citation.duplicateKeys)}`)
  } else {
    printDoctorLine('Citation bibliography', true, `${citation.bibEntryCount} entries loaded from ${citation.bibFile}`)
  }

  if (citation.unresolvedKeys.length > 0) {
    printDoctorLine('Citation keys', false, `unresolved citation keys: ${formatList(citation.unresolvedKeys)}`)
  } else {
    printDoctorLine('Citation keys', true, `${citation.citationKeys.length} citation keys resolved`)
  }

  printDoctorLine('References slide', citation.hasReferencesSlide, citation.hasReferencesSlide ? 'found' : 'missing; add layout: references')
}

function runDoctor() {
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

  console.log('Scholarly Doctor')
  printDoctorLine('Node.js', nodeOk, `v${nodeVersion} (required >= 20)`)
  printDoctorLine('pnpm', pnpmCheck.ok, pnpmCheck.ok ? pnpmCheck.version : 'not found')
  printDoctorLine('npm', npmCheck.ok, npmCheck.ok ? npmCheck.version : 'not found')
  printDoctorLine(
    'Slidev CLI',
    slidevCheck.ok,
    slidevCheck.ok ? slidevCheck.version : 'not found in PATH (you can still use npx slidev)',
  )
  printDoctorLine('slides.md', hasSlides, hasSlides ? 'found' : 'missing in current directory')
  printDoctorLine(
    'slidev-theme-scholarly dependency',
    hasTheme,
    isThemeRepo
      ? 'current repository is slidev-theme-scholarly'
      : hasTheme
        ? 'found in package.json'
        : 'not found in package.json',
  )
  printCitationDoctorLines()

  if (!nodeOk) {
    console.log('\nAction required: upgrade Node.js to version 20 or newer.')
    process.exit(1)
  }
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
    if (args[1] === '-h' || args[1] === '--help') {
      printDoctorHelp()
      return
    }
    runDoctor()
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
