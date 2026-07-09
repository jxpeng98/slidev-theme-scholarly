import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const files = {
  footerToc: await readFile(new URL('../components/FooterTocControl.vue', import.meta.url), 'utf8'),
  internalAnchors: await readFile(new URL('../utils/internalAnchorNavigation.ts', import.meta.url), 'utf8'),
  mainSetup: await readFile(new URL('../setup/main.ts', import.meta.url), 'utf8'),
  layout: await readFile(new URL('../styles/layout.css', import.meta.url), 'utf8'),
  colorThemes: await readFile(new URL('../styles/themes/colors.css', import.meta.url), 'utf8'),
  sectionLayout: await readFile(new URL('../layouts/section.vue', import.meta.url), 'utf8'),
  contentMode: await readFile(new URL('../styles/themes/content-mode.css', import.meta.url), 'utf8'),
  themeMode: await readFile(new URL('../styles/themes/mode.css', import.meta.url), 'utf8'),
}

function extractConstFunctionBody(source, name) {
  const start = source.indexOf(`const ${name} =`)
  assert.notEqual(start, -1, `Expected ${name} to be defined`)

  const openBrace = source.indexOf('{', source.indexOf('=>', start))
  assert.notEqual(openBrace, -1, `Expected ${name} to have a function body`)

  let depth = 0
  for (let i = openBrace; i < source.length; i++) {
    if (source[i] === '{')
      depth++
    else if (source[i] === '}')
      depth--

    if (depth === 0)
      return source.slice(openBrace + 1, i)
  }

  assert.fail(`Expected ${name} function body to close`)
}

test('outline navigation restores presentation focus after closing the panel', () => {
  const navigateToSlideBody = extractConstFunctionBody(files.footerToc, 'navigateToSlide')
  assert.match(files.footerToc, /const restorePresentationFocus = /)
  assert.match(navigateToSlideBody, /await \$slidev\.nav\.go\(slideNo\)[\s\S]*restorePresentationFocus\(\)/)
})

