<template>
  <div
    v-if="tocEnabled"
    class="footer-toc-control"
  >
    <button
      type="button"
      class="beamer-nav-button beamer-nav-button-toc"
      :class="{ 'is-active': isOpen }"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="panelId"
      aria-haspopup="dialog"
      :aria-label="isOpen ? labels.close : labels.open"
      :title="isOpen ? labels.close : labels.open"
      @click="togglePanel"
    >
      <svg
        class="beamer-nav-toc-icon"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M3 3.5V12.5" />
        <path d="M5.5 4H13" />
        <path d="M5.5 8H13" />
        <path d="M5.5 12H10.5" />
      </svg>
    </button>

    <Transition name="footer-toc-backdrop">
      <button
        v-if="isOpen"
        type="button"
        class="footer-toc-backdrop"
        :aria-label="labels.close"
        @click="closePanel"
      />
    </Transition>

    <Transition name="footer-toc-panel">
      <div
        v-if="isOpen"
        ref="panelRef"
        :id="panelId"
        class="footer-toc-panel"
        :aria-label="labels.title"
        role="dialog"
        aria-modal="false"
      >
        <div class="footer-toc-panel-header">
          <div class="footer-toc-panel-heading">
            <div class="footer-toc-panel-title">{{ labels.title }}</div>
            <div class="footer-toc-panel-subtitle">{{ labels.subtitle }}</div>
          </div>
          <div class="footer-toc-panel-actions">
            <button
              type="button"
              class="footer-toc-panel-close"
              :aria-label="labels.close"
              @click="closePanel"
            >
              <svg
                class="footer-toc-panel-close-icon"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M5 5L11 11" />
                <path d="M11 5L5 11" />
              </svg>
            </button>
          </div>
        </div>

        <div
          class="footer-toc-panel-body"
          @scroll.passive="syncPreviewAnchor()"
        >
          <p
            v-if="sectionGroups.length === 0"
            class="footer-toc-empty"
          >
            {{ labels.empty }}
          </p>

          <template v-else>
            <div
              v-for="section in sectionGroups"
              :key="`section-${section.no}-${section.title}`"
              class="footer-toc-section"
              :class="{ 'is-active': section.active }"
            >
              <div
                class="footer-toc-section-header"
                :class="{ 'is-collapsed': compactOutline && !isSectionExpanded(section) }"
              >
                <button
                  type="button"
                  class="footer-toc-section-jump"
                  :data-preview-no="section.no"
                  @mouseenter="setPreviewTarget(section.no, $event)"
                  @focus="setPreviewTarget(section.no, $event)"
                  @click="navigateToSlide(section.no)"
                >
                  <span class="footer-toc-section-index">{{ section.no }}</span>
                  <span class="footer-toc-section-copy">
                    <span class="footer-toc-section-title">{{ section.title }}</span>
                    <span class="footer-toc-section-meta">
                      {{ section.range }} · {{ section.slideCountLabel }}
                    </span>
                  </span>
                </button>
                <button
                  v-if="compactOutline && section.slides.length > 0"
                  type="button"
                  class="footer-toc-section-toggle"
                  :aria-expanded="isSectionExpanded(section) ? 'true' : 'false'"
                  :aria-label="`${isSectionExpanded(section) ? labels.collapseSection : labels.expandSection}: ${section.title}`"
                  :title="`${isSectionExpanded(section) ? labels.collapseSection : labels.expandSection}: ${section.title}`"
                  @click="toggleSectionExpanded(section.no)"
                >
                  <svg class="footer-toc-section-toggle-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5.5 6.5L8 9L10.5 6.5" />
                  </svg>
                </button>
              </div>

              <div
                v-if="section.slides.length > 0 && isSectionExpanded(section)"
                class="footer-toc-slides"
              >
                <button
                  v-for="slide in section.slides"
                  :key="`slide-${slide.no}`"
                  type="button"
                  class="footer-toc-slide"
                  :class="{ 'is-active': slide.active }"
                  :data-preview-no="slide.no"
                  @mouseenter="setPreviewTarget(slide.no, $event)"
                  @focus="setPreviewTarget(slide.no, $event)"
                  @click="navigateToSlide(slide.no)"
                >
                  <span class="footer-toc-slide-index">{{ slide.no }}</span>
                  <span class="footer-toc-slide-title">{{ slide.title }}</span>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>

    <FooterTocPreviewCard
      :visible="previewVisible"
      :route="previewRoute"
      :slide-no="previewTargetNo"
      :clicks-context="previewClicksContext"
      :position-style="previewPositionStyle"
    />
  </div>
