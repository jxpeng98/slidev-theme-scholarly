<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  colorTheme?: string
}>(), {
  colorTheme: 'classic-blue',
})

const themeColors = {
  'classic-blue': {
    primary: '#1e3a5f',
    primaryLight: '#2c5282',
    accent: '#b8860b',
    bgWarm: '#fdfbf7',
    textPrimary: '#2d3748',
  },
  'oxford-burgundy': {
    primary: '#862633',
    primaryLight: '#a23648',
    accent: '#c5a572',
    bgWarm: '#faf8f5',
    textPrimary: '#2d1b1e',
  },
  'cambridge-green': {
    primary: '#00543c',
    primaryLight: '#006b4a',
    accent: '#d4af37',
    bgWarm: '#f8faf7',
    textPrimary: '#1a2f1a',
  },
  'princeton-orange': {
    primary: '#e87722',
    primaryLight: '#f08f42',
    accent: '#1c1c1c',
    bgWarm: '#fffbf5',
    textPrimary: '#2d2d2d',
  },
  'yale-blue': {
    primary: '#0f4d92',
    primaryLight: '#286fb4',
    accent: '#d4af37',
    bgWarm: '#f7f9fc',
    textPrimary: '#1a2332',
  },
  monochrome: {
    primary: '#2d3748',
    primaryLight: '#4a5568',
    accent: '#718096',
    bgWarm: '#ffffff',
    textPrimary: '#1a202c',
  },
  'warm-sepia': {
    primary: '#5d4037',
    primaryLight: '#795548',
    accent: '#d4a574',
    bgWarm: '#faf6f1',
    textPrimary: '#3e2723',
  },
  'nordic-blue': {
    primary: '#2e5266',
    primaryLight: '#4a7c9c',
    accent: '#d4a762',
    bgWarm: '#f5f8fa',
    textPrimary: '#1e3a4a',
  },
  'high-contrast': {
    primary: '#000000',
    primaryLight: '#333333',
    accent: '#0066cc',
    bgWarm: '#ffffff',
    textPrimary: '#000000',
  },
}

const colors = computed(() => themeColors[props.colorTheme as keyof typeof themeColors] || themeColors['classic-blue'])

const cssVars = computed(() => ({
  '--preview-primary': colors.value.primary,
  '--preview-primary-light': colors.value.primaryLight,
  '--preview-accent': colors.value.accent,
  '--preview-bg-warm': colors.value.bgWarm,
  '--preview-text-primary': colors.value.textPrimary,
  '--preview-content-accent': props.colorTheme === 'princeton-orange' ? '#9d5926' : colors.value.primary,
  '--preview-on-primary': props.colorTheme === 'princeton-orange' ? '#1c1c1c' : '#ffffff',
}))
</script>

<template>
  <div class="theme-preview" :style="cssVars">
    <slot />
  </div>
</template>

<style scoped>
.theme-preview {
  background: var(--preview-bg-warm);
  color: var(--preview-text-primary);
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid var(--preview-primary);
}

.theme-preview :deep(h1),
.theme-preview :deep(h2),
.theme-preview :deep(h3) {
  color: var(--preview-content-accent);
}

.theme-preview :deep(.block),
.theme-preview :deep(.scholarly-block) {
  border-left-color: var(--preview-primary);
  background: color-mix(in srgb, var(--preview-primary) 5%, var(--preview-bg-warm));
}

.theme-preview :deep(.theorem-box) {
  border-color: var(--preview-primary);
}

.theme-preview :deep(.theorem-title) {
  background: var(--preview-primary);
  color: var(--preview-on-primary);
}

.theme-preview :deep(a) {
  color: var(--preview-accent);
}

.theme-preview :deep(strong) {
  color: var(--preview-content-accent);
}

.theme-preview :deep(code) {
  background: color-mix(in srgb, var(--preview-primary) 10%, var(--preview-bg-warm));
  color: var(--preview-content-accent);
}
</style>
