import assert from 'node:assert/strict'
import test, { beforeEach } from 'node:test'

globalThis.window = {}

const {
  getTheoremNumber,
  invalidateTheoremNumberMap,
  resetOccurrenceTracker,
} = await import('../utils/theorem.ts').catch((error) => {
  assert.fail(`Expected ../utils/theorem.ts to export theorem numbering helpers, got ${error.message}`)
})

beforeEach(() => {
  invalidateTheoremNumberMap()
})

const slidesWithConsecutiveTheorems = [
  {
    content: `
<Theorem type="theorem" title="First">
First numbered statement.
</Theorem>

<Theorem type="theorem" title="Second">
Second numbered statement.
</Theorem>
`,
  },
]

test('keeps consecutive theorem numbers stable across repeated slide renders', () => {
  assert.deepEqual(
    [
      getTheoremNumber(slidesWithConsecutiveTheorems, 1, 'theorem'),
      getTheoremNumber(slidesWithConsecutiveTheorems, 1, 'theorem'),
      getTheoremNumber(slidesWithConsecutiveTheorems, 1, 'theorem'),
      getTheoremNumber(slidesWithConsecutiveTheorems, 1, 'theorem'),
    ],
    [1, 2, 1, 2],
  )
})

test('continues auto numbers across slides while ignoring manual and disabled numbers', () => {
  const slides = [
    {
      content: `
<Theorem type="theorem" title="First">
First auto-numbered statement.
</Theorem>

<Theorem type="theorem" number="A.1" title="Manual">
Manual references should not consume an auto number.
</Theorem>
`,
    },
    {
      content: `
<Theorem type="theorem" :autoNumber="false" title="Disabled">
Disabled auto numbering should not consume an auto number.
</Theorem>

<Theorem type="theorem" title="Second">
Second auto-numbered statement.
</Theorem>
`,
    },
  ]

  assert.equal(getTheoremNumber(slides, 1, 'theorem'), 1)
  resetOccurrenceTracker(2)
  assert.equal(getTheoremNumber(slides, 2, 'theorem'), 2)
})
