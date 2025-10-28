<template>
  <div class="slidev-layout image-right grid grid-cols-2 gap-0 h-full" style="grid-template-rows: auto 1fr auto;">
    <ScholarlyHeader class="col-span-2" style="z-index: 10;" />
    <div class="image-container-right" style="grid-column: 2; grid-row: 2;">
      <slot name="image">
        <img v-if="image" :src="image" class="w-full h-full object-cover">
      </slot>
    </div>
    <div class="content-wrapper-text px-8" style="grid-column: 1; grid-row: 2;">
      <slot />
    </div>
    <ScholarlyFooter class="col-span-2" style="z-index: 10;" />
  </div>
</template>

<script setup lang="ts">
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'

const props = defineProps<{
  image?: string
}>()
</script>

<style>
.slidev-layout.image-right {
  padding: 0 !important;
}
</style>

<style scoped>
.content-wrapper-text {
  padding-top: calc(60px + 5%); /* Space for fixed header + compensate for removed layout padding */
  padding-bottom: 35px; /* Space for fixed footer */
  padding-left: 2rem;
  padding-right: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.image-container-right {
  position: relative;
  overflow: hidden;
  grid-row: 1 / -1; /* Span from first to last row */
}

.image-container-right img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
