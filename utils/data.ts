export type ResultCell = string | number | boolean | null | undefined

export type ResultRecord = Record<string, ResultCell>

export type ResultRow = ResultRecord | ResultCell[]

export type MetricVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export type MetricTrend = 'up' | 'down' | 'flat'

export interface MetricItem {
  label?: string
  value: string | number
  unit?: string
  delta?: string
  caption?: string
  variant?: MetricVariant
  trend?: MetricTrend
}

export interface CsvTableOptions {
  headers?: string[]
  trim?: boolean
}

export interface NormalizeResultRowsOptions {
  columns?: string[]
}

export interface MetricMappingOptions {
  labelKey?: string
  valueKey?: string
  unitKey?: string
  deltaKey?: string
  captionKey?: string
  variantKey?: string
  trendKey?: string
}

const DEFAULT_METRIC_KEYS = {
  label: ['label', 'metric', 'name', 'Metric', 'Label'],
  value: ['value', 'score', 'result', 'Value', 'Score', 'Result'],
  unit: ['unit', 'Unit'],
  delta: ['delta', 'change', 'Delta', 'Change'],
  caption: ['caption', 'note', 'description', 'Caption', 'Note', 'Description'],
  variant: ['variant', 'status', 'Variant', 'Status'],
  trend: ['trend', 'Trend'],
}

const metricVariants = new Set(['primary', 'success', 'warning', 'danger', 'info'])
const metricTrends = new Set(['up', 'down', 'flat'])

export function parseCsvRows(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  const pushCell = () => {
    row.push(cell)
    cell = ''
  }

  const pushRow = () => {
    pushCell()
    if (row.length > 1 || row[0] !== '')
      rows.push(row)
    row = []
  }

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    const next = input[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      pushCell()
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n')
        index += 1
      pushRow()
      continue
    }

    cell += char
  }

  pushCell()
  if (row.length > 1 || row[0] !== '')
    rows.push(row)

  return rows
}

export function parseCsvTable(input: string, options: CsvTableOptions = {}): ResultRecord[] {
  const rows = parseCsvRows(input)
  if (!rows.length) return []

  const shouldTrim = options.trim !== false
  const normalizeCell = (value: string) => shouldTrim ? value.trim() : value
  const headers = options.headers?.length
    ? options.headers.map(normalizeCell)
    : rows[0].map(normalizeCell)
  const dataRows = options.headers?.length ? rows : rows.slice(1)

  return dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ''))
    .map((row) => headers.reduce<ResultRecord>((record, header, index) => {
      if (header)
        record[header] = normalizeCell(row[index] ?? '')
      return record
    }, {}))
}

export function normalizeResultRows(input: ResultRow[], options: NormalizeResultRowsOptions = {}): ResultRecord[] {
  if (!Array.isArray(input) || !input.length) return []

  if (Array.isArray(input[0])) {
    const rows = input as ResultCell[][]
    const headers = options.columns?.length
      ? options.columns
      : rows[0].map((value) => String(value ?? ''))
    const dataRows = options.columns?.length ? rows : rows.slice(1)

    return dataRows.map((row) => headers.reduce<ResultRecord>((record, header, index) => {
      if (header)
        record[header] = row[index]
      return record
    }, {}))
  }

  const records = input as ResultRecord[]
  if (!options.columns?.length)
    return records.map((record) => ({ ...record }))

  return records.map((record) => options.columns!.reduce<ResultRecord>((next, column) => {
    next[column] = record[column]
    return next
  }, {}))
}

export function toMetricItems(input: ResultRow[], options: MetricMappingOptions = {}): MetricItem[] {
  return normalizeResultRows(input)
    .map((row) => {
      const label = readMappedValue(row, options.labelKey, DEFAULT_METRIC_KEYS.label)
      const value = readMappedValue(row, options.valueKey, DEFAULT_METRIC_KEYS.value)
      if (value === undefined || value === null || value === '')
        return null

      const metric: MetricItem = {
        label: label === undefined || label === null ? undefined : String(label),
        value: typeof value === 'number' ? value : String(value),
      }

      const unit = readMappedValue(row, options.unitKey, DEFAULT_METRIC_KEYS.unit)
      const delta = readMappedValue(row, options.deltaKey, DEFAULT_METRIC_KEYS.delta)
      const caption = readMappedValue(row, options.captionKey, DEFAULT_METRIC_KEYS.caption)
      const variant = readMappedValue(row, options.variantKey, DEFAULT_METRIC_KEYS.variant)
      const trend = readMappedValue(row, options.trendKey, DEFAULT_METRIC_KEYS.trend)

      if (unit !== undefined && unit !== null && unit !== '') metric.unit = String(unit)
      if (delta !== undefined && delta !== null && delta !== '') metric.delta = String(delta)
      if (caption !== undefined && caption !== null && caption !== '') metric.caption = String(caption)
      if (typeof variant === 'string' && metricVariants.has(variant)) metric.variant = variant as MetricVariant
      if (typeof trend === 'string' && metricTrends.has(trend)) metric.trend = trend as MetricTrend

      return metric
    })
    .filter((metric): metric is MetricItem => metric !== null)
}

function readMappedValue(row: ResultRecord, explicitKey: string | undefined, fallbackKeys: string[]): ResultCell {
  if (explicitKey)
    return row[explicitKey]

  const key = fallbackKeys.find((candidate) => Object.prototype.hasOwnProperty.call(row, candidate))
  return key ? row[key] : undefined
}