</template>

<script setup lang="ts">
import type { ClicksContext, SlideRoute } from '@slidev/types'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { slideAspect, useSlideContext } from '@slidev/client'
import { isInteractiveSlideRoute } from '../utils/presentationMode'
import { CLICKS_MAX, createFixedClicks } from '../utils/fixedClicks'
import { sanitizeMarkdownHeadingTitle } from '../utils/outlineTitle'
import {
  formatSectionRange,
  formatSlideCount,
  shouldUseCompactOutline,
  type FooterTocSectionGroup,
  type FooterTocSlideItem,
} from '../utils/footerToc'
import FooterTocPreviewCard from './FooterTocPreviewCard.vue'

interface PreviewAnchorRect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

type TocSlideItem = FooterTocSlideItem

interface TocSectionGroup extends FooterTocSectionGroup {
  range: string
  slideCountLabel: string
}

const panelOpen = ref<boolean | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const previewVisible = ref(false)
const previewTargetNo = ref<number | null>(null)
const previewAnchorRect = ref<PreviewAnchorRect | null>(null)
const previewAnchorEl = ref<HTMLElement | null>(null)
const expandedSectionNos = ref<Set<number>>(new Set())
const lastCompactMode = ref(false)

const { $slidev } = useSlideContext()
const slidevConfigs = computed(() => ($slidev.configs as any) || {})
const themeConfig = computed(() => slidevConfigs.value?.themeConfig || {})
const currentPage = computed(() => $slidev.nav.currentPage)
const allSlides = computed(() => (($slidev.nav as any).slides || []) as SlideRoute[])
const previewContexts = new Map<number, ClicksContext>()
const desktopHover = ref(false)
const viewportWidth = ref(0)
const viewportHeight = ref(0)
let hoverMediaQuery: MediaQueryList | null = null

const tocEnabled = computed(() => {
  const enabled = themeConfig.value?.outlineToc ?? themeConfig.value?.outlineSidebar
  if (enabled !== true)
    return false

  return isInteractiveSlideRoute()
})

const initialOpen = computed(() => {
  return themeConfig.value?.outlineTocOpen === true || themeConfig.value?.outlineSidebarOpen === true
})

if (panelOpen.value === null)
  panelOpen.value = initialOpen.value

const isOpen = computed(() => panelOpen.value === true)
const previewEnabled = computed(() => tocEnabled.value && desktopHover.value && viewportWidth.value >= 1100)
const panelId = 'scholarly-footer-toc-panel'
const previewCardWidthPx = 248
const previewCardHeightPx = computed(() => previewCardWidthPx / slideAspect.value)
const previewGapPx = 12
const previewViewportPaddingPx = 12

const isChinese = computed(() => `${slidevConfigs.value?.lang || ''}`.toLowerCase().startsWith('zh'))

const labels = computed(() => {
  if (isChinese.value) {
    return {
      title: '演示目录',
      subtitle: '按 section 分组，点击即可跳转',
      open: '打开目录面板',
      close: '关闭目录面板',
      empty: '当前没有可显示的目录项。请使用 section 页，或为幻灯片添加标题。',
      ungrouped: '开场',
      expandSection: '展开 section',
      collapseSection: '折叠 section',
      slideSingular: '页',
      slidePlural: '页',
    }
  }

  return {
    title: 'Presentation Outline',
    subtitle: 'Grouped by section for quick jumps',
    open: 'Open outline panel',
    close: 'Close outline panel',
    empty: 'No outline items available. Add section slides or slide titles.',
    ungrouped: 'Opening',
    expandSection: 'Expand section',
    collapseSection: 'Collapse section',
    slideSingular: 'slide',
    slidePlural: 'slides',
  }
})

