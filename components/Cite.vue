<template>
  <div :class="['scholarly-cite', { 'cite-inline': inline }]">
    <span v-if="isAuthorYear" class="cite-marker cite-marker-author-year">{{ authorYearMarker }}</span>
    <span v-else class="cite-marker">[{{ numericMarker }}]</span>
    <span v-if="$slots.default" class="cite-content">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Citation number or key */
  id?: string | number
  /** Display inline (default) or as block */
  inline?: boolean
  /** Legacy author for manual citations, e.g. "Smith et al." */
  author?: string
  /** Legacy year for manual citations, e.g. 2024 */
  year?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  inline: true
})

// Auto-increment citation counter if no id provided
let assignedId = 0
if (typeof window !== 'undefined' && props.id === undefined) {
  const win = window as any
  if (!win.__citationCounter) {
    win.__citationCounter = 0
  }
  win.__citationCounter++
  assignedId = win.__citationCounter
}

const isAuthorYear = computed(() => Boolean(props.author || props.year !== undefined))

const authorYearMarker = computed(() => {
  const parts: string[] = []
  if (props.author) parts.push(props.author)
  if (props.year !== undefined) parts.push(String(props.year))
  return parts.length ? `(${parts.join(', ')})` : ''
})

const numericMarker = computed(() => {
  if (props.id !== undefined) return props.id
  return assignedId
})
</script>

<style scoped>
.scholarly-cite {
  font-size: 0.85em;
  color: var(--scholarly-content-fg-muted, #64748b);
}

.scholarly-cite.cite-inline {
  display: inline;
}

.scholarly-cite:not(.cite-inline) {
  display: block;
  margin: 0.5rem 0;
  padding-left: 1.5em;
  text-indent: -1.5em;
}

.cite-marker {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #5d8392));
  font-weight: 500;
}

.cite-marker-author-year {
  /* Keep the author-year marker tight to the surrounding text */
  font-variant-numeric: tabular-nums;
}

.cite-content {
  margin-left: 0.25em;
}

/* For reference lists at the end */
.scholarly-cite:not(.cite-inline) .cite-marker {
  display: inline-block;
  min-width: 2em;
  text-align: right;
  margin-right: 0.5em;
}
</style>
