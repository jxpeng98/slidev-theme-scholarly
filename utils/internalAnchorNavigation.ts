import { slides } from '#slidev/slides'
import type { SlideRoute } from '@slidev/types'
import { nextTick, readonly, ref } from 'vue'
import type { LocationQueryRaw, RouteLocationNormalized, Router } from 'vue-router'

const BIBLIOGRAPHY_MARKER = '[[bibliography]]'
const REFERENCES_LAYOUT = 'references'
const INTERNAL_LINK_SELECTOR = '.slidev-layout a[href*="#"]'
const INTERNAL_TARGET_ATTR = 'data-scholarly-anchor-target'
const TEMP_TABINDEX_ATTR = 'data-scholarly-temp-tabindex'
const ANCHOR_MARKER_CLASS = 'scholarly-anchor-marker'
const ANCHOR_RETURN_POPOVER_CLASS = 'scholarly-anchor-return-popover'
const ANCHOR_RETURN_POPOVER_VISIBLE_CLASS = 'is-visible'
const DISPLAY_TARGET_PARENT_TAGS = new Set([
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'P',
  'LI',
  'BLOCKQUOTE',
  'FIGCAPTION',
  'DT',
  'DD',
  'TD',
  'TH',
])
const INTERNAL_LINK_EXCLUDE_RE = /^#(?:fn|fnref)/
const CODE_BLOCK_RE = /```[\s\S]*?```/g
const INLINE_CODE_RE = /`[^`]*`/g
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g
const HTML_ID_RE = /\bid\s*=\s*["']([^"'<>]+)["']/g
const NAMED_ANCHOR_RE = /<a\b[^>]*\bname\s*=\s*["']([^"'<>]+)["']/gi
const MARKDOWN_ID_RE = /\{#([^\s}]+)\}/g
const ANCHOR_SUGAR_RE = /^[ \t]*::anchor\{#([^\s}]+)\}[ \t]*$/gm
const CITATION_RE = /(?<![A-Za-z0-9])(!?)@([A-Za-z][A-Za-z0-9_-]*)/g
const HIGHLIGHT_DURATION = 2400
const MAX_HISTORY = 20

type AnchorLocator = {
  href: string
  text: string
  dataKey: string | null
  index: number
}

type AnchorSnapshot = {
  hash: string
  locator: AnchorLocator | null
  path: string
  query: LocationQueryRaw
}

type PendingAnchorFocus = {
  locator?: AnchorLocator | null
  targetId?: string | null
}

type AnchorNavigationWindow = Window & typeof globalThis & {
  __scholarlyAnchorNavigationCleanup?: () => void
}

type AnchorNavigationState = {
  highlightTimer: number | null
  history: AnchorSnapshot[]
  initialized: boolean
  pending: PendingAnchorFocus | null
  registry: Map<string, string | number>
  returnPopover: HTMLButtonElement | null
  returnPopoverTarget: HTMLElement | null
  router: Router | null
}

const state: AnchorNavigationState = {
  highlightTimer: null,
  history: [],
  initialized: false,
  pending: null,
  registry: new Map(),
  returnPopover: null,
  returnPopoverTarget: null,
  router: null,
}

const internalAnchorReturnAvailableState = ref(false)

export const internalAnchorReturnAvailable = readonly(internalAnchorReturnAvailableState)

const getEventElement = (target: EventTarget | null): Element | null => {
  if (target instanceof Element)
    return target

  if (target instanceof Node)
    return target.parentElement

  return null
}

const escapeIdSelector = (value: string): string => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
    return CSS.escape(value)

  return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&')
}

const stripProtectedBlocks = (text: string): string => {
  if (!text)
    return ''

  return text
    .replace(CODE_BLOCK_RE, '')
    .replace(INLINE_CODE_RE, '')
    .replace(HTML_COMMENT_RE, '')
}

const normalizeHashTarget = (hash: string | null | undefined): string | null => {
  if (!hash || hash === '#')
    return null

  const value = hash.startsWith('#') ? hash : `#${hash}`
  if (INTERNAL_LINK_EXCLUDE_RE.test(value))
    return null

  try {
    const decoded = decodeURIComponent(value.slice(1)).trim()
    return decoded || null
  }
  catch {
    const raw = value.slice(1).trim()
    return raw || null
  }
}

