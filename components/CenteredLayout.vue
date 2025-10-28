<template>
  <div :class="['slidev-layout', layoutName, 'flex', 'flex-col', 'h-full']">
    <ScholarlyHeader v-if="showHeader" class="flex-shrink-0" />
    <div :class="['flex-grow', 'flex', 'flex-col', 'items-center', 'justify-center', 'text-center', 'content-wrapper-centered', containerClass]">
      <slot />
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ScholarlyHeader from './ScholarlyHeader.vue'
import ScholarlyFooter from './ScholarlyFooter.vue'

interface Props {
  layoutName: string
  maxWidth?: 'full' | '4xl' | '5xl' | 'none'
  showHeader?: boolean
  customPadding?: string
  customSpacing?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'none',
  showHeader: true,
  customPadding: undefined,
  customSpacing: undefined
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

const paddingTop = computed(() => {
  if (props.customPadding !== undefined) {
    return props.customPadding
  }
  return props.showHeader ? '60px' : '0'
})

const itemSpacing = computed(() => {
  return props.customSpacing || '0.5rem'
})
</script>

<style scoped>
.content-wrapper-centered {
  padding-top: v-bind(paddingTop);
  padding-bottom: 35px; /* Space for fixed footer */
  padding-left: 2rem;
  padding-right: 2rem;
}

.content-wrapper-centered :deep(> *) {
  margin-bottom: v-bind(itemSpacing);
}

.content-wrapper-centered :deep(> *:last-child) {
  margin-bottom: 0;
}
</style>
