import { spawnSync } from 'node:child_process'
import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { replaceMappedScreenshots } from './screenshot-export-utils.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const slidevCli = path.join(root, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs')

// Layout configuration
const layoutsEntry = path.join(root, 'scripts', 'generate-layout-screenshots.md')
const tempOutDir = path.join(tmpdir(), 'slidev-theme-scholarly-layout-screenshots')
const docsOutDir = path.join(root, 'docs', 'public', 'images', 'layouts')

// Layout mapping: slide number -> layout name.
// Keep this aligned with generate-layout-screenshots.md: one slide per exported preview target.
const LAYOUTS = {
  1: 'cover',
  2: 'default',
  3: 'intro',
  4: 'section',
  5: 'center',
  6: 'auto-center',
  7: 'auto-size',
  8: 'toc',
  9: 'end',
  10: 'two-cols',
  11: 'image-left',
  12: 'image-right',
  13: 'bullets',
  14: 'figure',
  15: 'split-image',
  16: 'quote',
  17: 'fact',
  18: 'statement',
  19: 'focus',
  20: 'compare',
  21: 'methodology',
  22: 'results',
  23: 'timeline',
  24: 'agenda',
  25: 'acknowledgments',
  26: 'references',
  27: 'paper-summary',
  28: 'related-work-matrix',
  29: 'method-pipeline',
  30: 'result-highlight',
  31: 'experiment-grid',
  32: 'limitation',
  33: 'defense-question',
  34: 'appendix-index'
}

console.log('🎨 Generating layout screenshots...')
console.log(`📁 Source: ${layoutsEntry}`)
console.log(`📁 Output: ${docsOutDir}`)

// Export all slides as PNG
console.log('\n📸 Exporting slides as PNG...')
await rm(tempOutDir, { recursive: true, force: true })
const result = spawnSync(
  process.execPath,
  [
    slidevCli,
    'export',
    layoutsEntry,
    '--format',
    'png',
    '--output',
    tempOutDir
  ],
  { stdio: 'inherit', cwd: root }
)

if (result.status !== 0) {
  console.error('❌ Export failed')
  process.exit(result.status ?? 1)
}

// Rename and move files
console.log('\n📝 Renaming and organizing files...')
console.log(`📂 Checking directory: ${tempOutDir}`)

try {
  const { allFiles, exportedPngs, mapped, successCount } = await replaceMappedScreenshots({
    tempOutDir,
    docsOutDir,
    mapping: LAYOUTS,
    label: 'layout',
  })

  console.log(`📋 All files in directory:`, allFiles)
  console.log(`🔍 Found ${exportedPngs.length} PNG files:`, exportedPngs)

  for (const item of mapped)
    console.log(`✅ Generated: ${item.outputName}.png (from ${item.sourceName})`)

  console.log(`\n📊 Total generated: ${successCount}/${Object.keys(LAYOUTS).length}`)

} catch (error) {
  console.error('❌ Screenshot generation failed:', error.message)
  console.log('💡 Existing docs screenshots were left untouched unless a complete export was available.')
  process.exit(1)
}

// Clean up temp directory
console.log('\n🧹 Cleaning up temporary files...')
await rm(tempOutDir, { recursive: true, force: true })

console.log('\n✨ Screenshot generation complete!')
console.log(`📁 Files saved to: ${docsOutDir}`)
