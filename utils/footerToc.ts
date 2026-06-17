export const COMPACT_OUTLINE_ITEM_THRESHOLD = 32

export interface FooterTocSlideItem {
  no: number
  title: string
  active: boolean
}

export interface FooterTocSectionGroup {
  no: number
  title: string
  active: boolean
  slides: FooterTocSlideItem[]
}

export function countOutlineItems(groups: FooterTocSectionGroup[]): number {
  return groups.reduce((total, group) => total + 1 + group.slides.length, 0)
}

export function shouldUseCompactOutline(
  groups: FooterTocSectionGroup[],
  threshold = COMPACT_OUTLINE_ITEM_THRESHOLD,
): boolean {
  return countOutlineItems(groups) > threshold
}

export function formatSectionRange(
  section: FooterTocSectionGroup,
  nextSection: FooterTocSectionGroup | undefined,
  totalSlides: number,
): string {
  const end = Math.max(section.no, (nextSection?.no ?? totalSlides + 1) - 1)
  return section.no === end ? `${section.no}` : `${section.no}-${end}`
}

export function formatSlideCount(count: number, singularLabel: string, pluralLabel: string): string {
  return `${count} ${count === 1 ? singularLabel : pluralLabel}`
}
