<template>
  <div class="slidev-layout default flex flex-col h-full">
    <ScholarlyHeader ref="headerRef" class="flex-shrink-0" />
    <div class="flex-grow overflow-auto content-wrapper" :class="{ 'no-header': !hasHeaderContent }">
      <slot />
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSlideContext } from '@slidev/client'
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'

const { $slidev } = useSlideContext()
const headerRef = ref()

const hasHeaderContent = computed(() => {
  const frontmatter = ($slidev?.nav?.currentSlideRoute?.meta?.slide as any)?.frontmatter
  return !!(frontmatter?.title || frontmatter?.subtitle)
})
</script>

<style scoped>
.content-wrapper {
  padding-top: 50px; /* Space for fixed header when it has content */
  padding-bottom: 35px; /* Space for fixed footer */
  padding-left: 0;
  padding-right: 0;
  width: 100%;
  box-sizing: border-box;
}

.content-wrapper.no-header {
  padding-top: 0;
}

.content-wrapper :deep(h1),
.content-wrapper :deep(h2),
.content-wrapper :deep(h3),
.content-wrapper :deep(p),
.content-wrapper :deep(ul),
.content-wrapper :deep(ol) {
  text-align: left;
}

.content-wrapper :deep(.theorem-box) {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}
</style>
