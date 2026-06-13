import { spawnSync } from 'node:child_process'
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const slidevCli = path.join(root, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs')

// Component configuration
const componentsEntry = path.join(root, 'scripts', 'generate-component-screenshots.md')
const tempOutDir = path.join(root, 'scripts', 'component-screenshots')
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

// Create docs output directory
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
    console.log('\n⚠️  No PNG files found.')
    console.log('💡 Try manual export: cd scripts && npx slidev export --format png generate-component-screenshots.md')
  }

  let successCount = 0

  for (const [slideNum, componentName] of Object.entries(COMPONENTS)) {
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
          path.join(docsOutDir, `${componentName}.png`),
          { force: true }
        )
        console.log(`✅ Generated: ${componentName}.png (from ${tempFile})`)
        successCount++
        found = true
        break
      }
    }

    if (!found && exportedPngs.length > 0) {
      console.log(`⚠️  Missing: slide ${slideNum} (${componentName})`)
    }
  }

  if (exportedPngs.length > 0) {
    console.log(`\n📊 Total generated: ${successCount}/${Object.keys(COMPONENTS).length}`)
  }

} catch (error) {
  console.error('❌ Error reading directory:', error.message)
  console.log('💡 The export directory might not exist yet.')
  process.exit(1)
}

// Clean up temp directory
console.log('\n🧹 Cleaning up temporary files...')
await rm(tempOutDir, { recursive: true, force: true })

console.log('\n✨ Component screenshot generation complete!')
console.log(`📁 Files saved to: ${docsOutDir}`)
