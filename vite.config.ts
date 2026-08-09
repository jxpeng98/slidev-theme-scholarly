import citationPluginMod from '@jxpeng98/markdown-it-citation'
import { defineConfig } from 'vite'
import { resolveScholarlyCitationConfig } from './setup/citation-config'

const SCHOLARLY_CITATIONS_RE = /<!--\s*scholarly-citations:\s*(\[.*?\])\s*-->/
const SCHOLARLY_CITATION_SETUP_FLAG = Symbol.for('scholarly.citation.setup')

function resolveCitationPlugin(mod: unknown): unknown {
  return (mod as { default?: unknown } | undefined)?.default ?? mod
}

function resolveCitationConfig(options: Record<string, unknown> = {}) {
  const config = (globalThis as typeof globalThis & {
    __scholarlyConfig?: {
      bibFile?: string
      bibStyle?: string
      showNum?: boolean
    }
  }).__scholarlyConfig || resolveScholarlyCitationConfig({})

  return {
    bibFile: options.bibFile || config.bibFile || 'references.bib',
    style: options.style || config.bibStyle || 'apa',
    showNum: options.showNum ?? config.showNum ?? false,
    bibTitle: options.bibTitle ?? '',
    autoGenerate: options.autoGenerate ?? false,
  }
}

function setupScholarlyCitationMarkdown(md: any, options: Record<string, unknown> = {}) {
  if (md[SCHOLARLY_CITATION_SETUP_FLAG])
    return

  md[SCHOLARLY_CITATION_SETUP_FLAG] = true

  const citationPlugin = resolveCitationPlugin(citationPluginMod)

  if (typeof citationPlugin !== 'function') {
    console.warn('[citation] resolved plugin is not a function:', citationPluginMod)
    return
  }

  md.use(citationPlugin, resolveCitationConfig(options))

  md.core.ruler.before('citation_bibliography', 'scholarly_citations_parser', (state: any) => {
    const match = state.src.match(SCHOLARLY_CITATIONS_RE)
    if (!match)
      return

    try {
      const citations = JSON.parse(match[1]) as string[]
      state.env ||= {}
      state.env.frontmatter ||= {}
      state.env.frontmatter.citations = citations
    }
    catch (error) {
      console.error('[scholarly] Failed to parse citations comment:', error)
    }
  })
}

export default defineConfig({
  slidev: {
    markdown: {
      markdownSetup(md) {
        setupScholarlyCitationMarkdown(md)
      },
      markdownItSetup(md) {
        setupScholarlyCitationMarkdown(md)
      },
    },
  },
})
