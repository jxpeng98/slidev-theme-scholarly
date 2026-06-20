import { spawnSync } from 'node:child_process'
import { access, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createSlideRangeMapping, replaceMappedScreenshots } from './screenshot-export-utils.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const slidevCli = path.join(root, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs')

const themes = [
  { name: 'classic-blue', entry: 'examples/example-classic-blue.md', outDir: 'images/themes/classic-blue' },
  { name: 'oxford', entry: 'examples/example-oxford.md', outDir: 'images/themes/oxford' },
  { name: 'cambridge', entry: 'examples/example-cambridge.md', outDir: 'images/themes/cambridge' },
  { name: 'yale', entry: 'examples/example-yale.md', outDir: 'images/themes/yale' },
  { name: 'princeton', entry: 'examples/example-princeton.md', outDir: 'images/themes/princeton' },
  { name: 'nordic', entry: 'examples/example-nordic.md', outDir: 'images/themes/nordic' },
  { name: 'monochrome', entry: 'examples/example-monochrome.md', outDir: 'images/themes/monochrome' },
  { name: 'sepia', entry: 'examples/example-sepia.md', outDir: 'images/themes/sepia' },
  { name: 'high-contrast', entry: 'examples/example-high-contrast.md', outDir: 'images/themes/high-contrast' },
]

const range = process.env.SLIDEV_EXPORT_RANGE || '1-4'
const extraArgs = process.argv.slice(2)
const rangeMapping = createSlideRangeMapping(range)

await access(slidevCli)

for (const theme of themes) {
  const entry = path.join(root, theme.entry)
  const outDir = path.join(root, theme.outDir)
  const tempOutDir = path.join(tmpdir(), `slidev-theme-scholarly-${theme.name}-theme-screenshots`)
  await access(entry)

  console.log(`\n[slidev-theme-scholarly] Exporting ${theme.name} (${range}) -> ${theme.outDir}\n`)
  await rm(tempOutDir, { recursive: true, force: true })

  const result = spawnSync(
    process.execPath,
    [
      slidevCli,
      'export',
      entry,
      '--format',
      'png',
      '--range',
      range,
      '--output',
      tempOutDir,
      ...extraArgs,
    ],
    { stdio: 'inherit', cwd: root },
  )

  if (result.status !== 0)
    process.exit(result.status ?? 1)

  const docsOutDir = path.join(root, 'docs', 'public', theme.outDir)
  const rootResult = await replaceMappedScreenshots({
    tempOutDir,
    docsOutDir: outDir,
    mapping: rangeMapping,
    label: `${theme.name} theme`,
  })
  await replaceMappedScreenshots({
    tempOutDir,
    docsOutDir,
    mapping: rangeMapping,
    label: `${theme.name} docs theme`,
  })
  await rm(tempOutDir, { recursive: true, force: true })

  console.log(`[slidev-theme-scholarly] Generated ${rootResult.successCount}/${Object.keys(rangeMapping).length} screenshots for ${theme.name}`)
}
