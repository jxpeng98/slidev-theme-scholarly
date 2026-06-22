import { spawnSync } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const slidevCli = path.join(root, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs')
const themesData = JSON.parse(await readFile(path.join(root, 'shared', 'themes.json'), 'utf8'))

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || process.env.SCHOLARLY_THEME_MATRIX_DRY_RUN === '1'
const passthroughArgs = args.filter(arg => arg !== '--dry-run' && arg !== '--')
const outputRoot = process.env.SCHOLARLY_THEME_MATRIX_OUT || path.join(os.tmpdir(), 'scholarly-theme-matrix')
const workRoot = path.join(outputRoot, '_work')
const requestedThemes = (process.env.SCHOLARLY_THEME_MATRIX_THEMES || '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean)
const requestedModes = (process.env.SCHOLARLY_THEME_MATRIX_MODES || '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean)

const colorThemes = themesData.colorThemes
  .filter(theme => requestedThemes.length === 0 || requestedThemes.includes(theme.id))
const modePresets = [
  {
    id: 'academic-default',
    label: 'Academic Default',
    contentMode: 'light',
    chromeMode: 'dark',
    sectionMode: 'dark',
  },
  {
    id: 'all-light-match',
    label: 'All Light Match',
    contentMode: 'light',
    chromeMode: 'match',
    sectionMode: 'match',
  },
  {
    id: 'all-dark-match',
    label: 'All Dark Match',
    contentMode: 'dark',
    chromeMode: 'match',
    sectionMode: 'match',
  },
  {
    id: 'inverse-chrome',
    label: 'Inverse Chrome',
    contentMode: 'light',
    chromeMode: 'inverse',
    sectionMode: 'dark',
  },
  {
    id: 'inverse-surfaces',
    label: 'Inverse Surfaces',
    contentMode: 'dark',
    chromeMode: 'inverse',
    sectionMode: 'inverse',
  },
]
const surfaceModes = modePresets
  .filter(mode => requestedModes.length === 0 || requestedModes.includes(mode.id))

if (!colorThemes.length)
  throw new Error('No color themes selected for theme matrix export.')

if (!surfaceModes.length)
  throw new Error('No surface modes selected for theme matrix export.')

const renderDeck = ({ theme, mode }) => `---
theme: ${root}
title: Scholarly Theme Matrix - ${theme.label} / ${mode.label}
themeConfig:
  colorTheme: ${theme.id}
  fontTheme: classic
  contentMode: ${mode.contentMode}
  chromeMode: ${mode.chromeMode}
  sectionMode: ${mode.sectionMode}
footerMiddle: Theme Matrix
---

# ${theme.label} / ${mode.label}

Readable body text with \`inline code\`, a highlight, and a citation-style marker.

<Highlight type="primary">Primary highlight</Highlight>
<Highlight type="success">Success highlight</Highlight>
<Highlight type="warning">Warning highlight</Highlight>
<Highlight type="danger">Danger highlight</Highlight>
<Highlight type="info">Info highlight</Highlight>

---
layout: default
---

# Quote, Code, and Table

> A readable quote should keep enough contrast in every content mode and theme.

~~~ts
const readable = 'semantic tokens';
console.log(readable);
~~~

| Element | Expected |
| --- | --- |
| Quote | readable text and visible border |
| Inline code | clear background and foreground |
| Table rule | visible but not dominant |

---
layout: default
---

# Blocks and Theorems

<Block type="info" title="Information">
The block content surface must remain readable on light and dark content modes.
</Block>

<Block type="warning" title="Warning">
Warning content uses the semantic warning token pair.
</Block>

<Theorem type="theorem" title="Token Contract">
Every theorem variant uses an accent token and a readable background token.
</Theorem>

---
layout: section
---

# Section Contrast

Section slides should follow sectionMode without leaking unreadable content colors.
`

await mkdir(workRoot, { recursive: true })

for (const theme of colorThemes) {
  for (const mode of surfaceModes) {
    const deckPath = path.join(workRoot, `${theme.id}-${mode.id}.md`)
    const outDir = path.join(outputRoot, theme.id, mode.id)

    await mkdir(path.dirname(deckPath), { recursive: true })
    await writeFile(deckPath, renderDeck({ theme, mode }), 'utf8')

    if (dryRun) {
      console.log(`[dry-run] ${theme.id}/${mode.id} -> ${outDir}`)
      continue
    }

    await rm(outDir, { recursive: true, force: true })
    await mkdir(outDir, { recursive: true })

    console.log(`\n[slidev-theme-scholarly] Exporting ${theme.id}/${mode.id} -> ${outDir}\n`)
    const result = spawnSync(
      process.execPath,
      [
        slidevCli,
        'export',
        deckPath,
        '--format',
        'png',
        '--output',
        outDir,
        ...passthroughArgs,
      ],
      { stdio: 'inherit', cwd: root },
    )

    if (result.status !== 0)
      process.exit(result.status ?? 1)
  }
}

console.log(`Theme matrix ${dryRun ? 'dry run' : 'export'} completed at ${outputRoot}`)