const getInternalTargetId = (href: string | null | undefined): string | null => {
  return normalizeHashTarget(href)
}

const getInternalTargetIdFromAnchor = (anchor: HTMLAnchorElement): string | null => {
  const rawHref = anchor.getAttribute('href')
  if (!rawHref || rawHref === '#')
    return null

  if (rawHref.startsWith('#'))
    return normalizeHashTarget(rawHref)

  if (typeof window === 'undefined')
    return null

  try {
    const resolved = new URL(rawHref, window.location.href)
    if (resolved.origin !== window.location.origin)
      return null

    return normalizeHashTarget(resolved.hash)
  }
  catch {
    return null
  }
}

const normalizeCitationKey = (value: string): string | null => {
  let normalized = value.trim()
  if (!normalized)
    return null

  if (normalized.startsWith('!'))
    normalized = normalized.slice(1)
  if (normalized.startsWith('@'))
    normalized = normalized.slice(1)

  normalized = normalized.replace(/[.,;:!?)]+$/, '')
  return normalized || null
}

const getSlideSourceText = (slideRoute: SlideRoute): string => {
  const slide = slideRoute.meta.slide
  return [
    slide.source?.contentRaw,
    slide.source?.content,
    slide.content,
  ].filter(Boolean).join('\n')
}

const getRouteSegment = (slideRoute: SlideRoute): string | number => {
  return slideRoute.meta.slide.frontmatter.routeAlias ?? slideRoute.no
}

const getSlideRoute = (route?: RouteLocationNormalized): SlideRoute | null => {
  const routeNo = Array.isArray(route?.params?.no)
    ? route?.params?.no[0]
    : route?.params?.no

  if (typeof routeNo === 'string' && routeNo) {
    return slides.value.find((slideRoute) => {
      return String(slideRoute.no) === routeNo
        || slideRoute.meta.slide.frontmatter.routeAlias === routeNo
    }) ?? null
  }

  return slides.value[0] ?? null
}

const getCurrentSlideRoot = (route?: RouteLocationNormalized): HTMLElement | null => {
  if (typeof document === 'undefined')
    return null

  const slideRoute = getSlideRoute(route)
  if (!slideRoute)
    return null

  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(`.slidev-page[data-slidev-no="${slideRoute.no}"]`),
  )

  return candidates.find(candidate => candidate.style.display !== 'none' && !candidate.hidden)
    ?? candidates[0]
    ?? null
}

const isAnchorMarkerElement = (element: HTMLElement): boolean => {
  return element.classList.contains(ANCHOR_MARKER_CLASS)
}

const hasMeaningfulContent = (node: Node): boolean => {
  if (node instanceof Text)
    return Boolean(node.textContent?.trim())

  if (!(node instanceof HTMLElement))
    return false

  if (isAnchorMarkerElement(node))
    return false

  return Array.from(node.childNodes).some(hasMeaningfulContent)
}

const isDisplaylessAnchorContainer = (element: HTMLElement): boolean => {
  return ['DIV', 'SPAN', 'P'].includes(element.tagName)
    && !Array.from(element.childNodes).some(hasMeaningfulContent)
}

const findNextDisplayTarget = (element: HTMLElement): HTMLElement | null => {
  let sibling = element.nextElementSibling
  while (sibling) {
    if (sibling instanceof HTMLElement)
      return resolveDisplayTarget(sibling)
    sibling = sibling.nextElementSibling
  }

  return null
}

