<template>
  <div class="slidev-layout defense-question h-full flex flex-col">
    <ScholarlyHeader
      v-if="hasHeader"
      class="flex-shrink-0"
      :title="headerTitle"
      :subtitle="headerSubtitle"
    />
    <main class="defense-question-main" :class="{ 'has-header': hasHeader }" :style="computedStyles">
      <section class="defense-question-prompt">
        <p v-if="eyebrow" class="defense-question-eyebrow">{{ eyebrow }}</p>
        <h1>{{ question }}</h1>
        <p v-if="source" class="defense-question-source">{{ source }}</p>
      </section>

      <section class="defense-question-grid">
        <article class="defense-question-answer">
          <h2>{{ answerLabel }}</h2>
          <slot>
            <p>{{ answer }}</p>
          </slot>
        </article>

        <aside class="defense-question-support">
          <section v-if="$slots.evidence || evidence">
            <h2>{{ evidenceLabel }}</h2>
            <slot name="evidence">
              <p>{{ evidence }}</p>
            </slot>
          </section>
          <section v-if="$slots.followup || followup">
            <h2>{{ followupLabel }}</h2>
            <slot name="followup">
              <p>{{ followup }}</p>
            </slot>
          </section>
        </aside>
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
  eyebrow?: string
  question?: string
  source?: string
  answer?: string
  evidence?: string
  followup?: string
  answerLabel?: string
  evidenceLabel?: string
  followupLabel?: string
}>(), {
  eyebrow: 'Defense Question',
  question: 'What is the strongest challenge to this claim?',
  answer: 'Start with the direct answer, then state the evidence and boundary conditions.',
  answerLabel: 'Answer',
  evidenceLabel: 'Evidence',
  followupLabel: 'Follow-up',
})

const { $slidev } = useSlideContext()
const computedStyles = useFontSizeStyles()

const frontmatter = computed(() => {
  return ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter || {}
})

const headerTitle = computed(() => props.title || frontmatter.value?.title || '')
const headerSubtitle = computed(() => props.subtitle || frontmatter.value?.subtitle || '')
const hasHeader = computed(() => Boolean(headerTitle.value || headerSubtitle.value))
</script>

<style scoped>
.defense-question-main {
  flex: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 1rem;
  padding: 2rem 2.5rem calc(var(--scholarly-footer-height) + 1rem);
  overflow: auto;
}

.defense-question-main.has-header {
  padding-top: calc(var(--scholarly-header-height) + 0.75rem);
}

.defense-question-prompt {
  padding: 1.05rem 1.15rem;
  border: 1px solid var(--scholarly-content-border);
  border-left: 0.3rem solid var(--slidev-theme-primary);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
}

.defense-question-eyebrow {
  margin: 0 0 0.35rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.defense-question-prompt h1 {
  margin: 0;
  color: var(--scholarly-content-fg, var(--scholarly-text-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 1.45rem;
  line-height: 1.18;
}

.defense-question-source {
  margin: 0.45rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.76rem;
}

.defense-question-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 0.95rem;
  min-height: 0;
}

.defense-question-answer,
.defense-question-support section {
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
}

.defense-question-answer {
  min-width: 0;
  padding: 1rem;
  overflow: auto;
}

.defense-question-support {
  display: grid;
  gap: 0.85rem;
  min-width: 0;
  min-height: 0;
}

.defense-question-support section {
  padding: 0.85rem;
  overflow: auto;
  background: var(--scholarly-content-surface-muted);
}

.defense-question-answer h2,
.defense-question-support h2 {
  margin: 0 0 0.55rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  font-family: var(--scholarly-font-sans);
  font-size: 0.92rem;
  line-height: 1.2;
}

.defense-question-answer :deep(p),
.defense-question-answer :deep(ul),
.defense-question-support :deep(p),
.defense-question-support :deep(ul) {
  margin-top: 0;
}

.defense-question-answer :deep(p),
.defense-question-answer :deep(li),
.defense-question-support :deep(p),
.defense-question-support :deep(li) {
  color: var(--scholarly-content-fg-muted);
  line-height: 1.45;
}
</style>
