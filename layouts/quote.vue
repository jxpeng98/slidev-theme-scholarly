<template>
  <div class="slidev-layout quote h-full flex flex-col">
    <ScholarlyHeader class="flex-shrink-0" />
    <div class="flex-grow flex flex-col justify-center items-center text-center quote-content" :style="computedStyles">
      <div class="quote-text">
        <slot />
      </div>
      <div class="quote-attribution" v-if="author || source">
        <span v-if="author" class="quote-author">— {{ author }}</span>
        <span v-if="source" class="quote-source">{{ source }}</span>
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

defineProps<{
  /** Quote author name */
  author?: string
  /** Quote source (book, year, etc.) */
  source?: string
}>()

const computedStyles = useFontSizeStyles()
</script>

<style scoped>
.quote-text {
  max-width: 56rem;
  position: relative;
}

.quote-text::before {
  content: "\201C";
  display: block;
  font-size: 6rem;
  line-height: 1;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  opacity: 0.15;
  font-family: serif;
  margin-bottom: -2rem;
  text-align: center;
}

.quote-text :deep(p:first-child),
.quote-text :deep(blockquote) {
  font-size: 1.875rem;
  font-family: var(--scholarly-font-serif, serif);
  font-style: italic;
  line-height: 1.6;
  border-left: none;
  padding: 0 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--scholarly-content-fg, var(--scholarly-text-primary, #2d3748));
}

.quote-attribution {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1.5rem;
  width: 60%;
}

.quote-author {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #1e3a5f));
}

.quote-source {
  font-size: 1rem;
  font-style: italic;
  color: var(--scholarly-content-fg-muted, #6b7280);
}
</style>
