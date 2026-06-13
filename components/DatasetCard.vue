<template>
  <article :class="['scholarly-dataset-card', `dataset-${variant}`, { 'dataset-compact': compact }]">
    <header class="dataset-header">
      <div class="dataset-heading">
        <span class="dataset-label">{{ label }}</span>
        <h3 class="dataset-name">{{ name }}</h3>
      </div>
      <span v-if="task" class="dataset-task">{{ task }}</span>
    </header>

    <p v-if="description" class="dataset-description">{{ description }}</p>

    <dl v-if="metaItems.length" class="dataset-meta">
      <div v-for="item in metaItems" :key="item.label" class="dataset-meta-item">
        <dt>{{ item.label }}</dt>
        <dd>{{ item.value }}</dd>
      </div>
    </dl>

    <div v-if="$slots.default" class="dataset-content">
      <slot />
    </div>

    <footer v-if="source || license" class="dataset-footer">
      <span v-if="source">Source: {{ source }}</span>
      <span v-if="license">License: {{ license }}</span>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Dataset name */
  name: string
  /** Small label above the dataset name */
  label?: string
  /** Short dataset description */
  description?: string
  /** Dataset task, for example "Classification" */
  task?: string
  /** Sample count or scale marker */
  samples?: string | number
  /** Feature, modality, or field count */
  features?: string | number
  /** Train/validation/test split */
  split?: string
  /** Dataset source or benchmark suite */
  source?: string
  /** License or access constraint */
  license?: string
  /** Visual emphasis variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Compact spacing */
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Dataset',
  description: undefined,
  task: undefined,
  samples: undefined,
  features: undefined,
  split: undefined,
  source: undefined,
  license: undefined,
  variant: 'primary',
  compact: false,
})

const metaItems = computed(() => [
  { label: 'Samples', value: props.samples },
  { label: 'Features', value: props.features },
  { label: 'Split', value: props.split },
].filter((item): item is { label: string; value: string | number } => item.value !== undefined && item.value !== ''))
</script>

<style scoped>
.scholarly-dataset-card {
  --dataset-accent: var(--slidev-theme-primary);
  --dataset-soft-bg: var(--scholarly-content-surface-muted);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
  margin: 0.85rem 0;
  padding: 0.9rem 1rem;
  border: 1px solid var(--scholarly-content-border);
  border-left: 4px solid var(--dataset-accent);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
  color: var(--scholarly-content-fg);
  box-shadow: var(--scholarly-content-shadow, none);
}

.scholarly-dataset-card.dataset-compact {
  gap: 0.55rem;
  margin: 0.55rem 0;
  padding: 0.7rem 0.8rem;
}

.dataset-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.9rem;
}

.dataset-heading {
  min-width: 0;
}

.dataset-label {
  display: block;
  margin-bottom: 0.12rem;
  color: var(--dataset-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.2;
  text-transform: uppercase;
}

.dataset-name {
  margin: 0;
  color: var(--scholarly-content-fg);
  font-size: 1.05rem;
  font-weight: 750;
  line-height: 1.25;
}

.dataset-task {
  flex: 0 0 auto;
  padding: 0.12rem 0.48rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--dataset-soft-bg);
  color: var(--dataset-accent);
  font-size: 0.7rem;
  font-weight: 650;
  line-height: 1.2;
}

.dataset-description {
  margin: 0;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.85rem;
  line-height: 1.45;
}

.dataset-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
  margin: 0;
}

.dataset-meta-item {
  min-width: 0;
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.45rem;
  background: var(--dataset-soft-bg);
}

.dataset-meta-item dt {
  color: var(--scholarly-content-fg-muted);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.2;
  text-transform: uppercase;
}

.dataset-meta-item dd {
  margin: 0.18rem 0 0;
  overflow-wrap: anywhere;
  color: var(--scholarly-content-fg);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  line-height: 1.2;
}

.dataset-content {
  color: var(--scholarly-content-fg-muted);
  font-size: 0.78rem;
  line-height: 1.4;
}

.dataset-content :deep(p),
.dataset-content :deep(ul),
.dataset-content :deep(ol) {
  margin: 0.35rem 0;
}

.dataset-content :deep(p:first-child),
.dataset-content :deep(ul:first-child),
.dataset-content :deep(ol:first-child) {
  margin-top: 0;
}

.dataset-content :deep(p:last-child),
.dataset-content :deep(ul:last-child),
.dataset-content :deep(ol:last-child) {
  margin-bottom: 0;
}

.dataset-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.8rem;
  padding-top: 0.55rem;
  border-top: 1px solid var(--scholarly-content-border);
  color: var(--scholarly-content-fg-muted);
  font-size: 0.72rem;
  line-height: 1.25;
}

.dataset-success {
  --dataset-accent: var(--scholarly-highlight-success-fg, var(--slidev-theme-primary));
  --dataset-soft-bg: var(--scholarly-highlight-success-bg, var(--scholarly-content-surface-muted));
}

.dataset-warning {
  --dataset-accent: var(--scholarly-highlight-warning-fg, var(--slidev-theme-primary));
  --dataset-soft-bg: var(--scholarly-highlight-warning-bg, var(--scholarly-content-surface-muted));
}

.dataset-danger {
  --dataset-accent: var(--scholarly-highlight-danger-fg, var(--slidev-theme-primary));
  --dataset-soft-bg: var(--scholarly-highlight-danger-bg, var(--scholarly-content-surface-muted));
}

.dataset-info {
  --dataset-accent: var(--scholarly-highlight-info-fg, var(--slidev-theme-primary));
  --dataset-soft-bg: var(--scholarly-highlight-info-bg, var(--scholarly-content-surface-muted));
}

@media (max-width: 640px) {
  .dataset-meta {
    grid-template-columns: 1fr;
  }
}
</style>
