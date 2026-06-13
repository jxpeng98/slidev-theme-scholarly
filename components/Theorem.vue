<template>
  <div :class="['theorem-box', `theorem-${type}`, { 'theorem-compact': compact }]">
    <div v-if="showHeader" class="theorem-header">
      <span class="theorem-type">{{ typeLabel }}</span>
      <span v-if="displayNumber" class="theorem-number">{{ displayNumber }}</span>
      <span v-if="title" class="theorem-title">{{ titleWrapper.left }}{{ title }}{{ titleWrapper.right }}</span>
    </div>
    <div class="theorem-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { getOccurrenceIndex, lookupTheoremNumber } from '../utils/theorem'
import type { TheoremType } from '../utils/theorem'

interface Props {
  type?: 'theorem' | 'lemma' | 'proposition' | 'corollary' | 'definition' | 'example' | 'remark' | 'proof' | 'note' | 'claim'
  number?: string | number
  title?: string
  autoNumber?: boolean
  /** Compact mode with less padding */
  compact?: boolean
  /** Hide the theorem header and render only the content box */
  showHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'theorem',
  autoNumber: true,
  compact: false,
  showHeader: true,
})

// Get slide context for language config
const { $page, $slidev } = useSlideContext()

// Type labels in different languages
const typeLabels: Record<string, Record<string, string>> = {
  zh: {
    theorem: '定理',
    lemma: '引理',
    proposition: '命题',
    corollary: '推论',
    definition: '定义',
    example: '例',
    remark: '注',
    proof: '证明',
    note: '注意',
    claim: '断言'
  },
  en: {
    theorem: 'Theorem',
    lemma: 'Lemma',
    proposition: 'Proposition',
    corollary: 'Corollary',
    definition: 'Definition',
    example: 'Example',
    remark: 'Remark',
    proof: 'Proof',
    note: 'Note',
    claim: 'Claim'
  }
}

// Title wrapper based on language
const titleWrappers: Record<string, { left: string; right: string }> = {
  zh: { left: '（', right: '）' },
  en: { left: ' (', right: ')' }
}

// Get current language from slidev config
const currentLang = computed(() => {
  const slidevConfigs = $slidev?.configs as any
  return slidevConfigs?.lang || slidevConfigs?.language || 'zh'
})

// Get numbering format from config
const numberFormat = computed(() => {
  const slidevConfigs = $slidev?.configs as any
  return slidevConfigs?.theoremNumberFormat || '{number}'
})

// Get title wrapper based on language
const titleWrapper = computed(() => {
  const lang = currentLang.value
  return titleWrappers[lang] || titleWrappers['en']
})

// Get type label based on language
const typeLabel = computed(() => {
  const lang = currentLang.value
  const labels = typeLabels[lang] || typeLabels['zh']
  return labels[props.type] || labels['theorem']
})

const typeKey = props.type as TheoremType
const noNumberTypes: TheoremType[] = ['proof', 'note']
const slideNoForTheorem = Number($page?.value ?? 1) || 1
const occurrenceIndex = typeof window !== 'undefined'
  && props.autoNumber
  && props.number === undefined
  && !noNumberTypes.includes(typeKey)
  ? getOccurrenceIndex(slideNoForTheorem, typeKey)
  : -1

const allSlides = computed(() => (($slidev?.nav as any)?.slides || []))

// Calculate display number with format
const displayNumber = computed(() => {
  // If number is explicitly provided, use it
  if (props.number !== undefined && props.number !== null) {
    return formatNumber(props.number.toString())
  }
  
  // If autoNumber is enabled, use assigned number
  if (props.autoNumber && occurrenceIndex >= 0) {
    const assignedNumber = lookupTheoremNumber(allSlides.value, slideNoForTheorem, typeKey, occurrenceIndex)
    if (assignedNumber > 0)
      return formatNumber(assignedNumber.toString())
  }
  
  return ''
})

// Format number according to config
function formatNumber(num: string): string {
  const format = numberFormat.value
  return format.replace('{number}', num)
}
</script>

<style scoped>
.theorem-box {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
  background-color: var(--scholarly-content-surface-muted, rgba(255, 255, 255, 0.05));
}

.theorem-box.theorem-compact {
  margin: 0.75rem 0;
  padding: 0.75rem 1rem;
}

.theorem-header {
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.theorem-compact .theorem-header {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.theorem-type {
  color: inherit;
}

.theorem-number {
  margin-left: 0.25rem;
}

.theorem-title {
  font-style: italic;
  opacity: 0.9;
}

.theorem-content {
  line-height: 1.6;
}

/* Different colors for different types */
.theorem-theorem {
  border-left-color: var(--scholarly-theorem-theorem-accent);
  background-color: var(--scholarly-theorem-theorem-bg);
}

.theorem-theorem .theorem-type {
  color: var(--scholarly-theorem-theorem-accent);
}

.theorem-lemma {
  border-left-color: var(--scholarly-theorem-lemma-accent);
  background-color: var(--scholarly-theorem-lemma-bg);
}

.theorem-lemma .theorem-type {
  color: var(--scholarly-theorem-lemma-accent);
}

.theorem-proposition {
  border-left-color: var(--scholarly-theorem-proposition-accent);
  background-color: var(--scholarly-theorem-proposition-bg);
}

.theorem-proposition .theorem-type {
  color: var(--scholarly-theorem-proposition-accent);
}

.theorem-corollary {
  border-left-color: var(--scholarly-theorem-corollary-accent);
  background-color: var(--scholarly-theorem-corollary-bg);
}

.theorem-corollary .theorem-type {
  color: var(--scholarly-theorem-corollary-accent);
}

.theorem-definition {
  border-left-color: var(--scholarly-theorem-definition-accent);
  background-color: var(--scholarly-theorem-definition-bg);
}

.theorem-definition .theorem-type {
  color: var(--scholarly-theorem-definition-accent);
}

.theorem-example {
  border-left-color: var(--scholarly-theorem-example-accent);
  background-color: var(--scholarly-theorem-example-bg);
}

.theorem-example .theorem-type {
  color: var(--scholarly-theorem-example-accent);
}

.theorem-remark {
  border-left-color: var(--scholarly-theorem-remark-accent);
  background-color: var(--scholarly-theorem-remark-bg);
}

.theorem-remark .theorem-type {
  color: var(--scholarly-theorem-remark-accent);
}

/* New types */
.theorem-proof {
  border-left-color: var(--scholarly-theorem-proof-accent);
  background-color: var(--scholarly-theorem-proof-bg);
}

.theorem-proof .theorem-type {
  color: var(--scholarly-theorem-proof-accent);
  font-style: italic;
}

.theorem-note {
  border-left-color: var(--scholarly-theorem-note-accent);
  background-color: var(--scholarly-theorem-note-bg);
}

.theorem-note .theorem-type {
  color: var(--scholarly-theorem-note-accent);
}

.theorem-claim {
  border-left-color: var(--scholarly-theorem-claim-accent);
  background-color: var(--scholarly-theorem-claim-bg);
}

.theorem-claim .theorem-type {
  color: var(--scholarly-theorem-claim-accent);
}

/* Deep styles for content */
.theorem-content :deep(p) {
  margin: 0.5rem 0;
}

.theorem-content :deep(p:first-child) {
  margin-top: 0;
}

.theorem-content :deep(p:last-child) {
  margin-bottom: 0;
}

.theorem-content :deep(ul),
.theorem-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.theorem-content :deep(code) {
  background-color: var(--scholarly-inline-code-bg, rgba(0, 0, 0, 0.2));
  color: var(--scholarly-code-fg, inherit);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}
</style>
