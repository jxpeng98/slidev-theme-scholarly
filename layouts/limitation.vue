<template>
  <div class="slidev-layout limitation h-full flex flex-col">
    <ScholarlyHeader
      v-if="hasHeader"
      class="flex-shrink-0"
      :title="headerTitle"
      :subtitle="headerSubtitle"
    />
    <main class="limitation-main" :class="{ 'has-header': hasHeader }" :style="computedStyles">
      <section class="limitation-heading">
        <p v-if="eyebrow" class="limitation-eyebrow">{{ eyebrow }}</p>
        <h1>{{ heading }}</h1>
        <p v-if="description" class="limitation-description">{{ description }}</p>
      </section>

      <section class="limitation-panels">
        <article class="limitation-panel is-limitation">
          <h2>{{ limitationLabel }}</h2>
          <slot name="limitation">
            <p>{{ limitation }}</p>
          </slot>
        </article>
        <article class="limitation-panel is-mitigation">
          <h2>{{ mitigationLabel }}</h2>
          <slot name="mitigation">
            <p>{{ mitigation }}</p>
          </slot>
        </article>
      </section>

      <section v-if="$slots.default" class="limitation-body">
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

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  heading?: string
  description?: string
  eyebrow?: string
  limitationLabel?: string
  mitigationLabel?: string
  limitation?: string
  mitigation?: string
}>(), {
  eyebrow: 'Limitation',
  limitationLabel: 'Limitation',
  mitigationLabel: 'Mitigation',
  limitation: 'Name the boundary condition or unresolved risk.',
  mitigation: 'Explain how the current work controls, measures, or scopes it.',
})

const { $slidev } = useSlideContext()
const computedStyles = useFontSizeStyles()

const frontmatter = computed(() => {
  return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
})

const headerTitle = computed(() => props.title || frontmatter.value?.title || '')
const headerSubtitle = computed(() => props.subtitle || frontmatter.value?.subtitle || '')
const hasHeader = computed(() => Boolean(headerTitle.value || headerSubtitle.value))
const heading = computed(() => props.heading || headerTitle.value || 'Limitation and Mitigation')
</script>

<style scoped>
.limitation-main {
  flex: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 1rem;
  padding: 2rem 2.5rem calc(var(--scholarly-footer-height) + 1rem);
  overflow: auto;
}

.limitation-main.has-header {
  padding-top: calc(var(--scholarly-header-height) + 0.75rem);
}

.limitation-eyebrow {
  margin: 0 0 0.3rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.limitation-heading h1 {
  margin: 0;
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 1.55rem;
  line-height: 1.16;
}

.limitation-description {
  max-width: 58rem;
  margin: 0.35rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.82rem;
  line-height: 1.45;
}

.limitation-panels {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.95rem;
  min-height: 0;
}

.limitation-panel,
.limitation-body {
  min-width: 0;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
}

.limitation-panel {
  padding: 1rem;
  overflow: auto;
  background: var(--scholarly-content-surface);
}

.limitation-panel.is-limitation {
  border-color: color-mix(in srgb, var(--scholarly-highlight-warning-fg) 34%, var(--scholarly-content-border) 66%);
  background: var(--scholarly-highlight-warning-bg);
}

.limitation-panel.is-mitigation {
  border-color: color-mix(in srgb, var(--slidev-theme-primary) 38%, var(--scholarly-content-border) 62%);
  background: color-mix(in srgb, var(--slidev-theme-primary) 8%, var(--scholarly-content-surface) 92%);
}

.limitation-panel h2 {
  margin: 0 0 0.7rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 1rem;
  line-height: 1.2;
}

.limitation-panel.is-limitation h2 {
  color: var(--scholarly-highlight-warning-fg);
}

.limitation-panel :deep(p),
.limitation-panel :deep(ul),
.limitation-body :deep(p),
.limitation-body :deep(ul) {
  margin-top: 0;
}

.limitation-panel :deep(p),
.limitation-panel :deep(li) {
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  line-height: 1.45;
}

.limitation-body {
  padding: 0.75rem 0.9rem;
  background: var(--scholarly-content-surface-muted);
  color: var(--scholarly-content-fg-muted);
}
</style>
