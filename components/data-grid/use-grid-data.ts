import * as React from "react"

import {
  type DataGridColumn,
  type DataGridFilterConfig,
  type DataGridRowBase,
  type DataGridSortConfig,
  type EditingCell,
} from "@/components/data-grid/types"

type UseGridDataParams<
  Row extends DataGridRowBase,
  ColumnId extends string,
  FilterPreset extends string,
  SortPreset extends string,
> = {
  initialRows: Row[]
  columns: DataGridColumn<ColumnId>[]
  filter: DataGridFilterConfig<FilterPreset, Row>
  sort: DataGridSortConfig<SortPreset, Row>
  filterPreset: FilterPreset
  sortPreset: SortPreset
  drawerCell: EditingCell<ColumnId> | null
  getDrawerCellValue: (row: Row, columnId: ColumnId) => React.ReactNode
  onRowsChange?: (rows: Row[]) => void
}

export function useGridData<
  Row extends DataGridRowBase,
  ColumnId extends string,
  FilterPreset extends string,
  SortPreset extends string,
>({
  initialRows,
  columns,
  filter,
  sort,
  filterPreset,
  sortPreset,
  drawerCell,
  getDrawerCellValue,
  onRowsChange,
}: UseGridDataParams<Row, ColumnId, FilterPreset, SortPreset>) {
  const [rows, setRows] = React.useState<Row[]>(initialRows)

  React.useEffect(() => {
    setRows(initialRows)
  }, [initialRows])

  const visibleRows = React.useMemo(() => {
    const filteredRows = rows.filter((row) => filter.apply(row, filterPreset))
    return [...filteredRows].sort((a, b) => sort.compare(a, b, sortPreset))
  }, [rows, filter, filterPreset, sort, sortPreset])

  const drawerRow = React.useMemo(() => {
    if (!drawerCell) return null
    return rows.find((row) => row.id === drawerCell.rowId) ?? null
  }, [drawerCell, rows])

  const drawerColumn = React.useMemo(() => {
    if (!drawerCell) return null
    return columns.find((column) => column.id === drawerCell.columnId) ?? null
  }, [drawerCell, columns])

  const drawerCellValue = React.useMemo(() => {
    if (!drawerCell || !drawerRow) return null
    return getDrawerCellValue(drawerRow, drawerCell.columnId)
  }, [drawerCell, drawerRow, getDrawerCellValue])

  const commitRows = React.useCallback(
    (updater: (currentRows: Row[]) => Row[]) => {
      setRows((currentRows) => {
        const resolved = updater(currentRows)
        onRowsChange?.(resolved)
        return resolved
      })
    },
    [onRowsChange]
  )

  return {
    rows,
    visibleRows,
    drawerRow,
    drawerColumn,
    drawerCellValue,
    commitRows,
  }
}
