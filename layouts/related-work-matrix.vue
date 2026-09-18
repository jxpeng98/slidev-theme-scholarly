<template>
  <div class="slidev-layout related-work-matrix h-full flex flex-col">
    <ScholarlyHeader
      v-if="hasHeader"
      class="flex-shrink-0"
      :title="headerTitle"
      :subtitle="headerSubtitle"
    />
    <main class="related-work-main" :class="{ 'has-header': hasHeader }" :style="computedStyles">
      <section class="related-work-intro">
        <p v-if="eyebrow" class="related-work-eyebrow">{{ eyebrow }}</p>
        <h1>{{ heading }}</h1>
        <p v-if="description" class="related-work-description">{{ description }}</p>
      </section>

      <section class="related-work-shell">
        <slot />
      </section>

      <section v-if="$slots.notes || note" class="related-work-notes">
        <slot name="notes">
          <p>{{ note }}</p>
        </slot>
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
  note?: string
}>(), {
  eyebrow: 'Related Work',
})

const { $slidev } = useSlideContext()
const computedStyles = useFontSizeStyles()

const frontmatter = computed(() => {
  return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
})

const headerTitle = computed(() => props.title || frontmatter.value?.title || '')
const headerSubtitle = computed(() => props.subtitle || frontmatter.value?.subtitle || '')
const hasHeader = computed(() => Boolean(headerTitle.value || headerSubtitle.value))
const heading = computed(() => props.heading || headerTitle.value || 'Related Work Matrix')
</script>

<style scoped>
.related-work-main {
  flex: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 0.9rem;
  padding: 2rem 2.5rem calc(var(--scholarly-footer-height) + 1rem);
  overflow: hidden;
}

.related-work-main.has-header {
  padding-top: calc(var(--scholarly-header-height) + 0.75rem);
}

.related-work-intro {
  min-width: 0;
}

.related-work-eyebrow {
  margin: 0 0 0.3rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: var(--scholarly-text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.related-work-intro h1 {
  margin: 0;
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 1.55rem;
  line-height: 1.16;
}

.related-work-description {
  max-width: 58rem;
  margin: 0.35rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: var(--scholarly-text-sm);
  line-height: 1.45;
}

.related-work-shell,
.related-work-notes {
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
}

.related-work-shell {
  min-height: 0;
  overflow: auto;
}

.related-work-shell :deep(table) {
  width: 100%;
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
  font-size: var(--scholarly-text-xs);
}

.related-work-shell :deep(th),
.related-work-shell :deep(td) {
  padding: 0.55rem 0.65rem;
  border-right: 1px solid var(--scholarly-content-border);
  border-bottom: 1px solid var(--scholarly-content-border);
  vertical-align: top;
}

.related-work-shell :deep(th:last-child),
.related-work-shell :deep(td:last-child) {
  border-right: 0;
}

.related-work-shell :deep(thead th) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: color-mix(in srgb, var(--slidev-theme-primary) 10%, var(--scholarly-content-surface) 90%);
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  font-family: var(--scholarly-font-sans);
  font-size: var(--scholarly-text-xs);
  font-weight: 750;
  text-align: left;
}

.related-work-shell :deep(tbody tr:nth-child(even)) {
  background: var(--scholarly-content-surface-muted);
}

.related-work-shell :deep(strong) {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
}

.related-work-notes {
  padding: 0.65rem 0.8rem;
  color: var(--scholarly-content-fg-muted);
  font-size: var(--scholarly-text-xs);
  line-height: 1.45;
}

.related-work-notes :deep(p) {
  margin: 0;
}
</style>
