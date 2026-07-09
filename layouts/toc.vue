<template>
  <!-- Updated: 2026-01-08 21:00 -->
  <div class="slidev-layout toc flex flex-col h-full">
    <div
      ref="contentWrapperRef"
      class="flex-grow toc-container"
    >
      <div
        ref="contentInnerRef"
        class="toc-content"
        :style="computedStyles"
        >
        <h1 v-if="tocTitle" class="toc-title">
          {{ tocTitle }}
        </h1>
        
        <!-- TOC Items as ordered list style -->
        <ol class="toc-list">
          <li 
            v-for="(section, idx) in tocSections" 
            :key="idx"
            class="toc-item"
            :class="{
              'toc-item--no-numbers': !showNumbers,
              'is-active': highlightCurrent && section.isActive,
              'is-inactive': highlightCurrent && !section.isActive
            }"
            @click="navigateToSection(section.slideNo)"
          >
            <!-- Circular number badge -->
            <span v-if="showNumbers" class="toc-number">
              {{ idx + 1 }}
            </span>
            
            <!-- Content -->
            <span class="toc-section-title">{{ section.title }}</span>
            <span v-if="section.subtitle" class="toc-section-subtitle">
              — {{ section.subtitle }}
            </span>
          </li>
        </ol>
        
        <!-- Slot for additional content -->
        <div v-if="$slots.default" class="mt-4">
          <slot />
        </div>
      </div>
    </div>
    <ScholarlyFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSlideContext } from '@slidev/client'
import ScholarlyFooter from '../components/ScholarlyFooter.vue'
import { useAutoFontSize } from '../utils/useAutoFontSize'
import { useFontSizeStyles } from '../utils/useFontSizeStyles'
import { sanitizeMarkdownHeadingTitle } from '../utils/outlineTitle'

interface TocSection {
  title: string
  subtitle?: string
  slideNo: number
  isActive: boolean
}

const props = defineProps<{
  /** Custom title for the TOC (default: 'Outline'), set to false to hide */
  title?: string | false
  /** Show section numbers (default: true) */
  showNumbers?: boolean
  /** Highlight the current active section (default: true) */
  highlightCurrent?: boolean
  /** Manually specify sections (overrides auto-extraction) */
  sections?: string[]
}>()

const { $slidev } = useSlideContext()

// TOC title - from frontmatter or default
const tocTitle = computed(() => {
  if (props.title === false) return ''
  if (typeof props.title === 'string' && props.title.trim()) return props.title

  const slidevConfigs = $slidev?.configs as any
  const lang = String(slidevConfigs?.lang || slidevConfigs?.language || 'en')
  return lang.startsWith('zh') ? '目录' : 'Outline'
})

// Refs for auto-font-size
const contentWrapperRef = ref<HTMLElement>()
const contentInnerRef = ref<HTMLElement>()

// Auto-adjusting font size based on content
const { fontSize: contentFontSize } = useAutoFontSize(contentWrapperRef, contentInnerRef)
const computedStyles = useFontSizeStyles(contentFontSize)

// Get all slides from Slidev
const allSlides = computed(() => {
  return ($slidev.nav as any).slides || []
})

// Current slide number
const currentPage = computed(() => $slidev.nav.currentPage)

const getSlideMeta = (slide: any) => {
  return slide?.meta?.slide || slide?.slide || {}
}

const getSlideFrontmatter = (slide: any) => {
  return getSlideMeta(slide)?.frontmatter || slide?.frontmatter || {}
}

const getSlideRawContent = (slide: any) => {
  return getSlideMeta(slide)?.content || slide?.content || ''
}

