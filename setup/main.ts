import { defineAppSetup } from '@slidev/types'
import { configs } from '@slidev/client'
import { slides } from '#slidev/slides'
import { watch } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import Theorem from '../components/Theorem.vue'
import Block from '../components/Block.vue'
import Columns from '../components/Columns.vue'
import Highlight from '../components/Highlight.vue'
import Cite from '../components/Cite.vue'
import Steps from '../components/Steps.vue'
import Keywords from '../components/Keywords.vue'
import ThemePreview from '../components/ThemePreview.vue'
import {
  initializeInternalAnchorNavigation,
  rebuildInternalAnchorTargets,
  resolvePendingInternalAnchorNavigation,
} from '../utils/internalAnchorNavigation'
import { applyRootColorMode, resolveScholarlyColorMode } from '../utils/colorMode'
import { hasVerticalOverflow, isVerticalScrollOverflowMode } from '../utils/scrollArea'
import { invalidateTheoremNumberMap, resetOccurrenceTracker } from '../utils/theorem'

const DEFAULT_FONT_SIZE = '1rem'
type FontsizeConfig =
  | string
  | number
  | {
    body?: string | number
    h1?: string | number
    h2?: string | number
    h3?: string | number
  }

type ThemeColorConfig = {
  primary?: string
  primaryLight?: string
  accent?: string
  bgWarm?: string
  textPrimary?: string
  headerBg?: string
  footerLeftBg?: string
  footerCenterBg?: string
  footerRightBg?: string
}

type ThemeColorPreset = Pick<ThemeColorConfig, 'primary' | 'primaryLight' | 'accent' | 'bgWarm' | 'textPrimary'>

const DEFAULT_COLOR_THEME = 'classic-blue'
const COLOR_THEME_PRESETS: Record<string, ThemeColorPreset> = {
  'classic-blue': {
    primary: '#1e3a5f',
    primaryLight: '#2c5282',
    accent: '#b8860b',
    bgWarm: '#fdfbf7',
    textPrimary: '#2d3748',
  },
  'oxford-burgundy': {
    primary: '#862633',
    primaryLight: '#a23648',
    accent: '#c5a572',
    bgWarm: '#faf8f5',
    textPrimary: '#2d1b1e',
  },
  'cambridge-green': {
    primary: '#00543c',
    primaryLight: '#006b4a',
    accent: '#d4af37',
    bgWarm: '#f8faf7',
    textPrimary: '#1a2f1a',
  },
  'princeton-orange': {
    primary: '#e87722',
    primaryLight: '#f08f42',
    accent: '#1c1c1c',
    bgWarm: '#fffbf5',
    textPrimary: '#2d2d2d',
  },
  'yale-blue': {
    primary: '#0f4d92',
    primaryLight: '#286fb4',
    accent: '#d4af37',
    bgWarm: '#f7f9fc',
    textPrimary: '#1a2332',
  },
  'monochrome': {
    primary: '#2d3748',
    primaryLight: '#4a5568',
    accent: '#718096',
    bgWarm: '#ffffff',
    textPrimary: '#1a202c',
  },
  'warm-sepia': {
    primary: '#5d4037',
    primaryLight: '#795548',
    accent: '#d4a574',
    bgWarm: '#faf6f1',
    textPrimary: '#3e2723',
  },
  'nordic-blue': {
    primary: '#2e5266',
    primaryLight: '#4a7c9c',
    accent: '#d4a762',
    bgWarm: '#f5f8fa',
    textPrimary: '#1e3a4a',
  },
  'high-contrast': {
    primary: '#000000',
    primaryLight: '#333333',
    accent: '#0066cc',
    bgWarm: '#ffffff',
    textPrimary: '#000000',
  },
}

const THEME_COLOR_VARIABLES: Array<[keyof ThemeColorConfig, string]> = [
  ['primary', '--slidev-theme-primary'],
  ['primaryLight', '--slidev-theme-primary-light'],
  ['accent', '--scholarly-accent'],
  ['bgWarm', '--scholarly-bg-warm'],
  ['textPrimary', '--scholarly-text-primary'],
  ['headerBg', '--scholarly-header-bg'],
  ['footerLeftBg', '--scholarly-footer-left-bg'],
  ['footerCenterBg', '--scholarly-footer-center-bg'],
  ['footerRightBg', '--scholarly-footer-right-bg'],
]

type ThemeConfig = {
  colorTheme?: string
  fontTheme?: string
  colorMode?: 'light' | 'dark'
  sectionMode?: 'light' | 'dark'
  beamerNav?: boolean
  outlineSidebar?: boolean
  outlineSidebarOpen?: boolean
  outlineToc?: boolean
  outlineTocOpen?: boolean
  footnoteDisplay?: 'both' | 'hover-only' | 'notes-only'
}

