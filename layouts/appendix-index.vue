<template>
  <div class="slidev-layout appendix-index h-full flex flex-col">
    <ScholarlyHeader
      v-if="hasHeader"
      class="flex-shrink-0"
      :title="headerTitle"
      :subtitle="headerSubtitle"
    />
    <main class="appendix-index-main" :class="{ 'has-header': hasHeader }" :style="computedStyles">
      <section class="appendix-index-heading">
        <p v-if="eyebrow" class="appendix-index-eyebrow">{{ eyebrow }}</p>
        <h1>{{ heading }}</h1>
        <p v-if="description" class="appendix-index-description">{{ description }}</p>
      </section>

      <section class="appendix-index-list">
        <article
          v-for="(item, index) in normalizedItems"
          :key="`${item.title}-${index}`"
          class="appendix-index-item"
        >
          <span class="appendix-index-code">{{ item.label || `A${index + 1}` }}</span>
          <div class="appendix-index-copy">
            <h2>{{ item.title }}</h2>
            <p v-if="item.description">{{ item.description }}</p>
          </div>
          <span v-if="item.page" class="appendix-index-page">{{ item.page }}</span>
        </article>
      </section>

      <section v-if="$slots.default" class="appendix-index-body">
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

interface AppendixItem {
  label?: string
  title: string
  description?: string
  page?: string | number
}

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  heading?: string
  description?: string
  eyebrow?: string
  items?: AppendixItem[]
}>(), {
  eyebrow: 'Appendix',
  items: () => [],
})

const { $slidev } = useSlideContext()
const computedStyles = useFontSizeStyles()

const frontmatter = computed(() => {
  return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
})

const headerTitle = computed(() => props.title || frontmatter.value?.title || '')
const headerSubtitle = computed(() => props.subtitle || frontmatter.value?.subtitle || '')
const hasHeader = computed(() => Boolean(headerTitle.value || headerSubtitle.value))
const heading = computed(() => props.heading || headerTitle.value || 'Appendix Index')
const normalizedItems = computed(() => props.items.length ? props.items : [
  { label: 'A1', title: 'Additional Experiments', description: 'Full ablation and robustness tables.', page: '31' },
  { label: 'A2', title: 'Implementation Details', description: 'Hyperparameters, training setup, and data splits.', page: '34' },
  { label: 'A3', title: 'Extended Proofs', description: 'Derivations and assumptions used in the method.', page: '38' },
])
</script>

<style scoped>
.appendix-index-main {
  flex: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 0.95rem;
  padding: 2rem 2.5rem calc(var(--scholarly-footer-height) + 1rem);
  overflow: auto;
}

.appendix-index-main.has-header {
  padding-top: calc(var(--scholarly-header-height) + 0.75rem);
}

.appendix-index-eyebrow {
  margin: 0 0 0.3rem;
  color: var(--slidev-theme-primary);
  font-family: var(--scholarly-font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.appendix-index-heading h1 {
  margin: 0;
  color: var(--scholarly-text-primary);
  font-family: var(--scholarly-font-sans);
  font-size: 1.55rem;
  line-height: 1.16;
}

.appendix-index-description {
  max-width: 58rem;
  margin: 0.35rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.82rem;
  line-height: 1.45;
}

.appendix-index-list {
  display: grid;
  gap: 0.7rem;
  align-content: start;
  min-height: 0;
  overflow: auto;
}

.appendix-index-item,
.appendix-index-body {
  min-width: 0;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
}

.appendix-index-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.8rem;
  align-items: center;
  padding: 0.75rem 0.9rem;
}

.appendix-index-code,
.appendix-index-page {
  display: inline-grid;
  place-items: center;
  border-radius: 0.35rem;
  font-family: var(--scholarly-font-sans);
  font-weight: 800;
}

.appendix-index-code {
  min-width: 2.4rem;
  height: 2.1rem;
  background: var(--slidev-theme-primary);
  color: var(--scholarly-content-on-primary);
  font-size: 0.78rem;
}

.appendix-index-page {
  min-width: 2.5rem;
  height: 1.8rem;
  border: 1px solid var(--scholarly-content-border);
  background: var(--scholarly-content-surface-muted);
  color: var(--slidev-theme-primary);
  font-size: 0.72rem;
}

.appendix-index-copy h2 {
  margin: 0;
  color: var(--scholarly-text-primary);
  font-family: var(--scholarly-font-sans);
  font-size: 0.95rem;
  line-height: 1.2;
}

.appendix-index-copy p {
  margin: 0.22rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.72rem;
  line-height: 1.45;
}

.appendix-index-body {
  padding: 0.75rem 0.9rem;
  background: var(--scholarly-content-surface-muted);
  color: var(--scholarly-content-fg-muted);
}

.appendix-index-body :deep(p) {
  margin: 0;
}
</style>
