<template>
  <div :class="['slidev-layout', layoutName, 'flex', 'flex-col', 'justify-center', 'items-center', 'text-center']">
    <div :class="containerClass">
      <slot />
    </div>
    <AcademicFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AcademicFooter from './AcademicFooter.vue'

interface Props {
  layoutName: string
  maxWidth?: 'full' | '4xl' | '5xl' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'none'
})

const containerClass = computed(() => {
  const classes = []
  
  if (props.maxWidth === 'full') {
    classes.push('w-full')
  } else if (props.maxWidth === '4xl') {
    classes.push('max-w-4xl')
  } else if (props.maxWidth === '5xl') {
    classes.push('max-w-5xl')
  }
  
  return classes.join(' ')
})
</script>
