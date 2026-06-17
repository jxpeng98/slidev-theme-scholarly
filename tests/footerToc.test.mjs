import assert from 'node:assert/strict'
import test from 'node:test'

const {
  COMPACT_OUTLINE_ITEM_THRESHOLD,
  countOutlineItems,
  formatSectionRange,
  formatSlideCount,
  shouldUseCompactOutline,
} = await import('../utils/footerToc.ts').catch((error) => {
  assert.fail(`Expected ../utils/footerToc.ts to export footer TOC helpers, got ${error.message}`)
})

test('counts each section and visible slide as outline items', () => {
  const groups = [
    { no: 1, title: 'Opening', active: false, slides: [{ no: 2, title: 'Context', active: false }] },
    {
      no: 5,
      title: 'Methods',
      active: true,
      slides: [
        { no: 6, title: 'Dataset', active: false },
        { no: 7, title: 'Model', active: true },
      ],
    },
  ]

  assert.equal(countOutlineItems(groups), 5)
})

test('enables compact mode only after the threshold is exceeded', () => {
  const groupsAtThreshold = [
    {
      no: 1,
      title: 'Long Section',
      active: false,
      slides: Array.from({ length: COMPACT_OUTLINE_ITEM_THRESHOLD - 1 }, (_, index) => ({
        no: index + 2,
        title: `Slide ${index + 2}`,
        active: false,
      })),
    },
  ]

  const groupsOverThreshold = [
    {
      no: 1,
      title: 'Long Section',
      active: false,
      slides: Array.from({ length: COMPACT_OUTLINE_ITEM_THRESHOLD }, (_, index) => ({
        no: index + 2,
        title: `Slide ${index + 2}`,
        active: false,
      })),
    },
  ]

  assert.equal(shouldUseCompactOutline(groupsAtThreshold), false)
  assert.equal(shouldUseCompactOutline(groupsOverThreshold), true)
})

test('formats section ranges from the next section boundary or total slide count', () => {
  const section = { no: 12, title: 'Results', active: false, slides: [] }
  const nextSection = { no: 25, title: 'Discussion', active: false, slides: [] }
  const finalSection = { no: 25, title: 'Discussion', active: false, slides: [] }

  assert.equal(formatSectionRange(section, nextSection, 40), '12-24')
  assert.equal(formatSectionRange(finalSection, undefined, 40), '25-40')
})

test('formats singular and plural slide counts', () => {
  assert.equal(formatSlideCount(1, 'slide', 'slides'), '1 slide')
  assert.equal(formatSlideCount(13, 'slide', 'slides'), '13 slides')
})