type SlideFrontmatter = {
  fontsize?: FontsizeConfig
  footnoteDisplay?: ThemeConfig['footnoteDisplay']
  routeAlias?: string
}

const normalizeFontSize = (value: unknown): string | null => {
  if (value === null || value === undefined) return null

  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}px`
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed)
      return null

    const numeric = Number(trimmed)
    if (!Number.isNaN(numeric)) {
      return `${numeric}px`
    }
    return trimmed
  }

  return null
}

const parseFontConfig = (value: FontsizeConfig | null | undefined) => {
  if (value === null || value === undefined) {
    return {}
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const body = normalizeFontSize(value)
    return body ? { body } : {}
  }

  const result: { body?: string; h1?: string; h2?: string; h3?: string } = {}
  const config = value as { body?: unknown; h1?: unknown; h2?: unknown; h3?: unknown }

  const body = normalizeFontSize(config.body)
  if (body) result.body = body

  const h1 = normalizeFontSize(config.h1)
  if (h1) result.h1 = h1

  const h2 = normalizeFontSize(config.h2)
  if (h2) result.h2 = h2

  const h3 = normalizeFontSize(config.h3)
  if (h3) result.h3 = h3

  return result
}

const applyFontSizes = (
  localConfig: FontsizeConfig | null | undefined,
  globalConfig: FontsizeConfig | null | undefined,
) => {
  if (typeof window === 'undefined') return
  const targets = [document.documentElement, document.body].filter(Boolean) as HTMLElement[]
  if (!targets.length) return

  const local = parseFontConfig(localConfig)
  const global = parseFontConfig(globalConfig)

  const bodySize = local.body ?? global.body
  const h1Size = local.h1 ?? global.h1
  const h2Size = local.h2 ?? global.h2
  const h3Size = local.h3 ?? global.h3

  for (const el of targets) {
    el.style.setProperty('--scholarly-font-size', bodySize ?? DEFAULT_FONT_SIZE)

    if (h1Size) el.style.setProperty('--scholarly-h1-size', h1Size)
    else el.style.removeProperty('--scholarly-h1-size')

    if (h2Size) el.style.setProperty('--scholarly-h2-size', h2Size)
    else el.style.removeProperty('--scholarly-h2-size')

    if (h3Size) el.style.setProperty('--scholarly-h3-size', h3Size)
    else el.style.removeProperty('--scholarly-h3-size')
  }
}

const getThemeColorTargets = (): HTMLElement[] => {
  if (typeof document === 'undefined')
    return []

  return [document.documentElement, document.body].filter(Boolean) as HTMLElement[]
}

const normalizeThemeColorValue = (value: string | null | undefined): string | null => {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

const applyThemePresetColors = (
  colorTheme: string | null | undefined,
  customColors?: ThemeColorConfig | null,
) => {
  if (typeof window === 'undefined') return

  const preset = COLOR_THEME_PRESETS[colorTheme || DEFAULT_COLOR_THEME] ?? COLOR_THEME_PRESETS[DEFAULT_COLOR_THEME]
  const presetColors = preset as Partial<ThemeColorConfig>
  const targets = getThemeColorTargets()

  for (const target of targets) {
    for (const [key, cssVar] of THEME_COLOR_VARIABLES) {
      const value = normalizeThemeColorValue(customColors?.[key] ?? presetColors[key])
      if (value)
        target.style.setProperty(cssVar, value)
      else
        target.style.removeProperty(cssVar)
    }
  }
}

const applyThemeColors = (
  config: ThemeColorConfig | null | undefined,
  themeConfig?: ThemeConfig | null,
) => {
  applyThemePresetColors(themeConfig?.colorTheme ?? DEFAULT_COLOR_THEME, config)
}

const applyThemePresets = (
  config: ThemeConfig | null | undefined,
  colorConfig?: ThemeColorConfig | null,
) => {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  const setAttr = (name: string, value: string | null | undefined) => {
    if (typeof value === 'string' && value.trim())
      root.setAttribute(name, value)
    else
      root.removeAttribute(name)
  }

  const colorTheme = config?.colorTheme || DEFAULT_COLOR_THEME
  setAttr('data-color-theme', colorTheme)
  setAttr('data-font-theme', config?.fontTheme)
  applyThemePresetColors(colorTheme, colorConfig)
  syncColorModeWithDark(config)
}

// Explicit Scholarly colorMode is authoritative; otherwise follow Slidev's dark class.
const syncColorModeWithDark = (config?: ThemeConfig | null) => {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  applyRootColorMode(
    root,
    resolveScholarlyColorMode(config?.colorMode, root.classList.contains('dark')),
  )
}

// Watch for Slidev's dark mode toggle (class changes on html element)
let darkModeObserver: MutationObserver | null = null

const FOOTNOTE_TRIGGER_SELECTOR = '.slidev-layout sup.footnote-ref a[href^="#fn"]'
const FOOTNOTE_SCOPE_SELECTOR = '.slidev-layout'
const FOOTNOTE_LAYOUT_CONTENT_SELECTOR = '.content-inner, .bullets-content, .prose, .references-content'
const FOOTNOTE_LAYOUT_WRAPPER_SELECTOR = '.content-wrapper, .intro-content, .bullets-container, .content-wrapper-centered'
const FOOTNOTE_ACTIVE_ATTR = 'data-scholarly-footnote-active'
const FOOTNOTE_PINNED_ATTR = 'data-scholarly-footnote-pinned'
const FOOTNOTE_DISPLAY_ATTR = 'data-scholarly-footnote-display'
const FOOTNOTE_LAYOUT_ATTR = 'data-scholarly-has-footnotes'
const FOOTNOTE_HIDE_DELAY = 120
type FootnoteDisplayMode = 'both' | 'hover-only' | 'notes-only'

type FootnotePopoverState = {
  initialized: boolean
  popover: HTMLDivElement | null
  label: HTMLDivElement | null
  content: HTMLDivElement | null
  activeAnchor: HTMLAnchorElement | null
  pinnedAnchor: HTMLAnchorElement | null
  hideTimer: number | null
}

type FootnotePopoverWindow = Window & typeof globalThis & {
  __scholarlyFootnotePopoverCleanup?: () => void
  __scholarlyFootnoteLayoutCleanup?: () => void
  __scholarlyScrollAreaCleanup?: () => void
}

const footnotePopoverState: FootnotePopoverState = {
  initialized: false,
  popover: null,
  label: null,
  content: null,
  activeAnchor: null,
  pinnedAnchor: null,
  hideTimer: null,
}

let footnoteLayoutObserver: MutationObserver | null = null
let footnoteLayoutSyncRaf: number | null = null
let scrollAreaObserver: MutationObserver | null = null
let scrollAreaSyncRaf: number | null = null

const SCROLL_AREA_SCOPE_SELECTOR = '.slidev-layout'
const SCROLL_AREA_STATE_ATTR = 'data-scholarly-scrollable'

const normalizeFootnoteDisplay = (value: unknown): FootnoteDisplayMode => {
  if (typeof value !== 'string')
    return 'both'

  const normalized = value.trim().toLowerCase()
  if (normalized === 'hover-only' || normalized === 'hover')
    return 'hover-only'
  if (normalized === 'notes-only' || normalized === 'footnotes-only' || normalized === 'static')
    return 'notes-only'
  return 'both'
}

const getFootnoteDisplayMode = (): FootnoteDisplayMode => {
  if (typeof document === 'undefined')
    return 'both'

  return normalizeFootnoteDisplay(document.documentElement.getAttribute(FOOTNOTE_DISPLAY_ATTR))
}

const escapeIdSelector = (value: string): string => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
    return CSS.escape(value)

  return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&')
}

const getEventElement = (target: EventTarget | null): Element | null => {
  if (target instanceof Element)
    return target

  if (target instanceof Node)
    return target.parentElement

  return null
}

const getFootnoteAnchor = (target: EventTarget | null): HTMLAnchorElement | null => {
  const element = getEventElement(target)
  if (!element)
    return null

  return element.closest(FOOTNOTE_TRIGGER_SELECTOR) as HTMLAnchorElement | null
}

const clearFootnoteHideTimer = () => {
  if (footnotePopoverState.hideTimer !== null) {
    window.clearTimeout(footnotePopoverState.hideTimer)
    footnotePopoverState.hideTimer = null
  }
}

const setFootnoteAnchorState = (
  anchor: HTMLAnchorElement | null,
  isActive: boolean,
  isPinned = false,
) => {
  if (!anchor)
    return

  anchor.setAttribute('aria-haspopup', 'dialog')
  anchor.setAttribute('aria-expanded', isActive ? 'true' : 'false')

  if (isActive)
    anchor.setAttribute(FOOTNOTE_ACTIVE_ATTR, 'true')
  else
    anchor.removeAttribute(FOOTNOTE_ACTIVE_ATTR)

  if (isPinned)
    anchor.setAttribute(FOOTNOTE_PINNED_ATTR, 'true')
  else
    anchor.removeAttribute(FOOTNOTE_PINNED_ATTR)
}

const enhanceFootnoteTriggers = () => {
  if (typeof document === 'undefined')
    return

  const interactive = getFootnoteDisplayMode() !== 'notes-only'
  document.querySelectorAll<HTMLAnchorElement>(FOOTNOTE_TRIGGER_SELECTOR).forEach((anchor) => {
    if (interactive) {
      anchor.setAttribute('aria-haspopup', 'dialog')
      if (!anchor.hasAttribute('aria-expanded'))
        anchor.setAttribute('aria-expanded', 'false')
      anchor.dataset.scholarlyFootnoteTrigger = 'true'
    } else {
      anchor.removeAttribute('aria-haspopup')
      anchor.removeAttribute('aria-expanded')
      anchor.removeAttribute(FOOTNOTE_ACTIVE_ATTR)
      anchor.removeAttribute(FOOTNOTE_PINNED_ATTR)
      delete anchor.dataset.scholarlyFootnoteTrigger
    }
  })
}

const setFootnoteLayoutState = (element: Element, enabled: boolean) => {
  const hasState = element.getAttribute(FOOTNOTE_LAYOUT_ATTR) === 'true'
  if (enabled === hasState)
    return

  if (enabled)
    element.setAttribute(FOOTNOTE_LAYOUT_ATTR, 'true')
  else
    element.removeAttribute(FOOTNOTE_LAYOUT_ATTR)
}

const hasDirectFootnotes = (element: Element) => {
  return Array.from(element.children).some((child) => child.classList.contains('footnotes'))
}

const syncFootnoteLayoutState = () => {
  if (typeof document === 'undefined')
    return

  document.querySelectorAll<HTMLElement>(FOOTNOTE_SCOPE_SELECTOR).forEach((root) => {
    root.querySelectorAll<HTMLElement>(FOOTNOTE_LAYOUT_CONTENT_SELECTOR).forEach((container) => {
      setFootnoteLayoutState(container, hasDirectFootnotes(container))
    })

    root.querySelectorAll<HTMLElement>(FOOTNOTE_LAYOUT_WRAPPER_SELECTOR).forEach((wrapper) => {
      const hasFootnotes = Array.from(
        wrapper.querySelectorAll<HTMLElement>(FOOTNOTE_LAYOUT_CONTENT_SELECTOR),
      ).some(container => container.getAttribute(FOOTNOTE_LAYOUT_ATTR) === 'true')
      setFootnoteLayoutState(wrapper, hasFootnotes)
    })
  })
}

const cancelFootnoteLayoutSync = () => {
  if (footnoteLayoutSyncRaf !== null) {
    window.cancelAnimationFrame(footnoteLayoutSyncRaf)
    footnoteLayoutSyncRaf = null
  }
}

const scheduleFootnoteLayoutSync = () => {
  if (typeof window === 'undefined' || footnoteLayoutSyncRaf !== null)
    return

  footnoteLayoutSyncRaf = window.requestAnimationFrame(() => {
    footnoteLayoutSyncRaf = null
    syncFootnoteLayoutState()
  })
}

const observeFootnoteLayout = () => {
  if (typeof window === 'undefined')
    return

  const globalWindow = window as FootnotePopoverWindow
  globalWindow.__scholarlyFootnoteLayoutCleanup?.()

  const scope = document.querySelector<HTMLElement>(FOOTNOTE_SCOPE_SELECTOR) ?? document.body

  if (typeof MutationObserver !== 'undefined') {
    footnoteLayoutObserver = new MutationObserver((mutations) => {
      if (!mutations.some(mutation => mutation.type === 'childList' || mutation.type === 'characterData'))
        return

      scheduleFootnoteLayoutSync()
    })

    footnoteLayoutObserver.observe(scope, {
      childList: true,
      subtree: true,
      characterData: true,
    })
  }

  globalWindow.__scholarlyFootnoteLayoutCleanup = () => {
    cancelFootnoteLayoutSync()
    footnoteLayoutObserver?.disconnect()
    footnoteLayoutObserver = null
    document.querySelectorAll<HTMLElement>(`[${FOOTNOTE_LAYOUT_ATTR}]`).forEach((element) => {
      element.removeAttribute(FOOTNOTE_LAYOUT_ATTR)
    })
  }

  scheduleFootnoteLayoutSync()
}

const isVerticalScrollCandidate = (element: HTMLElement): boolean => {
  if (element.hasAttribute(SCROLL_AREA_STATE_ATTR))
    return true

  const overflowY = window.getComputedStyle(element).overflowY
  return isVerticalScrollOverflowMode(overflowY)
}

const syncScrollAreaState = () => {
  if (typeof document === 'undefined')
    return

  document.querySelectorAll<HTMLElement>(`${SCROLL_AREA_SCOPE_SELECTOR} *`).forEach((element) => {
    if (!isVerticalScrollCandidate(element))
      return

    const overflowY = window.getComputedStyle(element).overflowY
    if (!isVerticalScrollOverflowMode(overflowY)) {
      element.removeAttribute(SCROLL_AREA_STATE_ATTR)
      return
    }

    const isScrollable = hasVerticalOverflow({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    })
    const nextState = isScrollable ? 'true' : 'false'
    if (element.getAttribute(SCROLL_AREA_STATE_ATTR) !== nextState)
      element.setAttribute(SCROLL_AREA_STATE_ATTR, nextState)
  })
}

const cancelScrollAreaSync = () => {
  if (scrollAreaSyncRaf !== null) {
    window.cancelAnimationFrame(scrollAreaSyncRaf)
    scrollAreaSyncRaf = null
  }
}

const scheduleScrollAreaSync = () => {
  if (typeof window === 'undefined' || scrollAreaSyncRaf !== null)
    return

  scrollAreaSyncRaf = window.requestAnimationFrame(() => {
    scrollAreaSyncRaf = null
    syncScrollAreaState()
  })
}

const observeScrollAreas = () => {
  if (typeof window === 'undefined')
    return

  const globalWindow = window as FootnotePopoverWindow
  globalWindow.__scholarlyScrollAreaCleanup?.()

  const scope = document.querySelector<HTMLElement>(SCROLL_AREA_SCOPE_SELECTOR) ?? document.body

  if (typeof MutationObserver !== 'undefined') {
    scrollAreaObserver = new MutationObserver(() => scheduleScrollAreaSync())
    scrollAreaObserver.observe(scope, {
      attributes: true,
      attributeFilter: ['class', 'style', SCROLL_AREA_STATE_ATTR],
      childList: true,
      subtree: true,
      characterData: true,
    })
  }

  const handleViewportChange = () => scheduleScrollAreaSync()
  window.addEventListener('resize', handleViewportChange)

  globalWindow.__scholarlyScrollAreaCleanup = () => {
    cancelScrollAreaSync()
    scrollAreaObserver?.disconnect()
    scrollAreaObserver = null
    window.removeEventListener('resize', handleViewportChange)
    document.querySelectorAll<HTMLElement>(`[${SCROLL_AREA_STATE_ATTR}]`).forEach((element) => {
      element.removeAttribute(SCROLL_AREA_STATE_ATTR)
    })
  }

  scheduleScrollAreaSync()
}

const getFootnoteItemForAnchor = (anchor: HTMLAnchorElement): HTMLElement | null => {
  const href = anchor.getAttribute('href')
  if (!href?.startsWith('#'))
    return null

  const id = decodeURIComponent(href.slice(1))
  if (!id)
    return null

  const scope = anchor.closest(FOOTNOTE_SCOPE_SELECTOR)
  const scopedMatch = scope?.querySelector<HTMLElement>(`#${escapeIdSelector(id)}`)
  if (scopedMatch)
    return scopedMatch

  return document.getElementById(id)
}

