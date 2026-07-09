<template>
  <div class="slidev-layout split-image h-full flex flex-col">
    <ScholarlyHeader v-if="hasHeader" class="flex-shrink-0" />
    <div class="flex-grow flex items-center justify-center px-6 py-4 gap-4" :style="computedStyles">
      <div v-for="(img, idx) in images" :key="idx" class="flex-1 flex flex-col items-center h-full justify-center">
        <div class="split-image-frame relative p-2 rounded shadow-sm border">
          <img :src="img" class="max-h-[55vh] object-contain rounded-sm" :alt="captions?.[idx] || `Image ${idx + 1}`" />
        </div>
        <p v-if="captions && captions[idx]" class="split-image-caption mt-3 text-center font-serif text-base max-w-xs">
          {{ captions[idx] }}
        </p>
      </div>
    </div>
    <div v-if="$slots.default" class="px-8 pb-4">
      <slot />
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

defineProps<{
  images: string[]
  captions?: string[]
}>()

const { $frontmatter } = useSlideContext()
const hasHeader = computed(() => $frontmatter.value?.title || $frontmatter.value?.subtitle)
const computedStyles = useFontSizeStyles()
</script>

<style scoped>
.split-image-frame {
  border-color: var(--scholarly-content-border, #f3f4f6);
  background: var(--scholarly-content-surface, #ffffff);
}

.split-image-caption {
  color: var(--scholarly-content-fg-muted, #374151);
}
</style>
