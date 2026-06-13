<template>
  <div :class="['scholarly-block', `block-${type}`, { 'block-compact': compact }]">
    <div v-if="title" class="block-header">
      <span class="block-title">{{ title }}</span>
    </div>
    <div class="block-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'default' | 'info' | 'success' | 'warning' | 'danger' | 'example' | 'alert'
  title?: string
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  compact: false
})
</script>

<style scoped>
.scholarly-block {
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scholarly-block.block-compact {
  margin: 0.5rem 0;
}

.block-header {
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 1rem;
}

.block-content {
  padding: 0.75rem 1rem;
  line-height: 1.6;
}

.block-content :deep(p) {
  margin: 0.5rem 0;
}

.block-content :deep(p:first-child) {
  margin-top: 0;
}

.block-content :deep(p:last-child) {
  margin-bottom: 0;
}

.block-content :deep(ul),
.block-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

/* Default (Beamer-like blue block) */
.block-default .block-header {
  background: var(--scholarly-block-default-header-bg);
  color: var(--scholarly-block-default-header-fg);
}

.block-default .block-content {
  background: var(--scholarly-block-default-content-bg);
  border: 1px solid var(--scholarly-block-default-border);
  border-top: none;
}

/* Info (cyan/teal) */
.block-info .block-header {
  background: var(--scholarly-block-info-header-bg);
  color: var(--scholarly-block-info-header-fg);
}

.block-info .block-content {
  background: var(--scholarly-block-info-content-bg);
  border: 1px solid var(--scholarly-block-info-border);
  border-top: none;
}

/* Success (green) */
.block-success .block-header {
  background: var(--scholarly-block-success-header-bg);
  color: var(--scholarly-block-success-header-fg);
}

.block-success .block-content {
  background: var(--scholarly-block-success-content-bg);
  border: 1px solid var(--scholarly-block-success-border);
  border-top: none;
}

/* Warning (amber/orange) */
.block-warning .block-header {
  background: var(--scholarly-block-warning-header-bg);
  color: var(--scholarly-block-warning-header-fg);
}

.block-warning .block-content {
  background: var(--scholarly-block-warning-content-bg);
  border: 1px solid var(--scholarly-block-warning-border);
  border-top: none;
}

/* Danger (red) */
.block-danger .block-header {
  background: var(--scholarly-block-danger-header-bg);
  color: var(--scholarly-block-danger-header-fg);
}

.block-danger .block-content {
  background: var(--scholarly-block-danger-content-bg);
  border: 1px solid var(--scholarly-block-danger-border);
  border-top: none;
}

/* Example (pink/purple) */
.block-example .block-header {
  background: var(--scholarly-block-example-header-bg);
  color: var(--scholarly-block-example-header-fg);
}

.block-example .block-content {
  background: var(--scholarly-block-example-content-bg);
  border: 1px solid var(--scholarly-block-example-border);
  border-top: none;
}

/* Alert (Beamer alertblock style - red/brown) */
.block-alert .block-header {
  background: var(--scholarly-block-alert-header-bg);
  color: var(--scholarly-block-alert-header-fg);
}

.block-alert .block-content {
  background: var(--scholarly-block-alert-content-bg);
  border: 1px solid var(--scholarly-block-alert-border);
  border-top: none;
}

/* Without title - single colored block */
.scholarly-block:not(:has(.block-header)) .block-content {
  border-radius: 0.5rem;
  border-top: 1px solid;
}

.block-default:not(:has(.block-header)) .block-content {
  border-left: 4px solid var(--scholarly-block-default-border);
}

.block-info:not(:has(.block-header)) .block-content {
  border-left: 4px solid var(--scholarly-block-info-border);
}

.block-success:not(:has(.block-header)) .block-content {
  border-left: 4px solid var(--scholarly-block-success-border);
}

.block-warning:not(:has(.block-header)) .block-content {
  border-left: 4px solid var(--scholarly-block-warning-border);
}

.block-danger:not(:has(.block-header)) .block-content {
  border-left: 4px solid var(--scholarly-block-danger-border);
}

.block-example:not(:has(.block-header)) .block-content {
  border-left: 4px solid var(--scholarly-block-example-border);
}

.block-alert:not(:has(.block-header)) .block-content {
  border-left: 4px solid var(--scholarly-block-alert-border);
}
</style>
