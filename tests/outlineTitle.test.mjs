import assert from 'node:assert/strict'
import test from 'node:test'

const modulePath = '../utils/outlineTitle.ts'
const { sanitizeMarkdownHeadingTitle } = await import(modulePath).catch((error) => {
  assert.fail(`Expected ${modulePath} to export sanitizeMarkdownHeadingTitle, got ${error.message}`)
})

test('removes a trailing Markdown heading id from outline titles', () => {
  assert.equal(
    sanitizeMarkdownHeadingTitle('Foundations {#sec-foundations}'),
    'Foundations',
  )
})

test('keeps ordinary outline titles unchanged', () => {
  assert.equal(
    sanitizeMarkdownHeadingTitle('Literature Review'),
    'Literature Review',
  )
})