const getSlideMeta = (slide: any) => {
  return slide?.meta?.slide || slide?.slide || {}
}

const getSlideFrontmatter = (slide: any) => {
  return getSlideMeta(slide)?.frontmatter || slide?.frontmatter || {}
}

const getSlideRawContent = (slide: any) => {
  return getSlideMeta(slide)?.content || slide?.content || ''
}

const getSlideTitle = (slide: any, fallback: string) => {
  const frontmatter = getSlideFrontmatter(slide)
  const title = getSlideMeta(slide)?.title
    || slide?.title
    || frontmatter.title

  if (typeof title === 'string' && title.trim()) {
    const sanitizedTitle = sanitizeMarkdownHeadingTitle(title)
    if (sanitizedTitle)
      return sanitizedTitle
  }

  const rawContent = getSlideRawContent(slide)
  const h1Match = rawContent.match(/^#\s+(.+)$/m)
  if (h1Match?.[1]?.trim())
    return sanitizeMarkdownHeadingTitle(h1Match[1])

  return fallback
}

const sectionGroups = computed<TocSectionGroup[]>(() => {
  const groups: TocSectionGroup[] = []
  let currentGroup: TocSectionGroup | null = null

  const ensureOpeningGroup = () => {
    if (!currentGroup) {
      currentGroup = {
        no: 1,
        title: labels.value.ungrouped,
        active: false,
        slides: [],
        range: '',
        slideCountLabel: '',
      }
      groups.push(currentGroup)
    }
    return currentGroup
  }

  for (let i = 0; i < allSlides.value.length; i++) {
    const slide = allSlides.value[i]
    const frontmatter = getSlideFrontmatter(slide)
    const layout = frontmatter.layout || (i === 0 ? 'cover' : 'default')
    const hideInToc = Boolean(frontmatter.hideInToc)
    const slideNo = i + 1

    if (layout === 'section') {
      if (hideInToc)
        continue

      currentGroup = {
        no: slideNo,
        title: getSlideTitle(slide, `Section ${groups.length + 1}`),
        active: false,
        slides: [],
        range: '',
        slideCountLabel: '',
      }
      groups.push(currentGroup)
      continue
    }

    if (hideInToc)
      continue

    const title = getSlideTitle(slide, '')
    if (!title)
      continue

    const targetGroup = currentGroup || ensureOpeningGroup()
    targetGroup.slides.push({
      no: slideNo,
      title,
      active: currentPage.value === slideNo,
    })
  }

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    const nextGroup = groups[i + 1]
    const inCurrentRange = currentPage.value >= group.no && (!nextGroup || currentPage.value < nextGroup.no)
    group.active = inCurrentRange || group.slides.some(slide => slide.active)
  }

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    const nextGroup = groups[i + 1]
    group.range = formatSectionRange(group, nextGroup, allSlides.value.length)
    group.slideCountLabel = formatSlideCount(
      group.slides.length,
      labels.value.slideSingular,
      labels.value.slidePlural,
    )
  }

  return groups
})

const compactOutline = computed(() => shouldUseCompactOutline(sectionGroups.value))

const activeSectionNo = computed(() => {
  return sectionGroups.value.find(section => section.active)?.no ?? null
})

const isSectionExpanded = (section: TocSectionGroup) => {
  return !compactOutline.value || expandedSectionNos.value.has(section.no)
}

const setSectionExpanded = (sectionNo: number, expanded: boolean) => {
  const next = new Set(expandedSectionNos.value)
  if (expanded)
    next.add(sectionNo)
  else
    next.delete(sectionNo)
  expandedSectionNos.value = next
}

const toggleSectionExpanded = (sectionNo: number) => {
  setSectionExpanded(sectionNo, !expandedSectionNos.value.has(sectionNo))
}

const ensureSectionExpanded = (sectionNo: number | null) => {
  if (!sectionNo)
    return
  setSectionExpanded(sectionNo, true)
}