const extractFootnotePreview = (item: HTMLElement): DocumentFragment => {
  const clone = item.cloneNode(true) as HTMLElement

  clone.removeAttribute('id')
  clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'))
  clone.querySelectorAll('.footnote-backref, [data-footnote-backref], a[href^="#fnref"]').forEach((node) => node.remove())

  const fragment = document.createDocumentFragment()
  while (clone.firstChild)
    fragment.appendChild(clone.firstChild)

  return fragment
}

const ensureFootnotePopover = (): HTMLDivElement | null => {
  if (typeof document === 'undefined')
    return null

  if (footnotePopoverState.popover && footnotePopoverState.label && footnotePopoverState.content)
    return footnotePopoverState.popover

  const popover = document.createElement('div')
  popover.className = 'scholarly-footnote-popover'
  popover.setAttribute('role', 'note')
  popover.setAttribute('aria-hidden', 'true')

  const label = document.createElement('div')
  label.className = 'scholarly-footnote-popover__label'

  const content = document.createElement('div')
  content.className = 'scholarly-footnote-popover__content'

  popover.append(label, content)

  popover.addEventListener('pointerenter', () => clearFootnoteHideTimer())
  popover.addEventListener('pointerleave', () => {
    if (!footnotePopoverState.pinnedAnchor)
      scheduleFootnoteHide()
  })

  document.body.appendChild(popover)

  footnotePopoverState.popover = popover
  footnotePopoverState.label = label
  footnotePopoverState.content = content

  return popover
}

