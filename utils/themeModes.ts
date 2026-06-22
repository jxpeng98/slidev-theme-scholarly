export type ScholarlyMode = 'light' | 'dark'
export type ScholarlySurfaceMode = ScholarlyMode | 'match' | 'inverse'
export type ScholarlyModeSource = 'contentMode' | 'colorMode' | 'slidev'

export interface ScholarlyModeConfig {
  contentMode?: unknown
  chromeMode?: unknown
  sectionMode?: unknown
  colorMode?: unknown
}

export interface ScholarlyModeResolution {
  contentMode: ScholarlyMode
  chromeMode: ScholarlyMode
  sectionMode: ScholarlyMode
  source: ScholarlyModeSource
}

export function normalizeScholarlyMode(value: unknown): ScholarlyMode | null {
  if (typeof value !== 'string')
    return null

  const normalized = value.trim().toLowerCase()
  return normalized === 'light' || normalized === 'dark' ? normalized : null
}

export function normalizeScholarlySurfaceMode(value: unknown): ScholarlySurfaceMode | null {
  const baseMode = normalizeScholarlyMode(value)
  if (baseMode)
    return baseMode

  if (typeof value !== 'string')
    return null

  const normalized = value.trim().toLowerCase()
  return normalized === 'match' || normalized === 'inverse' ? normalized : null
}

export function invertScholarlyMode(mode: ScholarlyMode): ScholarlyMode {
  return mode === 'dark' ? 'light' : 'dark'
}

export function resolveScholarlySurfaceMode(
  value: unknown,
  contentMode: ScholarlyMode,
  fallback: ScholarlySurfaceMode,
): ScholarlyMode {
  const surfaceMode = normalizeScholarlySurfaceMode(value) ?? fallback

  if (surfaceMode === 'match')
    return contentMode

  if (surfaceMode === 'inverse')
    return invertScholarlyMode(contentMode)

  return surfaceMode
}

export function resolveScholarlySectionMode(options: {
  localSectionMode?: unknown
  globalSectionMode?: unknown
  contentMode: ScholarlyMode
}): ScholarlyMode {
  const sectionMode = normalizeScholarlySurfaceMode(options.localSectionMode)
    ?? normalizeScholarlySurfaceMode(options.globalSectionMode)
    ?? 'dark'

  return resolveScholarlySurfaceMode(
    sectionMode,
    options.contentMode,
    'dark',
  )
}

export function resolveScholarlyModes(options: {
  themeConfig?: ScholarlyModeConfig | null
  slidevDark: boolean
}): ScholarlyModeResolution {
  const themeConfig = options.themeConfig ?? {}
  const explicitContentMode = normalizeScholarlyMode(themeConfig.contentMode)
  const legacyColorMode = normalizeScholarlyMode(themeConfig.colorMode)

  const contentMode = explicitContentMode ?? legacyColorMode ?? (options.slidevDark ? 'dark' : 'light')
  const source: ScholarlyModeSource = explicitContentMode
    ? 'contentMode'
    : legacyColorMode
      ? 'colorMode'
      : 'slidev'

  return {
    contentMode,
    chromeMode: resolveScholarlySurfaceMode(
      themeConfig.chromeMode,
      contentMode,
      source === 'colorMode' ? legacyColorMode ?? 'dark' : 'dark',
    ),
    sectionMode: resolveScholarlySurfaceMode(themeConfig.sectionMode, contentMode, 'dark'),
    source,
  }
}
