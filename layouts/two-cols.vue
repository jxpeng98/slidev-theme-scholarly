<template>
  <div class="slidev-layout two-cols grid grid-cols-2 gap-x-4">
    <div class="col-left my-auto">
      <slot name="left">
        <slot />
      </slot>
    </div>
    <div class="col-right my-auto">
      <slot name="right" />
    </div>
    <AcademicFooter />
  </div>
</template>

<script setup lang="ts">
import AcademicFooter from '../components/AcademicFooter.vue'
</script>