const positionFootnotePopover = (anchor: HTMLAnchorElement, popover: HTMLDivElement) => {
  const anchorRect = anchor.getBoundingClientRect()
  const viewportPadding = 16
  const gap = 12

  popover.style.left = `${viewportPadding}px`
  popover.style.top = `${viewportPadding}px`

  const popoverRect = popover.getBoundingClientRect()
  const fitsBelow = anchorRect.bottom + gap + popoverRect.height <= window.innerHeight - viewportPadding
  const fitsAbove = anchorRect.top - gap - popoverRect.height >= viewportPadding
  const placeAbove = !fitsBelow && fitsAbove

  let top = placeAbove
    ? anchorRect.top - popoverRect.height - gap
    : anchorRect.bottom + gap

  if (top < viewportPadding)
    top = viewportPadding
  if (top + popoverRect.height > window.innerHeight - viewportPadding)
    top = Math.max(viewportPadding, window.innerHeight - popoverRect.height - viewportPadding)

  let left = anchorRect.left + (anchorRect.width / 2) - (popoverRect.width / 2)
  if (left < viewportPadding)
    left = viewportPadding
  if (left + popoverRect.width > window.innerWidth - viewportPadding)
    left = Math.max(viewportPadding, window.innerWidth - popoverRect.width - viewportPadding)

  popover.dataset.placement = placeAbove ? 'top' : 'bottom'
  popover.style.left = `${Math.round(left)}px`
  popover.style.top = `${Math.round(top)}px`
}

