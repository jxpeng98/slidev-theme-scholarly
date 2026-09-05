import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { renderBuilderMarkdown, renderBuilderSlides } from '../vscode-extension/out/guiBuilderModel.js'
import { BUILDER_TEMPLATES } from '../vscode-extension/out/sharedData.js'

const require = createRequire(import.meta.url)
const slidevRequire = createRequire(require.resolve('@slidev/cli/package.json'))
const { parse } = await import(pathToFileURL(slidevRequire.resolve('@slidev/parser')).href)

for (const { id, deck } of BUILDER_TEMPLATES) {
  const parsed = await parse(renderBuilderMarkdown(deck))
  assert.equal(parsed.slides.length, deck.slides.length, `${id}: generated page count must match the outline`)
  for (const [index, slide] of deck.slides.entries()) {
    assert.equal(parsed.slides[index].frontmatter.layout, slide.layout, `${id}: layout ${index + 1}`)
    const standalone = await parse(renderBuilderSlides([slide], deck.lang))
    assert.equal(parsed.slides[index].content, standalone.slides[0].content, `${id}: content ${index + 1}`)
  }
  assert.ok(parsed.slides[0].content.trim(), `${id}: first slide must contain content`)
  console.log(`${id}: ${parsed.slides.length} pages, matching content and layouts`)
}

const firstSlide = {
  layout: 'two-cols', title: 'First: "findings"', titleKey: 'title', heading: false,
  body: 'Shared content', slots: { left: 'Left evidence', right: 'Right evidence' },
  configSource: 'ratio: "2:3"\nsubtitle: Local subtitle',
  config: { ratio: '1:2' }
}
const deck = {
  title: 'Deck: "research"', subtitle: 'Deck subtitle', colorTheme: 'yale-blue',
  frontmatterSource: 'aspectRatio: 16/9\nbibFile: ./references.bib\nauthors:\n  - name: Researcher\nthemeConfig:\n  outlineToc: false\n  customSetting: preserved\ntitleTemplate: "%s · Research"',
  slides: [firstSlide, { layout: 'default', title: 'Next', body: 'Second content' }]
}
const output = await parse(renderBuilderMarkdown(deck))
assert.equal(output.slides.length, 2)
const head = output.slides[0].frontmatter
assert.equal(head.title, firstSlide.title, 'explicit first-page title takes precedence')
assert.equal(head.titleTemplate, 'Deck: "research" · Research', 'retain the deck title in the browser title')
assert.equal(head.subtitle, 'Local subtitle')
assert.equal(head.ratio, '1:2', 'structured edits override the original layout config')
assert.equal(head.aspectRatio, '16/9')
assert.equal(head.bibFile, './references.bib')
assert.deepEqual(head.authors, [{ name: 'Researcher' }])
assert.equal(head.themeConfig.colorTheme, 'yale-blue')
assert.equal(head.themeConfig.customSetting, 'preserved')
assert.equal(head.themeConfig.outlineToc, false)
assert.match(output.slides[0].content, /::left::\n\nLeft evidence/)
assert.match(output.slides[0].content, /::right::\n\nRight evidence/)
assert.doesNotMatch(renderBuilderSlides([firstSlide]), /theme: scholarly|titleTemplate:/)

const reordered = await parse(renderBuilderMarkdown({ ...deck, slides: [...deck.slides].reverse() }))
assert.equal(reordered.slides.length, 2)
assert.equal(reordered.slides[0].frontmatter.layout, 'default')
assert.match(reordered.slides[0].content, /# Next/)
for (const title of ['"quoted"', "'quoted'", 'a # note', 'true', '2026', 'line\nbreak', '9:30']) {
  const parsed = await parse(renderBuilderMarkdown({
    title, slides: [{ ...firstSlide, title, configSource: '' }],
  }))
  assert.equal(parsed.slides[0].frontmatter.title, title, 'preserve special title characters')
}
assert.throws(
  () => renderBuilderMarkdown({ ...deck, frontmatterSource: 'bibFile: a.bib\nbibFile: b.bib' }),
  /duplicated mapping key/,
)
console.log('Builder output checks passed: templates, arbitrary first page, metadata, slots and standalone insertion.')

for (const config of [{}, { title: undefined }, { title: false }, { heading: false }, { title: 'Agenda' }]) {
  const toc = { layout: 'toc', heading: false, config, body: '', title: '' }
  const rendered = await parse(renderBuilderMarkdown({ title: 'Research deck', slides: [toc] }))
  assert.equal(rendered.slides.length, 1)
  const head = rendered.slides[0].frontmatter
  assert.equal(typeof head.title, 'string', 'Slidev global title remains a string')
  assert.equal(head.heading, config.heading ?? config.title ?? 'Outline')
}
const hiddenTitle = { layout: 'toc', title: 'Outline', titleKey: 'title', heading: false, config: { title: false } }
assert.match(renderBuilderSlides([hiddenTitle]), /title: false/, 'a named Builder page can still hide its visible title')
assert.equal((await parse(renderBuilderMarkdown({ title: '研究报告', lang: 'zh', slides: [{ layout: 'toc', heading: false }] }))).slides[0].frontmatter.heading, '目录')
console.log('TOC first-page checks passed: default, custom, hidden and localized headings.')
