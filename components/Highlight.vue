<template>
  <span :class="['scholarly-highlight', `highlight-${resolvedType}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Highlight type: primary (default), success, warning, danger, info */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Legacy alias of `type` */
  color?: 'yellow' | 'green' | 'blue' | 'pink' | 'purple'
}

const props = withDefaults(defineProps<Props>(), {
  type: undefined,
  color: undefined
})

const resolvedType = computed(() => {
  if (props.type) return props.type
  switch (props.color) {
    case 'yellow':
      return 'warning'
    case 'green':
      return 'success'
    case 'blue':
      return 'info'
    case 'pink':
      return 'danger'
    case 'purple':
      return 'primary'
    default:
      return 'primary'
  }
})
</script>

<style scoped>
.scholarly-highlight {
  display: inline-block;
  padding: 0.2em 0.55em;
  border-radius: 0.4em;
  font-weight: 500;
  line-height: 1.25;
  background-color: var(--scholarly-highlight-bg);
  color: var(--scholarly-highlight-fg);
}

.highlight-primary {
  --scholarly-highlight-bg: color-mix(in srgb, var(--slidev-theme-primary, #5d8392) 16%, white 84%);
  --scholarly-highlight-fg: color-mix(in srgb, var(--slidev-theme-primary, #4a6b7a) 82%, black 18%);
}

.highlight-success {
  --scholarly-highlight-bg: color-mix(in srgb, #10b981 18%, white 82%);
  --scholarly-highlight-fg: color-mix(in srgb, #059669 84%, black 16%);
}

.highlight-warning {
  --scholarly-highlight-bg: color-mix(in srgb, #f59e0b 20%, white 80%);
  --scholarly-highlight-fg: color-mix(in srgb, #b45309 88%, black 12%);
}

.highlight-danger {
  --scholarly-highlight-bg: color-mix(in srgb, #ef4444 16%, white 84%);
  --scholarly-highlight-fg: color-mix(in srgb, #dc2626 86%, black 14%);
}

.highlight-info {
  --scholarly-highlight-bg: color-mix(in srgb, #06b6d4 18%, white 82%);
  --scholarly-highlight-fg: color-mix(in srgb, #0891b2 84%, black 16%);
}

/* Follow the theme color mode, not Slidev's raw html.dark class. */
:global(:root[data-color-mode="dark"]) .highlight-primary {
  --scholarly-highlight-bg: color-mix(in srgb, var(--slidev-theme-primary-light, #8fb3c2) 28%, transparent);
  --scholarly-highlight-fg: color-mix(in srgb, var(--slidev-theme-primary-light, #8fb3c2) 72%, white 28%);
}

:global(:root[data-color-mode="dark"]) .highlight-success {
  --scholarly-highlight-bg: color-mix(in srgb, #10b981 30%, transparent);
  --scholarly-highlight-fg: #34d399;
}

:global(:root[data-color-mode="dark"]) .highlight-warning {
  --scholarly-highlight-bg: color-mix(in srgb, #f59e0b 30%, transparent);
  --scholarly-highlight-fg: #fbbf24;
}

:global(:root[data-color-mode="dark"]) .highlight-danger {
  --scholarly-highlight-bg: color-mix(in srgb, #ef4444 30%, transparent);
  --scholarly-highlight-fg: #f87171;
}

:global(:root[data-color-mode="dark"]) .highlight-info {
  --scholarly-highlight-bg: color-mix(in srgb, #06b6d4 30%, transparent);
  --scholarly-highlight-fg: #22d3ee;
}
</style>
