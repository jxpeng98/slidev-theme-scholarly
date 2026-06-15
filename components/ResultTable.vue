<template>
  <figure :class="['scholarly-result-table', { 'result-table-compact': compact }]">
    <figcaption v-if="caption" class="result-table-caption">{{ caption }}</figcaption>

    <div class="result-table-scroll">
      <table>
        <thead>
          <tr>
            <th
              v-for="(column, index) in normalizedColumns"
              :key="column.key"
              :class="columnClass(column, index)"
              scope="col"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in normalizedRows" :key="rowIndex">
            <td
              v-for="(column, columnIndex) in normalizedColumns"
              :key="column.key"
              :class="columnClass(column, columnIndex)"
            >
              {{ formatCell(row[column.key], column, row) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ResultCell = string | number | boolean | null | undefined
type ResultRecord = Record<string, ResultCell>
type ResultRow = ResultRecord | ResultCell[]
type ColumnAlign = 'left' | 'center' | 'right'

interface ColumnObject {
  key: string
  label?: string
  align?: ColumnAlign
  format?: (value: ResultCell, row: ResultRecord) => string | number
}

type ColumnInput = string | ColumnObject

interface NormalizedColumn {
  key: string
  label: string
  align?: ColumnAlign
  format?: (value: ResultCell, row: ResultRecord) => string | number
}

interface Props {
  /** Result rows imported from JSON or produced by parseCsvTable */
  rows?: ResultRow[]
  /** Optional column order and labels */
  columns?: ColumnInput[]
  /** Short table caption */
  caption?: string
  /** Reduce padding for dense result slides */
  compact?: boolean
  /** Highlight a column by key or zero-based index */
  highlightColumn?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  rows: () => [],
  columns: undefined,
  caption: undefined,
  compact: false,
  highlightColumn: undefined,
})

const normalizedColumns = computed<NormalizedColumn[]>(() => {
  if (props.columns?.length)
    return props.columns.map((column) => typeof column === 'string'
      ? { key: column, label: column }
      : { key: column.key, label: column.label || column.key, align: column.align, format: column.format })

  const firstRow = props.rows[0]
  if (!firstRow) return []

  if (Array.isArray(firstRow)) {
    return firstRow.map((_, index) => ({
      key: String(index),
      label: `Column ${index + 1}`,
    }))
  }

  return Object.keys(firstRow).map((key) => ({ key, label: key }))
})

const normalizedRows = computed<ResultRecord[]>(() => {
  return props.rows.map((row) => {
    if (!Array.isArray(row))
      return row

    return normalizedColumns.value.reduce<ResultRecord>((record, column, index) => {
      record[column.key] = row[index]
      return record
    }, {})
  })
})

function columnClass(column: NormalizedColumn, index: number) {
  return {
    'is-highlighted': props.highlightColumn === column.key || props.highlightColumn === index,
    'is-numeric': column.align === 'right',
    'is-centered': column.align === 'center',
  }
}

function formatCell(value: ResultCell, column: NormalizedColumn, row: ResultRecord) {
  if (column.format)
    return column.format(value, row)

  if (value === null || value === undefined)
    return ''

  return value
}
</script>

<style scoped>
.scholarly-result-table {
  --result-table-surface: var(--scholarly-content-surface);
  --result-table-surface-muted: var(--scholarly-content-surface-muted, var(--scholarly-content-surface));
  --result-table-border: var(--scholarly-content-border);
  --result-table-fg: var(--scholarly-content-fg);
  --result-table-muted: var(--scholarly-content-fg-muted);
  --result-table-primary: var(--slidev-theme-primary);
  width: 100%;
  margin: 0.75rem 0;
  color: var(--result-table-fg);
}

.result-table-caption {
  margin: 0 0 0.45rem;
  color: var(--result-table-muted);
  font-size: 0.78rem;
  font-weight: 650;
  line-height: 1.35;
}

.result-table-scroll {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--result-table-border);
  border-radius: 0.5rem;
  background: var(--result-table-surface);
  box-shadow: var(--scholarly-content-shadow, none);
}

.scholarly-result-table table {
  width: 100%;
  min-width: 28rem;
  border-collapse: collapse;
  background: transparent;
  color: inherit;
  font-size: 0.82rem;
  line-height: 1.35;
}

.scholarly-result-table th,
.scholarly-result-table td {
  padding: 0.52rem 0.65rem;
  border-bottom: 1px solid var(--result-table-border);
  text-align: left;
  vertical-align: top;
}

.scholarly-result-table th {
  background: var(--result-table-surface-muted);
  color: var(--result-table-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.scholarly-result-table tbody tr:last-child td {
  border-bottom: 0;
}

.scholarly-result-table tbody tr:hover td {
  background: var(--result-table-surface-muted);
}

.scholarly-result-table .is-highlighted {
  color: var(--result-table-primary);
  font-weight: 700;
}

.scholarly-result-table th.is-highlighted {
  border-bottom-color: var(--result-table-primary);
}

.scholarly-result-table .is-numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.scholarly-result-table .is-centered {
  text-align: center;
}

.scholarly-result-table.result-table-compact {
  margin: 0.5rem 0;
}

.result-table-compact table {
  font-size: 0.76rem;
}

.result-table-compact th,
.result-table-compact td {
  padding: 0.34rem 0.5rem;
}
</style>
