<template>
  <div class="slidev-layout two-cols grid grid-cols-2 gap-x-4 h-full" style="grid-template-rows: auto 1fr auto;">
    <ScholarlyHeader class="col-span-2" />
    <div class="col-left content-wrapper-left">
      <slot name="left">
        <slot />
      </slot>
    </div>
    <div class="col-right content-wrapper-right">
      <slot name="right" />
    </div>
    <ScholarlyFooter class="col-span-2" />
  </div>
</template>

<script setup lang="ts">
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
</script>

<style scoped>
.content-wrapper-left,
.content-wrapper-right {
  padding-top: 60px; /* Space for fixed header */
  padding-bottom: 35px; /* Space for fixed footer */
  align-self: start;
}
</style>
