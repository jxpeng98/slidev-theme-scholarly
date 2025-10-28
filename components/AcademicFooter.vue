<template>
  <footer class="absolute bottom-0 left-0 right-0">
    <div class="flex justify-between beamer-footer">
      <span class="beamer-footer-left">{{ leftContent }}</span>
      <span class="beamer-footer-center">{{ middleContent }}</span>
      <span class="beamer-footer-right">{{ $slidev.nav.currentPage }} / {{ $slidev.nav.total }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

interface Author {
  name?: string
  institution?: string
  email?: string
}

const props = defineProps<{
  authors?: Author[]
  footerLeft?: string
  footerMiddle?: string
}>()

// Get configs from useSlidevContext
const { $slidev } = useSlideContext()
const slidevConfigs = computed(() => $slidev.configs || {})

// Parse authors from authors array (frontmatter)
const parsedAuthors = computed(() => {
  // First try to get from props (per-slide override)
  if (props.authors && Array.isArray(props.authors) && props.authors.length > 0) {
    return props.authors
  }
  
  // Then try to get from global frontmatter config
  const globalAuthors = slidevConfigs.value?.authors
  if (globalAuthors && Array.isArray(globalAuthors) && globalAuthors.length > 0) {
    return globalAuthors as Author[]
  }
  
  return []
})

// Left content: custom or author(s)
const leftContent = computed(() => {
  // Check if custom footer left is provided
  const footerLeft = props.footerLeft || slidevConfigs.value?.footerLeft
  if (footerLeft) {
    return footerLeft
  }
  
  if (parsedAuthors.value.length > 0) {
    if (parsedAuthors.value.length === 1) {
      return parsedAuthors.value[0].name
    } else if (parsedAuthors.value.length === 2) {
      return parsedAuthors.value.map(a => a.name).join(' & ')
    } else if (parsedAuthors.value.length === 3) {
      return parsedAuthors.value.map(a => a.name).join(', ')
    } else {
      // More than 3 authors: show "First Author et al."
      return `${parsedAuthors.value[0].name} et al.`
    }
  }
  // Fallback to simple author field
  return slidevConfigs.value?.author || ''
})

// Middle content: custom or conference
const middleContent = computed(() => {
  const footerMiddle = props.footerMiddle || slidevConfigs.value?.footerMiddle
  if (footerMiddle) {
    return footerMiddle
  }
  // Fallback to conference field for backward compatibility
  return slidevConfigs.value?.conference || ''
})
</script>