const syncFootnotePopoverPosition = () => {
  const { activeAnchor, popover } = footnotePopoverState
  if (!activeAnchor || !popover || popover.getAttribute('aria-hidden') === 'true')
    return

  if (!document.contains(activeAnchor)) {
    hideFootnotePopover()
    return
  }

  positionFootnotePopover(activeAnchor, popover)
}

const hideFootnotePopover = () => {
  clearFootnoteHideTimer()

  if (footnotePopoverState.activeAnchor)
    setFootnoteAnchorState(footnotePopoverState.activeAnchor, false, false)

  if (footnotePopoverState.pinnedAnchor && footnotePopoverState.pinnedAnchor !== footnotePopoverState.activeAnchor)
    setFootnoteAnchorState(footnotePopoverState.pinnedAnchor, false, false)

  footnotePopoverState.activeAnchor = null
  footnotePopoverState.pinnedAnchor = null

  if (!footnotePopoverState.popover)
    return

  footnotePopoverState.popover.classList.remove('is-visible')
  footnotePopoverState.popover.dataset.pinned = 'false'
  footnotePopoverState.popover.setAttribute('aria-hidden', 'true')
}

const scheduleFootnoteHide = () => {
  clearFootnoteHideTimer()

  if (footnotePopoverState.pinnedAnchor)
    return

  footnotePopoverState.hideTimer = window.setTimeout(() => {
    hideFootnotePopover()
  }, FOOTNOTE_HIDE_DELAY)
}