const getSlideTitle = (slide: any, fallback: string) => {
  const frontmatter = getSlideFrontmatter(slide)
  const title = getSlideMeta(slide)?.title || slide?.title || frontmatter.title

  if (typeof title === 'string' && title.trim()) {
    const sanitizedTitle = sanitizeMarkdownHeadingTitle(title)
    if (sanitizedTitle)
      return sanitizedTitle
  }

  const rawContent = getSlideRawContent(slide)
  const h1Match = rawContent.match(/^#\s+(.+)$/m)
  if (h1Match?.[1]?.trim())
    return sanitizeMarkdownHeadingTitle(h1Match[1])

  return fallback
}

// Extract sections from slides with layout: section
const tocSections = computed<TocSection[]>(() => {
  if (props.sections && props.sections.length > 0) {
    return props.sections.map((title, idx) => {
      const sanitizedTitle = sanitizeMarkdownHeadingTitle(title)
      return {
        title: sanitizedTitle || title.trim() || `Section ${idx + 1}`,
        slideNo: idx + 1,
        isActive: false
      }
    })
  }

  const sections: TocSection[] = []
  const slides = allSlides.value

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    const frontmatter = getSlideFrontmatter(slide)
    const layout = frontmatter.layout || (i === 0 ? 'cover' : 'default')

    if (layout === 'section') {
      const rawContent = getSlideRawContent(slide)
      const title = getSlideTitle(slide, `Section ${sections.length + 1}`)
      const subtitleMatch = rawContent.match(/^#\s+.+\n+(?:##\s+)?(.+)$/m)
      const rawSubtitle = subtitleMatch ? subtitleMatch[1] : frontmatter.subtitle
      const subtitle = typeof rawSubtitle === 'string'
        ? sanitizeMarkdownHeadingTitle(rawSubtitle)
        : rawSubtitle

      sections.push({
        title,
        subtitle,
        slideNo: i + 1,
        isActive: false
      })
    }
  }

  const current = currentPage.value
  for (let i = sections.length - 1; i >= 0; i--) {
    if (current >= sections[i].slideNo) {
      sections[i].isActive = true
      break
    }
  }

  return sections
})

const navigateToSection = (slideNo: number) => {
  if (slideNo > 0) {
    $slidev.nav.go(slideNo)
  }
}

const showNumbers = computed(() => props.showNumbers !== false)
const highlightCurrent = computed(() => props.highlightCurrent !== false)
</script>

<style scoped>
/* Container - matching bullets layout pattern */
.toc-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 3rem calc(var(--scholarly-footer-height) + 0.5rem);
}

.toc-container.has-header {
  padding-top: 60px;
}

.toc-content {
  max-width: 90%;
}

/* Title - matching bullets h1/h2 style */
.toc-title {
  margin-bottom: 1.5rem;
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #1e3a5f));
  font-family: var(--scholarly-font-sans, sans-serif);
  font-size: 2rem;
  font-weight: 700;
}

/* TOC List - matching bullets ol style */
.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: item;
}

/* TOC Item - matching bullets ol > li style */
	.toc-item {
	  position: relative;
	  padding-left: 2.5rem;
	  margin-bottom: 1rem;
  font-size: 1.25rem;
  line-height: 1.6;
  cursor: pointer;
	  transition: opacity 0.15s ease;
	}

	.toc-item.toc-item--no-numbers {
	  padding-left: 0;
	}

	.toc-item:hover {
	  opacity: 0.8;
	}

.toc-item.is-active {
  font-weight: 600;
}

.toc-item.is-inactive {
  opacity: 0.6;
}

.toc-item.is-inactive:hover {
  opacity: 0.85;
}

/* Circular number badge - matching bullets ol::before */
.toc-number {
  position: absolute;
  left: 0;
  top: 0.1em;
  width: 1.75rem;
  height: 1.75rem;
  background: var(--slidev-theme-primary, #1e3a5f);
  color: var(--scholarly-content-on-primary, white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--scholarly-font-sans, sans-serif);
}

.toc-item.is-active .toc-number {
  box-shadow: 0 2px 4px rgba(30, 58, 95, 0.3);
}

/* Section title */
.toc-section-title {
  color: var(--scholarly-content-fg, #1f2937) !important;
  font-family: var(--scholarly-font-serif, serif);
}

.toc-item.is-active .toc-section-title {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #1e3a5f)) !important;
}

/* Section subtitle */
.toc-section-subtitle {
  color: var(--scholarly-content-fg-muted, #6b7280) !important;
  font-size: 0.85em;
  font-style: italic;
  margin-left: 0.25em;
}

/* Strong text emphasis - matching bullets */
.toc-content :deep(strong) {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #1e3a5f));
}
</style>
