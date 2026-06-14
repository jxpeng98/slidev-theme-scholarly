import fs from 'node:fs'
import path from 'node:path'

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/
const PROTECTED_BLOCKS_RE = /```[\s\S]*?```|`[^`]*`|<!--[\s\S]*?-->/g
const URL_RE = /https?:\/\/[^\s)>\]]+/g
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
const CITATION_RE = /(?<![A-Za-z0-9])!?\@([A-Za-z][A-Za-z0-9_-]*)/g

function blankMatches(content, pattern) {
  return content.replace(pattern, match => ' '.repeat(match.length))
}

export function extractFrontmatter(content) {
  const match = content.match(FRONTMATTER_RE)
  return match ? match[1] : ''
}

export function extractBibFile(content) {
  const frontmatter = extractFrontmatter(content)
  if (!frontmatter)
    return ''

  const match = frontmatter.match(/^\s*bibFile:\s*(.+?)\s*$/m)
  if (!match)
    return ''

  const raw = match[1].split('#')[0].trim()
  return raw.replace(/^['"]|['"]$/g, '')
}

export function hasReferencesSlide(content) {
  return /^---\r?\n[\s\S]*?^\s*layout:\s*references\s*$/m.test(content)
}

export function collectCitationKeys(content) {
  const keys = []
  const seen = new Set()

  for (const ref of collectCitationReferences(content)) {
    if (seen.has(ref.key))
      continue

    seen.add(ref.key)
    keys.push(ref.key)
  }

  return keys
}

export function collectCitationReferences(content) {
  const stripped = blankMatches(
    blankMatches(
      blankMatches(content, PROTECTED_BLOCKS_RE),
      URL_RE,
    ),
    EMAIL_RE,
  )

  const references = []

  for (const match of stripped.matchAll(CITATION_RE)) {
    const matchStart = match.index || 0
    const matchEnd = matchStart + match[0].length
    const next = stripped.slice(matchEnd)

    if (stripped[matchStart - 1] === '\\' || /^\s*=/.test(next) || /^\.[A-Za-z_$-]/.test(next))
      continue

    const key = match[1].replace(/[.,;:!?)]+$/, '')
    if (!key)
      continue

    references.push({
      key,
      marker: match[0],
      index: matchStart,
    })
  }

  return references
}

export function parseBibEntries(content) {
  const entries = []
  const len = content.length
  let i = 0

  const isWhitespace = ch => /\s/.test(ch)
  const skipWhitespace = () => {
    while (i < len && isWhitespace(content[i])) i += 1
  }
  const readWord = () => {
    const start = i
    while (i < len && /[A-Za-z0-9_-]/.test(content[i])) i += 1
    return content.slice(start, i)
  }
  const readUntil = stopChars => {
    const start = i
    while (i < len && !stopChars.has(content[i])) i += 1
    return content.slice(start, i)
  }
  const skipEnclosedBlock = (open, close) => {
    let depth = 1
    while (i < len) {
      const ch = content[i]
      if (ch === open) depth += 1
      else if (ch === close) depth -= 1
      i += 1
      if (depth === 0) break
    }
  }

  while (i < len) {
    const at = content.indexOf('@', i)
    if (at === -1) break
    i = at + 1

    skipWhitespace()
    const type = readWord().toLowerCase()
    if (!type) {
      i += 1
      continue
    }

    skipWhitespace()
    const open = content[i]
    if (open !== '{' && open !== '(')
      continue

    const close = open === '{' ? '}' : ')'
    i += 1

    if (type === 'comment' || type === 'preamble' || type === 'string') {
      skipEnclosedBlock(open, close)
      continue
    }

    skipWhitespace()
    const key = readUntil(new Set([',', close])).trim()
    if (key)
      entries.push({ key, type })

    skipEnclosedBlock(open, close)
  }

  return entries
}

export function findDuplicateBibKeys(entries) {
  const seen = new Set()
  const duplicates = new Set()

  for (const entry of entries) {
    if (seen.has(entry.key))
      duplicates.add(entry.key)
    else
      seen.add(entry.key)
  }

  return Array.from(duplicates)
}

export function analyzeCitationProject(cwd, slideFile = 'slides.md') {
  const slidePath = path.resolve(cwd, slideFile)
  const hasSlides = fs.existsSync(slidePath)

  if (!hasSlides) {
    return {
      hasSlides: false,
      slideFile,
      citationKeys: [],
      hasReferencesSlide: false,
      bibFile: '',
      bibFilePath: '',
      bibFileSource: 'none',
      bibFileExists: false,
      bibEntryCount: 0,
      duplicateKeys: [],
      unresolvedKeys: [],
      missingSetup: false,
    }
  }

  const content = fs.readFileSync(slidePath, 'utf8')
  const citationKeys = collectCitationKeys(content)
  const configuredBibFile = extractBibFile(content)
  const defaultBibFile = 'references.bib'
  const defaultBibPath = path.resolve(path.dirname(slidePath), defaultBibFile)
  const defaultBibExists = fs.existsSync(defaultBibPath)
  const bibFile = configuredBibFile || (defaultBibExists ? defaultBibFile : '')
  const bibFilePath = bibFile ? path.resolve(path.dirname(slidePath), bibFile) : ''
  const bibFileSource = configuredBibFile ? 'frontmatter' : defaultBibExists ? 'default' : 'none'
  const bibFileExists = Boolean(bibFilePath && fs.existsSync(bibFilePath))
  const missingSetup = citationKeys.length > 0 && !configuredBibFile && !defaultBibExists

  let entries = []
  if (bibFileExists)
    entries = parseBibEntries(fs.readFileSync(bibFilePath, 'utf8'))

  const entryKeys = new Set(entries.map(entry => entry.key))
  const unresolvedKeys = bibFileExists
    ? citationKeys.filter(key => !entryKeys.has(key))
    : []

  return {
    hasSlides: true,
    slideFile,
    citationKeys,
    hasReferencesSlide: hasReferencesSlide(content),
    bibFile,
    bibFilePath,
    bibFileSource,
    bibFileExists,
    bibEntryCount: entries.length,
    duplicateKeys: findDuplicateBibKeys(entries),
    unresolvedKeys,
    missingSetup,
  }
}
