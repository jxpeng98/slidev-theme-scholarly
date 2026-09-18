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
import { ref, computed } from 'vue'
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useAutoFontSize } from '../utils/useAutoFontSize'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

const props = defineProps<{
  page?: number
  title?: string
  /** Minimum font size in pixels */
  minFontSize?: number
  /** Maximum font size in pixels */
  maxFontSize?: number
}>()

const contentWrapperRef = ref<HTMLElement>()
const contentInnerRef = ref<HTMLElement>()

const headerTitle = computed(() => {
  if (props.title) return props.title
  if (props.page && props.page > 1) {
    return `References (cont.)`
  }
  return 'References'
})

const { fontSize } = useAutoFontSize(contentWrapperRef, contentInnerRef, {
  minFontSizePx: computed(() => props.minFontSize ?? 16),
  maxFontSizePx: computed(() => props.maxFontSize),
  strategy: 'fit',
  growthFactor: 1.2,
})

const computedStyles = useFontSizeStyles(fontSize)
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
