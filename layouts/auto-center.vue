<template>
  <div 
    class="slidev-layout auto-center flex flex-col h-full"
  >
    <ScholarlyHeader ref="headerRef" class="flex-shrink-0" :title="headerTitle" :subtitle="headerSubtitle" />
    <div
      ref="contentWrapperRef"
      class="flex-grow overflow-hidden content-wrapper flex items-center justify-center"
      :class="{ 'no-header': !hasHeaderContent }"
    >
      <div
        ref="contentInnerRef"
        class="content-inner"
        :style="computedStyles"
      >
        <slot />
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useAutoFontSize } from '../utils/useAutoFontSize'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

const props = defineProps<{
  /** Override header title */
  title?: string
  /** Override header subtitle */
  subtitle?: string
  /** Minimum font size in pixels */
  minFontSize?: number
  /** Maximum font size in pixels */
  maxFontSize?: number
}>()

const { $slidev } = useSlideContext()
const headerRef = ref()
const contentWrapperRef = ref<HTMLElement>()
const contentInnerRef = ref<HTMLElement>()

// Get frontmatter settings
const frontmatter = computed(() => {
  return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
})

// Check if frontmatter has title/subtitle
const hasHeaderContent = computed(() => {
  return !!(frontmatter.value?.title || frontmatter.value?.subtitle || props.title || props.subtitle)
})

// Header title: from props > frontmatter
const headerTitle = computed(() => {
  if (props.title) return props.title
  if (frontmatter.value?.title) return frontmatter.value.title
  return ''
})

// Header subtitle: from props > frontmatter
const headerSubtitle = computed(() => {
  if (props.subtitle) return props.subtitle
  if (frontmatter.value?.subtitle) return frontmatter.value.subtitle
  return ''
})

const { fontSize } = useAutoFontSize(contentWrapperRef, contentInnerRef, {
  minFontSizePx: computed(() => props.minFontSize ?? 16),
  maxFontSizePx: computed(() => props.maxFontSize),
  strategy: 'fit',
})

const computedStyles = useFontSizeStyles(fontSize)
</script>

<style scoped>
.content-wrapper {
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
}

.content-wrapper.no-header {
  padding-top: 10px;
}

.content-inner {
  width: 100%;
  max-width: 100%;
  text-align: left;
}

.content-wrapper :deep(h1),
.content-wrapper :deep(h2),
.content-wrapper :deep(h3),
.content-wrapper :deep(p),
.content-wrapper :deep(ul),
.content-wrapper :deep(ol) {
  text-align: left;
}

.content-wrapper :deep(.theorem-box) {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}

/* Reduce spacing for auto-centered content */
.content-wrapper :deep(h1) {
  margin-bottom: 0.5em;
}

.content-wrapper :deep(h2) {
  margin-bottom: 0.4em;
}

.content-wrapper :deep(h3) {
  margin-bottom: 0.3em;
}

.content-wrapper :deep(p) {
  margin-bottom: 0.5em;
}

.content-wrapper :deep(ul),
.content-wrapper :deep(ol) {
  margin-bottom: 0.5em;
}

.content-wrapper :deep(li) {
  margin-bottom: 0.25em;
}
</style>
