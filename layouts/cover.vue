<template>
  <div class="slidev-layout cover">
    <div class="my-auto w-full text-center">
      <slot />
      
      <!-- Author information section -->
      <div v-if="parsedAuthors.length > 0" class="author-section mt-12">
        <div class="flex justify-center items-start gap-8 flex-wrap">
          <div v-for="(author, index) in parsedAuthors" :key="index" class="author-item">
            <div class="author-name text-xl">{{ author.name }}</div>
            <div v-if="author.institution" class="author-institution text-lg mt-2 opacity-80">
              {{ author.institution }}
            </div>
            <div v-if="author.email" class="author-email text-base mt-1 opacity-70">
              {{ author.email }}
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="$slidev.configs.author" class="author-section mt-12">
        <div class="author-name text-xl">{{ $slidev.configs.author }}</div>
      </div>
    </div>
    <ScholarlyFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'

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

// Get configs from useSlideContext
const { $slidev } = useSlideContext()
const slidevConfigs = computed(() => ($slidev.configs as any) || {})

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
</script>