const resolveDisplayTarget = (element: HTMLElement): HTMLElement => {
  if (isAnchorMarkerElement(element)) {
    const parent = element.parentElement

    if (parent instanceof HTMLElement) {
      if (DISPLAY_TARGET_PARENT_TAGS.has(parent.tagName) && Array.from(parent.childNodes).some(hasMeaningfulContent))
        return parent

      if (isDisplaylessAnchorContainer(parent)) {
        const next = findNextDisplayTarget(parent)
        if (next)
          return next
      }
    }

    const next = findNextDisplayTarget(element)
    if (next)
      return next
  }

  if (isDisplaylessAnchorContainer(element)) {
    const next = findNextDisplayTarget(element)
    if (next)
      return next
  }

  return element
}

const findTargetInCurrentSlide = (
  targetId: string,
  route?: RouteLocationNormalized,
): HTMLElement | null => {
  if (typeof document === 'undefined')
    return null

  const root = getCurrentSlideRoot(route)
  const scoped = root?.querySelector<HTMLElement>(`#${escapeIdSelector(targetId)}`)
  if (scoped)
    return resolveDisplayTarget(scoped)

  const global = document.getElementById(targetId)
  if (!global)
    return null

  const slideRoute = getSlideRoute(route)
  const ownerPage = global.closest<HTMLElement>('.slidev-page')
  if (!slideRoute || !ownerPage || ownerPage.dataset.slidevNo === String(slideRoute.no))
    return resolveDisplayTarget(global)

  return null
}

const getAnchorDataKey = (anchor: HTMLAnchorElement): string | null => {
  return anchor.dataset.key
    ?? anchor.getAttribute('data-key')
    ?? anchor.querySelector<HTMLElement>('[data-key]')?.dataset.key
    ?? null
}

const getAnchorsByHref = (root: ParentNode, href: string): HTMLAnchorElement[] => {
  return Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href]')).filter((anchor) => {
    return (anchor.getAttribute('href') ?? '') === href
  })
}

const createAnchorLocator = (
  anchor: HTMLAnchorElement,
  route?: RouteLocationNormalized,
): AnchorLocator | null => {
  const href = anchor.getAttribute('href')?.trim()
  if (!href)
    return null

  const root = getCurrentSlideRoot(route)
  const anchors = root ? getAnchorsByHref(root, href) : [anchor]
  const index = Math.max(anchors.indexOf(anchor), 0)

  return {
    dataKey: getAnchorDataKey(anchor),
    href,
    index,
    text: anchor.textContent?.trim() ?? '',
  }
}

const findAnchorByLocator = (
  locator: AnchorLocator,
  route?: RouteLocationNormalized,
): HTMLAnchorElement | null => {
  const root = getCurrentSlideRoot(route)
  if (!root)
    return null

  const anchors = getAnchorsByHref(root, locator.href)
  if (!anchors.length)
    return null

  if (locator.dataKey) {
    const keyed = anchors.filter(anchor => getAnchorDataKey(anchor) === locator.dataKey)
    if (keyed[locator.index])
      return keyed[locator.index]
    if (keyed[0])
      return keyed[0]
  }

  if (locator.text) {
    const textMatched = anchors.filter(anchor => (anchor.textContent?.trim() ?? '') === locator.text)
    if (textMatched[locator.index])
      return textMatched[locator.index]
    if (textMatched[0])
      return textMatched[0]
  }

  return anchors[locator.index] ?? anchors[0] ?? null
}

const clearHighlight = () => {
  if (typeof document === 'undefined')
    return

  if (state.highlightTimer !== null) {
    window.clearTimeout(state.highlightTimer)
    state.highlightTimer = null
  }

  document.querySelectorAll<HTMLElement>(`[${INTERNAL_TARGET_ATTR}]`).forEach((element) => {
    element.removeAttribute(INTERNAL_TARGET_ATTR)
    if (element.getAttribute(TEMP_TABINDEX_ATTR) === 'true') {
      element.removeAttribute('tabindex')
      element.removeAttribute(TEMP_TABINDEX_ATTR)
    }
  })
}

