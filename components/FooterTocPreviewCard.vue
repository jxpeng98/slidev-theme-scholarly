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
   FooterTocPreviewCard — Academic Index Card Preview
   Warm paper frame matching the outline panel's aesthetic.
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
  border: 1px solid color-mix(in srgb, var(--scholarly-content-border, #dbe3ec) 68%, var(--scholarly-accent, #b8860b) 6%, #c4b998 26%);
  border-radius: 0.56rem;
  background: var(--scholarly-bg-warm, #fdfbf7);
  box-shadow:
    0 0.8rem 2rem rgba(45, 55, 72, 0.1),
    0 0.2rem 0.6rem rgba(45, 55, 72, 0.06),
    0 0 0 0.5px rgba(45, 55, 72, 0.04);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.footer-toc-preview-stage {
  width: 15.5rem;
  height: v-bind(previewHeight);
  overflow: hidden;
  margin: 0.2rem;
  border-radius: 0.44rem;
  background: var(--scholarly-bg-warm, #fdfbf7);
  box-shadow: inset 0 0 0 1px rgba(45, 55, 72, 0.06);
}

.footer-toc-preview-badge {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  min-width: 1.4rem;
  height: 1.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.32rem;
  border: none;
  border-radius: 999px;
  background: color-mix(in srgb, var(--slidev-theme-primary, #1e3a5f) 86%, var(--scholarly-accent, #b8860b) 14%);
  color: #fff;
  font-family: var(--scholarly-font-sans);
  font-size: 0.58rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 0.08rem 0.24rem rgba(45, 55, 72, 0.12);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.footer-toc-preview-enter-active,
.footer-toc-preview-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.footer-toc-preview-enter-from,
.footer-toc-preview-leave-to {
  opacity: 0;
  transform: translateX(0.16rem);
}

@media (prefers-reduced-motion: reduce) {
  .footer-toc-preview-enter-active,
  .footer-toc-preview-leave-active {
    transition: none;
  }
}
</style>
