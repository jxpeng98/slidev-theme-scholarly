<template>
  <section :class="['scholarly-caveat-list', `caveat-${variant}`, { 'caveat-compact': compact }]">
    <header v-if="title || label" class="caveat-header">
      <span v-if="label" class="caveat-label">{{ label }}</span>
      <h3 v-if="title" class="caveat-title">{{ title }}</h3>
    </header>

    <ul class="caveat-items">
      <li v-for="(item, index) in items" :key="item.title || index" class="caveat-item">
        <span class="caveat-marker">!</span>
        <div class="caveat-body">
          <strong v-if="item.title">{{ item.title }}</strong>
          <p v-if="item.description">{{ item.description }}</p>
          <p v-if="item.mitigation" class="caveat-mitigation">
            <span>{{ mitigationLabel }}:</span> {{ item.mitigation }}
          </p>
        </div>
      </li>
    </ul>

    <div v-if="$slots.default" class="caveat-content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface CaveatItem {
  title?: string
  description?: string
  mitigation?: string
}

interface Props {
  /** Section title */
  title?: string
  /** Small label above title */
  label?: string
  /** Caveat items */
  items?: CaveatItem[]
  /** Label before mitigation text */
  mitigationLabel?: string
  /** Visual emphasis variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Compact spacing */
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  label: 'Caveats',
  items: () => [],
  mitigationLabel: 'Mitigation',
  variant: 'warning',
  compact: false,
})
</script>

<style scoped>
.scholarly-caveat-list {
  --caveat-accent: var(--scholarly-highlight-warning-fg, var(--slidev-theme-primary));
  --caveat-soft-bg: var(--scholarly-highlight-warning-bg, var(--scholarly-content-surface-muted));
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-width: 0;
  margin: 0.85rem 0;
  padding: 0.9rem 1rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.5rem;
  background: var(--scholarly-content-surface);
  color: var(--scholarly-content-fg);
  box-shadow: var(--scholarly-content-shadow, none);
}

.scholarly-caveat-list.caveat-compact {
  gap: 0.5rem;
  margin: 0.55rem 0;
  padding: 0.7rem 0.8rem;
}

.caveat-header {
  min-width: 0;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid var(--scholarly-content-border);
}

.caveat-label {
  display: block;
  margin-bottom: 0.12rem;
  color: var(--caveat-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.2;
  text-transform: uppercase;
}

.caveat-title {
  margin: 0;
  color: var(--scholarly-content-fg);
  font-size: 1rem;
  font-weight: 750;
  line-height: 1.25;
}

.caveat-items {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.caveat-item {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.65rem;
  align-items: flex-start;
}

.caveat-marker {
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--caveat-soft-bg);
  color: var(--caveat-accent);
  font-size: 0.85rem;
  font-weight: 800;
  line-height: 1;
}

.caveat-body {
  min-width: 0;
}

.caveat-body strong {
  display: block;
  color: var(--scholarly-content-fg);
  font-size: 0.92rem;
  line-height: 1.25;
}

.caveat-body p {
  margin: 0.18rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.82rem;
  line-height: 1.4;
}

.caveat-mitigation {
  padding: 0.35rem 0.45rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 0.45rem;
  background: var(--caveat-soft-bg);
}

.caveat-mitigation span {
  color: var(--caveat-accent);
  font-weight: 700;
}

.caveat-content {
  color: var(--scholarly-content-fg-muted);
  font-size: 0.78rem;
  line-height: 1.4;
}

.caveat-primary {
  --caveat-accent: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  --caveat-soft-bg: var(--scholarly-content-surface-muted);
}

.caveat-success {
  --caveat-accent: var(--scholarly-highlight-success-fg, var(--slidev-theme-primary));
  --caveat-soft-bg: var(--scholarly-highlight-success-bg, var(--scholarly-content-surface-muted));
}

.caveat-danger {
  --caveat-accent: var(--scholarly-highlight-danger-fg, var(--slidev-theme-primary));
  --caveat-soft-bg: var(--scholarly-highlight-danger-bg, var(--scholarly-content-surface-muted));
}

.caveat-info {
  --caveat-accent: var(--scholarly-highlight-info-fg, var(--slidev-theme-primary));
  --caveat-soft-bg: var(--scholarly-highlight-info-bg, var(--scholarly-content-surface-muted));
}
</style>
