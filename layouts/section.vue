<template>
  <CenteredLayout
    layout-name="section"
    max-width="full"
    :show-header="false"
    custom-spacing="1rem"
    :data-section-mode="resolvedSectionMode"
  >
    <slot />
  </CenteredLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDarkMode, useSlideContext } from '@slidev/client'
import CenteredLayout from '../components/CenteredLayout.vue'
import { resolveScholarlyModes, resolveScholarlySectionMode } from '../utils/themeModes'

const { $slidev, $frontmatter } = useSlideContext()
const { isDark } = useDarkMode()

const themeConfig = computed<Record<string, unknown>>(() => {
  return (($slidev.configs as any)?.themeConfig ?? {}) as Record<string, unknown>
})

const resolvedSectionMode = computed<'dark' | 'light'>(() => {
  const resolvedModes = resolveScholarlyModes({
    themeConfig: themeConfig.value,
    slidevDark: isDark.value,
  })

  return resolveScholarlySectionMode({
    localSectionMode: $frontmatter.value?.sectionMode,
    globalSectionMode: themeConfig.value.sectionMode,
    contentMode: resolvedModes.contentMode,
  })
})
</script>
