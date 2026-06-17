export const VERTICAL_OVERFLOW_TOLERANCE_PX = 1
export const VERTICAL_SCROLL_OVERFLOW_VALUES = new Set(['auto', 'scroll', 'overlay'])

interface VerticalOverflowMetrics {
  clientHeight: number
  scrollHeight: number
}

export function isVerticalScrollOverflowMode(value: string): boolean {
  return VERTICAL_SCROLL_OVERFLOW_VALUES.has(value)
}

export function hasVerticalOverflow(
  metrics: VerticalOverflowMetrics,
  tolerancePx = VERTICAL_OVERFLOW_TOLERANCE_PX,
): boolean {
  return metrics.scrollHeight - metrics.clientHeight > tolerancePx
}
