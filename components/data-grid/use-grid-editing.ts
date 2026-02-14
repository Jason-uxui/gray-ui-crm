import * as React from "react"

import {
  type DataGridColumn,
  type DataGridRowBase,
  type EditingCell,
} from "@/components/data-grid/types"

type UseGridEditingParams<Row extends DataGridRowBase, ColumnId extends string> = {
  gridRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
  visibleRowCount: number
  visibleColumnCount: number
  isEditableColumn: (columnId: ColumnId) => boolean
  getCellEditValue: (row: Row, columnId: ColumnId) => string
  applyCellEdit: (row: Row, columnId: ColumnId, nextValue: string) => Row
  commitRows: (updater: (currentRows: Row[]) => Row[]) => void
}

export function useGridEditing<Row extends DataGridRowBase, ColumnId extends string>({
  gridRef,
  inputRef,
  visibleRowCount,
  visibleColumnCount,
  isEditableColumn,
  getCellEditValue,
  applyCellEdit,
  commitRows,
}: UseGridEditingParams<Row, ColumnId>) {
  const [editingCell, setEditingCell] = React.useState<EditingCell<ColumnId> | null>(null)
  const [draftValue, setDraftValue] = React.useState("")

  React.useEffect(() => {
    if (!editingCell) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editingCell, inputRef])

  const startEditing = React.useCallback(
    (row: Row, columnId: ColumnId) => {
      if (!isEditableColumn(columnId)) return
      setEditingCell({ rowId: row.id, columnId })
      setDraftValue(getCellEditValue(row, columnId))
    },
    [getCellEditValue, isEditableColumn]
  )

  const commitEdit = React.useCallback(() => {
    if (!editingCell) return

    commitRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== editingCell.rowId) return row
        return applyCellEdit(row, editingCell.columnId, draftValue)
      })
    )
    setEditingCell(null)
    setDraftValue("")
  }, [editingCell, draftValue, applyCellEdit, commitRows])

  const cancelEdit = React.useCallback(() => {
    setEditingCell(null)
    setDraftValue("")
  }, [])

  const focusCell = React.useCallback(
    (rowIndex: number, colIndex: number) => {
      const targetCell = gridRef.current?.querySelector<HTMLElement>(
        `[data-grid-cell="true"][data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`
      )
      targetCell?.focus()
    },
    [gridRef]
  )

  const handleCellKeyDown = React.useCallback(
    (
      event: React.KeyboardEvent<HTMLTableCellElement>,
      row: Row,
      rowIndex: number,
      column: DataGridColumn<ColumnId>,
      colIndex: number
    ) => {
      const maxRowIndex = visibleRowCount - 1
      const maxColIndex = visibleColumnCount - 1

      if (event.key === "Enter" && isEditableColumn(column.id)) {
        event.preventDefault()
        startEditing(row, column.id)
        return
      }

      if (event.key === "ArrowRight") {
        event.preventDefault()
        focusCell(rowIndex, Math.min(colIndex + 1, maxColIndex))
        return
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        focusCell(rowIndex, Math.max(colIndex - 1, 0))
        return
      }

      if (event.key === "ArrowDown") {
        event.preventDefault()
        focusCell(Math.min(rowIndex + 1, maxRowIndex), colIndex)
        return
      }

      if (event.key === "ArrowUp") {
        event.preventDefault()
        focusCell(Math.max(rowIndex - 1, 0), colIndex)
      }
    },
    [visibleRowCount, visibleColumnCount, focusCell, isEditableColumn, startEditing]
  )

  return {
    editingCell,
    draftValue,
    setDraftValue,
    startEditing,
    commitEdit,
    cancelEdit,
    handleCellKeyDown,
  }
}