const highlightElement = (element: HTMLElement) => {
  if (typeof window === 'undefined')
    return

  clearHighlight()

  element.setAttribute(INTERNAL_TARGET_ATTR, 'true')
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1')
    element.setAttribute(TEMP_TABINDEX_ATTR, 'true')
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  })
  element.focus({ preventScroll: true })
  showReturnPopoverNearElement(element)

  state.highlightTimer = window.setTimeout(() => {
    element.removeAttribute(INTERNAL_TARGET_ATTR)
    if (element.getAttribute(TEMP_TABINDEX_ATTR) === 'true') {
      element.removeAttribute('tabindex')
      element.removeAttribute(TEMP_TABINDEX_ATTR)
    }
    state.highlightTimer = null
  }, HIGHLIGHT_DURATION)
}

const waitForElement = async <T extends Element>(
  resolve: () => T | null,
  attempts = 24,
): Promise<T | null> => {
  if (typeof window === 'undefined')
    return resolve()

  for (let attempt = 0; attempt < attempts; attempt++) {
    await nextTick()

    const found = resolve()
    if (found)
      return found

    await new Promise<void>(resolveFrame => requestAnimationFrame(() => resolveFrame()))
  }

  return resolve()
}

const isSameQueryValue = (left: unknown, right: unknown): boolean => {
  if (Array.isArray(left) || Array.isArray(right)) {
    const leftArray = Array.isArray(left) ? left : [left]
    const rightArray = Array.isArray(right) ? right : [right]
    return leftArray.length === rightArray.length
      && leftArray.every((value, index) => value === rightArray[index])
  }

  return left === right
}

const isSameLocation = (
  route: RouteLocationNormalized,
  snapshot: AnchorSnapshot,
): boolean => {
  if (route.path !== snapshot.path || route.hash !== snapshot.hash)
    return false

  const keys = new Set([
    ...Object.keys(route.query),
    ...Object.keys(snapshot.query),
  ])

  for (const key of keys) {
    if (!isSameQueryValue(route.query[key], snapshot.query[key]))
      return false
  }

  return true
}

const buildQuery = (query: RouteLocationNormalized['query']): LocationQueryRaw => {
  const nextQuery: LocationQueryRaw = { ...query }
  delete nextQuery.clicks
  return nextQuery
}

const buildPathForSegment = (
  segment: string | number,
  routeName: RouteLocationNormalized['name'],
): string => {
  if (routeName === 'presenter')
    return `/presenter/${segment}`
  if (routeName === 'export')
    return `/export/${segment}`
  return `/${segment}`
}

const createSnapshot = (
  anchor: HTMLAnchorElement,
  route: RouteLocationNormalized,
): AnchorSnapshot => {
  return {
    hash: route.hash ?? '',
    locator: createAnchorLocator(anchor, route),
    path: route.path,
    query: { ...route.query },
  }
}

const updateReturnButton = () => {
  internalAnchorReturnAvailableState.value = state.history.length > 0
  if (state.history.length === 0)
    hideReturnPopover()
}

const getReturnPopoverLabel = (): string => {
  if (typeof document === 'undefined')
    return 'Back to source'

  const lang = `${document.documentElement.lang || document.body?.getAttribute('lang') || ''}`.toLowerCase()
  return lang.startsWith('zh') ? '返回来源' : 'Back to source'
}

