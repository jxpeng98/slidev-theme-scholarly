<template>
  <div class="slidev-layout statement flex flex-col h-full">
    <div class="flex-grow statement-container">
      <div class="statement-content">
        <div class="statement-quote-mark">"</div>
        <div class="statement-text" :style="computedStyles">
          <slot />
        </div>
        <div class="statement-author" v-if="author">
          — {{ author }}
        </div>
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

defineProps<{
  /** Attribution author */
  author?: string
}>()

const computedStyles = useFontSizeStyles()
</script>

<style scoped>
.statement-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 4rem;
}

.statement-content {
  max-width: 900px;
  text-align: center;
  position: relative;
}

.statement-quote-mark {
  font-size: 8rem;
  font-family: Georgia, serif;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #1e3a5f));
  opacity: 0.15;
  position: absolute;
  top: -3rem;
  left: -2rem;
  line-height: 1;
  user-select: none;
}

.statement-text :deep(h1) {
  font-size: 2.5rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--scholarly-content-fg, #1f2937);
  margin: 0;
  font-style: italic;
}

.statement-text :deep(p) {
  font-size: 1.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--scholarly-content-fg, #374151);
  margin: 0;
}

.statement-author {
  margin-top: 2rem;
  font-size: 1.25rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #1e3a5f));
  font-weight: 500;
}
</style>
