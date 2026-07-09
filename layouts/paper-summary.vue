<template>
  <div class="slidev-layout paper-summary h-full flex flex-col">
    <ScholarlyHeader
      v-if="hasHeader"
      class="flex-shrink-0"
      :title="headerTitle"
      :subtitle="headerSubtitle"
    />
    <main class="paper-summary-main" :class="{ 'has-header': hasHeader }" :style="computedStyles">
      <section class="paper-summary-hero">
        <p v-if="eyebrow" class="paper-summary-eyebrow">{{ eyebrow }}</p>
        <h1>{{ resolvedPaperTitle }}</h1>
        <p v-if="authorLine" class="paper-summary-authors">{{ authorLine }}</p>
        <div v-if="metaItems.length" class="paper-summary-meta">
          <span v-for="item in metaItems" :key="item">{{ item }}</span>
        </div>
        <div v-if="keywordList.length" class="paper-summary-keywords">
          <span v-for="keyword in keywordList" :key="keyword">{{ keyword }}</span>
        </div>
      </section>

      <section class="paper-summary-grid">
        <article class="paper-summary-card">
          <h2>{{ problemLabel }}</h2>
          <slot name="problem" />
        </article>
        <article class="paper-summary-card">
          <h2>{{ methodLabel }}</h2>
          <slot name="method" />
        </article>
        <article class="paper-summary-card is-accented">
          <h2>{{ findingLabel }}</h2>
          <slot name="finding" />
        </article>
      </section>

      <section v-if="$slots.default" class="paper-summary-body">
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
  paperTitle?: string
  authors?: string | string[]
  venue?: string
  year?: string | number
  doi?: string
  status?: string
  keywords?: string | string[]
  eyebrow?: string
  problemLabel?: string
  methodLabel?: string
  findingLabel?: string
}>(), {
  eyebrow: 'Paper Summary',
  problemLabel: 'Problem',
  methodLabel: 'Method',
  findingLabel: 'Key Finding',
})

const { $slidev } = useSlideContext()
const computedStyles = useFontSizeStyles()

const frontmatter = computed(() => {
  return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
})

const toList = (value?: string | string[]) => {
  if (Array.isArray(value))
    return value.filter(Boolean)
  if (typeof value === 'string')
    return value.split(',').map(item => item.trim()).filter(Boolean)
  return []
}

const headerTitle = computed(() => props.title || frontmatter.value?.title || '')
const headerSubtitle = computed(() => props.subtitle || frontmatter.value?.subtitle || '')
const hasHeader = computed(() => Boolean(headerTitle.value || headerSubtitle.value))
const resolvedPaperTitle = computed(() => props.paperTitle || headerTitle.value || 'Paper Summary')
const authorLine = computed(() => toList(props.authors).join(', '))
const keywordList = computed(() => toList(props.keywords))
const metaItems = computed(() => [props.venue, props.year, props.status, props.doi].filter(Boolean).map(String))
</script>

<style scoped>
.paper-summary-main {
  flex: 1;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  padding: 2rem 2.5rem calc(var(--scholarly-footer-height) + 1rem);
  overflow: auto;
}

.paper-summary-main.has-header {
  padding-top: calc(var(--scholarly-header-height) + 0.75rem);
}

.paper-summary-hero {
  padding: 1rem 1.15rem;
  border: 1px solid var(--scholarly-content-border);
  border-left: 0.28rem solid var(--slidev-theme-primary);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
}

.paper-summary-eyebrow {
  margin: 0 0 0.35rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.paper-summary-hero h1 {
  margin: 0;
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 1.55rem;
  line-height: 1.18;
}

.paper-summary-authors,
.paper-summary-meta {
  margin-top: 0.45rem;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.78rem;
}

.paper-summary-meta,
.paper-summary-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.paper-summary-meta span,
.paper-summary-keywords span {
  display: inline-flex;
  align-items: center;
}

.paper-summary-meta span:not(:last-child)::after {
  content: "";
  width: 0.22rem;
  height: 0.22rem;
  margin-left: 0.4rem;
  border-radius: 999px;
  background: var(--scholarly-content-border);
}

.paper-summary-keywords {
  margin-top: 0.65rem;
}

.paper-summary-keywords span {
  padding: 0.14rem 0.48rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--scholarly-content-surface-muted);
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-size: 0.62rem;
  font-weight: 650;
}

.paper-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
}

.paper-summary-card,
.paper-summary-body {
  min-width: 0;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface-muted);
}

.paper-summary-card {
  padding: 0.85rem;
  overflow: auto;
}

.paper-summary-card.is-accented {
  border-color: color-mix(in srgb, var(--slidev-theme-primary) 42%, var(--scholarly-content-border) 58%);
  background: color-mix(in srgb, var(--slidev-theme-primary) 8%, var(--scholarly-content-surface) 92%);
}

.paper-summary-card h2 {
  margin: 0 0 0.45rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 0.9rem;
  line-height: 1.2;
}

.paper-summary-card :deep(p),
.paper-summary-card :deep(ul),
.paper-summary-body :deep(p),
.paper-summary-body :deep(ul) {
  margin-top: 0;
}

.paper-summary-body {
  padding: 0.8rem 1rem;
  color: var(--scholarly-content-fg-muted);
}
</style>
