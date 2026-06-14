import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const cliPath = path.join(root, 'cli', 'scholarly.mjs')

const failures = []

function runDoctor(files) {
  const dir = mkdtempSync(path.join(tmpdir(), 'scholarly-citation-doctor-'))
  try {
    for (const [name, content] of Object.entries(files)) {
      writeFileSync(path.join(dir, name), content, 'utf8')
    }

    const result = spawnSync(process.execPath, [cliPath, 'doctor'], {
      cwd: dir,
      encoding: 'utf8',
    })

    return {
      status: result.status,
      output: `${result.stdout || ''}${result.stderr || ''}`,
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function expectContains(name, text, needle) {
  if (!text.includes(needle))
    failures.push(`${name} should contain "${needle}"`)
}

function expectStatus(name, status, expected) {
  if (status !== expected)
    failures.push(`${name} should exit with ${expected}, got ${status}`)
}

const ignoredNonCitations = runDoctor({
  'slides.md': `---
theme: scholarly
---

<button @click="count += 1" @keyup.enter="submit">Run</button>

Ignore escaped \\@literal2026, emails person@example.com, and URLs https://example.com/@handle.

\`@inlineCode2026\`

\`\`\`ts
const sample = '@codeBlock2026'
\`\`\`
`,
})

expectStatus('ignored non-citations doctor', ignoredNonCitations.status, 0)
expectContains(
  'ignored non-citations doctor',
  ignoredNonCitations.output,
  'Citation keys: [OK] no citations found',
)

const missingSetup = runDoctor({
  'slides.md': `---
theme: scholarly
---

Missing bibliography setup @missing2026.
`,
})

expectStatus('missing setup doctor', missingSetup.status, 0)
expectContains(
  'missing setup doctor',
  missingSetup.output,
  'Citation setup: [WARN] citations found but no bibFile or references.bib',
)

const missingBibFile = runDoctor({
  'slides.md': `---
theme: scholarly
bibFile: ./missing.bib
---

Configured bibliography file is missing @missing2026.
`,
})

expectStatus('missing bibFile doctor', missingBibFile.status, 0)
expectContains(
  'missing bibFile doctor',
  missingBibFile.output,
  'Citation bibliography: [WARN] missing .bib file: ./missing.bib',
)

const unresolvedAndDuplicate = runDoctor({
  'slides.md': `---
theme: scholarly
bibFile: ./references.bib
---

Resolved @known2026 and unresolved @missing2026 citations.
`,
  'references.bib': `@article{known2026,
  title={Known Paper},
  author={Smith, Alice},
  year={2026}
}

@inproceedings{known2026,
  title={Duplicate Paper},
  author={Lee, Bob},
  year={2026}
}
`,
})

expectStatus('unresolved duplicate doctor', unresolvedAndDuplicate.status, 0)
expectContains(
  'unresolved duplicate doctor',
  unresolvedAndDuplicate.output,
  'Citation bibliography: [WARN] duplicate BibTeX keys: known2026',
)
expectContains(
  'unresolved duplicate doctor',
  unresolvedAndDuplicate.output,
  'Citation keys: [WARN] unresolved citation keys: missing2026',
)

const resolved = runDoctor({
  'slides.md': `---
theme: scholarly
bibFile: ./references.bib
---

Grouped citations @known2026 @other2026 resolve cleanly.

---
layout: references
---
`,
  'references.bib': `@article{known2026,
  title={Known Paper},
  author={Smith, Alice},
  year={2026}
}

@article{other2026,
  title={Other Paper},
  author={Lee, Bob},
  year={2026}
}
`,
})

expectStatus('resolved doctor', resolved.status, 0)
expectContains(
  'resolved doctor',
  resolved.output,
  'Citation keys: [OK] 2 citation keys resolved',
)
expectContains(
  'resolved doctor',
  resolved.output,
  'References slide: [OK] found',
)

if (failures.length) {
  console.error('Citation workflow checks failed:')
  for (const failure of failures)
    console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Citation workflow checks passed.')
