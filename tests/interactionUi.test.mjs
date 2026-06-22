import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const files = {
  footerToc: await readFile(new URL('../components/FooterTocControl.vue', import.meta.url), 'utf8'),
  internalAnchors: await readFile(new URL('../utils/internalAnchorNavigation.ts', import.meta.url), 'utf8'),
  mainSetup: await readFile(new URL('../setup/main.ts', import.meta.url), 'utf8'),
  layout: await readFile(new URL('../styles/layout.css', import.meta.url), 'utf8'),
}

test('outline navigation restores presentation focus after closing the panel', () => {
  assert.match(files.footerToc, /const restorePresentationFocus = /)
  assert.match(files.footerToc, /await \$slidev\.nav\.go\(slideNo\)[\s\S]*restorePresentationFocus\(\)/)
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

test('theme color presets are promoted at runtime so Slidev body tokens cannot mask them', () => {
  assert.match(files.mainSetup, /COLOR_THEME_PRESETS/)
  assert.match(files.mainSetup, /applyThemePresetColors/)
  assert.match(files.mainSetup, /document\.body/)
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
