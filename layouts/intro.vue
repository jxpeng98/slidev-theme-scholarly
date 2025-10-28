<template>
  <div class="slidev-layout intro h-full flex flex-col">
    <div class="flex-grow flex flex-col justify-center intro-content">
      <slot />
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
</script>

<style scoped>
.intro-content {
  padding-top: 0;
  padding-bottom: 35px; /* Space for fixed footer */
  padding-left: 2rem;
  padding-right: 2rem;
}

.intro-content :deep(h1),
.intro-content :deep(h2),
.intro-content :deep(h3),
.intro-content :deep(p),
.intro-content :deep(ul),
.intro-content :deep(ol) {
  text-align: left;
}
</style>
