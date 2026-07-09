<template>
  <div class="slidev-layout fact flex flex-col h-full">
    <div class="flex-grow fact-container">
      <div class="fact-content" :class="[`fact-${color}`]">
        <div class="fact-number" :style="computedStyles">
          <slot />
        </div>
        <div class="fact-decoration"></div>
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

defineProps<{
  /** Accent color */
  color?: 'primary' | 'blue' | 'green' | 'amber' | 'red' | 'purple'
}>()

const computedStyles = useFontSizeStyles()
</script>

<style scoped>
.fact-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-image: radial-gradient(circle at center, rgba(30, 58, 95, 0.03) 0%, transparent 70%);
}

.fact-content {
  text-align: center;
  position: relative;
  padding: 3rem;
  border: 1px solid var(--scholarly-content-border, rgba(0, 0, 0, 0.05));
  border-radius: 8px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  background: color-mix(in srgb, var(--scholarly-content-surface, #ffffff) 86%, transparent);
  backdrop-filter: blur(5px);
}

.fact-number :deep(h1) {
  font-size: 6rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--fact-color-start), var(--fact-color-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.fact-number :deep(p) {
  font-size: 1.5rem;
  color: var(--scholarly-content-fg-muted, #6b7280);
  margin: 0;
}

.fact-number :deep(h2) {
  font-size: 2rem;
  font-weight: 600;
  color: var(--scholarly-content-fg, #374151);
  margin: 0;
}

.fact-decoration {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--fact-color-start), var(--fact-color-end));
}

/* Color variants - Academic tones */
.fact-primary {
  --fact-color-start: var(--scholarly-content-accent-fg);
  --fact-color-end: color-mix(in srgb, var(--scholarly-content-accent-fg) 72%, var(--scholarly-content-fg) 28%);
}

.fact-blue {
  --fact-color-start: var(--scholarly-highlight-info-fg);
  --fact-color-end: color-mix(in srgb, var(--scholarly-highlight-info-fg) 72%, var(--scholarly-content-fg) 28%);
}

.fact-green {
  --fact-color-start: var(--scholarly-highlight-success-fg);
  --fact-color-end: color-mix(in srgb, var(--scholarly-highlight-success-fg) 72%, var(--scholarly-content-fg) 28%);
}

.fact-amber {
  --fact-color-start: var(--scholarly-highlight-warning-fg);
  --fact-color-end: color-mix(in srgb, var(--scholarly-highlight-warning-fg) 72%, var(--scholarly-content-fg) 28%);
}

.fact-red {
  --fact-color-start: var(--scholarly-highlight-danger-fg);
  --fact-color-end: color-mix(in srgb, var(--scholarly-highlight-danger-fg) 72%, var(--scholarly-content-fg) 28%);
}

.fact-purple {
  --fact-color-start: var(--scholarly-content-purple-fg);
  --fact-color-end: color-mix(in srgb, var(--scholarly-content-purple-fg) 62%, var(--scholarly-content-fg) 38%);
}
</style>
