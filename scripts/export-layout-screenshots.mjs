import { spawnSync } from 'node:child_process'
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const slidevCli = path.join(root, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs')

// Layout configuration
const layoutsEntry = path.join(root, 'scripts', 'generate-layout-screenshots.md')
const tempOutDir = path.join(root, 'scripts', 'layout-screenshots')
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
  30: 'result-highlight'
}

console.log('🎨 Generating layout screenshots...')
console.log(`📁 Source: ${layoutsEntry}`)
console.log(`📁 Output: ${docsOutDir}`)

// Export all slides as PNG
console.log('\n📸 Exporting slides as PNG...')
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

// Recreate the output directory so stale screenshots cannot survive a partial export.
await rm(docsOutDir, { recursive: true, force: true })
await mkdir(docsOutDir, { recursive: true })

// Check if export directory exists and create if needed
try {
  await mkdir(tempOutDir, { recursive: true })
} catch (error) {
  console.error('⚠️  Could not create temp directory:', error.message)
}

// Rename and move files
console.log('\n📝 Renaming and organizing files...')
console.log(`📂 Checking directory: ${tempOutDir}`)

try {
  const allFiles = await readdir(tempOutDir)
  console.log(`📋 All files in directory:`, allFiles)

  const exportedPngs = allFiles.filter(name => name.endsWith('.png'))
  console.log(`🔍 Found ${exportedPngs.length} PNG files:`, exportedPngs)

  if (exportedPngs.length === 0) {
    console.log('\n⚠️  No PNG files found. Checking alternative locations...')

    // Check if files might be in a subdirectory
    const possiblePaths = [
      path.join(root, 'layout-screenshots'),
      path.join(tempOutDir),
      path.join(root, 'dist'),
    ]

    for (const possiblePath of possiblePaths) {
      try {
        const files = await readdir(possiblePath)
        const pngs = files.filter(name => name.endsWith('.png'))
        if (pngs.length > 0) {
          console.log(`✅ Found ${pngs.length} PNGs in ${possiblePath}`)
        }
      } catch (e) {
        // Directory doesn't exist, skip
      }
    }

    console.log('\n💡 The Slidev export might not have generated PNG files.')
    console.log('   This could be because:')
    console.log('   1. Playwright browser is not installed')
    console.log('   2. The export format is not supported')
    console.log('   3. Try manual export: cd scripts && npx slidev export --format png generate-layout-screenshots.md')
  }

  let successCount = 0

  for (const [slideNum, layoutName] of Object.entries(LAYOUTS)) {
    // Try different naming patterns
    const possibleNames = [
      `${String(slideNum).padStart(3, '0')}.png`,  // 001.png
      `${String(slideNum).padStart(2, '0')}.png`,  // 01.png
      `${slideNum}.png`,                           // 1.png
      `slide-${slideNum}.png`,                     // slide-1.png
    ]

    let found = false
    for (const tempFile of possibleNames) {
      if (exportedPngs.includes(tempFile)) {
        await cp(
          path.join(tempOutDir, tempFile),
          path.join(docsOutDir, `${layoutName}.png`),
          { force: true }
        )
        console.log(`✅ Generated: ${layoutName}.png (from ${tempFile})`)
        successCount++
        found = true
        break
      }
    }

    if (!found && exportedPngs.length > 0) {
      console.log(`⚠️  Missing: slide ${slideNum} (${layoutName})`)
    }
  }

  if (exportedPngs.length > 0) {
    console.log(`\n📊 Total generated: ${successCount}/${Object.keys(LAYOUTS).length}`)
  }

} catch (error) {
  console.error('❌ Error reading directory:', error.message)
  console.log('💡 The export directory might not exist yet.')
  process.exit(1)
}

// Clean up temp directory
console.log('\n🧹 Cleaning up temporary files...')
await rm(tempOutDir, { recursive: true, force: true })

console.log('\n✨ Screenshot generation complete!')
console.log(`📁 Files saved to: ${docsOutDir}`)
