import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const themes = JSON.parse(await readFile(new URL('../shared/themes.json', import.meta.url), 'utf8'))

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

function relativeLuminance(rgb) {
  const [red, green, blue] = rgb
    .map(value => value / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

function parseHex(value) {
  return [1, 3, 5].map(index => Number.parseInt(value.slice(index, index + 2), 16))
}

test('normalizes only supported Scholarly color modes', () => {
  assert.equal(normalizeScholarlyColorMode('light'), 'light')
  assert.equal(normalizeScholarlyColorMode('dark'), 'dark')
  assert.equal(normalizeScholarlyColorMode(' LIGHT '), 'light')
  assert.equal(normalizeScholarlyColorMode('system'), null)
  assert.equal(normalizeScholarlyColorMode(undefined), null)
})

test('explicit light mode preserves an existing Slidev dark class', () => {
  const root = createRoot(['dark'])
  const resolution = resolveScholarlyColorMode('light', root.classList.contains('dark'))

  applyRootColorMode(root, resolution)

  assert.deepEqual(resolution, { mode: 'light', source: 'config' })
  assert.equal(root.getAttribute('data-color-mode'), 'light')
  assert.equal(root.classList.contains('dark'), true)
  assert.equal(root.style.colorScheme, 'light')
})

test('explicit dark mode does not enable the Slidev dark class', () => {
  const root = createRoot()
  const resolution = resolveScholarlyColorMode('dark', root.classList.contains('dark'))

  applyRootColorMode(root, resolution)

  assert.deepEqual(resolution, { mode: 'dark', source: 'config' })
  assert.equal(root.getAttribute('data-color-mode'), 'dark')
  assert.equal(root.classList.contains('dark'), false)
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

test('every palette produces a readable dark-content accent foreground', () => {
  const darkCanvas = parseHex('#0f172a')

  for (const theme of themes.colorThemes) {
    const primaryLight = parseHex(theme.palette.primaryLight)
    const accentForeground = primaryLight.map(channel => Math.round((channel + 255) / 2))
    assert.ok(
      contrastRatio(accentForeground, darkCanvas) >= 4.5,
      `${theme.id} dark accent foreground should meet WCAG AA contrast`,
    )
  }
})