const positionReturnPopover = () => {
  if (typeof window === 'undefined' || !state.returnPopover || !state.returnPopoverTarget)
    return

  if (!document.contains(state.returnPopoverTarget)) {
    hideReturnPopover()
    return
  }

  const targetRect = state.returnPopoverTarget.getBoundingClientRect()
  const viewportPadding = 12
  const gap = 10

  state.returnPopover.style.left = `${viewportPadding}px`
  state.returnPopover.style.top = `${viewportPadding}px`

  const popoverRect = state.returnPopover.getBoundingClientRect()
  const placeAbove = targetRect.top - popoverRect.height - gap >= viewportPadding
  let top = placeAbove
    ? targetRect.top - popoverRect.height - gap
    : targetRect.bottom + gap

  if (top < viewportPadding)
    top = viewportPadding
  if (top + popoverRect.height > window.innerHeight - viewportPadding)
    top = Math.max(viewportPadding, window.innerHeight - popoverRect.height - viewportPadding)

  let left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2
  if (left < viewportPadding)
    left = viewportPadding
  if (left + popoverRect.width > window.innerWidth - viewportPadding)
    left = Math.max(viewportPadding, window.innerWidth - popoverRect.width - viewportPadding)

  state.returnPopover.dataset.placement = placeAbove ? 'top' : 'bottom'
  state.returnPopover.style.left = `${Math.round(left)}px`
  state.returnPopover.style.top = `${Math.round(top)}px`
}

const hideReturnPopover = () => {
  if (!state.returnPopover)
    return

  state.returnPopover.classList.remove(ANCHOR_RETURN_POPOVER_VISIBLE_CLASS)
  state.returnPopover.setAttribute('aria-hidden', 'true')
  state.returnPopoverTarget = null
}

const ensureReturnPopover = (): HTMLButtonElement | null => {
  if (typeof document === 'undefined')
    return null

  if (state.returnPopover)
    return state.returnPopover

  const button = document.createElement('button')
  button.type = 'button'
  button.className = ANCHOR_RETURN_POPOVER_CLASS
  button.setAttribute('aria-hidden', 'true')
  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    hideReturnPopover()
    void goBackToAnchorSource()
  })

  document.body.appendChild(button)
  state.returnPopover = button
  return button
}

const showReturnPopoverNearElement = (element: HTMLElement) => {
  if (state.history.length === 0)
    return

  const popover = ensureReturnPopover()
  if (!popover)
    return

  const label = getReturnPopoverLabel()
  popover.textContent = label
  popover.setAttribute('aria-label', label)
  popover.setAttribute('aria-hidden', 'false')
  popover.classList.add(ANCHOR_RETURN_POPOVER_VISIBLE_CLASS)
  state.returnPopoverTarget = element
  positionReturnPopover()
}

const cleanupReturnPopover = () => {
  hideReturnPopover()
  state.returnPopover?.remove()
  state.returnPopover = null
  state.returnPopoverTarget = null
}

const setPendingFromSnapshot = (snapshot: AnchorSnapshot) => {
  if (snapshot.locator) {
    state.pending = { locator: snapshot.locator }
    return
  }

  const targetId = getInternalTargetId(snapshot.hash)
  state.pending = targetId ? { targetId } : null
}

const collectCitationKeys = (text: string, citekeys: Set<string>) => {
  const stripped = stripProtectedBlocks(text)
    .replace(/https?:\/\/[^\s)>\]]+/g, '')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '')

  for (const match of stripped.matchAll(CITATION_RE)) {
    const normalized = normalizeCitationKey(match[2])
    if (normalized)
      citekeys.add(normalized)
  }
}

const resolveBibliographyKeys = (slideRoute: SlideRoute): string[] => {
  const frontmatter = slideRoute.meta.slide.frontmatter as Record<string, unknown>

  let citations: string[] = []
  if (Array.isArray(frontmatter.citations)) {
    citations = [...frontmatter.citations] as string[]
  } else if (Array.isArray(frontmatter.references)) {
    citations = [...frontmatter.references] as string[]
  } else if (Array.isArray(frontmatter.bib)) {
    citations = [...frontmatter.bib] as string[]
  } else {
    const citekeys = new Set<string>()
    for (const route of slides.value)
      collectCitationKeys(getSlideSourceText(route), citekeys)
    citations = Array.from(citekeys)
  }

  const normalized = citations
    .map(citation => normalizeCitationKey(String(citation)))
    .filter((citation): citation is string => Boolean(citation))

  const perPage = Number(frontmatter.perPage)
  const page = Number(frontmatter.page) || 1
  if (perPage > 0 && normalized.length > 0) {
    const start = (page - 1) * perPage
    return normalized.slice(start, start + perPage)
  }

  return normalized
}

