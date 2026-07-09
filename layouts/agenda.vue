<template>
  <div class="slidev-layout agenda h-full flex flex-col">
    <ScholarlyHeader v-if="hasHeader" class="flex-shrink-0" />
    <div class="flex-grow flex items-center justify-center" :style="computedStyles">
      <div class="w-full max-w-3xl px-8">
        <h1 class="text-3xl font-bold mb-10 text-center text-primary tracking-tight">
          {{ title || 'Agenda' }}
        </h1>
        <div class="space-y-4">
          <div v-for="(item, idx) in parsedItems" :key="idx"
               class="agenda-item flex items-center p-4 rounded-lg shadow-sm border">
            <div class="agenda-index flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg mr-5">
              {{ idx + 1 }}
            </div>
            <div class="agenda-item-text text-xl font-serif">{{ item }}</div>
          </div>
        </div>
        <div class="mt-8">
          <slot />
        </div>
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

const props = defineProps<{
  title?: string
  items?: string[]
}>()

const { $frontmatter } = useSlideContext()
const hasHeader = computed(() => $frontmatter.value?.title || $frontmatter.value?.subtitle)
const parsedItems = computed(() => props.items || [])
const computedStyles = useFontSizeStyles()
</script>

<style scoped>
.text-primary {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
}
.bg-primary {
  background-color: var(--slidev-theme-primary);
}
.agenda-item {
  border-color: var(--scholarly-content-border, #f3f4f6);
  background: var(--scholarly-content-surface, #ffffff);
}
.agenda-index {
  background: var(--slidev-theme-primary);
  color: var(--scholarly-content-on-primary, #ffffff);
}
.agenda-item-text {
  color: var(--scholarly-content-fg, #1f2937);
}
</style>
