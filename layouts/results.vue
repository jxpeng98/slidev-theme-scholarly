<template>
  <div class="slidev-layout flow-header-layout results h-full flex flex-col">
    <ScholarlyHeader v-if="hasHeader" class="flex-shrink-0" />
    <div class="flex-grow px-8 py-6 flex flex-col" :style="computedStyles">
      <div v-if="$slots.header" class="mb-4">
        <slot name="header" />
      </div>
      <div class="grid gap-4 flex-grow" :style="gridStyle">
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

const props = withDefaults(defineProps<{
  cols?: number | string
}>(), {
  cols: 2
})

const { $frontmatter } = useSlideContext()
const hasHeader = computed(() => $frontmatter?.title || $frontmatter?.subtitle)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))`
}))

const computedStyles = useFontSizeStyles()
</script>
