<template>
  <div class="slidev-layout acknowledgments h-full flex flex-col">
    <ScholarlyHeader v-if="hasHeader" class="flex-shrink-0" />
    <div class="flex-grow flex flex-col items-center justify-center text-center p-10" :style="computedStyles">
      <h1 class="text-3xl font-bold mb-12 text-primary tracking-wide">
        {{ title || 'Acknowledgments' }}
      </h1>

      <div class="grid gap-16 w-full max-w-5xl" :class="gridCols">
        <div v-if="funders && funders.length" class="text-center">
          <h3 class="acknowledgment-label text-lg font-serif italic mb-6 border-b pb-2 inline-block px-6">
            Funded By
          </h3>
          <ul class="space-y-4">
            <li v-for="funder in funders" :key="funder" class="acknowledgment-item text-xl font-medium">
              {{ funder }}
            </li>
          </ul>
        </div>

        <div v-if="collaborators && collaborators.length" class="text-center">
          <h3 class="acknowledgment-label text-lg font-serif italic mb-6 border-b pb-2 inline-block px-6">
            In Collaboration With
          </h3>
          <ul class="space-y-4">
            <li v-for="collab in collaborators" :key="collab" class="acknowledgment-item text-xl font-medium">
              {{ collab }}
            </li>
          </ul>
        </div>
      </div>

      <div class="acknowledgment-note mt-12 max-w-3xl">
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

const props = defineProps<{
  title?: string
  funders?: string[]
  collaborators?: string[]
}>()

const { $frontmatter } = useSlideContext()
const hasHeader = computed(() => $frontmatter.value?.title || $frontmatter.value?.subtitle)

const gridCols = computed(() => {
  const hasFunders = props.funders && props.funders.length > 0
  const hasCollabs = props.collaborators && props.collaborators.length > 0
  return hasFunders && hasCollabs ? 'grid-cols-2' : 'grid-cols-1'
})

const computedStyles = useFontSizeStyles()
</script>

<style scoped>
.text-primary {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
}
.acknowledgment-label {
  border-color: var(--scholarly-content-border, #e5e7eb);
  color: var(--scholarly-content-fg-muted, #6b7280);
}
.acknowledgment-item {
  color: var(--scholarly-content-fg, #1f2937);
}
.acknowledgment-note {
  color: var(--scholarly-content-fg-muted, #4b5563);
}
</style>
