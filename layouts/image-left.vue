<template>
  <div class="slidev-layout image-left grid grid-cols-2 gap-x-4">
    <div class="my-auto">
      <slot />
    </div>
    <div class="my-auto">
      <slot name="image">
        <img v-if="image" :src="image" class="w-full h-full object-cover">
      </slot>
    </div>
    <AcademicFooter />
  </div>
</template>

<script setup lang="ts">
import AcademicFooter from '../components/AcademicFooter.vue'

const props = defineProps<{
  image?: string
}>()
</script>
