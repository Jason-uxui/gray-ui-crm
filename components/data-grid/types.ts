import * as React from "react"

import { HugeiconsIcon } from "@hugeicons/react"

type IconType = React.ComponentProps<typeof HugeiconsIcon>["icon"]

export type DataGridRowBase = {
  id: string
}

export type DataGridColumn<ColumnId extends string> = {
  id: ColumnId
  label: string
  icon: IconType
  defaultWidth: number
  minWidth?: number
}

export type DataGridFilterConfig<
  FilterPreset extends string,
  Row extends DataGridRowBase,
> = {
  order: FilterPreset[]
  labels: Record<FilterPreset, string>
  defaultPreset: FilterPreset
  apply: (row: Row, preset: FilterPreset) => boolean
}

export type DataGridSortConfig<SortPreset extends string, Row extends DataGridRowBase> = {
  order: SortPreset[]
  labels: Record<SortPreset, string>
  defaultPreset: SortPreset
  compare: (a: Row, b: Row, preset: SortPreset) => number
}

export type DataGridProps<
  Row extends DataGridRowBase,
  ColumnId extends string,
  FilterPreset extends string,
  SortPreset extends string,
> = {
  initialRows: Row[]
  columns: DataGridColumn<ColumnId>[]
  viewLabel: string
  getRowLabel: (row: Row) => string
  renderCell: (row: Row, column: DataGridColumn<ColumnId>) => React.ReactNode
  isEditableColumn: (columnId: ColumnId) => boolean
  getCellEditValue: (row: Row, columnId: ColumnId) => string
  applyCellEdit: (row: Row, columnId: ColumnId, nextValue: string) => Row
  getDrawerCellValue: (row: Row, columnId: ColumnId) => React.ReactNode
  filter: DataGridFilterConfig<FilterPreset, Row>
  sort: DataGridSortConfig<SortPreset, Row>
  renderSummary?: (column: DataGridColumn<ColumnId>, visibleRows: Row[]) => React.ReactNode
  drawerModal?: boolean
  disablePointerDismissal?: boolean
  onRowsChange?: (rows: Row[]) => void
}

export type EditingCell<ColumnId extends string> = {
  rowId: string
  columnId: ColumnId
}
