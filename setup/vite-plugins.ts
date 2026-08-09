import { defineVitePluginsSetup } from '@slidev/types'
import { resolveScholarlyCitationConfig } from './citation-config'

declare global {
  // eslint-disable-next-line no-var
  var __scholarlyConfig: {
    bibFile: string
    bibStyle: string
    showNum: boolean
  } | undefined
}

export default defineVitePluginsSetup((options) => {
  const headmatter = options.data.headmatter || {}

  globalThis.__scholarlyConfig = resolveScholarlyCitationConfig(headmatter, options.entry)

  return []
})
