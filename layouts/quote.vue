<template>
  <div class="slidev-layout quote h-full flex flex-col">
    <ScholarlyHeader class="flex-shrink-0" />
    <div class="flex-grow flex flex-col justify-center items-center text-center quote-content">
      <slot />
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
</script>

<style scoped>
.quote-content {
  padding-top: 60px; /* Space for fixed header */
  padding-bottom: 35px; /* Space for fixed footer */
  padding-left: 4rem;
  padding-right: 4rem;
  max-width: 56rem; /* 4xl */
}

/* Quote specific styles - vertical stacking with quote styling */
.quote-content :deep(> *) {
  margin-bottom: 1.5rem;
}

.quote-content :deep(blockquote),
.quote-content :deep(> p:first-child) {
  font-size: 1.875rem; /* 30px */
  font-style: italic;
  line-height: 2.25rem;
  border-left: 4px solid var(--slidev-theme-primary, #5d8392);
  padding-left: 2rem;
  margin-bottom: 2rem;
  text-align: left;
}

.quote-content :deep(cite),
.quote-content :deep(> p:last-child) {
  font-size: 1.25rem;
  font-style: normal;
  opacity: 0.8;
  margin-top: 1rem;
}

.quote-content :deep(h1) {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.quote-content :deep(h2) {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
</style>
