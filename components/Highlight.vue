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
  --scholarly-highlight-bg: var(--scholarly-highlight-primary-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-primary-fg);
}

.highlight-success {
  --scholarly-highlight-bg: var(--scholarly-highlight-success-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-success-fg);
}

.highlight-warning {
  --scholarly-highlight-bg: var(--scholarly-highlight-warning-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-warning-fg);
}

.highlight-danger {
  --scholarly-highlight-bg: var(--scholarly-highlight-danger-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-danger-fg);
}

.highlight-info {
  --scholarly-highlight-bg: var(--scholarly-highlight-info-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-info-fg);
}

:global(:root[data-color-mode="dark"]) .highlight-primary {
  --scholarly-highlight-bg: var(--scholarly-highlight-primary-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-primary-fg);
}

:global(:root[data-color-mode="dark"]) .highlight-success {
  --scholarly-highlight-bg: var(--scholarly-highlight-success-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-success-fg);
}

:global(:root[data-color-mode="dark"]) .highlight-warning {
  --scholarly-highlight-bg: var(--scholarly-highlight-warning-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-warning-fg);
}

:global(:root[data-color-mode="dark"]) .highlight-danger {
  --scholarly-highlight-bg: var(--scholarly-highlight-danger-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-danger-fg);
}

:global(:root[data-color-mode="dark"]) .highlight-info {
  --scholarly-highlight-bg: var(--scholarly-highlight-info-bg);
  --scholarly-highlight-fg: var(--scholarly-highlight-info-fg);
}
</style>
