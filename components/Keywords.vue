<template>
  <div class="scholarly-keywords">
    <span 
      v-for="(keyword, index) in resolvedKeywords" 
      :key="index" 
      class="keyword-tag"
      :class="[`keyword-${resolvedColor}`]"
    >
      {{ keyword }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Array of keywords to display */
  keywords?: string[]
  /** Legacy alias of `keywords` */
  items?: string[]
  /** Tag color: primary (default), blue, green, purple, gray */
  color?: 'primary' | 'blue' | 'green' | 'purple' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
})

const resolvedKeywords = computed(() => props.keywords ?? props.items ?? [])
const resolvedColor = computed(() => props.color ?? 'primary')
</script>

<style scoped>
.scholarly-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.keyword-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.keyword-primary {
  background: rgba(93, 131, 146, 0.15);
  color: var(--scholarly-content-accent-fg, #4a6b7a);
}

.keyword-blue {
  background: rgba(59, 130, 246, 0.15);
  color: var(--scholarly-highlight-info-fg, #2563eb);
}

.keyword-green {
  background: rgba(16, 185, 129, 0.15);
  color: var(--scholarly-highlight-success-fg, #059669);
}

.keyword-purple {
  background: rgba(139, 92, 246, 0.15);
  color: color-mix(in srgb, #8b5cf6 56%, var(--scholarly-content-fg, #ffffff) 44%);
}

.keyword-gray {
  background: rgba(107, 114, 128, 0.15);
  color: var(--scholarly-content-fg-muted, #4b5563);
}
</style>
