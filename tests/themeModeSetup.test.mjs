import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const mainSetup = await readFile(new URL('../setup/main.ts', import.meta.url), 'utf8')
const themeMatrix = await readFile(new URL('../scripts/check-theme-matrix.mjs', import.meta.url), 'utf8')

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

test('theme mode sync observes Slidev dark state without mutating it', () => {
  const body = extractConstFunctionBody(mainSetup, 'syncThemeModesWithDark')

  assert.match(body, /slidevDark:\s*root\.classList\.contains\('dark'\)/)
  assert.match(body, /data-content-mode/)
  assert.match(body, /data-chrome-mode/)
  assert.match(body, /data-section-mode/)
  assert.doesNotMatch(body, /classList\.toggle\('dark'/)
})

test('theme matrix covers omitted contentMode following Slidev dark state', () => {
  assert.match(themeMatrix, /id: 'follow-slidev-dark'/)
  assert.match(themeMatrix, /colorSchema: 'dark'/)
  assert.match(themeMatrix, /mode\.contentMode \?/)
})
