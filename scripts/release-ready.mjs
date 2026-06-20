import { spawnSync } from 'node:child_process'
import process from 'node:process'

const fullVisual = process.env.SCHOLARLY_FULL_VISUAL === '1' || process.argv.includes('--visual')

const steps = [
  {
    name: 'Color mode and semantic token contract',
    command: ['node', 'scripts/check-color-mode-styles.mjs'],
  },
  {
    name: 'Academic layout pack contract',
    command: ['node', 'scripts/check-academic-layout-pack.mjs'],
  },
  {
    name: 'Academic component contract',
    command: ['node', 'scripts/check-academic-components.mjs'],
  },
  {
    name: 'Citation workflow contract',
    command: ['node', 'scripts/check-citation-workflow.mjs'],
  },
  {
    name: 'Paper metadata and BibTeX contract',
    command: ['node', 'scripts/check-paper-metadata.mjs'],
  },
  {
    name: 'VS Code citation diagnostics contract',
    command: ['node', 'scripts/check-vscode-citation-diagnostics.mjs'],
  },
  {
    name: 'VS Code metadata and preview sync contract',
    command: ['node', 'scripts/check-vscode-metadata-previews.mjs'],
  },
  {
    name: 'VS Code preview prompt contract',
    command: ['node', 'scripts/check-vscode-preview-prompts.mjs'],
  },
  {
    name: 'Curated template contract',
    command: ['node', 'scripts/check-curated-templates.mjs'],
  },
  {
    name: 'CLI doctor actionability contract',
    command: ['node', 'scripts/check-doctor-actionable.mjs'],
  },
  {
    name: 'Documentation workflow IA contract',
    command: ['node', 'scripts/check-docs-workflows.mjs'],
  },
  {
    name: 'Data-driven result contract',
    command: ['node', 'scripts/check-data-driven-results.mjs'],
  },
  {
    name: 'Theorem numbering regression contract',
    command: ['node', '--test', 'tests/theoremNumbering.test.mjs'],
  },
  {
    name: 'Screenshot export safety contract',
    command: ['node', '--test', 'tests/screenshotExport.test.mjs'],
  },
  {
    name: 'Documentation build',
    command: ['pnpm', 'run', 'docs:build'],
  },
  {
    name: 'CLI doctor',
    command: ['node', 'cli/scholarly.mjs', 'doctor'],
  },
  {
    name: 'VS Code extension compile',
    command: ['pnpm', 'run', 'vscode:compile'],
  },
]

if (fullVisual) {
  steps.push({
    name: 'Theme matrix visual export',
    command: ['node', 'scripts/check-theme-matrix.mjs'],
  })
} else {
  steps.push({
    name: 'Theme matrix dry run',
    command: ['node', 'scripts/check-theme-matrix.mjs', '--dry-run'],
  })
}

for (const step of steps) {
  const [cmd, ...args] = step.command
  console.log(`\n[release-ready] ${step.name}`)
  console.log(`[release-ready] $ ${step.command.join(' ')}`)

  const result = spawnSync(cmd, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status !== 0)
    process.exit(result.status ?? 1)

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }
}

console.log('\n[release-ready] All checks passed.')
