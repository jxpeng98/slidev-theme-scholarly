<template>
  <div class="slidev-layout method-pipeline h-full flex flex-col">
    <ScholarlyHeader
      v-if="hasHeader"
      class="flex-shrink-0"
      :title="headerTitle"
      :subtitle="headerSubtitle"
    />
    <main class="method-pipeline-main" :class="{ 'has-header': hasHeader }" :style="computedStyles">
      <section class="method-pipeline-intro">
        <p v-if="eyebrow" class="method-pipeline-eyebrow">{{ eyebrow }}</p>
        <h1>{{ heading }}</h1>
        <p v-if="description" class="method-pipeline-description">{{ description }}</p>
      </section>

      <section class="method-pipeline-steps" :style="pipelineStyle">
        <article
          v-for="(step, index) in normalizedSteps"
          :key="`${step.title}-${index}`"
          class="method-pipeline-step"
          :class="{ 'is-active': activeStep === index + 1 }"
        >
          <div class="method-pipeline-number">{{ index + 1 }}</div>
          <div class="method-pipeline-copy">
            <h2>{{ step.title }}</h2>
            <p v-if="step.description">{{ step.description }}</p>
            <small v-if="step.detail">{{ step.detail }}</small>
          </div>
          <div
            v-if="index < normalizedSteps.length - 1"
            class="method-pipeline-connector"
            aria-hidden="true"
          />
        </article>
      </section>

      <section v-if="$slots.default" class="method-pipeline-body">
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

interface PipelineStep {
  title: string
  description?: string
  detail?: string
}

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  heading?: string
  description?: string
  eyebrow?: string
  steps?: PipelineStep[]
  activeStep?: number
}>(), {
  eyebrow: 'Method Pipeline',
  activeStep: 0,
  steps: () => [],
})

const { $slidev } = useSlideContext()
const computedStyles = useFontSizeStyles()

const frontmatter = computed(() => {
  return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
})

const headerTitle = computed(() => props.title || frontmatter.value?.title || '')
const headerSubtitle = computed(() => props.subtitle || frontmatter.value?.subtitle || '')
const hasHeader = computed(() => Boolean(headerTitle.value || headerSubtitle.value))
const heading = computed(() => props.heading || headerTitle.value || 'Method Pipeline')
const normalizedSteps = computed(() => props.steps.length ? props.steps : [
  { title: 'Input', description: 'Define the starting data or assumptions.' },
  { title: 'Process', description: 'Apply the core method.' },
  { title: 'Output', description: 'Report the result and validation signal.' },
])
const pipelineStyle = computed(() => ({
  '--scholarly-pipeline-count': String(normalizedSteps.value.length),
}))
</script>

<style scoped>
.method-pipeline-main {
  flex: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 1rem;
  padding: 2rem 2.5rem calc(var(--scholarly-footer-height) + 1rem);
  overflow: auto;
}

.method-pipeline-main.has-header {
  padding-top: calc(var(--scholarly-header-height) + 0.75rem);
}

.method-pipeline-eyebrow {
  margin: 0 0 0.3rem;
  color: var(--slidev-theme-primary);
  font-family: var(--scholarly-font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.method-pipeline-intro h1 {
  margin: 0;
  color: var(--scholarly-text-primary);
  font-family: var(--scholarly-font-sans);
  font-size: 1.55rem;
  line-height: 1.16;
}

.method-pipeline-description {
  max-width: 58rem;
  margin: 0.35rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.82rem;
  line-height: 1.45;
}

.method-pipeline-steps {
  display: grid;
  grid-template-columns: repeat(var(--scholarly-pipeline-count), minmax(0, 1fr));
  gap: 0.8rem;
  align-items: stretch;
}

.method-pipeline-step {
  position: relative;
  min-width: 0;
  padding: 0.9rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
  box-shadow: 0 0.35rem 1rem color-mix(in srgb, var(--slidev-theme-primary) 8%, transparent);
}

.method-pipeline-step.is-active {
  border-color: color-mix(in srgb, var(--slidev-theme-primary) 58%, var(--scholarly-content-border) 42%);
  background: color-mix(in srgb, var(--slidev-theme-primary) 9%, var(--scholarly-content-surface) 91%);
}

.method-pipeline-number {
  width: 2rem;
  height: 2rem;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: var(--slidev-theme-primary);
  color: var(--scholarly-footer-fg);
  font-family: var(--scholarly-font-sans);
  font-size: 0.78rem;
  font-weight: 800;
}

.method-pipeline-copy h2 {
  margin: 0.65rem 0 0.35rem;
  color: var(--scholarly-text-primary);
  font-family: var(--scholarly-font-sans);
  font-size: 0.95rem;
  line-height: 1.2;
}

.method-pipeline-copy p,
.method-pipeline-copy small {
  color: var(--scholarly-content-fg-muted);
  line-height: 1.45;
}

.method-pipeline-copy p {
  margin: 0;
  font-size: 0.72rem;
}

.method-pipeline-copy small {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.62rem;
  font-weight: 650;
}

.method-pipeline-connector {
  position: absolute;
  top: 1.9rem;
  right: -0.8rem;
  width: 0.8rem;
  height: 0.1rem;
  background: var(--scholarly-content-border);
}

.method-pipeline-body {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface-muted);
  color: var(--scholarly-content-fg-muted);
}

.method-pipeline-body :deep(p) {
  margin: 0;
}
</style>