watch(
  [compactOutline, activeSectionNo],
  ([compact, activeNo]) => {
    if (!compact) {
      expandedSectionNos.value = new Set()
      lastCompactMode.value = false
      return
    }

    if (!lastCompactMode.value) {
      expandedSectionNos.value = new Set(activeNo ? [activeNo] : [])
      lastCompactMode.value = true
      return
    }

    ensureSectionExpanded(activeNo)
  },
  { immediate: true },
)

const previewableSlideNos = computed(() => {
  const slideNos: number[] = []
  for (const section of sectionGroups.value) {
    slideNos.push(section.no)
    for (const slide of section.slides)
      slideNos.push(slide.no)
  }
  return slideNos
})

const currentOutlineTargetNo = computed(() => {
  if (previewableSlideNos.value.includes(currentPage.value))
    return currentPage.value

  if (activeSectionNo.value)
    return activeSectionNo.value

  return previewableSlideNos.value[0] ?? null
})

const fallbackPreviewTargetNo = computed(() => {
  return currentOutlineTargetNo.value
})

const previewRoute = computed<SlideRoute | null>(() => {
  if (!previewTargetNo.value)
    return null

  return allSlides.value[previewTargetNo.value - 1] || null
})

const previewClicksContext = computed<ClicksContext | null>(() => {
  const route = previewRoute.value
  if (!route)
    return null

  let context = previewContexts.get(route.no)
  if (!context) {
    context = createFixedClicks(route, CLICKS_MAX)
    previewContexts.set(route.no, context)
  }

  return context
})

const previewPositionStyle = computed(() => {
  if (!previewVisible.value || !previewEnabled.value || !previewAnchorRect.value || !panelRef.value)
    return null

  const panelRect = panelRef.value.getBoundingClientRect()
  const anchorRect = previewAnchorRect.value
  const headerHeight = getChromeInset('--scholarly-header-height', 56)
  const footerHeight = getChromeInset('--scholarly-footer-height', 36)
  const previewHeight = previewCardHeightPx.value

  const maxTop = Math.max(
    headerHeight + previewViewportPaddingPx,
    viewportHeight.value - footerHeight - previewHeight - previewViewportPaddingPx,
  )
  const left = Math.max(
    previewViewportPaddingPx,
    panelRect.left - previewCardWidthPx - previewGapPx,
  )
  const top = clampValue(
    anchorRect.top + anchorRect.height / 2 - previewHeight / 2,
    headerHeight + previewViewportPaddingPx,
    maxTop,
  )

  return {
    left: `${left}px`,
    top: `${top}px`,
  }
})

const setPreviewTarget = (slideNo: number, event: MouseEvent | FocusEvent) => {
  if (!previewEnabled.value)
    return

  const target = event.currentTarget
  if (!(target instanceof HTMLElement))
    return

  previewTargetNo.value = slideNo
  previewAnchorEl.value = target
  syncPreviewAnchor(target)
  previewVisible.value = true
}

const syncPreviewAnchor = (source?: HTMLElement | Event) => {
  if (!previewEnabled.value || !isOpen.value) {
    previewAnchorRect.value = null
    return
  }

  let element: HTMLElement | null = null

  if (source instanceof HTMLElement) {
    element = source
  }
  else if (source instanceof Event && source.currentTarget instanceof HTMLElement) {
    element = source.currentTarget
  }
  else {
    element = previewAnchorEl.value
  }

  if (!element) {
    previewAnchorRect.value = null
    return
  }

  const rect = element.getBoundingClientRect()
  previewAnchorEl.value = element
  previewAnchorRect.value = {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  }
}

const syncPreviewToTargetNo = async (slideNo: number | null) => {
  if (!slideNo || !previewEnabled.value || !isOpen.value) {
    previewVisible.value = false
    previewTargetNo.value = slideNo
    previewAnchorEl.value = null
    previewAnchorRect.value = null
    return
  }

  previewTargetNo.value = slideNo
  await nextTick()

  const element = panelRef.value?.querySelector<HTMLElement>(`[data-preview-no="${slideNo}"]`) || null
  if (!element) {
    previewVisible.value = false
    previewAnchorEl.value = null
    previewAnchorRect.value = null
    return
  }

  previewAnchorEl.value = element
  syncPreviewAnchor(element)
  previewVisible.value = true
}

