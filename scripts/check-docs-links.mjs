import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Inspect VitePress's emitted HTML, so navigation, locale links and generated
// heading IDs are checked along with links authored in Markdown.
const root = fileURLToPath(new URL('../docs/.vitepress/dist/', import.meta.url))
const files = await fs.readdir(root, { recursive: true })
const pages = new Map()
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = await fs.readFile(path.join(root, file), 'utf8')
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => decode(match[1])))
  pages.set(file.replaceAll(path.sep, '/'), { html, ids })
}
assert.ok(pages.has('en/index.html') && pages.has('zh/index.html'), 'Build the localized docs before checking links')
assert.ok(![...pages.keys()].some(file => file.startsWith('superpowers/')), 'Internal plans must stay outside the website')

const failures = []
let checked = 0
for (const [file, { html }] of pages) {
  const route = file.replace(/index\.html$/, '').replace(/\.html$/, '')
  for (const match of html.matchAll(/<(a|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
    const [, tag, value] = match
    const url = new URL(decode(value), `https://docs.local/${route}`)
    if (url.origin !== 'https://docs.local') continue
    const target = decodeURIComponent(url.pathname).slice(1)
    const candidates = [target, `${target}.html`, `${target.replace(/\/$/, '')}/index.html`]
    if (!target) candidates.push('index.html')
    const page = candidates.map(candidate => pages.get(candidate)).find(Boolean)
    try {
      if (tag === 'a' && page) {
        const id = decodeURIComponent(url.hash.slice(1))
        assert.ok(!id || page.ids.has(id), `Missing anchor: ${value}`)
      } else {
        assert.ok(target && !target.startsWith('../'), `Invalid asset path: ${value}`)
        assert.ok((await fs.stat(path.join(root, target))).isFile(), `Missing file: ${value}`)
      }
      checked += 1
    } catch (error) {
      failures.push(`${file}: ${error.message}`)
    }
  }
}
assert.equal(failures.length, 0, failures.join('\n'))
console.log(`Documentation links passed: ${pages.size} HTML pages, ${checked} local links and images.`)
