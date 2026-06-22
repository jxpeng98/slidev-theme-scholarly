import assert from 'node:assert/strict'
import test from 'node:test'

const {
  applyRootColorMode,
  normalizeScholarlyColorMode,
  resolveScholarlyColorMode,
} = await import('../utils/colorMode.ts').catch((error) => {
  assert.fail(`Expected ../utils/colorMode.ts to export color mode helpers, got ${error.message}`)
})

function createRoot(initialClasses = []) {
  const attributes = new Map()
  const classes = new Set(initialClasses)

  return {
    style: {},
    getAttribute(name) {
      return attributes.get(name) ?? null
    },
    setAttribute(name, value) {
      attributes.set(name, String(value))
    },
    removeAttribute(name) {
      attributes.delete(name)
    },
    classList: {
      add(name) {
        classes.add(name)
      },
      remove(name) {
        classes.delete(name)
      },
      contains(name) {
        return classes.has(name)
      },
      toggle(name, force) {
        if (force) {
          classes.add(name)
          return true
        }
        classes.delete(name)
        return false
      },
    },
  }
}

test('normalizes only supported Scholarly color modes', () => {
  assert.equal(normalizeScholarlyColorMode('light'), 'light')
  assert.equal(normalizeScholarlyColorMode('dark'), 'dark')
  assert.equal(normalizeScholarlyColorMode(' LIGHT '), 'light')
  assert.equal(normalizeScholarlyColorMode('system'), null)
  assert.equal(normalizeScholarlyColorMode(undefined), null)
})

test('explicit light mode overrides an existing Slidev dark class', () => {
  const root = createRoot(['dark'])
  const resolution = resolveScholarlyColorMode('light', root.classList.contains('dark'))

  applyRootColorMode(root, resolution)

  assert.deepEqual(resolution, { mode: 'light', source: 'config' })
  assert.equal(root.getAttribute('data-color-mode'), 'light')
  assert.equal(root.classList.contains('dark'), false)
  assert.equal(root.style.colorScheme, 'light')
})

test('explicit dark mode enables the Slidev dark class', () => {
  const root = createRoot()
  const resolution = resolveScholarlyColorMode('dark', root.classList.contains('dark'))

  applyRootColorMode(root, resolution)

  assert.deepEqual(resolution, { mode: 'dark', source: 'config' })
  assert.equal(root.getAttribute('data-color-mode'), 'dark')
  assert.equal(root.classList.contains('dark'), true)
  assert.equal(root.style.colorScheme, 'dark')
})

test('implicit mode follows Slidev without mutating its dark class', () => {
  const root = createRoot(['dark'])
  const resolution = resolveScholarlyColorMode(undefined, root.classList.contains('dark'))

  applyRootColorMode(root, resolution)

  assert.deepEqual(resolution, { mode: 'dark', source: 'slidev' })
  assert.equal(root.getAttribute('data-color-mode'), 'dark')
  assert.equal(root.classList.contains('dark'), true)
  assert.equal(root.style.colorScheme, '')
})
