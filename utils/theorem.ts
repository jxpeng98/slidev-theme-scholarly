export const THEOREM_TYPES = ['theorem', 'lemma', 'proposition', 'corollary', 'definition', 'example', 'remark', 'proof', 'note', 'claim'] as const

export type TheoremType = typeof THEOREM_TYPES[number]
export type TheoremCounters = Record<TheoremType, number>

const NO_NUMBER_TYPES = new Set<TheoremType>(['proof', 'note'])
const THEOREM_TAG_REGEX = /<Theorem(?:\s[^>]*)?\/?>/gi
const THEOREM_DIRECTIVE_REGEX = /^[ \t]*:::theorem(?:\{([^\n]*)\})?[ \t]*$/gm
const TYPE_ATTR_REGEX = /\btype\s*=\s*["']([^"']+)["']/i
const NUMBER_ATTR_REGEX = /(?:^|\s):?number\s*=/i
const AUTO_NUMBER_DISABLED_REGEX = /(?:^|\s):?auto-?number\s*=\s*(?:"(?:false|0)"|'(?:false|0)'|false|0)/i

type SlideLike = {
  content?: string
  source?: {
    content?: string
    contentRaw?: string
  }
  meta?: {
    slide?: {
      content?: string
    }
  }
}

type TheoremNumberMap = Map<number, Map<TheoremType, number[]>>

interface TheoremMapCache {
  fingerprint: string
  map: TheoremNumberMap
}

const createEmptyCounters = (): TheoremCounters => ({
  theorem: 0,
  lemma: 0,
  proposition: 0,
  corollary: 0,
  definition: 0,
  example: 0,
  remark: 0,
  proof: 0,
  note: 0,
  claim: 0,
})

const resetTheoremState = (): void => {
  const win = getWindowState()
  if (!win)
    return

  delete win.__theoremMapCache
  win.__theoremOccurrenceTracker?.clear()
}

const getWindowState = () => {
  if (typeof window === 'undefined')
    return null

  return window as Window & {
    __theoremMapCache?: TheoremMapCache
    __theoremOccurrenceTracker?: Map<string, number>
  }
}

const getSlideContent = (slide: SlideLike): string => {
  return slide?.meta?.slide?.content ?? slide?.source?.contentRaw ?? slide?.source?.content ?? slide?.content ?? ''
}

const normalizeTheoremType = (rawType?: string): TheoremType => {
  const candidate = (rawType ?? 'theorem').trim().toLowerCase() as TheoremType
  return THEOREM_TYPES.includes(candidate) ? candidate : 'theorem'
}

const shouldCountForAutoNumbering = (attrs: string, type: TheoremType): boolean => {
  if (NO_NUMBER_TYPES.has(type))
    return false
  if (NUMBER_ATTR_REGEX.test(attrs))
    return false
  if (AUTO_NUMBER_DISABLED_REGEX.test(attrs))
    return false
  return true
}

const stripProtectedBlocks = (content: string): string => {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
}

const collectTheoremMatches = (content: string): Array<{ type: TheoremType; index: number }> => {
  const matches: Array<{ type: TheoremType; index: number }> = []
  const cleanedContent = stripProtectedBlocks(content)

  THEOREM_TAG_REGEX.lastIndex = 0
  THEOREM_DIRECTIVE_REGEX.lastIndex = 0

  let match: RegExpExecArray | null

  while ((match = THEOREM_TAG_REGEX.exec(cleanedContent)) !== null) {
    const attrs = match[0]
    const type = normalizeTheoremType(TYPE_ATTR_REGEX.exec(attrs)?.[1])
    if (shouldCountForAutoNumbering(attrs, type))
      matches.push({ type, index: match.index })
  }

  while ((match = THEOREM_DIRECTIVE_REGEX.exec(cleanedContent)) !== null) {
    const attrs = match[1] ?? ''
    const type = normalizeTheoremType(TYPE_ATTR_REGEX.exec(attrs)?.[1])
    if (shouldCountForAutoNumbering(attrs, type))
      matches.push({ type, index: match.index })
  }

  matches.sort((left, right) => left.index - right.index)
  return matches
}