watch(
  [isOpen, previewEnabled, fallbackPreviewTargetNo],
  async ([open, enabled, fallbackTarget]) => {
    if (!open || !enabled || !fallbackTarget) {
      previewVisible.value = false
      previewTargetNo.value = null
      previewAnchorEl.value = null
      previewAnchorRect.value = null
      return
    }

    await syncPreviewToTargetNo(fallbackTarget)
  },
  { immediate: true },
)

watch(previewEnabled, async (enabled) => {
  if (!enabled) {
    previewVisible.value = false
    previewAnchorEl.value = null
    previewAnchorRect.value = null
    return
  }

  if (isOpen.value)
    await syncPreviewToTargetNo(fallbackPreviewTargetNo.value)
})

const closePanel = () => {
  panelOpen.value = false
  previewVisible.value = false
  previewAnchorEl.value = null
  previewAnchorRect.value = null
}

const scrollToPreviewNo = async (slideNo: number | null, block: ScrollLogicalPosition = 'center') => {
  await nextTick()
  if (!slideNo || !panelRef.value)
    return

  const body = panelRef.value.querySelector('.footer-toc-panel-body')
  if (!body)
    return

  const target = body.querySelector<HTMLElement>(`[data-preview-no="${slideNo}"]`)
  if (target) {
    target.scrollIntoView({ block, behavior: 'smooth' })
    await syncPreviewToTargetNo(slideNo)
  }
}

const scrollToActiveItem = async () => {
  ensureSectionExpanded(activeSectionNo.value)
  await scrollToPreviewNo(currentOutlineTargetNo.value, 'center')
}

const togglePanel = async () => {
  panelOpen.value = !isOpen.value
  if (panelOpen.value) {
    await scrollToActiveItem()
  }
}

const navigateToSlide = async (slideNo: number) => {
  if (slideNo <= 0)
    return

  await $slidev.nav.go(slideNo)
  closePanel()
  await restorePresentationFocus()
}

const restorePresentationFocus = async () => {
  if (typeof window === 'undefined')
    return

  await nextTick()

  window.requestAnimationFrame(() => {
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement)
      activeElement.blur()

    const currentSlide = document.querySelector<HTMLElement>(`.slidev-page[data-slidev-no="${currentPage.value}"]`)
    const focusTarget = currentSlide?.querySelector<HTMLElement>('.slidev-layout')
      ?? currentSlide
      ?? document.body

    if (!focusTarget)
      return

    const hadTabIndex = focusTarget.hasAttribute('tabindex')
    if (!hadTabIndex)
      focusTarget.setAttribute('tabindex', '-1')

    focusTarget.dataset.scholarlyTocFocusTarget = 'true'
    focusTarget.focus({ preventScroll: true })

    const cleanup = () => {
      delete focusTarget.dataset.scholarlyTocFocusTarget
      if (!hadTabIndex)
        focusTarget.removeAttribute('tabindex')
      focusTarget.removeEventListener('blur', cleanup)
    }
    focusTarget.addEventListener('blur', cleanup, { once: true })
  })
}

const clampValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

const getChromeInset = (cssVarName: string, fallback: number) => {
  if (typeof window === 'undefined')
    return fallback

  const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue(cssVarName)
  const parsed = Number.parseFloat(rawValue)
  return Number.isFinite(parsed) ? parsed : fallback
}

