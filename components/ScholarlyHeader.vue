<template>
  <header v-if="headerTitle || headerSubtitle" :class="['header-container', { 'header-centered': centered, 'header-fixed': !centered }]">
    <div :class="['beamer-header', { 'beamer-header-centered': centered }]">
      <div v-if="headerTitle" class="header-title">{{ headerTitle }}</div>
      <div v-if="headerSubtitle" class="header-subtitle">{{ headerSubtitle }}</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = defineProps<{
  title?: string
  subtitle?: string
  centered?: boolean
}>()

// Get slide context
const { $slidev } = useSlideContext()

// Extract title and subtitle from frontmatter only
const getCurrentFrontmatter = () => {
  const currentSlide = $slidev?.nav?.currentSlideRoute
  if (currentSlide?.meta?.slide?.frontmatter) {
    return currentSlide.meta.slide.frontmatter as any
  }
  return null
}

// Header title: use props or current page frontmatter only
const headerTitle = computed(() => {
  // Priority 1: Props override
  if (props.title) return props.title
  
  // Priority 2: Current slide frontmatter only
  const fm = getCurrentFrontmatter()
  if (fm?.title) {
    return fm.title
  }
  
  return ''
})

// Header subtitle: use props or current page frontmatter only
const headerSubtitle = computed(() => {
  // Priority 1: Props override
  if (props.subtitle) return props.subtitle
  
  // Priority 2: Current slide frontmatter only
  const fm = getCurrentFrontmatter()
  if (fm?.subtitle) {
    return fm.subtitle
  }
  
  return ''
})
</script>
