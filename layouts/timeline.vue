<template>
  <div class="slidev-layout timeline h-full flex flex-col">
    <ScholarlyHeader v-if="hasHeader" class="flex-shrink-0" />
    <div class="flex-grow flex flex-col justify-center px-12 py-4" :style="computedStyles">
      <h1 v-if="title" class="mb-10 text-center text-3xl font-bold text-primary">{{ title }}</h1>
      <div class="timeline-container relative max-w-4xl mx-auto w-full">
        <div class="timeline-line absolute left-20 top-0 bottom-0 w-0.5"></div>

        <div v-for="(item, idx) in items" :key="idx" class="timeline-item relative flex items-start mb-6 last:mb-0">
          <div class="w-20 flex-shrink-0 text-right pr-6 pt-0.5 font-mono font-bold text-primary text-sm">
            {{ item.year }}
          </div>
          <div class="timeline-dot absolute left-20 w-3 h-3 rounded-full border-3 border-accent transform -translate-x-1.5 mt-1 z-10"></div>
          <div class="flex-grow pl-6">
            <h3 class="text-lg font-bold mb-0.5">{{ item.title }}</h3>
            <p class="timeline-description text-sm leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <slot />
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

interface TimelineItem {
  year: string | number
  title: string
  description?: string
}

defineProps<{
  title?: string
  items?: TimelineItem[]
}>()

const { $frontmatter } = useSlideContext()
const hasHeader = computed(() => $frontmatter.value?.title || $frontmatter.value?.subtitle)
const computedStyles = useFontSizeStyles()
</script>

<style scoped>
.text-primary {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
}
.border-accent {
  border-color: var(--scholarly-accent);
}
.border-3 {
  border-width: 3px;
}
.timeline-line {
  background: var(--scholarly-content-border, #e5e7eb);
}
.timeline-dot {
  background: var(--scholarly-content-surface, #ffffff);
}
.timeline-description {
  color: var(--scholarly-content-fg-muted, #4b5563);
}
</style>
