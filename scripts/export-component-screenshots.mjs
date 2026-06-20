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

// Component configuration
const componentsEntry = path.join(root, 'scripts', 'generate-component-screenshots.md')
const tempOutDir = path.join(tmpdir(), 'slidev-theme-scholarly-component-screenshots')
const docsOutDir = path.join(root, 'docs', 'public', 'images', 'components')

// Component mapping: slide number -> component name.
// Keep this aligned with generate-component-screenshots.md: one slide per exported preview target.
const COMPONENTS = {
  1: 'block',
  2: 'theorem',
  3: 'definition',
  4: 'highlight',
  5: 'steps',
  6: 'columns',
  7: 'keywords',
  8: 'cite',
  9: 'theme-preview',
  10: 'metric-card',
  11: 'metric-grid',
  12: 'evidence-block',
  13: 'equation-block',
  14: 'dataset-card',
  15: 'paper-card',
  16: 'contribution-list',
  17: 'caveat-list'
}

console.log('🎨 Generating component screenshots...')
console.log(`📁 Source: ${componentsEntry}`)
console.log(`📁 Output: ${docsOutDir}`)

// Export all slides as PNG
console.log('\n📸 Exporting slides as PNG...')
await rm(tempOutDir, { recursive: true, force: true })
const result = spawnSync(
  process.execPath,
  [
    slidevCli,
    'export',
    componentsEntry,
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
    mapping: COMPONENTS,
    label: 'component',
  })

  console.log(`📋 All files in directory:`, allFiles)
  console.log(`🔍 Found ${exportedPngs.length} PNG files:`, exportedPngs)

  for (const item of mapped)
    console.log(`✅ Generated: ${item.outputName}.png (from ${item.sourceName})`)

  console.log(`\n📊 Total generated: ${successCount}/${Object.keys(COMPONENTS).length}`)

} catch (error) {
  console.error('❌ Screenshot generation failed:', error.message)
  console.log('💡 Existing docs screenshots were left untouched unless a complete export was available.')
  process.exit(1)
}

// Clean up temp directory
console.log('\n🧹 Cleaning up temporary files...')
await rm(tempOutDir, { recursive: true, force: true })

console.log('\n✨ Component screenshot generation complete!')
console.log(`📁 Files saved to: ${docsOutDir}`)
