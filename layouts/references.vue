<template>
  <div class="slidev-layout references flex flex-col h-full">
    <ScholarlyHeader :title="headerTitle" class="flex-shrink-0" />
    <div 
      ref="contentWrapperRef"
      class="flex-grow overflow-hidden content-wrapper flex items-center justify-center"
    >
      <div 
        ref="contentInnerRef"
        class="references-content" 
        :style="computedStyles"
      >
        <slot />
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useSlideContext } from '@slidev/client'
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

const props = defineProps<{
  page?: number
  title?: string
  /** Minimum font size in pixels */
  minFontSize?: number
  /** Maximum font size in pixels */
  maxFontSize?: number
}>()

const { $slidev } = useSlideContext()
const contentWrapperRef = ref<HTMLElement>()
const contentInnerRef = ref<HTMLElement>()

const fontSize = ref<string>('')

const computedStyles = useFontSizeStyles(fontSize)

const headerTitle = computed(() => {
  if (props.title) return props.title
  if (props.page && props.page > 1) {
    return `References (cont.)`
  }
  return 'References'
})

// Auto font size adjustment
const isClient = typeof window !== 'undefined'
let resizeObserver: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined
let rafId: number | null = null

const cancelScheduledAdjust = () => {
  if (rafId !== null && isClient) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

const adjustFontSize = () => {
  if (!isClient) return
  const wrapper = contentWrapperRef.value
  const content = contentInnerRef.value

  if (!wrapper || !content) return

  cancelScheduledAdjust()

  // Reset font size first
  content.style.fontSize = ''
  fontSize.value = ''

  const computedSize = parseFloat(window.getComputedStyle(content).fontSize || '18')
  if (Number.isNaN(computedSize)) {
    fontSize.value = ''
    return
  }

  const minFontSize = props.minFontSize ?? Math.max(10, Math.round(computedSize * 0.4))
  const maxFontSize = props.maxFontSize ?? Math.round(computedSize * 1.2)

  // Get available space
  const wrapperRect = wrapper.getBoundingClientRect()
  const availableHeight = wrapperRect.height - 20
  const availableWidth = wrapperRect.width - 40

  let candidateSize = maxFontSize
  const maxAttempts = 100
  let attempts = 0

  // Try to find the best font size
  content.style.fontSize = `${candidateSize}px`

  while (
    attempts < maxAttempts &&
    (content.scrollHeight > availableHeight || content.scrollWidth > availableWidth)
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
  cancelScheduledAdjust()
  nextTick(() => {
    cancelScheduledAdjust()
    rafId = requestAnimationFrame(() => {
      adjustFontSize()
      rafId = null
    })
  })
}

watch(() => $slidev?.nav?.currentPage, () => {
  scheduleAdjust()
})

watch(() => $slidev?.nav?.clicks, () => {
  scheduleAdjust()
})

watch(
  () => [contentWrapperRef.value, contentInnerRef.value],
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
    if (contentWrapperRef.value) resizeObserver.observe(contentWrapperRef.value)
    if (contentInnerRef.value) resizeObserver.observe(contentInnerRef.value)
  }

  if (typeof MutationObserver !== 'undefined' && contentInnerRef.value) {
    mutationObserver = new MutationObserver(() => scheduleAdjust())
    mutationObserver.observe(contentInnerRef.value, { childList: true, subtree: true, characterData: true })
  }
})

onBeforeUnmount(() => {
  if (!isClient) return

  window.removeEventListener('resize', scheduleAdjust)
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  cancelScheduledAdjust()
})
</script>

<style scoped>
.content-wrapper {
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
}

.references-content {
  width: 100%;
  max-width: 100%;
  line-height: 1.6;
}

/* Style ordered lists as bibliography */
.references-content :deep(ol) {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: ref;
}

.references-content :deep(ol > li) {
  position: relative;
  padding-left: 2.5rem;
  margin-bottom: 0.5em;
  text-indent: -0.5rem;
  padding-right: 1rem;
  counter-increment: ref;
}

.references-content :deep(ol > li::before) {
  content: "[" counter(ref) "]";
  position: absolute;
  left: 0;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #5d8392));
  font-weight: 500;
  font-size: 0.9em;
}

/* Style unordered lists */
.references-content :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

.references-content :deep(ul > li) {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5em;
}

.references-content :deep(ul > li::before) {
  content: "•";
  position: absolute;
  left: 0.5rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #5d8392));
}

/* Author names */
.references-content :deep(strong) {
  font-weight: 600;
}

/* Paper titles */
.references-content :deep(em) {
  font-style: italic;
}

/* Links */
.references-content :deep(a) {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #5d8392));
  text-decoration: none;
}

.references-content :deep(a:hover) {
  text-decoration: underline;
}

/* Bibliography from citation plugin */
.references-content :deep(.bibliography) {
  margin-top: 0;
}

.references-content :deep(.csl-bib-body) {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}

.references-content :deep(.csl-entry) {
  padding: 0.4em 0.6em;
  line-height: 1.5;
}

/* Two column layout for many references */
.references-content.two-columns {
  column-count: 2;
  column-gap: 2rem;
}
</style>
