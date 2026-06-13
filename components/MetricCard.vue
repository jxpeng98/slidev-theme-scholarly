<template>
  <article :class="['scholarly-metric-card', `metric-${variant}`, { 'metric-compact': compact }]">
    <div class="metric-header">
      <span v-if="label" class="metric-label">{{ label }}</span>
      <span v-if="delta" :class="['metric-delta', `metric-trend-${trend}`]">{{ delta }}</span>
    </div>

    <div class="metric-value-row">
      <span class="metric-value">{{ value }}</span>
      <span v-if="unit" class="metric-unit">{{ unit }}</span>
    </div>

    <div v-if="caption || $slots.default" class="metric-caption">
      <slot>{{ caption }}</slot>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Props {
  /** Short metric label, for example "Accuracy" or "Latency" */
  label?: string
  /** Main value shown with tabular numeric styling */
  value: string | number
  /** Optional unit, for example "%" or "ms" */
  unit?: string
  /** Optional delta or comparison note, for example "+3.2" */
  delta?: string
  /** Supporting caption shown below the metric */
  caption?: string
  /** Visual emphasis variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Trend semantics for the delta badge */
  trend?: 'up' | 'down' | 'flat'
  /** Compact mode for dense slides */
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  unit: undefined,
  delta: undefined,
  caption: undefined,
  variant: 'primary',
  trend: 'flat',
  compact: false,
})
</script>

<style scoped>
.scholarly-metric-card {
  --metric-accent: var(--slidev-theme-primary);
  --metric-soft-bg: var(--scholarly-content-surface-muted);
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--scholarly-content-border);
  border-left: 4px solid var(--metric-accent);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
  color: var(--scholarly-content-fg);
  box-shadow: var(--scholarly-content-shadow, none);
}

.scholarly-metric-card.metric-compact {
  gap: 0.35rem;
  padding: 0.65rem 0.8rem;
}

.metric-header {
  display: flex;
  min-height: 1.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.metric-label {
  min-width: 0;
  overflow: hidden;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0;
  line-height: 1.2;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.metric-delta {
  flex: 0 0 auto;
  padding: 0.1rem 0.42rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--metric-soft-bg);
  color: var(--metric-accent);
  font-size: 0.68rem;
  font-weight: 650;
  line-height: 1.2;
}

.metric-value-row {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 0.28rem;
  color: var(--metric-accent);
}

.metric-value {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: clamp(1.7rem, 1.45rem + 1vw, 2.35rem);
  font-variant-numeric: tabular-nums;
  font-weight: 750;
  line-height: 1;
}

.metric-unit {
  color: var(--scholarly-content-fg-muted);
  font-size: 0.9rem;
  font-weight: 650;
  line-height: 1;
}

.metric-caption {
  color: var(--scholarly-content-fg-muted);
  font-size: 0.76rem;
  line-height: 1.35;
}

.metric-caption :deep(p) {
  margin: 0.25rem 0;
}

.metric-caption :deep(p:first-child) {
  margin-top: 0;
}

.metric-caption :deep(p:last-child) {
  margin-bottom: 0;
}

.metric-success {
  --metric-accent: var(--scholarly-highlight-success-fg, var(--slidev-theme-primary));
  --metric-soft-bg: var(--scholarly-highlight-success-bg, var(--scholarly-content-surface-muted));
}

.metric-warning {
  --metric-accent: var(--scholarly-highlight-warning-fg, var(--slidev-theme-primary));
  --metric-soft-bg: var(--scholarly-highlight-warning-bg, var(--scholarly-content-surface-muted));
}

.metric-danger {
  --metric-accent: var(--scholarly-highlight-danger-fg, var(--slidev-theme-primary));
  --metric-soft-bg: var(--scholarly-highlight-danger-bg, var(--scholarly-content-surface-muted));
}

.metric-info {
  --metric-accent: var(--scholarly-highlight-info-fg, var(--slidev-theme-primary));
  --metric-soft-bg: var(--scholarly-highlight-info-bg, var(--scholarly-content-surface-muted));
}

.metric-trend-up,
.metric-trend-down,
.metric-trend-flat {
  color: var(--metric-accent);
}
</style>