const refreshPreviewEnvironment = () => {
  if (typeof window === 'undefined')
    return

  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
  desktopHover.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

const handleViewportChange = () => {
  refreshPreviewEnvironment()
  syncPreviewAnchor()
}

const handleHoverModeChange = () => {
  refreshPreviewEnvironment()
  syncPreviewAnchor()
}

onMounted(() => {
  if (typeof window === 'undefined')
    return

  refreshPreviewEnvironment()
  hoverMediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  window.addEventListener('resize', handleViewportChange, { passive: true })

  if ('addEventListener' in hoverMediaQuery)
    hoverMediaQuery.addEventListener('change', handleHoverModeChange)
  else
    hoverMediaQuery.addListener(handleHoverModeChange)
})

onUnmounted(() => {
  if (typeof window === 'undefined')
    return

  window.removeEventListener('resize', handleViewportChange)

  if (!hoverMediaQuery)
    return

  if ('removeEventListener' in hoverMediaQuery)
    hoverMediaQuery.removeEventListener('change', handleHoverModeChange)
  else
    hoverMediaQuery.removeListener(handleHoverModeChange)
})
</script>

<style scoped>
/* ============================================================================
   FooterTocControl — Dark Liquid Glass Outline Panel
   Matches the scholarly theme's dark chrome toolbar aesthetic.
   Uses layered translucent gradients, backdrop-filter blur, and gold accents.
   ============================================================================ */

.footer-toc-control {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding-right: 0.18rem;
  margin-right: 0.02rem;
}

/* -- Trigger button -------------------------------------------------------- */

.beamer-nav-button-toc {
  position: relative;
  overflow: hidden;
  border-color: color-mix(in srgb, var(--scholarly-toolbar-divider, rgba(255, 255, 255, 0.22)) 78%, transparent);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04)),
    color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 18%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0.18rem 0.42rem rgba(5, 18, 36, 0.12);
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
}

.beamer-nav-button-toc::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.22), transparent 55%);
  opacity: 0.56;
}

.beamer-nav-button-toc:hover:not(:disabled),
.beamer-nav-button-toc:focus-visible,
.beamer-nav-button-toc.is-active {
  border-color: color-mix(in srgb, var(--scholarly-accent, #b8860b) 36%, rgba(255, 255, 255, 0.16) 64%);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.06)),
    color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 26%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0.22rem 0.56rem rgba(5, 18, 36, 0.18);
}

/* -- Backdrop overlay ------------------------------------------------------ */

.footer-toc-backdrop {
  position: fixed;
  inset: 0;
  z-index: 54;
  border: 0;
  background: rgba(10, 22, 40, 0.12);
}

/* -- Panel container — dark liquid glass ----------------------------------- */

.footer-toc-panel {
  position: fixed;
  right: 0.9rem;
  bottom: calc(var(--scholarly-footer-height) + 0.4rem);
  z-index: 55;
  width: min(16.2rem, calc(100vw - 1.4rem));
  max-height: min(18.5rem, calc(100vh - var(--scholarly-header-height) - var(--scholarly-footer-height) - 1.05rem));
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Glass border — subtle luminous edge */
  border: 1px solid color-mix(in srgb, var(--slidev-theme-primary-light, #2c5282) 28%, rgba(255, 255, 255, 0.12) 72%);
  border-radius: 0.62rem;

  /* Dark translucent glass surface */
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--slidev-theme-primary-light, #2c5282) 18%, rgba(255, 255, 255, 0.06) 82%) 0%,
      transparent 40%
    ),
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 90%, #0d1f38 10%),
      color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 82%, #0a1628 18%) 50%,
      color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 88%, #111b2e 12%)
    );
  color: rgba(255, 255, 255, 0.92);

  /* Layered shadows: specular highlight + depth + colored halo */
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04),
    0 1.2rem 3rem rgba(10, 22, 40, 0.42),
    0 0.35rem 1.1rem rgba(10, 22, 40, 0.22),
    0 0 0 0.5px rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(28px) saturate(1.6);
  -webkit-backdrop-filter: blur(28px) saturate(1.6);
}

/* -- Panel header — frosted dark strip ------------------------------------- */

.footer-toc-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.62rem 0.66rem 0.52rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 80%),
    color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 30%, transparent);
}

.footer-toc-panel-heading {
  min-width: 0;
}