const hashContent = (content: string): string => {
  let hash = 2166136261
  for (let index = 0; index < content.length; index++) {
    hash ^= content.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

const buildFingerprint = (slides: SlideLike[]): string => {
  return `${slides.length}:${slides.map((slide) => {
    const content = getSlideContent(slide)
    return `${content.length}-${hashContent(content)}`
  }).join('|')}`
}

const buildTheoremNumberMap = (slides: SlideLike[]): TheoremNumberMap => {
  const result: TheoremNumberMap = new Map()
  const globalCounters = createEmptyCounters()

  for (let index = 0; index < slides.length; index++) {
    const slideNo = index + 1
    const slideMatches = collectTheoremMatches(getSlideContent(slides[index]))

    if (!slideMatches.length)
      continue

    const slideNumbers = new Map<TheoremType, number[]>()

    for (const match of slideMatches) {
      globalCounters[match.type] += 1

      if (!slideNumbers.has(match.type))
        slideNumbers.set(match.type, [])

      slideNumbers.get(match.type)!.push(globalCounters[match.type])
    }

    result.set(slideNo, slideNumbers)
  }

  return result
}

const getCachedMap = (slides: SlideLike[]): TheoremNumberMap => {
  const win = getWindowState()
  if (!win)
    return new Map()

  const fingerprint = buildFingerprint(slides)
  if (win.__theoremMapCache?.fingerprint === fingerprint)
    return win.__theoremMapCache.map

  const map = buildTheoremNumberMap(slides)
  win.__theoremMapCache = { fingerprint, map }
  return map
}

const getOccurrenceTracker = (): Map<string, number> => {
  const win = getWindowState()
  if (!win)
    return new Map()

  if (!win.__theoremOccurrenceTracker)
    win.__theoremOccurrenceTracker = new Map<string, number>()

  return win.__theoremOccurrenceTracker
}

export const getOccurrenceIndex = (slideNo: number, type: TheoremType): number => {
  const tracker = getOccurrenceTracker()
  const key = `${slideNo}-${type}`
  const index = tracker.get(key) ?? 0
  tracker.set(key, index + 1)
  return index
}

export const lookupTheoremNumber = (
  slides: SlideLike[],
  slideNo: number,
  type: TheoremType,
  occurrenceIndex: number,
): number => {
  if (NO_NUMBER_TYPES.has(type))
    return 0
  if (!slides?.length)
    return 0

  const map = getCachedMap(slides)
  const slideMap = map.get(slideNo)
  const numbers = slideMap?.get(type)

  if (!numbers?.length)
    return 0

  if (occurrenceIndex < 0)
    return 0

  // Slidev can mount the same slide more than once for previews, export, or HMR.
  // Keep each render pass on the slide's own occurrence sequence instead of
  // falling through to the final number after the first pass.
  return numbers[occurrenceIndex % numbers.length] ?? 0
}

export function getTheoremNumber(slides: SlideLike[], slideNo: number, type: TheoremType): number
export function getTheoremNumber(type: TheoremType): number
export function getTheoremNumber(slidesOrType: SlideLike[] | TheoremType, slideNo?: number, type?: TheoremType): number {
  if (Array.isArray(slidesOrType) && typeof slideNo === 'number' && type) {
    const occurrenceIndex = getOccurrenceIndex(slideNo, type)
    return lookupTheoremNumber(slidesOrType, slideNo, type, occurrenceIndex)
  }

  return 0
}

export const resetOccurrenceTracker = (slideNo?: number): void => {
  const tracker = getOccurrenceTracker()

  if (slideNo === undefined) {
    tracker.clear()
    return
  }

  for (const key of tracker.keys()) {
    if (key.startsWith(`${slideNo}-`))
      tracker.delete(key)
  }
}

export const invalidateTheoremNumberMap = (): void => {
  resetTheoremState()
}

// Legacy compatibility shims.
// The old global mutable counter model no longer exists; numbering now depends on
// slide order plus the per-slide occurrence claimed at render time. We keep these
// exports so external imports do not break, but route them to the new state model
// where that makes sense.
export const snapshotTheoremCounters = (): TheoremCounters => createEmptyCounters()
export const restoreTheoremCounters = (_snapshot?: Partial<TheoremCounters>): void => {}
export const prepareTheoremCountersForRoute = (_routePath?: string): void => {
  resetOccurrenceTracker()
}
export const invalidateTheoremCounterBases = (_keepPath?: string): void => {
  resetTheoremState()
}
export const resetTheoremCounters = (): void => {
  resetTheoremState()
}
export const resetTheoremCounter = (_type: TheoremType): void => {
  resetTheoremState()
}
export const getTheoremCounter = (_type: TheoremType): number => 0
export const ensureTheoremCounters = (): TheoremCounters => createEmptyCounters()
