<template>
  <section :class="['scholarly-evidence-block', `evidence-${variant}`, { 'evidence-compact': compact }]">
    <header v-if="label || title || source || confidence" class="evidence-header">
      <div class="evidence-heading">
        <span v-if="label" class="evidence-label">{{ label }}</span>
        <h3 v-if="title" class="evidence-title">{{ title }}</h3>
      </div>
      <div v-if="source || confidence" class="evidence-meta">
        <span v-if="source" class="evidence-source">{{ source }}</span>
        <span v-if="confidence" class="evidence-confidence">{{ confidence }}</span>
      </div>
    </header>

    <div class="evidence-content">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="evidence-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
interface Props {
  /** Small label above the title, for example "Evidence" */
  label?: string
  /** Main title for the evidence block */
  title?: string
  /** Source marker, for example "Table 3" or "5-seed mean" */
  source?: string
  /** Optional confidence or scope note */
  confidence?: string
  /** Visual emphasis variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Compact density for dense evidence slides */
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  label: 'Evidence',
  source: undefined,
  confidence: undefined,
  variant: 'primary',
  compact: false,
})
</script>

<style scoped>
.scholarly-evidence-block {
  --evidence-accent: var(--slidev-theme-primary);
  --evidence-soft-bg: var(--scholarly-content-surface-muted);
  margin: 0.85rem 0;
  overflow: hidden;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
  color: var(--scholarly-content-fg);
  box-shadow: var(--scholarly-content-shadow, none);
}

.scholarly-evidence-block.evidence-compact {
  margin: 0.55rem 0;
}

.evidence-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid var(--scholarly-content-border);
  background: var(--evidence-soft-bg);
}

.evidence-compact .evidence-header {
  padding: 0.55rem 0.75rem;
}

.evidence-heading {
  min-width: 0;
}

.evidence-label {
  display: block;
  margin-bottom: 0.15rem;
  color: var(--evidence-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.2;
  text-transform: uppercase;
}

.evidence-title {
  margin: 0;
  color: var(--scholarly-content-fg);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
}

.evidence-meta {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem;
  max-width: 42%;
}

.evidence-source,
.evidence-confidence {
  padding: 0.12rem 0.42rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--scholarly-content-surface);
  color: var(--scholarly-content-fg-muted);
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.2;
}

.evidence-content {
  padding: 0.8rem 0.9rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.evidence-compact .evidence-content {
  padding: 0.65rem 0.75rem;
}

.evidence-content :deep(p),
.evidence-content :deep(ul),
.evidence-content :deep(ol) {
  margin: 0.45rem 0;
}

.evidence-content :deep(p:first-child),
.evidence-content :deep(ul:first-child),
.evidence-content :deep(ol:first-child) {
  margin-top: 0;
}

.evidence-content :deep(p:last-child),
.evidence-content :deep(ul:last-child),
.evidence-content :deep(ol:last-child) {
  margin-bottom: 0;
}

.evidence-footer {
  padding: 0.55rem 0.9rem;
  border-top: 1px solid var(--scholarly-content-border);
  color: var(--scholarly-content-fg-muted);
  font-size: 0.78rem;
  line-height: 1.35;
}

.evidence-success {
  --evidence-accent: var(--scholarly-highlight-success-fg, var(--slidev-theme-primary));
  --evidence-soft-bg: var(--scholarly-highlight-success-bg, var(--scholarly-content-surface-muted));
}

.evidence-warning {
  --evidence-accent: var(--scholarly-highlight-warning-fg, var(--slidev-theme-primary));
  --evidence-soft-bg: var(--scholarly-highlight-warning-bg, var(--scholarly-content-surface-muted));
}

.evidence-danger {
  --evidence-accent: var(--scholarly-highlight-danger-fg, var(--slidev-theme-primary));
  --evidence-soft-bg: var(--scholarly-highlight-danger-bg, var(--scholarly-content-surface-muted));
}

.evidence-info {
  --evidence-accent: var(--scholarly-highlight-info-fg, var(--slidev-theme-primary));
  --evidence-soft-bg: var(--scholarly-highlight-info-bg, var(--scholarly-content-surface-muted));
}
</style>