const showFootnotePopover = (anchor: HTMLAnchorElement, pinned = false): boolean => {
  const item = getFootnoteItemForAnchor(anchor)
  const popover = ensureFootnotePopover()
  const label = footnotePopoverState.label
  const content = footnotePopoverState.content

  if (!item || !popover || !label || !content)
    return false

  const fragment = extractFootnotePreview(item)
  if (!fragment.hasChildNodes())
    return false

  clearFootnoteHideTimer()

  if (footnotePopoverState.activeAnchor && footnotePopoverState.activeAnchor !== anchor)
    setFootnoteAnchorState(footnotePopoverState.activeAnchor, false, false)

  if (footnotePopoverState.pinnedAnchor && footnotePopoverState.pinnedAnchor !== anchor)
    setFootnoteAnchorState(footnotePopoverState.pinnedAnchor, false, false)

  footnotePopoverState.activeAnchor = anchor
  footnotePopoverState.pinnedAnchor = pinned ? anchor : null

  label.textContent = anchor.textContent?.trim() ?? ''
  label.hidden = !label.textContent

  content.replaceChildren(fragment)

  popover.dataset.pinned = pinned ? 'true' : 'false'
  popover.setAttribute('aria-hidden', 'false')
  popover.classList.add('is-visible')

  setFootnoteAnchorState(anchor, true, pinned)
  positionFootnotePopover(anchor, popover)

  window.requestAnimationFrame(() => {
    if (footnotePopoverState.activeAnchor === anchor)
      syncFootnotePopoverPosition()
  })

  return true
}