const shouldRegisterBibliographyTargets = (slideRoute: SlideRoute): boolean => {
  const frontmatter = slideRoute.meta.slide.frontmatter as Record<string, unknown>
  const source = stripProtectedBlocks(getSlideSourceText(slideRoute))

  return frontmatter.layout === REFERENCES_LAYOUT || source.includes(BIBLIOGRAPHY_MARKER)
}

const extractExplicitTargetIds = (text: string): string[] => {
  const stripped = stripProtectedBlocks(text)
  const ids = new Set<string>()

  for (const match of stripped.matchAll(HTML_ID_RE)) {
    const value = match[1]?.trim()
    if (value)
      ids.add(value)
  }

  for (const match of stripped.matchAll(NAMED_ANCHOR_RE)) {
    const value = match[1]?.trim()
    if (value)
      ids.add(value)
  }

  for (const match of stripped.matchAll(MARKDOWN_ID_RE)) {
    const value = match[1]?.trim()
    if (value)
      ids.add(value)
  }

  for (const match of stripped.matchAll(ANCHOR_SUGAR_RE)) {
    const value = match[1]?.trim()
    if (value)
      ids.add(value)
  }

  return Array.from(ids)
}

const slideDefinesTarget = (slideRoute: SlideRoute, targetId: string): boolean => {
  if (extractExplicitTargetIds(getSlideSourceText(slideRoute)).includes(targetId))
    return true

  if (!shouldRegisterBibliographyTargets(slideRoute))
    return false

  return resolveBibliographyKeys(slideRoute).some(key => `ref-${key}` === targetId)
}

export const rebuildInternalAnchorTargets = () => {
  state.registry.clear()

  for (const slideRoute of slides.value) {
    const routeSegment = getRouteSegment(slideRoute)
    for (const id of extractExplicitTargetIds(getSlideSourceText(slideRoute))) {
      if (!state.registry.has(id))
        state.registry.set(id, routeSegment)
    }

    if (!shouldRegisterBibliographyTargets(slideRoute))
      continue

    for (const key of resolveBibliographyKeys(slideRoute)) {
      const targetId = `ref-${key}`
      if (!state.registry.has(targetId))
        state.registry.set(targetId, routeSegment)
    }
  }
}

const resolveTargetRouteSegment = (targetId: string): string | number | undefined => {
  const registered = state.registry.get(targetId)
  if (registered !== undefined)
    return registered

  const matchedSlide = slides.value.find(slideRoute => slideDefinesTarget(slideRoute, targetId))
  if (!matchedSlide)
    return undefined

  const routeSegment = getRouteSegment(matchedSlide)
  state.registry.set(targetId, routeSegment)
  return routeSegment
}

export const goBackToAnchorSource = async () => {
  const router = state.router
  const snapshot = state.history.pop()
  updateReturnButton()
  hideReturnPopover()

  if (!router || !snapshot)
    return

  setPendingFromSnapshot(snapshot)

  if (isSameLocation(router.currentRoute.value, snapshot)) {
    await resolvePendingInternalAnchorNavigation(router.currentRoute.value)
    return
  }

  await router.push({
    hash: snapshot.hash || undefined,
    path: snapshot.path,
    query: { ...snapshot.query },
  })
}

const resolveFocusRequest = async (route: RouteLocationNormalized, pending: PendingAnchorFocus) => {
  if (pending.targetId) {
    const target = await waitForElement(() => findTargetInCurrentSlide(pending.targetId!, route))
    if (target)
      highlightElement(target)
    return
  }

  if (pending.locator) {
    const source = await waitForElement(() => findAnchorByLocator(pending.locator!, route))
    if (source)
      highlightElement(source)
  }
}

