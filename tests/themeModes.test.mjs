import assert from 'node:assert/strict'
import test from 'node:test'

const modes = await import('../utils/themeModes.ts').catch((error) => {
  assert.fail(`Expected ../utils/themeModes.ts to export theme mode helpers, got ${error.message}`)
})

test('normalizes base modes and surface modes', () => {
  assert.equal(modes.normalizeScholarlyMode('light'), 'light')
  assert.equal(modes.normalizeScholarlyMode(' DARK '), 'dark')
  assert.equal(modes.normalizeScholarlyMode('system'), null)
  assert.equal(modes.normalizeScholarlySurfaceMode('match'), 'match')
  assert.equal(modes.normalizeScholarlySurfaceMode('inverse'), 'inverse')
  assert.equal(modes.normalizeScholarlySurfaceMode('auto'), null)
})

test('resolves explicit contentMode before legacy colorMode and Slidev dark state', () => {
  assert.deepEqual(
    modes.resolveScholarlyModes({
      themeConfig: { contentMode: 'light', colorMode: 'dark' },
      slidevDark: true,
    }),
    { contentMode: 'light', chromeMode: 'dark', sectionMode: 'dark', source: 'contentMode' },
  )
})

test('uses legacy colorMode for content and chrome when new modes are absent', () => {
  assert.deepEqual(
    modes.resolveScholarlyModes({
      themeConfig: { colorMode: 'light' },
      slidevDark: true,
    }),
    { contentMode: 'light', chromeMode: 'light', sectionMode: 'dark', source: 'colorMode' },
  )
})

test('defaults content to Slidev dark state and chrome to dark', () => {
  assert.deepEqual(
    modes.resolveScholarlyModes({
      themeConfig: {},
      slidevDark: false,
    }),
    { contentMode: 'light', chromeMode: 'dark', sectionMode: 'dark', source: 'slidev' },
  )
})

test('resolves match and inverse surface modes from content mode', () => {
  assert.deepEqual(
    modes.resolveScholarlyModes({
      themeConfig: { contentMode: 'dark', chromeMode: 'inverse', sectionMode: 'match' },
      slidevDark: false,
    }),
    { contentMode: 'dark', chromeMode: 'light', sectionMode: 'dark', source: 'contentMode' },
  )
})

test('per-slide sectionMode overrides the global section mode', () => {
  assert.equal(
    modes.resolveScholarlySectionMode({
      localSectionMode: 'inverse',
      globalSectionMode: 'match',
      contentMode: 'light',
    }),
    'dark',
  )
})