const initializeFootnotePopovers = () => {
  if (typeof window === 'undefined' || footnotePopoverState.initialized)
    return

  const globalWindow = window as FootnotePopoverWindow
  globalWindow.__scholarlyFootnotePopoverCleanup?.()

  const handlePointerOver = (event: PointerEvent) => {
    if (event.pointerType && event.pointerType !== 'mouse')
      return

    if (getFootnoteDisplayMode() === 'notes-only')
      return

    if (footnotePopoverState.pinnedAnchor)
      return

    const anchor = getFootnoteAnchor(event.target)
    if (!anchor)
      return

    showFootnotePopover(anchor, false)
  }

  const handlePointerOut = (event: PointerEvent) => {
    if (event.pointerType && event.pointerType !== 'mouse')
      return

    if (getFootnoteDisplayMode() === 'notes-only')
      return

    if (footnotePopoverState.pinnedAnchor)
      return

    const anchor = getFootnoteAnchor(event.target)
    if (!anchor)
      return

    const relatedTarget = event.relatedTarget
    if (relatedTarget instanceof Node) {
      if (anchor.contains(relatedTarget))
        return

      if (footnotePopoverState.popover?.contains(relatedTarget))
        return
    }

    scheduleFootnoteHide()
  }

  const handleFocusIn = (event: FocusEvent) => {
    if (getFootnoteDisplayMode() === 'notes-only')
      return

    if (footnotePopoverState.pinnedAnchor)
      return

    const anchor = getFootnoteAnchor(event.target)
    if (!anchor)
      return

    showFootnotePopover(anchor, false)
  }

  const handleFocusOut = (event: FocusEvent) => {
    if (getFootnoteDisplayMode() === 'notes-only')
      return

    if (footnotePopoverState.pinnedAnchor)
      return

    const anchor = getFootnoteAnchor(event.target)
    if (!anchor)
      return

    const relatedTarget = event.relatedTarget
    if (relatedTarget instanceof Node && footnotePopoverState.popover?.contains(relatedTarget))
      return

    scheduleFootnoteHide()
  }

  const handleClick = (event: MouseEvent) => {
    const anchor = getFootnoteAnchor(event.target)
    if (anchor) {
      const footnoteDisplay = getFootnoteDisplayMode()
      if (footnoteDisplay === 'notes-only')
        return

      event.preventDefault()
      clearFootnoteHideTimer()

      if (footnoteDisplay === 'hover-only') {
        showFootnotePopover(anchor, false)
      } else if (footnotePopoverState.pinnedAnchor === anchor) {
        hideFootnotePopover()
      } else {
        showFootnotePopover(anchor, true)
      }
      return
    }

    const element = getEventElement(event.target)
    if (element && footnotePopoverState.popover?.contains(element))
      return

    hideFootnotePopover()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (getFootnoteDisplayMode() === 'notes-only')
      return

    if (event.key === 'Escape')
      hideFootnotePopover()
  }

  const handleViewportChange = () => {
    syncFootnotePopoverPosition()
  }

  document.addEventListener('pointerover', handlePointerOver)
  document.addEventListener('pointerout', handlePointerOut)
  document.addEventListener('focusin', handleFocusIn)
  document.addEventListener('focusout', handleFocusOut)
  document.addEventListener('click', handleClick)
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('scroll', handleViewportChange, true)
  window.addEventListener('resize', handleViewportChange)

  const cleanup = () => {
    document.removeEventListener('pointerover', handlePointerOver)
    document.removeEventListener('pointerout', handlePointerOut)
    document.removeEventListener('focusin', handleFocusIn)
    document.removeEventListener('focusout', handleFocusOut)
    document.removeEventListener('click', handleClick)
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('scroll', handleViewportChange, true)
    window.removeEventListener('resize', handleViewportChange)

    hideFootnotePopover()
    footnotePopoverState.popover?.remove()
    footnotePopoverState.popover = null
    footnotePopoverState.label = null
    footnotePopoverState.content = null
    footnotePopoverState.initialized = false
  }

  globalWindow.__scholarlyFootnotePopoverCleanup = cleanup
  footnotePopoverState.initialized = true

  enhanceFootnoteTriggers()
}

const setupDarkModeSync = (config: ThemeConfig | null | undefined) => {
  if (typeof window === 'undefined') return

  // Clean up existing observer
  if (darkModeObserver) {
    darkModeObserver.disconnect()
    darkModeObserver = null
  }

  // Initial sync
  syncColorModeWithDark(config)

  // Watch for class changes on html element. With an explicit colorMode, this
  // immediately restores the configured mode if Slidev/system dark mode changes.
  darkModeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        syncColorModeWithDark(config)
      }
    }
  })

  darkModeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
}

