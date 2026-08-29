<template>
  <article :class="['scholarly-paper-card', `paper-${variant}`, { 'paper-compact': compact }]">
    <header class="paper-header">
      <div class="paper-heading">
        <span class="paper-label">{{ label }}</span>
        <h3 class="paper-title">{{ title }}</h3>
      </div>
      <span v-if="status" class="paper-status">{{ status }}</span>
    </header>

    <p v-if="authorsText" class="paper-authors">{{ authorsText }}</p>

    <div v-if="venue || year || doi" class="paper-meta">
      <span v-if="venue">{{ venue }}</span>
      <span v-if="year">{{ year }}</span>
      <span v-if="doi">DOI: {{ doi }}</span>
    </div>

    <p v-if="contribution" class="paper-contribution">{{ contribution }}</p>

    <div v-if="$slots.default" class="paper-content">
      <slot />
    </div>

    <footer v-if="url" class="paper-footer">
      <a :href="url" class="paper-link">{{ urlLabel }}</a>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Paper title */
  title: string
  /** Small label above the title */
  label?: string
  /** Authors as an array or already formatted string */
  authors?: string[] | string
  /** Venue or journal */
  venue?: string
  /** Publication year */
  year?: string | number
  /** Review/publication status */
  status?: string
  /** DOI without URL prefix */
  doi?: string
  /** Paper URL */
  url?: string
  /** Link label */
  urlLabel?: string
  /** One-sentence contribution or takeaway */
  contribution?: string
  /** Visual emphasis variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Compact spacing */
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Paper',
  authors: undefined,
  venue: undefined,
  year: undefined,
  status: undefined,
  doi: undefined,
  url: undefined,
  urlLabel: 'Open paper',
  contribution: undefined,
  variant: 'primary',
  compact: false,
})

const authorsText = computed(() => {
  if (Array.isArray(props.authors))
    return props.authors.join(', ')
  return props.authors || ''
})
</script>

<style scoped>
.scholarly-paper-card {
  --paper-accent: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  --paper-soft-bg: var(--scholarly-content-surface-muted);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-width: 0;
  margin: 0.85rem 0;
  padding: 0.9rem 1rem;
  border: 1px solid var(--scholarly-content-border);
  border-left: 4px solid var(--paper-accent);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
  color: var(--scholarly-content-fg);
  box-shadow: var(--scholarly-content-shadow, none);
}

.scholarly-paper-card.paper-compact {
  gap: 0.42rem;
  margin: 0.55rem 0;
  padding: 0.7rem 0.8rem;
}

.paper-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.9rem;
}

.paper-heading {
  min-width: 0;
}

.paper-label {
  display: block;
  margin-bottom: 0.12rem;
  color: var(--paper-accent);
  font-size: var(--scholarly-text-xs);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.2;
  text-transform: uppercase;
}

.paper-title {
  margin: 0;
  color: var(--scholarly-content-fg);
  font-size: 1.02rem;
  font-weight: 750;
  line-height: 1.25;
}

.paper-status {
  flex: 0 0 auto;
  padding: 0.12rem 0.48rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--paper-soft-bg);
  color: var(--paper-accent);
  font-size: var(--scholarly-text-xs);
  font-weight: 650;
  line-height: 1.2;
}

.paper-authors,
.paper-contribution {
  margin: 0;
  color: var(--scholarly-content-fg-muted);
  font-size: var(--scholarly-text-sm);
  line-height: 1.4;
}

.paper-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.paper-meta span {
  padding: 0.12rem 0.42rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--paper-soft-bg);
  color: var(--scholarly-content-fg-muted);
  font-size: var(--scholarly-text-xs);
  font-weight: 600;
  line-height: 1.2;
}

.paper-contribution {
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.45rem;
  background: var(--paper-soft-bg);
  color: var(--scholarly-content-fg);
}

.paper-content {
  color: var(--scholarly-content-fg-muted);
  font-size: var(--scholarly-text-sm);
  line-height: 1.4;
}

.paper-content :deep(p),
.paper-content :deep(ul),
.paper-content :deep(ol) {
  margin: 0.35rem 0;
}

.paper-content :deep(p:first-child),
.paper-content :deep(ul:first-child),
.paper-content :deep(ol:first-child) {
  margin-top: 0;
}

.paper-content :deep(p:last-child),
.paper-content :deep(ul:last-child),
.paper-content :deep(ol:last-child) {
  margin-bottom: 0;
}

.paper-footer {
  padding-top: 0.45rem;
  border-top: 1px solid var(--scholarly-content-border);
}

.paper-link {
  color: var(--paper-accent);
  font-size: var(--scholarly-text-sm);
  font-weight: 650;
  text-decoration: none;
}

.paper-link:hover {
  text-decoration: underline;
}

.paper-success {
  --paper-accent: var(--scholarly-highlight-success-fg, var(--slidev-theme-primary));
  --paper-soft-bg: var(--scholarly-highlight-success-bg, var(--scholarly-content-surface-muted));
}

.paper-warning {
  --paper-accent: var(--scholarly-highlight-warning-fg, var(--slidev-theme-primary));
  --paper-soft-bg: var(--scholarly-highlight-warning-bg, var(--scholarly-content-surface-muted));
}

.paper-danger {
  --paper-accent: var(--scholarly-highlight-danger-fg, var(--slidev-theme-primary));
  --paper-soft-bg: var(--scholarly-highlight-danger-bg, var(--scholarly-content-surface-muted));
}

.paper-info {
  --paper-accent: var(--scholarly-highlight-info-fg, var(--slidev-theme-primary));
  --paper-soft-bg: var(--scholarly-highlight-info-bg, var(--scholarly-content-surface-muted));
}
</style>
