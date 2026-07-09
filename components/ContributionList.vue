<template>
  <section :class="['scholarly-contribution-list', `contribution-${variant}`, { 'contribution-compact': compact }]">
    <header v-if="title || label" class="contribution-header">
      <span v-if="label" class="contribution-label">{{ label }}</span>
      <h3 v-if="title" class="contribution-title">{{ title }}</h3>
    </header>

    <component :is="ordered ? 'ol' : 'ul'" class="contribution-items">
      <li v-for="(item, index) in items" :key="item.title || index" class="contribution-item">
        <span class="contribution-marker">{{ ordered ? index + 1 : '' }}</span>
        <div class="contribution-body">
          <strong v-if="item.title">{{ item.title }}</strong>
          <p v-if="item.description">{{ item.description }}</p>
          <span v-if="item.evidence" class="contribution-evidence">{{ item.evidence }}</span>
        </div>
      </li>
    </component>

    <div v-if="$slots.default" class="contribution-content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface ContributionItem {
  title?: string
  description?: string
  evidence?: string
}

interface Props {
  /** Section title */
  title?: string
  /** Small label above title */
  label?: string
  /** Contribution items */
  items?: ContributionItem[]
  /** Render as numbered list */
  ordered?: boolean
  /** Visual emphasis variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Compact spacing */
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  label: 'Contributions',
  items: () => [],
  ordered: true,
  variant: 'primary',
  compact: false,
})
</script>

<style scoped>
.scholarly-contribution-list {
  --contribution-accent: var(--scholarly-content-accent-fg, var(--slidev-theme-primary));
  --contribution-soft-bg: var(--scholarly-content-surface-muted);
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

.scholarly-contribution-list.contribution-compact {
  gap: 0.5rem;
  margin: 0.55rem 0;
  padding: 0.7rem 0.8rem;
}

.contribution-header {
  min-width: 0;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid var(--scholarly-content-border);
}

.contribution-label {
  display: block;
  margin-bottom: 0.12rem;
  color: var(--contribution-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.2;
  text-transform: uppercase;
}

.contribution-title {
  margin: 0;
  color: var(--scholarly-content-fg);
  font-size: 1rem;
  font-weight: 750;
  line-height: 1.25;
}

.contribution-items {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.contribution-item {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.65rem;
  align-items: flex-start;
}

.contribution-marker {
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--contribution-soft-bg);
  color: var(--contribution-accent);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  font-weight: 750;
  line-height: 1;
}

.contribution-body {
  min-width: 0;
}

.contribution-body strong {
  display: block;
  color: var(--scholarly-content-fg);
  font-size: 0.92rem;
  line-height: 1.25;
}

.contribution-body p {
  margin: 0.18rem 0 0;
  color: var(--scholarly-content-fg-muted);
  font-size: 0.82rem;
  line-height: 1.4;
}

.contribution-evidence {
  display: inline-block;
  margin-top: 0.3rem;
  padding: 0.12rem 0.42rem;
  border: 1px solid var(--scholarly-content-border);
  border-radius: 999px;
  background: var(--contribution-soft-bg);
  color: var(--contribution-accent);
  font-size: 0.68rem;
  font-weight: 650;
  line-height: 1.2;
}

.contribution-content {
  color: var(--scholarly-content-fg-muted);
  font-size: 0.78rem;
  line-height: 1.4;
}

.contribution-success {
  --contribution-accent: var(--scholarly-highlight-success-fg, var(--slidev-theme-primary));
  --contribution-soft-bg: var(--scholarly-highlight-success-bg, var(--scholarly-content-surface-muted));
}

.contribution-warning {
  --contribution-accent: var(--scholarly-highlight-warning-fg, var(--slidev-theme-primary));
  --contribution-soft-bg: var(--scholarly-highlight-warning-bg, var(--scholarly-content-surface-muted));
}

.contribution-danger {
  --contribution-accent: var(--scholarly-highlight-danger-fg, var(--slidev-theme-primary));
  --contribution-soft-bg: var(--scholarly-highlight-danger-bg, var(--scholarly-content-surface-muted));
}

.contribution-info {
  --contribution-accent: var(--scholarly-highlight-info-fg, var(--slidev-theme-primary));
  --contribution-soft-bg: var(--scholarly-highlight-info-bg, var(--scholarly-content-surface-muted));
}
</style>
