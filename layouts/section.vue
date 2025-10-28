<template>
  <CenteredLayout 
    layout-name="section" 
    max-width="full" 
    :show-header="false"
    custom-spacing="1rem"
  >
    <slot />
  </CenteredLayout>
</template>

<script setup lang="ts">
import CenteredLayout from '../components/CenteredLayout.vue'
</script>

<style>
/* Section specific styles - larger fonts */
.slidev-layout.section :deep(h1) {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.slidev-layout.section :deep(h2) {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.slidev-layout.section :deep(p) {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}
</style>