export default defineAppSetup(({ app, router }) => {
  // Register components globally
  app.component('Theorem', Theorem)
  app.component('Block', Block)
  app.component('Columns', Columns)
  app.component('Highlight', Highlight)
  app.component('Cite', Cite)
  app.component('Steps', Steps)
  app.component('Keywords', Keywords)
  app.component('ThemePreview', ThemePreview)

  const getGlobalFontConfig = (): FontsizeConfig | undefined => {
    return (configs as any)?.fontsize as FontsizeConfig | undefined
  }

  const getGlobalFootnoteDisplay = (): ThemeConfig['footnoteDisplay'] | undefined => {
    return (configs as any)?.footnoteDisplay as ThemeConfig['footnoteDisplay'] | undefined
  }

  const getThemeColorConfig = (): ThemeColorConfig | undefined => {
    return (configs as any)?.themeColors as ThemeColorConfig | undefined
  }

  const getThemeConfig = (): ThemeConfig | undefined => {
    return (configs as any)?.themeConfig as ThemeConfig | undefined
  }

  const getSlideFrontmatter = (route?: RouteLocationNormalized): SlideFrontmatter => {
    const frontmatterFromRoute = route?.meta?.slide?.frontmatter as SlideFrontmatter | undefined
    if (frontmatterFromRoute)
      return frontmatterFromRoute

    const routeNo = Array.isArray(route?.params?.no)
      ? route?.params?.no[0]
      : route?.params?.no

    if (typeof routeNo === 'string' && routeNo) {
      const matchedSlide = slides.value.find((slide) => {
        const slideRouteAlias = slide?.meta?.slide?.frontmatter?.routeAlias
        return String(slide?.no) === routeNo || slideRouteAlias === routeNo
      })
      const frontmatterFromSlides = matchedSlide?.meta?.slide?.frontmatter as SlideFrontmatter | undefined
      if (frontmatterFromSlides)
        return frontmatterFromSlides
    }

    return slides.value[0]?.meta?.slide?.frontmatter as SlideFrontmatter ?? {}
  }

  const updateFontSize = (route: RouteLocationNormalized | undefined) => {
    const frontmatter = getSlideFrontmatter(route)
    applyFontSizes(frontmatter?.fontsize as FontsizeConfig | undefined, getGlobalFontConfig())
  }

  const applyFootnoteDisplay = (route: RouteLocationNormalized | undefined) => {
    if (typeof document === 'undefined')
      return

    const frontmatter = getSlideFrontmatter(route)
    const mode = normalizeFootnoteDisplay(
      frontmatter?.footnoteDisplay
        ?? getGlobalFootnoteDisplay()
        ?? getThemeConfig()?.footnoteDisplay,
    )
    document.documentElement.setAttribute(FOOTNOTE_DISPLAY_ATTR, mode)
    hideFootnotePopover()
    enhanceFootnoteTriggers()
  }

  // Apply font size for the initial route
  updateFontSize(router.currentRoute.value)
  applyFootnoteDisplay(router.currentRoute.value)

  // Apply theme colors and theme presets
  applyThemePresets(getThemeConfig(), getThemeColorConfig())
  setupDarkModeSync(getThemeConfig())
  initializeFootnotePopovers()
  initializeInternalAnchorNavigation(router)
  observeFootnoteLayout()
  observeScrollAreas()

  if (typeof window !== 'undefined') {
    window.requestAnimationFrame(() => {
      enhanceFootnoteTriggers()
      scheduleFootnoteLayoutSync()
      scheduleScrollAreaSync()
      rebuildInternalAnchorTargets()
      void resolvePendingInternalAnchorNavigation(router.currentRoute.value)
    })
  }

  watch(
    () => getSlideFrontmatter(router.currentRoute.value)?.fontsize,
    () => updateFontSize(router.currentRoute.value),
    { deep: true }
  )

  watch(
    () => getSlideFrontmatter(router.currentRoute.value)?.footnoteDisplay,
    () => applyFootnoteDisplay(router.currentRoute.value),
    { deep: true }
  )

  watch(
    () => (configs as any)?.fontsize as FontsizeConfig | undefined,
    () => updateFontSize(router.currentRoute.value),
    { deep: true }
  )

  watch(
    () => (configs as any)?.footnoteDisplay as ThemeConfig['footnoteDisplay'] | undefined,
    () => applyFootnoteDisplay(router.currentRoute.value),
    { deep: true }
  )

  watch(
    () => (configs as any)?.themeColors as ThemeColorConfig | undefined,
    (newConfig) => applyThemeColors(newConfig, getThemeConfig()),
    { deep: true, immediate: true }
  )

  watch(
    () => (configs as any)?.themeConfig as ThemeConfig | undefined,
    (newConfig) => {
      applyThemePresets(newConfig, getThemeColorConfig())
      setupDarkModeSync(newConfig)
      applyFootnoteDisplay(router.currentRoute.value)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => slides.value.map(slide => slide.meta.slide.revision).join('|'),
    () => rebuildInternalAnchorTargets(),
  )

  // Reset theorem numbering state and update font sizing when navigating
  router.afterEach((to) => {
    updateFontSize(to)
    applyFootnoteDisplay(to)
    observeFootnoteLayout()
    observeScrollAreas()
    resetOccurrenceTracker()
    hideFootnotePopover()

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        enhanceFootnoteTriggers()
        scheduleFootnoteLayoutSync()
        scheduleScrollAreaSync()
        void resolvePendingInternalAnchorNavigation(to)
      })
    }

    if (to.path === '/1' || to.path === '/') {
      invalidateTheoremNumberMap()
    }
  })
})
