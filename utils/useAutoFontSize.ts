import type { Ref } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

type AutoFontSizeStrategy = 'shrink' | 'fit'
type MaybeRef<T> = T | Ref<T>

interface UseAutoFontSizeOptions {
  /**
   * Minimum font size in pixels when auto-adjusting.
   * Defaults to 60% of the current computed size, but not lower than 16px.
   */
  minFontSizePx?: MaybeRef<number | undefined>
  /**
   * Maximum font size in pixels when fitting content to the available area.
   * Only used when `strategy` is `fit`.
   */
  maxFontSizePx?: MaybeRef<number | undefined>
  /**
   * Auto-sizing behavior.
   * - `shrink`: keep the current font size unless the content overflows
   * - `fit`: grow up to a ceiling, then shrink until content fits
   */
  strategy?: MaybeRef<AutoFontSizeStrategy | undefined>
  /**
   * Multiplier used to derive a default maximum size in `fit` mode.
   */
  growthFactor?: MaybeRef<number | undefined>
}

interface UseAutoFontSizeReturn {
  fontSize: Ref<string>
  isExplicit: Ref<boolean>
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

    // Accept values with CSS units (px, rem, em, %, etc.)
    const numeric = Number(trimmed)
    if (!Number.isNaN(numeric)) {
      return `${numeric}px`
    }
    return trimmed
  }

  return null
}

const resolveBodyFontSize = (value: unknown): string | null => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const body = (value as any).body ?? (value as any).base ?? (value as any).default
    return normalizeFontSize(body)
  }
  return normalizeFontSize(value)
}

const parsePxValue = (value: string | null | undefined): number => {
  if (!value)
    return 0

  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function useAutoFontSize(
  wrapperRef: Ref<HTMLElement | undefined>,
  contentRef: Ref<HTMLElement | undefined>,
  options: UseAutoFontSizeOptions = {},
): UseAutoFontSizeReturn {
  const { $slidev } = useSlideContext()
  const isClient = typeof window !== 'undefined'
  const fontSize = ref<string>('')
  const slidevConfigs = computed(() => ($slidev?.configs as any) || {})
  const currentFrontmatter = computed(() => {
    return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
  })

  const explicitFontSize = computed(() => {
    const local = resolveBodyFontSize(currentFrontmatter.value?.fontsize)
    if (local) return local
    return resolveBodyFontSize(slidevConfigs.value?.fontsize)
  })
  const isExplicit = computed(() => !!explicitFontSize.value)

  let resizeObserver: ResizeObserver | undefined
  let mutationObserver: MutationObserver | undefined
  let rafId: number | null = null
  let nextTickPending = false
  let scheduleEpoch = 0

  const cancelScheduledAdjust = () => {
    scheduleEpoch += 1
    nextTickPending = false
    if (rafId !== null && isClient) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  const adjustFontSize = () => {
    if (!isClient) return
    const wrapper = wrapperRef.value
    const content = contentRef.value

    if (!wrapper || !content) return

    if (explicitFontSize.value) {
      fontSize.value = explicitFontSize.value
      return
    }

    fontSize.value = ''
    content.style.fontSize = ''

    const computedSize = parseFloat(window.getComputedStyle(content).fontSize || '16')
    if (Number.isNaN(computedSize)) {
      fontSize.value = ''
      return
    }

    let candidateSize = computedSize
    const strategy = unref(options.strategy) ?? 'shrink'
    const minFontSize = unref(options.minFontSizePx) ?? Math.max(16, Math.round(computedSize * 0.6))
    const growthFactor = unref(options.growthFactor) ?? 1.5
    const maxFontSize = unref(options.maxFontSizePx) ?? Math.round(computedSize * growthFactor)
    const maxAttempts = 80
    let attempts = 0
    const wrapperStyles = window.getComputedStyle(wrapper)
    const availableHeight = Math.max(0, wrapper.clientHeight - parsePxValue(wrapperStyles.paddingTop) - parsePxValue(wrapperStyles.paddingBottom))
    const availableWidth = Math.max(0, wrapper.clientWidth - parsePxValue(wrapperStyles.paddingLeft) - parsePxValue(wrapperStyles.paddingRight))

    if (strategy === 'fit') {
      candidateSize = Math.max(minFontSize, maxFontSize)
      content.style.fontSize = `${candidateSize}px`
    }

    while (
      attempts < maxAttempts
      && (content.scrollHeight > availableHeight || content.scrollWidth > availableWidth)
    ) {
      candidateSize -= 1
      if (candidateSize <= minFontSize) {
        candidateSize = minFontSize
        break
      }
      content.style.fontSize = `${candidateSize}px`
      attempts += 1
    }

    content.style.fontSize = `${candidateSize}px`
    fontSize.value = `${candidateSize}px`
  }

  const scheduleAdjust = () => {
    if (!isClient) return
    if (nextTickPending || rafId !== null)
      return

    const epoch = scheduleEpoch
    nextTickPending = true
    nextTick(() => {
      if (epoch !== scheduleEpoch)
        return

      nextTickPending = false
      rafId = requestAnimationFrame(() => {
        if (epoch !== scheduleEpoch) {
          rafId = null
          return
        }

        adjustFontSize()
        rafId = null
      })
    })
  }

  watch(explicitFontSize, () => {
    scheduleAdjust()
  }, { immediate: true })

  watch(() => $slidev?.nav?.currentPage, () => {
    scheduleAdjust()
  })

  watch(() => $slidev?.nav?.clicks, () => {
    scheduleAdjust()
  })

  watch(
    () => [wrapperRef.value, contentRef.value],
    () => {
      scheduleAdjust()
    },
  )

  onMounted(() => {
    if (!isClient) return

    scheduleAdjust()
    window.addEventListener('resize', scheduleAdjust)

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => scheduleAdjust())
      if (wrapperRef.value) resizeObserver.observe(wrapperRef.value)
    }

    if (typeof MutationObserver !== 'undefined' && contentRef.value) {
      mutationObserver = new MutationObserver(() => scheduleAdjust())
      mutationObserver.observe(contentRef.value, { childList: true, subtree: true, characterData: true })
    }
  })

  onBeforeUnmount(() => {
    if (!isClient) return

    window.removeEventListener('resize', scheduleAdjust)
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()
    cancelScheduledAdjust()
  })

  return {
    fontSize,
    isExplicit,
  }
}
