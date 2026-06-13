export type ScholarlyColorMode = 'light' | 'dark'

export type ScholarlySectionMode = 'light' | 'dark'

export type ScholarlyFootnoteDisplay = 'both' | 'hover-only' | 'notes-only'

export interface ScholarlyAuthor {
  name: string
  institution?: string
  email?: string
}

export interface ScholarlyThemeColors {
  primary?: string
  primaryLight?: string
  accent?: string
  bgWarm?: string
  textPrimary?: string
  headerBg?: string
  footerLeftBg?: string
  footerCenterBg?: string
  footerRightBg?: string
}

export interface ScholarlyThemeConfig {
  colorTheme?: string
  fontTheme?: string
  colorMode?: ScholarlyColorMode
  sectionMode?: ScholarlySectionMode
  beamerNav?: boolean
  outlineToc?: boolean
  outlineTocOpen?: boolean
  outlineSidebar?: boolean
  outlineSidebarOpen?: boolean
  footnoteDisplay?: ScholarlyFootnoteDisplay
}

export interface ScholarlySlideConfig {
  theme?: 'scholarly' | string
  lang?: 'en' | 'zh' | string
  author?: string
  authors?: ScholarlyAuthor[]
  conference?: string
  footerLeft?: string
  footerMiddle?: string
  footerRight?: string
  themeConfig?: ScholarlyThemeConfig
  themeColors?: ScholarlyThemeColors
}
