<template>
  <div class="slidev-layout figure flex flex-col h-full">
    <ScholarlyHeader v-if="headerTitle || headerSubtitle" :title="headerTitle" :subtitle="headerSubtitle" class="flex-shrink-0" />
    <div class="flex-grow figure-container" :class="{ 'has-header': headerTitle || headerSubtitle }">
      <div class="figure-image">
        <slot name="figure">
          <img v-if="imageSrc" :src="imageSrc" :alt="caption || 'Figure'" :style="imageStyle">
        </slot>
      </div>
      <div class="figure-caption" v-if="caption || $slots.caption">
        <span class="caption-label" v-if="label">{{ label }}</span>
        <slot name="caption">{{ caption }}</slot>
      </div>
      <div class="figure-description" v-if="$slots.default" :style="computedStyles">
        <slot />
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ScholarlyHeader from '../components/ScholarlyHeader.vue'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'

const props = defineProps<{
  /** Figure image URL. Prefer `image` in Slidev frontmatter because `src` is reserved by Slidev. */
  image?: string
  /** Legacy alias for the figure image URL. Avoid using `src` in Slidev frontmatter. */
  src?: string
  /** Figure caption */
  caption?: string
  /** Figure label (e.g., "Figure 1:", "Fig. 2:") */
  label?: string
  /** Header title */
  title?: string
  /** Header subtitle */
  subtitle?: string
  /** Image max height (default: 60%) */
  height?: string
  /** Image fit: contain (default), cover */
  fit?: 'contain' | 'cover'
}>()

const computedStyles = useFontSizeStyles()

const headerTitle = computed(() => props.title)
const headerSubtitle = computed(() => props.subtitle)
const imageSrc = computed(() => props.image || props.src)

const imageStyle = computed(() => ({
  maxHeight: props.height || '55vh',
  objectFit: props.fit || 'contain',
}))
</script>

<style scoped>
.figure-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem calc(var(--scholarly-footer-height) + 0.5rem);
  text-align: center;
}

.figure-container.has-header {
  padding-top: 55px;
}

.figure-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.figure-image img {
  max-width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.figure-caption {
  font-size: 1.1rem;
  color: var(--scholarly-content-fg-muted, #4b5563);
  margin-bottom: 0.75rem;
  max-width: 80%;
}

.caption-label {
  font-weight: 600;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #5d8392));
  margin-right: 0.5rem;
}

.figure-description {
  font-size: 1rem;
  color: var(--scholarly-content-fg-muted, #6b7280);
  max-width: 70%;
  line-height: 1.5;
}

.figure-description :deep(p) {
  margin: 0;
}
</style>
