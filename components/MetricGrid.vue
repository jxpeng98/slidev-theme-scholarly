<template>
  <section class="scholarly-metric-grid" :style="gridStyle">
    <MetricCard
      v-for="(metric, index) in metrics"
      :key="metric.label || index"
      :label="metric.label"
      :value="metric.value"
      :unit="metric.unit"
      :delta="metric.delta"
      :caption="metric.caption"
      :variant="metric.variant || variant"
      :trend="metric.trend"
      :compact="compact"
    />
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MetricCard from './MetricCard.vue'

interface MetricItem {
  label?: string
  value: string | number
  unit?: string
  delta?: string
  caption?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  trend?: 'up' | 'down' | 'flat'
}

interface Props {
  /** Metric objects rendered as MetricCard items */
  metrics?: MetricItem[]
  /** Number of responsive columns */
  columns?: 1 | 2 | 3 | 4 | number | string
  /** Gap between cards; numbers are interpreted as rem */
  gap?: string | number
  /** Default card variant when a metric has no variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Compact card density */
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  metrics: () => [],
  columns: 3,
  gap: '0.75rem',
  variant: 'primary',
  compact: false,
})

function normalizeColumns(value: Props['columns']): number {
  const parsed = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(parsed)) return 3
  return Math.min(Math.max(Number(parsed), 1), 4)
}

function normalizeGap(value: string | number): string {
  if (typeof value === 'number') return `${value}rem`
  const trimmed = value.trim()
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}rem`
  return trimmed
}

const gridStyle = computed(() => ({
  '--metric-grid-columns': normalizeColumns(props.columns),
  '--metric-grid-gap': normalizeGap(props.gap),
}))
</script>

<style scoped>
.scholarly-metric-grid {
  --metric-grid-surface: var(--scholarly-content-surface);
  --metric-grid-border: var(--scholarly-content-border);
  --metric-grid-muted: var(--scholarly-content-fg-muted);
  --metric-grid-primary: var(--slidev-theme-primary);
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: repeat(var(--metric-grid-columns), minmax(0, 1fr));
  gap: var(--metric-grid-gap);
  color: var(--scholarly-content-fg);
}

.scholarly-metric-grid :deep(> *) {
  min-width: 0;
}

.scholarly-metric-grid :deep(.scholarly-metric-card) {
  min-height: 100%;
}

@media (max-width: 720px) {
  .scholarly-metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .scholarly-metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