.footer-toc-panel-actions {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.footer-toc-panel-title {
  font-family: var(--scholarly-font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
}

.footer-toc-panel-subtitle {
  margin-top: 0.1rem;
  font-size: 0.56rem;
  line-height: 1.28;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.55);
}

/* -- Close button — dark glass mini-button --------------------------------- */

.footer-toc-panel-close {
  width: 1.24rem;
  height: 1.24rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.34rem;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)),
    color-mix(in srgb, var(--slidev-theme-primary-light, #2c5282) 32%, transparent);
  color: rgba(255, 255, 255, 0.72);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0.12rem 0.36rem rgba(0, 0, 0, 0.12);
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease, color 180ms ease;
}

.footer-toc-panel-close-icon {
  width: 0.6rem;
  height: 0.6rem;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* -- Panel body — scrollable area ------------------------------------------ */

.footer-toc-panel-body {
  flex: 1;
  overflow: auto;
  padding: 0.38rem;
  background: transparent;
  scrollbar-width: thin;
  scrollbar-gutter: stable;
  scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
}

.footer-toc-empty {
  margin: 0;
  padding: 0.42rem;
  font-size: 0.68rem;
  line-height: 1.38;
  color: rgba(255, 255, 255, 0.5);
}

/* -- Section cards — dark glass tiles -------------------------------------- */

.footer-toc-section + .footer-toc-section {
  margin-top: 0.22rem;
}

.footer-toc-section {
  padding: 0.14rem;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0.46rem;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
    color-mix(in srgb, var(--slidev-theme-primary-light, #2c5282) 14%, transparent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0.1rem 0.32rem rgba(0, 0, 0, 0.08);
  transition: border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
}

/* Active section — scholarly gold accent */
.footer-toc-section.is-active {
  border-color: color-mix(in srgb, var(--scholarly-accent, #b8860b) 32%, rgba(255, 255, 255, 0.1) 68%);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
    color-mix(in srgb, var(--scholarly-accent, #b8860b) 8%, color-mix(in srgb, var(--slidev-theme-primary-light, #2c5282) 18%, transparent) 92%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 2px 0 0 color-mix(in srgb, var(--scholarly-accent, #b8860b) 62%, transparent),
    0 0.14rem 0.5rem rgba(0, 0, 0, 0.1),
    0 0 0.6rem color-mix(in srgb, var(--scholarly-accent, #b8860b) 8%, transparent);
}

.footer-toc-section-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.18rem;
  border-radius: 0.36rem;
  background: transparent;
}

.footer-toc-section.is-active .footer-toc-section-header {
  background: rgba(255, 255, 255, 0.04);
}

/* -- Section jump button --------------------------------------------------- */

.footer-toc-section-jump {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.36rem;
  min-height: 1.68rem;
  padding: 0.28rem 0.34rem;
  border: 0;
  border-radius: 0.36rem;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
}

.footer-toc-section-copy {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 0.08rem;
}

.footer-toc-section-meta {
  font-size: 0.52rem;
  line-height: 1.12;
  color: rgba(255, 255, 255, 0.42);
}

/* -- Section toggle — dark glass expand/collapse --------------------------- */

.footer-toc-section-toggle {
  width: 1.34rem;
  min-width: 1.34rem;
  height: 1.34rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.34rem;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
    color-mix(in srgb, var(--slidev-theme-primary-light, #2c5282) 20%, transparent);
  color: rgba(255, 255, 255, 0.62);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0.08rem 0.28rem rgba(0, 0, 0, 0.1);
  transition: background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease, color 200ms ease;
}

.footer-toc-section-toggle-icon {
  width: 0.58rem;
  height: 0.58rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 180ms ease;
}

.footer-toc-section-toggle[aria-expanded='true'] .footer-toc-section-toggle-icon {
  transform: rotate(180deg);
}

/* -- Index badges ---------------------------------------------------------- */

.footer-toc-section-index,
.footer-toc-slide-index {
  min-width: 1.02rem;
  height: 1.02rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.34rem;
  font-family: var(--scholarly-font-sans);
  font-size: 0.52rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* Section badge — luminous accent pill */
.footer-toc-section-index {
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.14), transparent 60%),
    color-mix(in srgb, var(--scholarly-accent, #b8860b) 72%, var(--slidev-theme-primary, #1e3a5f) 28%);
  color: #fff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 0.08rem 0.24rem rgba(0, 0, 0, 0.14);
}

.footer-toc-section-title {
  flex: 1;
  min-width: 0;
  font-family: var(--scholarly-font-sans);
  font-size: 0.66rem;
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.94);
  overflow-wrap: anywhere;
}

/* -- Slide items ----------------------------------------------------------- */

.footer-toc-slides {
  margin-top: 0.1rem;
  padding: 0.04rem 0 0.02rem 0.12rem;
}

.footer-toc-slide {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 0.32rem;
  padding: 0.2rem 0.28rem;
  border: 0;
  border-radius: 0.34rem;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
}

/* -- Hover & focus states — glass brightening ------------------------------ */

.footer-toc-slide:hover,
.footer-toc-slide:focus-visible,
.footer-toc-section-jump:hover,
.footer-toc-section-jump:focus-visible {
  outline: none;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)),
    rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.footer-toc-section-jump:focus-visible,
.footer-toc-slide:focus-visible {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 0 1.5px color-mix(in srgb, var(--scholarly-accent, #b8860b) 42%, transparent);
}

.footer-toc-section-toggle:hover,
.footer-toc-section-toggle:focus-visible,
.footer-toc-panel-close:hover,
.footer-toc-panel-close:focus-visible {
  outline: none;
  border-color: rgba(255, 255, 255, 0.2);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04)),
    color-mix(in srgb, var(--slidev-theme-primary-light, #2c5282) 36%, transparent);
  color: rgba(255, 255, 255, 0.92);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 0.14rem 0.4rem rgba(0, 0, 0, 0.14);
}

.footer-toc-panel-close:hover,
.footer-toc-panel-close:focus-visible {
  transform: translateY(-0.5px);
}

.footer-toc-section-toggle:hover,
.footer-toc-section-toggle:focus-visible {
  transform: translateY(-0.5px);
}

/* Slide index badge — translucent pill on dark */
.footer-toc-slide-index {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Active slide — subtle accent glow */
.footer-toc-slide.is-active {
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.06), transparent),
    color-mix(in srgb, var(--scholarly-accent, #b8860b) 10%, transparent);
}

.footer-toc-slide.is-active .footer-toc-slide-index {
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.12), transparent 60%),
    color-mix(in srgb, var(--scholarly-accent, #b8860b) 68%, var(--slidev-theme-primary, #1e3a5f) 32%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 0.06rem 0.2rem rgba(0, 0, 0, 0.12);
}

.footer-toc-slide-title {
  flex: 1;
  min-width: 0;
  font-size: 0.63rem;
  line-height: 1.24;
  color: rgba(255, 255, 255, 0.76);
  overflow-wrap: anywhere;
}

.footer-toc-slide.is-active .footer-toc-slide-title {
  color: rgba(255, 255, 255, 0.92);
}

/* -- Panel transitions — spring-like entrance ------------------------------ */

.footer-toc-panel-enter-active,
.footer-toc-panel-leave-active {
  transition: opacity 240ms cubic-bezier(0.22, 0.68, 0.35, 1), transform 240ms cubic-bezier(0.22, 0.68, 0.35, 1);
}

.footer-toc-panel-enter-from,
.footer-toc-panel-leave-to {
  opacity: 0;
  transform: translateY(0.55rem) scale(0.96);
}

.footer-toc-backdrop-enter-active,
.footer-toc-backdrop-leave-active {
  transition: opacity 200ms ease;
}

.footer-toc-backdrop-enter-from,
.footer-toc-backdrop-leave-to {
  opacity: 0;
}

/* -- Responsive ------------------------------------------------------------ */

@media (max-width: 900px) {
  .footer-toc-panel {
    right: 0.5rem;
    width: min(15rem, calc(100vw - 1rem));
  }

  .footer-toc-section-toggle {
    width: 1.22rem;
    min-width: 1.22rem;
    height: 1.22rem;
  }
}

/* -- Reduced motion -------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .footer-toc-panel-enter-active,
  .footer-toc-panel-leave-active,
  .footer-toc-backdrop-enter-active,
  .footer-toc-backdrop-leave-active {
    transition: none;
  }
}

/* -- Print ----------------------------------------------------------------- */

@media print {
  .footer-toc-control,
  .footer-toc-backdrop,
  .footer-toc-panel {
    display: none !important;
  }
}
</style>
