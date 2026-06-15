const VENUE_FIELDS = ['journal', 'booktitle', 'publisher', 'school', 'institution']
const REQUIRED_METADATA_FIELDS = ['title', 'authors', 'year', 'venue']

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function stripOuterBraces(value) {
  let text = String(value || '')
  let changed = true

  while (changed) {
    changed = false
    text = text.replace(/\{([^{}]*)\}/g, '$1')
    if (text.includes('{') || text.includes('}')) {
      const next = text.replace(/[{}]/g, '')
      changed = next !== text
      text = next
    }
  }

  return text
}

function cleanupLatex(value) {
  return normalizeWhitespace(
    stripOuterBraces(value)
      .replace(/\\[`'^"~=cHkruv]\s*\{?([A-Za-z])\}?/g, '$1')
      .replace(/\\[A-Za-z]+\s*\{([^{}]*)\}/g, '$1')
      .replace(/\\([#$%&_{}])/g, '$1')
      .replace(/[{}]/g, ''),
  )
}

function splitAuthors(value) {
  const text = cleanupLatex(value)
  if (!text)
    return []

  return text.split(/\s+and\s+/i).map(author => {
    const parts = author.split(',').map(part => normalizeWhitespace(part)).filter(Boolean)
    if (parts.length >= 2)
      return normalizeWhitespace(`${parts.slice(1).join(' ')} ${parts[0]}`)
    return normalizeWhitespace(author)
  }).filter(Boolean)
}

function escapeYamlScalar(value) {
  const text = String(value || '')
  if (!text)
    return '""'

  if (/[:#\[\]{}&*!|>'"%@`]|^\s|\s$/.test(text))
    return JSON.stringify(text)

  return text
}

function escapeVueAttribute(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function createBibParser(content) {
  const text = String(content || '')
  const len = text.length
  let i = 0
  const macros = new Map()

  const isWhitespace = ch => /\s/.test(ch)
  const skipWhitespace = () => {
    while (i < len && isWhitespace(text[i])) i += 1
  }
  const readWord = () => {
    const start = i
    while (i < len && /[A-Za-z0-9_:-]/.test(text[i])) i += 1
    return text.slice(start, i)
  }
  const readUntil = stopChars => {
    const start = i
    while (i < len && !stopChars.has(text[i])) i += 1
    return text.slice(start, i)
  }
  const skipEnclosedBlock = (open, close) => {
    let depth = 1
    let inQuote = false
    let escaped = false

    while (i < len) {
      const ch = text[i]

      if (escaped) {
        escaped = false
        i += 1
        continue
      }

      if (ch === '\\') {
        escaped = true
        i += 1
        continue
      }

      if (ch === '"') {
        inQuote = !inQuote
        i += 1
        continue
      }

      if (!inQuote) {
        if (ch === open) depth += 1
        else if (ch === close) depth -= 1
      }

      i += 1
      if (depth === 0) break
    }
  }
  const parseBraceValue = () => {
    i += 1
    let value = ''
    let depth = 1
    let escaped = false

    while (i < len) {
      const ch = text[i]

      if (escaped) {
        value += ch
        escaped = false
        i += 1
        continue
      }

      if (ch === '\\') {
        value += ch
        escaped = true
        i += 1
        continue
      }

      if (ch === '{') {
        depth += 1
        value += ch
        i += 1
        continue
      }

      if (ch === '}') {
        depth -= 1
        if (depth === 0) {
          i += 1
          break
        }
        value += ch
        i += 1
        continue
      }

      value += ch
      i += 1
    }

    return value
  }
  const parseQuotedValue = () => {
    i += 1
    let value = ''
    let escaped = false

    while (i < len) {
      const ch = text[i]

      if (escaped) {
        value += ch
        escaped = false
        i += 1
        continue
      }

      if (ch === '\\') {
        value += ch
        escaped = true
        i += 1
        continue
      }

      if (ch === '"') {
        i += 1
        break
      }

      value += ch
      i += 1
    }

    return value
  }
  const parseValueToken = entryClose => {
    skipWhitespace()
    if (i >= len)
      return ''

    const ch = text[i]
    if (ch === '{')
      return parseBraceValue()
    if (ch === '"')
      return parseQuotedValue()

    const raw = readUntil(new Set([',', '#', entryClose]))
    const token = raw.trim()
    return macros.get(token.toLowerCase()) || token
  }
  const parseValue = entryClose => {
    const parts = [parseValueToken(entryClose)]
    skipWhitespace()
    while (i < len && text[i] === '#') {
      i += 1
      parts.push(parseValueToken(entryClose))
      skipWhitespace()
    }

    return cleanupLatex(parts.join(''))
  }
  const parseFields = close => {
    const fields = {}

    while (i < len) {
      skipWhitespace()
      if (i >= len)
        break

      if (text[i] === ',') {
        i += 1
        continue
      }

      if (text[i] === close) {
        i += 1
        break
      }

      const fieldName = readWord().toLowerCase()
      if (!fieldName) {
        i += 1
        continue
      }

      skipWhitespace()
      if (text[i] !== '=') {
        i += 1
        continue
      }

      i += 1
      const fieldValue = parseValue(close)
      if (fieldValue)
        fields[fieldName] = fieldValue
    }

    return fields
  }
  const parseStringMacro = close => {
    skipWhitespace()
    const name = readWord().toLowerCase()
    skipWhitespace()
    if (!name || text[i] !== '=') {
      skipEnclosedBlock(close === '}' ? '{' : '(', close)
      return
    }

    i += 1
    const value = parseValue(close)
    if (value)
      macros.set(name, value)

    while (i < len && text[i] !== close) i += 1
    if (text[i] === close) i += 1
  }

  return {
    parse() {
      const entries = []

      while (i < len) {
        const at = text.indexOf('@', i)
        if (at === -1) break
        i = at + 1

        skipWhitespace()
        const type = readWord().toLowerCase()
        if (!type) {
          i += 1
          continue
        }

        skipWhitespace()
        const open = text[i]
        if (open !== '{' && open !== '(')
          continue

        const close = open === '{' ? '}' : ')'
        i += 1

        if (type === 'comment' || type === 'preamble') {
          skipEnclosedBlock(open, close)
          continue
        }

        if (type === 'string') {
          parseStringMacro(close)
          continue
        }

        skipWhitespace()
        const key = readUntil(new Set([',', close])).trim()
        if (i < len && text[i] === ',') i += 1
        const fields = parseFields(close)
        if (key)
          entries.push({ key, type, fields })
      }

      return entries
    },
  }
}

export function parseBibEntries(content) {
  return createBibParser(content).parse()
}

export function findBibEntry(entries, key) {
  return entries.find(entry => entry.key === key) || null
}

export function extractPaperMetadata(entry) {
  if (!entry) {
    return {
      key: '',
      type: '',
      title: '',
      authors: [],
      year: '',
      venue: '',
      doi: '',
      url: '',
    }
  }

  const fields = entry.fields || {}
  const venueField = VENUE_FIELDS.find(field => fields[field])

  return {
    key: entry.key,
    type: entry.type,
    title: cleanupLatex(fields.title || ''),
    authors: splitAuthors(fields.author || fields.editor || ''),
    year: cleanupLatex(fields.year || fields.date || ''),
    venue: venueField ? cleanupLatex(fields[venueField]) : '',
    doi: cleanupLatex(fields.doi || ''),
    url: cleanupLatex(fields.url || fields.eprint || ''),
  }
}

export function buildPaperMetadataWarnings(metadata) {
  const warnings = []
  for (const field of REQUIRED_METADATA_FIELDS) {
    const value = metadata[field]
    if (Array.isArray(value) ? value.length === 0 : !value)
      warnings.push(`Missing ${field} for BibTeX key "${metadata.key || '(unknown)'}".`)
  }
  return warnings
}

export function renderPaperMarkdown(metadata, options = {}) {
  const layout = options.layout || 'paper-summary'
  if (layout === 'paper-card')
    return renderPaperCardMarkdown(metadata)
  if (layout === 'paper-summary')
    return renderPaperSummaryMarkdown(metadata)
  throw new Error(`Unknown paper layout: ${layout}`)
}

function renderPaperSummaryMarkdown(metadata) {
  const lines = [
    '---',
    'layout: paper-summary',
    `paperTitle: ${escapeYamlScalar(metadata.title || 'Untitled Paper')}`,
  ]

  if (metadata.authors.length) {
    lines.push('authors:')
    for (const author of metadata.authors)
      lines.push(`  - ${escapeYamlScalar(author)}`)
  } else {
    lines.push('authors: []')
  }

  lines.push(`year: ${escapeYamlScalar(metadata.year || '')}`)
  lines.push(`venue: ${escapeYamlScalar(metadata.venue || '')}`)
  if (metadata.doi)
    lines.push(`doi: ${escapeYamlScalar(metadata.doi)}`)
  if (metadata.url)
    lines.push(`url: ${escapeYamlScalar(metadata.url)}`)
  lines.push('---')
  lines.push('')
  lines.push('::problem')
  lines.push('- Add the paper problem or research question.')
  lines.push('::')
  lines.push('')
  lines.push('::method')
  lines.push('- Add the method or study design.')
  lines.push('::')
  lines.push('')
  lines.push('::finding')
  lines.push('- Add the key result or takeaway.')
  lines.push('::')

  return `${lines.join('\n')}\n`
}

function renderPaperCardMarkdown(metadata) {
  const attrs = [
    `title="${escapeVueAttribute(metadata.title || 'Untitled Paper')}"`,
  ]

  if (metadata.authors.length)
    attrs.push(`:authors='${JSON.stringify(metadata.authors).replace(/'/g, '&apos;')}'`)
  if (metadata.venue)
    attrs.push(`venue="${escapeVueAttribute(metadata.venue)}"`)
  if (metadata.year)
    attrs.push(`year="${escapeVueAttribute(metadata.year)}"`)
  if (metadata.doi)
    attrs.push(`doi="${escapeVueAttribute(metadata.doi)}"`)
  if (metadata.url)
    attrs.push(`url="${escapeVueAttribute(metadata.url)}"`)

  return `<PaperCard\n  ${attrs.join('\n  ')}\n>\n\nAdd the main contribution or discussion notes.\n\n</PaperCard>\n`
}
