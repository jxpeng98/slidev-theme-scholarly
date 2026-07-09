<template>
  <div class="slidev-layout compare flex flex-col h-full">
    <ScholarlyHeader v-if="title || subtitle" :title="title" :subtitle="subtitle" class="flex-shrink-0" />
    <div class="flex-grow compare-container" :class="{ 'has-header': title || subtitle }">
      <div class="compare-left" :class="[`compare-${leftColor}`]">
        <div class="compare-label" v-if="leftLabel">{{ leftLabel }}</div>
        <div class="compare-content" :style="computedStyles">
          <slot name="left">
            <slot />
          </slot>
        </div>
      </div>
      <div class="compare-divider">
        <span class="divider-text">VS</span>
      </div>
      <div class="compare-right" :class="[`compare-${rightColor}`]">
        <div class="compare-label" v-if="rightLabel">{{ rightLabel }}</div>
        <div class="compare-content" :style="computedStyles">
          <slot name="right" />
        </div>
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

defineProps<{
  title?: string
  subtitle?: string
  /** Left side label (e.g., "Before", "Method A") */
  leftLabel?: string
  /** Right side label (e.g., "After", "Method B") */
  rightLabel?: string
  /** Left side color accent */
  leftColor?: 'red' | 'blue' | 'green' | 'gray'
  /** Right side color accent */
  rightColor?: 'red' | 'blue' | 'green' | 'gray'
}>()

const computedStyles = useFontSizeStyles()
</script>

<style scoped>
.compare-container {
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 1rem 2rem calc(var(--scholarly-footer-height) + 0.5rem);
}

.compare-container.has-header {
  padding-top: 60px;
}

.compare-left,
.compare-right {
  flex: 1;
  padding: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
}

.compare-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid currentColor;
  opacity: 0.8;
}

.compare-content {
  flex: 1;
}

.compare-content :deep(h2),
.compare-content :deep(h3) {
  margin-top: 0;
}

.compare-content :deep(ul),
.compare-content :deep(ol) {
  padding-left: 1.25rem;
}

.compare-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}

.divider-text {
  font-size: 1rem;
  font-weight: 700;
  color: var(--scholarly-content-fg-muted, #9ca3af);
  background: var(--scholarly-content-surface, white);
  padding: 0.5rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Color variants */
.compare-red {
  background: rgba(239, 68, 68, 0.08);
  border-left: 3px solid #ef4444;
}
.compare-red .compare-label { color: var(--scholarly-highlight-danger-fg, #dc2626); }

.compare-blue {
  background: rgba(59, 130, 246, 0.08);
  border-left: 3px solid #3b82f6;
}
.compare-blue .compare-label { color: var(--scholarly-highlight-info-fg, #2563eb); }

.compare-green {
  background: rgba(16, 185, 129, 0.08);
  border-left: 3px solid #10b981;
}
.compare-green .compare-label { color: var(--scholarly-highlight-success-fg, #059669); }

.compare-gray {
  background: rgba(107, 114, 128, 0.08);
  border-left: 3px solid #6b7280;
}
.compare-gray .compare-label { color: var(--scholarly-content-fg-muted, #4b5563); }
</style>
