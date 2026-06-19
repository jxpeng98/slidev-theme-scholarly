<template>
  <Teleport to="body">
    <Transition name="footer-toc-preview">
      <div
        v-if="visible && route && clicksContext && positionStyle"
        class="footer-toc-preview"
        :style="positionStyle"
        aria-hidden="true"
      >
        <div class="footer-toc-preview-surface">
          <div class="footer-toc-preview-stage">
            <SlideContainer
              :key="slideNo"
              :no="slideNo || undefined"
              :use-snapshot="true"
              :width="previewWidth"
              class="pointer-events-none select-none"
            >
              <SlideWrapper
                :clicks-context="clicksContext"
                :route="route"
                render-context="overview"
              />
              <DrawingPreview :page="slideNo" />
            </SlideContainer>
          </div>

          <div class="footer-toc-preview-badge">
            {{ slideNo }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ClicksContext, SlideRoute } from '@slidev/types'
import type { CSSProperties, PropType } from 'vue'
import { slideAspect } from '@slidev/client'
import { computed } from 'vue'
import DrawingPreview from '@slidev/client/internals/DrawingPreview.vue'
import SlideContainer from '@slidev/client/internals/SlideContainer.vue'
import SlideWrapper from '@slidev/client/internals/SlideWrapper.vue'

const PREVIEW_WIDTH_PX = 248

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  route: {
    type: Object as PropType<SlideRoute | null>,
    default: null,
  },
  slideNo: {
    type: Number,
    default: null,
  },
  clicksContext: {
    type: Object as PropType<ClicksContext | null>,
    default: null,
  },
  positionStyle: {
    type: Object as PropType<CSSProperties | null>,
    default: null,
  },
})

const previewWidth = PREVIEW_WIDTH_PX
const previewHeight = computed(() => `${previewWidth / slideAspect.value}px`)
</script>

<style scoped>
/* ============================================================================
   FooterTocPreviewCard — Dark Liquid Glass Frame
   Matches the outline panel's dark chrome aesthetic.
   ============================================================================ */

.footer-toc-preview {
  position: fixed;
  z-index: 56;
  width: 15.5rem;
  pointer-events: none;
}

.footer-toc-preview-surface {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--slidev-theme-primary-light, #2c5282) 24%, rgba(255, 255, 255, 0.1) 76%);
  border-radius: 0.92rem;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.04), transparent 50%),
    color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 86%, #0d1f38 14%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1.2rem 2.8rem rgba(10, 22, 40, 0.38),
    0 0.4rem 1.2rem rgba(10, 22, 40, 0.18),
    0 0 0 0.5px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
}

.footer-toc-preview-stage {
  width: 15.5rem;
  height: v-bind(previewHeight);
  overflow: hidden;
  margin: 0.22rem;
  border-radius: 0.72rem;
  background: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 4%, var(--scholarly-bg-warm, #fdfbf7));
}

.footer-toc-preview-badge {
  position: absolute;
  top: 0.46rem;
  right: 0.46rem;
  min-width: 1.44rem;
  height: 1.44rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.32rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)),
    color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 72%, rgba(0, 0, 0, 0.2) 28%);
  color: rgba(255, 255, 255, 0.88);
  font-family: var(--scholarly-font-sans);
  font-size: 0.6rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0.16rem 0.5rem rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.footer-toc-preview-enter-active,
.footer-toc-preview-leave-active {
  transition: opacity 200ms cubic-bezier(0.22, 0.68, 0.35, 1), transform 200ms cubic-bezier(0.22, 0.68, 0.35, 1);
}

.footer-toc-preview-enter-from,
.footer-toc-preview-leave-to {
  opacity: 0;
  transform: translateX(0.24rem) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .footer-toc-preview-enter-active,
  .footer-toc-preview-leave-active {
    transition: none;
  }
}
</style>