test('closing the outline panel after slide preview restores presentation focus', () => {
  const closePanelBody = extractConstFunctionBody(files.footerToc, 'closePanel')
  const togglePanelBody = extractConstFunctionBody(files.footerToc, 'togglePanel')

  assert.match(closePanelBody, /await restorePresentationFocus\(\)/)
  assert.match(togglePanelBody, /if \(isOpen\.value\) \{[\s\S]*await closePanel\(\)[\s\S]*return/)
})

test('outline collapse control uses an icon-only toggle with accessible state', () => {
  assert.match(files.footerToc, /class="footer-toc-section-toggle"/)
  assert.match(files.footerToc, /class="footer-toc-section-toggle-icon"/)
  assert.match(files.footerToc, /:aria-expanded="isSectionExpanded\(section\) \? 'true' : 'false'"/)
  assert.match(files.footerToc, /labels\.collapseSection : labels\.expandSection/)
  assert.doesNotMatch(files.footerToc, /footer-toc-section-toggle-hitbox/)
  assert.doesNotMatch(files.footerToc, /footer-toc-section-toggle-label/)
  assert.doesNotMatch(files.footerToc, /labels\.expanded/)
  assert.doesNotMatch(files.footerToc, /labels\.collapsed/)
})

test('reference navigation provides a local return popover near highlighted targets', () => {
  assert.match(files.internalAnchors, /ANCHOR_RETURN_POPOVER_CLASS/)
  assert.match(files.internalAnchors, /showReturnPopoverNearElement/)
  assert.match(files.internalAnchors, /goBackToAnchorSource/)
  assert.match(files.layout, /\.scholarly-anchor-return-popover/)
})

test('footnotes use dedicated readable tokens instead of blending with slide backgrounds', () => {
  for (const token of [
    '--scholarly-footnote-fg',
    '--scholarly-footnote-link-fg',
    '--scholarly-footnote-popover-bg',
    '--scholarly-footnote-popover-fg',
    '--scholarly-footnote-popover-border',
  ]) {
    assert.match(files.layout, new RegExp(token))
  }
})

test('theme color presets have one CSS source while runtime only applies custom overrides', () => {
  assert.doesNotMatch(files.mainSetup, /COLOR_THEME_PRESETS/)
  assert.match(files.mainSetup, /applyThemePresetColors/)
  assert.match(files.mainSetup, /normalizeThemeColorValue\(customColors\?\.\[key\]\)/)
  assert.match(files.mainSetup, /document\.body/)
  assert.match(files.colorThemes, /:root\[data-color-theme="classic-blue"\]/)
  assert.match(files.colorThemes, /--slidev-theme-primary:\s*#1e3a5f/)
})

test('route navigation does not rebuild the full internal anchor registry', () => {
  const afterEachMatch = files.mainSetup.match(/router\.afterEach\(\(to\) => \{([\s\S]*?)\n  \}\)/)
  assert.ok(afterEachMatch, 'Expected setup/main.ts to register router.afterEach')
  assert.doesNotMatch(afterEachMatch[1], /rebuildInternalAnchorTargets\(\)/)
})

test('footer outline slide previews are lazy loaded', () => {
  assert.match(files.footerToc, /defineAsyncComponent/)
  assert.match(files.footerToc, /import\('\.\/FooterTocPreviewCard\.vue'\)/)
  assert.match(files.footerToc, /v-if="previewVisible"/)
  assert.doesNotMatch(files.footerToc, /import FooterTocPreviewCard from '\.\/FooterTocPreviewCard\.vue'/)
})

test('explicit theme modes sync content chrome and section attributes', () => {
  assert.match(files.mainSetup, /resolveScholarlyModes/)
  assert.match(files.mainSetup, /data-content-mode/)
  assert.match(files.mainSetup, /data-chrome-mode/)
  assert.match(files.mainSetup, /data-section-mode/)
  assert.match(files.mainSetup, /data-color-mode/)
  assert.doesNotMatch(files.mainSetup, /if \(config\?\.colorMode\) return/)
})

test('content mode selects matching Shiki colors without owning Slidev dark state', () => {
  assert.match(files.contentMode, /:root\[data-content-mode="light"\] \.shiki/)
  assert.match(files.contentMode, /color:\s*var\(--shiki-light/)
  assert.match(files.contentMode, /:root\[data-content-mode="dark"\] \.shiki/)
  assert.match(files.contentMode, /color:\s*var\(--shiki-dark/)
})

test('mode compatibility entrypoint imports split content and chrome token files', () => {
  assert.match(files.themeMode, /@import '\.\/content-mode\.css';/)
  assert.match(files.themeMode, /@import '\.\/chrome-mode\.css';/)
  assert.doesNotMatch(files.themeMode, /--scholarly-content-surface:/)
  assert.doesNotMatch(files.themeMode, /--scholarly-chrome-bg:/)
})

test('base layout consumes resolved canvas mode tokens', () => {
  assert.match(files.layout, /color:\s*var\(--scholarly-canvas-fg,\s*var\(--scholarly-text-primary\)\)/)
  assert.match(files.layout, /background-color:\s*var\(--scholarly-canvas-bg,\s*var\(--scholarly-bg-warm\)\)/)
})

test('section layout resolves surface mode through shared theme mode helpers', () => {
  assert.match(files.sectionLayout, /useDarkMode/)
  assert.match(files.sectionLayout, /const \{ isDark \} = useDarkMode\(\)/)
  assert.match(files.sectionLayout, /resolveScholarlySectionMode/)
  assert.match(files.sectionLayout, /resolveScholarlyModes/)
  assert.match(files.sectionLayout, /slidevDark:\s*isDark\.value/)
  assert.doesNotMatch(files.sectionLayout, /document\.documentElement\.classList\.contains\('dark'\)/)
  assert.doesNotMatch(files.sectionLayout, /localMode === 'light' \|\| localMode === 'dark'/)
})
