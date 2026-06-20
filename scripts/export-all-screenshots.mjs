import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const scripts = [
  { name: 'Layout', script: 'export-layout-screenshots.mjs' },
  { name: 'Component', script: 'export-component-screenshots.mjs' },
  { name: 'Theme', script: 'export-theme-images.mjs' }
]

async function runScript(name, scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Running ${name} screenshot generator...`)
    console.log('='.repeat(60))

    const child = spawn(process.execPath, [scriptPath], {
      stdio: 'inherit',
      cwd: root
    })

    child.on('close', code => {
      if (code === 0) {
        console.log(`✅ ${name} screenshots completed`)
        resolve()
      } else {
        console.error(`❌ ${name} screenshots failed with code ${code}`)
        reject(new Error(`${name} failed`))
      }
    })

    child.on('error', err => {
      console.error(`❌ ${name} error:`, err.message)
      reject(err)
    })
  })
}

async function main() {
  console.log('🎨 Generating all preview screenshots...\n')
  console.log('This will generate:')
  console.log('  - Layout screenshots (34 layouts)')
  console.log('  - Component screenshots (17 previews)')
  console.log('  - Theme screenshots (9 themes × 4 slides)')

  let failed = 0

  for (const { name, script } of scripts) {
    const scriptPath = path.join(__dirname, script)
    try {
      await runScript(name, scriptPath)
    } catch {
      failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  if (failed === 0) {
    console.log('✨ All screenshot generation complete!')
  } else {
    console.log(`⚠️  Completed with ${failed} failure(s)`)
  }
  console.log('='.repeat(60))

  console.log('\n📦 To sync to VS Code extension, run:')
  console.log('   cd vscode-extension && pnpm run sync-previews')
}

main().catch(err => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
