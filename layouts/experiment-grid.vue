<template>
  <div class="slidev-layout experiment-grid h-full flex flex-col">
    <ScholarlyHeader
      v-if="hasHeader"
      class="flex-shrink-0"
      :title="headerTitle"
      :subtitle="headerSubtitle"
    />
    <main class="experiment-grid-main" :class="{ 'has-header': hasHeader }" :style="computedStyles">
      <section v-if="eyebrow || showHeading || description" class="experiment-grid-intro">
        <p v-if="eyebrow" class="experiment-grid-eyebrow">{{ eyebrow }}</p>
        <h1 v-if="showHeading">{{ heading }}</h1>
        <p v-if="description" class="experiment-grid-description">{{ description }}</p>
      </section>

      <section class="experiment-grid-cards" :style="gridStyle">
        <article
          v-for="(experiment, index) in normalizedExperiments"
          :key="`${experiment.name}-${index}`"
          class="experiment-grid-card"
        >
          <div class="experiment-grid-card-header">
            <span>{{ index + 1 }}</span>
            <h2>{{ experiment.name }}</h2>
          </div>
          <dl>
            <div v-if="experiment.setup">
              <dt>{{ setupLabel }}</dt>
              <dd>{{ experiment.setup }}</dd>
            </div>
            <div v-if="experiment.metric || experiment.result">
              <dt>{{ metricLabel }}</dt>
              <dd>
                <strong v-if="experiment.result">{{ experiment.result }}</strong>
                <span v-if="experiment.metric">{{ experiment.metric }}</span>
              </dd>
            </div>
            <div v-if="experiment.note">
              <dt>{{ noteLabel }}</dt>
              <dd>{{ experiment.note }}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section v-if="$slots.default" class="experiment-grid-body">
        <slot />
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

interface ExperimentItem {
  name: string
  setup?: string
  metric?: string
  result?: string
  note?: string
}

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  heading?: string
  description?: string
  eyebrow?: string
  experiments?: ExperimentItem[]
  cols?: number | string
  setupLabel?: string
  metricLabel?: string
  noteLabel?: string
}>(), {
  eyebrow: undefined,
  cols: 2,
  setupLabel: 'Setup',
  metricLabel: 'Metric',
  noteLabel: 'Note',
  experiments: () => [],
})

const { $slidev } = useSlideContext()
const computedStyles = useFontSizeStyles()

const frontmatter = computed(() => {
  return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
})

const headerTitle = computed(() => props.title || frontmatter.value?.title || '')
const headerSubtitle = computed(() => props.subtitle || frontmatter.value?.subtitle || '')
const hasHeader = computed(() => Boolean(headerTitle.value || headerSubtitle.value))
const heading = computed(() => props.heading || headerTitle.value || 'Experiment Grid')
const showHeading = computed(() => !hasHeader.value || heading.value !== headerTitle.value)
const normalizedExperiments = computed(() => props.experiments.length ? props.experiments : [
  { name: 'Ablation', setup: 'Remove one module at a time', result: '-2.1', metric: 'accuracy points', note: 'Largest drop from routing module' },
  { name: 'Robustness', setup: 'Evaluate across shifted domains', result: '+1.4', metric: 'macro F1', note: 'Stable under moderate shift' },
])
const gridStyle = computed(() => ({
  '--scholarly-experiment-grid-cols': String(props.cols || 2),
}))
</script>

<style scoped>
.slidev-layout.experiment-grid {
  padding: 0;
}

.experiment-grid-main {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 0.75rem;
  padding: 2rem 2.5rem calc(var(--scholarly-footer-height) + 1rem);
}

.experiment-grid-main.has-header {
  padding-top: calc(var(--scholarly-header-height) + 0.75rem);
}

.experiment-grid-eyebrow {
  margin: 0 0 0.3rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: var(--scholarly-text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.experiment-grid-intro h1 {
  margin: 0;
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 1.55rem;
  line-height: 1.16;
}

.experiment-grid-description {
  max-width: 58rem;
  margin: 0.35rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: 1.125rem;
  line-height: 1.45;
}

.experiment-grid-cards {
  grid-row: 2;
  display: grid;
  grid-template-columns: repeat(var(--scholarly-experiment-grid-cols), minmax(0, 1fr));
  gap: 0.85rem;
  min-height: 0;
}

.experiment-grid-card,
.experiment-grid-body {
  grid-row: 3;
  min-width: 0;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
}

.experiment-grid-card {
  padding: 0.75rem;
}

.experiment-grid-card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.45rem;
}

.experiment-grid-card-header span {
  width: 1.8rem;
  height: 1.8rem;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: var(--slidev-theme-primary);
  color: var(--scholarly-content-on-primary);
  font-family: var(--scholarly-font-sans);
  font-size: var(--scholarly-text-xs);
  font-weight: 800;
}

.experiment-grid-card h2 {
  margin: 0;
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 1.125rem;
  line-height: 1.2;
}

.experiment-grid-card dl {
  display: grid;
  gap: 0.35rem;
  margin: 0;
}

.experiment-grid-card dl > div {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: baseline;
  gap: 0.75rem;
}

.experiment-grid-card dt {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: var(--scholarly-text-sm);
  font-weight: 750;
}

.experiment-grid-card dd {
  margin: 0;
  color: var(--scholarly-content-fg-muted);
  font-size: var(--scholarly-text-sm);
  line-height: 1.3;
}

.experiment-grid-card dd strong {
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  font-size: 1.4rem;
  margin-right: 0.25rem;
}

.experiment-grid-body {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--scholarly-content-fg-muted);
  font-size: 1.125rem;
}

.experiment-grid-body :deep(p) {
  margin: 0;
}
</style>
