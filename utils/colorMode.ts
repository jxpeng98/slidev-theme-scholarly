export type ScholarlyColorMode = 'light' | 'dark'
export type ScholarlyColorModeSource = 'config' | 'slidev'

export interface ScholarlyColorModeResolution {
  mode: ScholarlyColorMode
  source: ScholarlyColorModeSource
}

export interface ScholarlyColorModeRoot {
  style: {
    colorScheme?: string
  }
  classList: {
    contains(name: string): boolean
    toggle(name: string, force?: boolean): boolean
  }
  setAttribute(name: string, value: string): void
}

export function normalizeScholarlyColorMode(value: unknown): ScholarlyColorMode | null {
  if (typeof value !== 'string')
    return null

  const normalized = value.trim().toLowerCase()
  return normalized === 'light' || normalized === 'dark'
    ? normalized
    : null
}

export function resolveScholarlyColorMode(
  configuredMode: unknown,
  slidevDark: boolean,
): ScholarlyColorModeResolution {
  const explicitMode = normalizeScholarlyColorMode(configuredMode)
  if (explicitMode)
    return { mode: explicitMode, source: 'config' }

  return { mode: slidevDark ? 'dark' : 'light', source: 'slidev' }
}

export function applyRootColorMode(
  root: ScholarlyColorModeRoot,
  resolution: ScholarlyColorModeResolution,
) {
  root.setAttribute('data-color-mode', resolution.mode)

  if (resolution.source === 'config') {
    root.style.colorScheme = resolution.mode
    return
  }

  root.style.colorScheme = ''
}
