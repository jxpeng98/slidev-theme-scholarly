<template>
  <figure :class="['scholarly-equation-block', { 'equation-compact': compact }]">
    <figcaption v-if="title || label || reference" class="equation-header">
      <div class="equation-heading">
        <span v-if="label" class="equation-label">{{ label }}</span>
        <span v-if="title" class="equation-title">{{ title }}</span>
      </div>
      <span v-if="displayReference" class="equation-reference">{{ displayReference }}</span>
    </figcaption>

    <div class="equation-content">
      <slot />
    </div>

    <figcaption v-if="caption" class="equation-caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Optional equation title */
  title?: string
  /** Small label before the title, for example "Objective" */
  label?: string
  /** Caption below the equation */
  caption?: string
  /** Equation number or reference text */
  reference?: string | number
  /** Whether to wrap a numeric reference in parentheses */
  numbered?: boolean
  /** Compact density for dense slides */
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Equation',
  caption: undefined,
  reference: undefined,
  numbered: true,
  compact: false,
})

const displayReference = computed(() => {
  if (props.reference === undefined || props.reference === null || props.reference === '')
    return ''
  const value = String(props.reference)
  if (!props.numbered || value.startsWith('(') || value.endsWith(')'))
    return value
  return `(${value})`
})
</script>

<style scoped>
.scholarly-equation-block {
  margin: 0.95rem 0;
  overflow: hidden;
  border: 1px solid var(--scholarly-content-border);
  border-left: 4px solid var(--slidev-theme-primary);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
  color: var(--scholarly-content-fg);
  box-shadow: var(--scholarly-content-shadow, none);
}

.scholarly-equation-block.equation-compact {
  margin: 0.6rem 0;
}

.equation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0.85rem;
  border-bottom: 1px solid var(--scholarly-content-border);
  background: var(--scholarly-content-surface-muted);
}

.equation-compact .equation-header {
  padding: 0.48rem 0.7rem;
}

.equation-heading {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 0.45rem;
}

.equation-label {
  color: var(--slidev-theme-primary);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.2;
  text-transform: uppercase;
}

.equation-title {
  min-width: 0;
  overflow: hidden;
  color: var(--scholarly-content-fg);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.equation-reference {
  flex: 0 0 auto;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
  font-weight: 650;
}

.equation-content {
  padding: 0.95rem 1rem;
  background: var(--scholarly-content-surface);
  color: var(--scholarly-content-fg);
  font-size: 1.05rem;
  line-height: 1.5;
  overflow-x: auto;
}

.equation-compact .equation-content {
  padding: 0.7rem 0.8rem;
}

.equation-content :deep(p),
.equation-content :deep(.katex-display) {
  margin: 0.35rem 0;
}

.equation-content :deep(p:first-child),
.equation-content :deep(.katex-display:first-child) {
  margin-top: 0;
}

.equation-content :deep(p:last-child),
.equation-content :deep(.katex-display:last-child) {
  margin-bottom: 0;
}

.equation-caption {
  padding: 0.55rem 0.85rem;
  border-top: 1px solid var(--scholarly-content-border);
  color: var(--scholarly-content-fg-muted);
  font-size: 0.78rem;
  line-height: 1.35;
}
</style>
