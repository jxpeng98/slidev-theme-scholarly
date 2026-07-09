<template>
  <div class="slidev-layout methodology h-full flex flex-col">
    <ScholarlyHeader v-if="hasHeader" class="flex-shrink-0" />
    <div class="flex-grow flex w-full overflow-hidden" :style="computedStyles">
      <div class="flex-1 p-10 overflow-y-auto flex flex-col justify-center" :style="{ flex: leftFlex }">
        <div class="prose max-w-none">
          <slot />
        </div>
      </div>
      <div class="methodology-visual flex-1 flex items-center justify-center p-6 relative border-l"
           :style="{ flex: rightFlex }">
        <div class="pattern-grid"></div>
        <div class="w-full h-full flex items-center justify-center relative z-10">
          <slot name="right" />
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

const props = withDefaults(defineProps<{
  ratio?: string
}>(), {
  ratio: '1:1'
})

const { $frontmatter } = useSlideContext()
const hasHeader = computed(() => $frontmatter.value?.title || $frontmatter.value?.subtitle)

const leftFlex = computed(() => {
  const parts = props.ratio.split(':').map(Number)
  const l = Number.isNaN(parts[0]) ? 1 : parts[0]
  return `${l} 1 0%`
})

const rightFlex = computed(() => {
  const parts = props.ratio.split(':').map(Number)
  const r = parts[1]
  const val = (r === undefined || Number.isNaN(r)) ? 1 : r
  return `${val} 1 0%`
})

const computedStyles = useFontSizeStyles()
</script>

<style scoped>
.pattern-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--scholarly-content-border, rgba(0,0,0,0.1)) 1px, transparent 1px);
  background-size: 16px 16px;
  opacity: 0.3;
  pointer-events: none;
}

.methodology-visual {
  border-color: var(--scholarly-content-border, #e5e7eb);
  background: var(--scholarly-content-surface-muted, #f9fafb);
}
</style>
