<template>
  <div class="slidev-layout end flex flex-col h-full">
    <div class="flex-grow end-container">
      <div class="end-content">
        <div class="end-title">
          <slot name="title">
            <h1>{{ thankYouText }}</h1>
          </slot>
        </div>
        
        <div class="end-subtitle" v-if="$slots.default || subtitle || email || website">
          <slot>
            <p v-if="subtitle">{{ subtitle }}</p>
          </slot>
        </div>
        
        <div class="end-contact" v-if="email || website || $slots.contact">
          <slot name="contact">
            <div class="contact-item" v-if="email">
              <span class="contact-icon">📧</span>
              <a :href="`mailto:${email}`">{{ email }}</a>
            </div>
            <div class="contact-item" v-if="website">
              <span class="contact-icon">🌐</span>
              <a :href="website" target="_blank">{{ website }}</a>
            </div>
          </slot>
        </div>

        <div class="end-qr" v-if="qrcode">
          <img :src="qrcode" alt="QR Code" class="qr-image">
          <p class="qr-label" v-if="qrcodeLabel">{{ qrcodeLabel }}</p>
        </div>
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'

const props = defineProps<{
  /** Custom thank you text */
  thankYou?: string
  /** Subtitle text (e.g., "Questions?") */
  subtitle?: string
  /** Contact email */
  email?: string
  /** Website URL */
  website?: string
  /** QR code image URL */
  qrcode?: string
  /** QR code label */
  qrcodeLabel?: string
}>()

const { $slidev } = useSlideContext()

const thankYouText = computed(() => {
  if (props.thankYou) return props.thankYou
  const lang = ($slidev?.configs as any)?.lang || 'en'
  return lang === 'zh' ? '谢谢！' : 'Thank You!'
})
</script>

<style scoped>
.end-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.end-content {
  text-align: center;
  max-width: 80%;
}

.end-title :deep(h1) {
  font-size: 4rem;
  font-weight: 700;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #5d8392));
  margin-bottom: 1rem;
}

.end-subtitle {
  font-size: 1.75rem;
  color: var(--scholarly-content-fg-muted, #6b7280);
  margin-bottom: 2rem;
}

.end-subtitle :deep(p) {
  margin: 0;
}

.end-contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.contact-icon {
  font-size: 1.25rem;
}

.contact-item a {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #5d8392));
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

.end-qr {
  margin-top: 1.5rem;
}

.qr-image {
  width: 120px;
  height: 120px;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qr-label {
  font-size: 0.875rem;
  color: var(--scholarly-content-fg-muted, #9ca3af);
  margin-top: 0.5rem;
}
</style>
