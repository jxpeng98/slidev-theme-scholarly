<template>
  <div class="slidev-layout result-highlight h-full flex flex-col">
    <ScholarlyHeader
      v-if="hasHeader"
      class="flex-shrink-0"
      :title="headerTitle"
      :subtitle="headerSubtitle"
    />
    <main class="result-highlight-main" :class="{ 'has-header': hasHeader }" :style="computedStyles">
      <section class="result-highlight-panel" :class="variantClass">
        <div class="result-highlight-copy">
          <p v-if="eyebrow" class="result-highlight-eyebrow">{{ eyebrow }}</p>
          <h1>{{ heading }}</h1>
          <p v-if="description" class="result-highlight-description">{{ description }}</p>
        </div>

        <div class="result-highlight-metric">
          <p v-if="label" class="result-highlight-label">{{ label }}</p>
          <div class="result-highlight-value">
            <span>{{ metric }}</span>
            <small v-if="unit">{{ unit }}</small>
          </div>
          <div class="result-highlight-context">
            <span v-if="delta">{{ delta }}</span>
            <span v-if="baseline">{{ baseline }}</span>
          </div>
        </div>
      </section>

      <section class="result-highlight-body">
        <div v-if="$slots.evidence" class="result-highlight-evidence">
          <slot name="evidence" />
        </div>
        <div class="result-highlight-detail">
          <slot />
        </div>
      </section>
    </main>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  heading?: string
  description?: string
  eyebrow?: string
  label?: string
  metric?: string | number
  unit?: string
  delta?: string
  baseline?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}>(), {
  eyebrow: undefined,
  label: 'Primary Metric',
  metric: '0.0',
  variant: 'primary',
})

const { $slidev } = useSlideContext()
const computedStyles = useFontSizeStyles()

const frontmatter = computed(() => {
  return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
})

const headerTitle = computed(() => props.title || frontmatter.value?.title || '')
const headerSubtitle = computed(() => props.subtitle || frontmatter.value?.subtitle || '')
const hasHeader = computed(() => Boolean(headerTitle.value || headerSubtitle.value))
const heading = computed(() => props.heading || headerTitle.value || 'Result Highlight')
const variantClass = computed(() => `is-${props.variant}`)
</script>

<style scoped>
.result-highlight-main {
  flex: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 1rem;
  padding: 2rem 2.5rem calc(var(--scholarly-footer-height) + 1rem);
  overflow: auto;
}

.result-highlight-main.has-header {
  padding-top: calc(var(--scholarly-header-height) + 0.75rem);
}

.result-highlight-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(12rem, 0.75fr);
  gap: 1rem;
  align-items: stretch;
  padding: 1.15rem;
  border: 1px solid var(--scholarly-result-border, var(--scholarly-content-border));
  border-radius: 0.55rem;
  background: var(--scholarly-result-bg, var(--scholarly-content-surface));
}

.result-highlight-panel.is-primary {
  --scholarly-result-bg: color-mix(in srgb, var(--slidev-theme-primary) 9%, var(--scholarly-content-surface) 91%);
  --scholarly-result-border: color-mix(in srgb, var(--slidev-theme-primary) 44%, var(--scholarly-content-border) 56%);
  --scholarly-result-fg: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
}

.result-highlight-panel.is-success {
  --scholarly-result-bg: var(--scholarly-highlight-success-bg);
  --scholarly-result-border: color-mix(in srgb, var(--scholarly-highlight-success-fg) 36%, var(--scholarly-content-border) 64%);
  --scholarly-result-fg: var(--scholarly-highlight-success-fg);
}

.result-highlight-panel.is-warning {
  --scholarly-result-bg: var(--scholarly-highlight-warning-bg);
  --scholarly-result-border: color-mix(in srgb, var(--scholarly-highlight-warning-fg) 36%, var(--scholarly-content-border) 64%);
  --scholarly-result-fg: var(--scholarly-highlight-warning-fg);
}

.result-highlight-panel.is-danger {
  --scholarly-result-bg: var(--scholarly-highlight-danger-bg);
  --scholarly-result-border: color-mix(in srgb, var(--scholarly-highlight-danger-fg) 36%, var(--scholarly-content-border) 64%);
  --scholarly-result-fg: var(--scholarly-highlight-danger-fg);
}

.result-highlight-panel.is-info {
  --scholarly-result-bg: var(--scholarly-highlight-info-bg);
  --scholarly-result-border: color-mix(in srgb, var(--scholarly-highlight-info-fg) 36%, var(--scholarly-content-border) 64%);
  --scholarly-result-fg: var(--scholarly-highlight-info-fg);
}

.result-highlight-eyebrow,
.result-highlight-label {
  margin: 0 0 0.35rem;
  color: var(--scholarly-result-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: var(--scholarly-text-xs);
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.result-highlight-copy h1 {
  margin: 0;
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 1.7rem;
  line-height: 1.12;
}

.result-highlight-description {
  max-width: 44rem;
  margin: 0.5rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: var(--scholarly-text-sm);
  line-height: 1.45;
}

.result-highlight-metric {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 0.9rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
}

.result-highlight-value {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  color: var(--scholarly-result-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
}

.result-highlight-value span {
  font-size: 2.6rem;
  line-height: 1;
  font-weight: 850;
}

.result-highlight-value small {
  font-size: var(--scholarly-text-sm);
  font-weight: 750;
}

.result-highlight-context {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.65rem;
  color: var(--scholarly-content-fg-muted);
  font-size: var(--scholarly-text-xs);
  font-weight: 650;
}

.result-highlight-context span {
  padding: 0.16rem 0.48rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--scholarly-content-surface-muted);
}

.result-highlight-body {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 0.9rem;
  min-height: 0;
}

.result-highlight-evidence,
.result-highlight-detail {
  min-width: 0;
  padding: 0.9rem 1rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
  overflow: auto;
}

.result-highlight-evidence {
  background: var(--scholarly-content-surface-muted);
  color: var(--scholarly-content-fg-muted);
}

.result-highlight-detail :deep(p),
.result-highlight-detail :deep(ul),
.result-highlight-evidence :deep(p),
.result-highlight-evidence :deep(ul) {
  margin-top: 0;
}
</style>