export const resolvePendingInternalAnchorNavigation = async (route: RouteLocationNormalized) => {
  const pending = state.pending
  if (pending) {
    state.pending = null
    await resolveFocusRequest(route, pending)
    return
  }

  const targetId = getInternalTargetId(route.hash)
  if (!targetId)
    return

  const localTarget = findTargetInCurrentSlide(targetId, route)
  if (!localTarget) {
    const routeSegment = resolveTargetRouteSegment(targetId)
    const currentSegment = Array.isArray(route.params.no) ? route.params.no[0] : route.params.no
    if (
      state.router
      && routeSegment !== undefined
      && String(routeSegment) !== String(currentSegment ?? '')
    ) {
      await state.router.replace({
        hash: `#${encodeURIComponent(targetId)}`,
        path: buildPathForSegment(routeSegment, route.name),
        query: buildQuery(route.query),
      })
      return
    }
  }

  const target = localTarget ?? await waitForElement(() => findTargetInCurrentSlide(targetId, route), 4)
  if (target)
    highlightElement(target)
}

const navigateToInternalTarget = async (
  anchor: HTMLAnchorElement,
  router: Router,
): Promise<boolean> => {
  const targetId = getInternalTargetIdFromAnchor(anchor)
  if (!targetId)
    return false

  const currentRoute = router.currentRoute.value
  const localTarget = findTargetInCurrentSlide(targetId, currentRoute)
  const routeSegment = resolveTargetRouteSegment(targetId)

  if (!localTarget && routeSegment === undefined)
    return false

  state.history.push(createSnapshot(anchor, currentRoute))
  if (state.history.length > MAX_HISTORY)
    state.history.splice(0, state.history.length - MAX_HISTORY)
  updateReturnButton()

  if (localTarget) {
    highlightElement(localTarget)
    return true
  }

  state.pending = { targetId }
  await router.push({
    hash: `#${encodeURIComponent(targetId)}`,
    path: buildPathForSegment(routeSegment!, currentRoute.name),
    query: buildQuery(currentRoute.query),
  })

  return true
}

export const initializeInternalAnchorNavigation = (router: Router) => {
  if (typeof window === 'undefined' || state.initialized)
    return

  const globalWindow = window as AnchorNavigationWindow
  globalWindow.__scholarlyAnchorNavigationCleanup?.()

  state.router = router
  rebuildInternalAnchorTargets()

  const handleClick = async (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return

    const element = getEventElement(event.target)
    if (!element)
      return

    const anchor = element.closest(INTERNAL_LINK_SELECTOR) as HTMLAnchorElement | null
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download'))
      return

    const targetId = getInternalTargetIdFromAnchor(anchor)
    if (!targetId)
      return

    if (!findTargetInCurrentSlide(targetId, router.currentRoute.value) && resolveTargetRouteSegment(targetId) === undefined)
      return

    event.preventDefault()
    void navigateToInternalTarget(anchor, router)
  }

  const handleViewportChange = () => {
    positionReturnPopover()
  }

  const cleanup = () => {
    document.removeEventListener('click', handleClick, true)
    document.removeEventListener('scroll', handleViewportChange, true)
    window.removeEventListener('resize', handleViewportChange)
    clearHighlight()
    cleanupReturnPopover()
    state.history = []
    state.pending = null
    state.registry.clear()
    state.initialized = false
    state.router = null
    internalAnchorReturnAvailableState.value = false
  }

  document.addEventListener('click', handleClick, true)
  document.addEventListener('scroll', handleViewportChange, true)
  window.addEventListener('resize', handleViewportChange)

  globalWindow.__scholarlyAnchorNavigationCleanup = cleanup
  state.initialized = true
}
