<template>
  <CenteredLayout layout-name="center" max-width="full">
    <slot />
  </CenteredLayout>
</template>

<script setup lang="ts">
import CenteredLayout from '../components/CenteredLayout.vue'
</script>
