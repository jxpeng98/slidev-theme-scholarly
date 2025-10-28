<template>
  <div :class="['theorem-box', `theorem-${type}`]">
    <div class="theorem-header">
      <span class="theorem-type">{{ typeLabel }}</span>
      <span v-if="displayNumber" class="theorem-number">{{ displayNumber }}</span>
      <span v-if="title" class="theorem-title">（{{ title }}）</span>
    </div>
    <div class="theorem-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSlideContext } from '@slidev/client'

interface Props {
  type?: 'theorem' | 'lemma' | 'proposition' | 'corollary' | 'definition' | 'example' | 'remark'
  number?: string | number
  title?: string
  autoNumber?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'theorem',
  autoNumber: true
})

// Get slide context for language config
const { $slidev } = useSlideContext()

// Type labels in different languages
const typeLabels: Record<string, Record<string, string>> = {
  zh: {
    theorem: '定理',
    lemma: '引理',
    proposition: '命题',
    corollary: '推论',
    definition: '定义',
    example: '例',
    remark: '注'
  },
  en: {
    theorem: 'Theorem',
    lemma: 'Lemma',
    proposition: 'Proposition',
    corollary: 'Corollary',
    definition: 'Definition',
    example: 'Example',
    remark: 'Remark'
  }
}

// Initialize auto-numbering system in global state
if (typeof window !== 'undefined') {
  if (!(window as any).__theoremCounters) {
    (window as any).__theoremCounters = {
      theorem: 0,
      lemma: 0,
      proposition: 0,
      corollary: 0,
      definition: 0,
      example: 0,
      remark: 0
    }
  }
  if (!(window as any).__theoremCurrentNumbers) {
    (window as any).__theoremCurrentNumbers = new WeakMap()
  }
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

// Get type label based on language
const typeLabel = computed(() => {
  const lang = currentLang.value
  const labels = typeLabels[lang] || typeLabels['zh']
  return labels[props.type] || labels['theorem']
})

// Assign a number to this theorem instance
let assignedNumber = 0
if (typeof window !== 'undefined' && props.autoNumber && props.number === undefined) {
  const counters = (window as any).__theoremCounters
  if (counters && counters[props.type] !== undefined) {
    counters[props.type]++
    assignedNumber = counters[props.type]
  }
}

// Calculate display number with format
const displayNumber = computed(() => {
  // If number is explicitly provided, use it
  if (props.number !== undefined && props.number !== null) {
    return formatNumber(props.number.toString())
  }
  
  // If autoNumber is enabled, use assigned number
  if (props.autoNumber && assignedNumber > 0) {
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
  background-color: rgba(255, 255, 255, 0.05);
}

.theorem-header {
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
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
  border-left-color: #3b82f6; /* blue */
  background-color: rgba(59, 130, 246, 0.1);
}

.theorem-theorem .theorem-type {
  color: #3b82f6;
}

.theorem-lemma {
  border-left-color: #8b5cf6; /* purple */
  background-color: rgba(139, 92, 246, 0.1);
}

.theorem-lemma .theorem-type {
  color: #8b5cf6;
}

.theorem-proposition {
  border-left-color: #06b6d4; /* cyan */
  background-color: rgba(6, 182, 212, 0.1);
}

.theorem-proposition .theorem-type {
  color: #06b6d4;
}

.theorem-corollary {
  border-left-color: #10b981; /* green */
  background-color: rgba(16, 185, 129, 0.1);
}

.theorem-corollary .theorem-type {
  color: #10b981;
}

.theorem-definition {
  border-left-color: #f59e0b; /* amber */
  background-color: rgba(245, 158, 11, 0.1);
}

.theorem-definition .theorem-type {
  color: #f59e0b;
}

.theorem-example {
  border-left-color: #ec4899; /* pink */
  background-color: rgba(236, 72, 153, 0.1);
}

.theorem-example .theorem-type {
  color: #ec4899;
}

.theorem-remark {
  border-left-color: #6b7280; /* gray */
  background-color: rgba(107, 114, 128, 0.1);
}

.theorem-remark .theorem-type {
  color: #6b7280;
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
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}
</style>
