import assert from 'node:assert/strict'
import test from 'node:test'

const modulePath = '../utils/scrollArea.ts'
const { hasVerticalOverflow, isVerticalScrollOverflowMode } = await import(modulePath).catch((error) => {
  assert.fail(`Expected ${modulePath} to export hasVerticalOverflow, got ${error.message}`)
})

test('does not require vertical scrolling when content fits', () => {
  assert.equal(hasVerticalOverflow({ clientHeight: 655, scrollHeight: 655 }), false)
})

test('ignores one-pixel measurement noise', () => {
  assert.equal(hasVerticalOverflow({ clientHeight: 655, scrollHeight: 656 }), false)
})

test('requires vertical scrolling when content exceeds the viewport area', () => {
  assert.equal(hasVerticalOverflow({ clientHeight: 655, scrollHeight: 670 }), true)
})

test('detects overflow modes that can produce vertical scrollbars', () => {
  assert.equal(isVerticalScrollOverflowMode('auto'), true)
  assert.equal(isVerticalScrollOverflowMode('scroll'), true)
  assert.equal(isVerticalScrollOverflowMode('overlay'), true)
  assert.equal(isVerticalScrollOverflowMode('visible'), false)
  assert.equal(isVerticalScrollOverflowMode('hidden'), false)
})
