import * as React from "react"

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"

import {
  type DataGridColumn,
  type DataGridRowBase,
  type EditingCell,
} from "@/components/data-grid/types"

type DataGridTableBodyProps<Row extends DataGridRowBase, ColumnId extends string> = {
  visibleRows: Row[]
  getRowLabel: (row: Row) => string
  visibleColumns: DataGridColumn<ColumnId>[]
  editingCell: EditingCell<ColumnId> | null
  isEditableColumn: (columnId: ColumnId) => boolean
  startEditing: (row: Row, columnId: ColumnId) => void
  onCellKeyDown: (
    event: React.KeyboardEvent<HTMLTableCellElement>,
    row: Row,
    rowIndex: number,
    column: DataGridColumn<ColumnId>,
    colIndex: number
  ) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  draftValue: string
  setDraftValue: (value: string) => void
  commitEdit: () => void
  cancelEdit: () => void
  renderCell: (row: Row, column: DataGridColumn<ColumnId>) => React.ReactNode
  onOpenDrawer: (cell: EditingCell<ColumnId>) => void
  columnWidths: Record<ColumnId, number>
  draggingColumnId: ColumnId | null
}

export function DataGridTableBody<Row extends DataGridRowBase, ColumnId extends string>({
  visibleRows,
  getRowLabel,
  visibleColumns,
  editingCell,
  isEditableColumn,
  startEditing,
  onCellKeyDown,
  inputRef,
  draftValue,
  setDraftValue,
  commitEdit,
  cancelEdit,
  renderCell,
  onOpenDrawer,
  columnWidths,
  draggingColumnId,
}: DataGridTableBodyProps<Row, ColumnId>) {
  return (
    <TableBody>
      {visibleRows.map((row, rowIndex) => (
        <TableRow key={row.id}>
          <TableCell className="h-8 border-r px-0 text-center">
            <Checkbox aria-label={`Select ${getRowLabel(row)}`} className="mx-auto" />
          </TableCell>
          {visibleColumns.map((column, colIndex) => {
            const isEditing = editingCell?.rowId === row.id && editingCell.columnId === column.id
            const editable = isEditableColumn(column.id)

            return (
              <TableCell
                key={`${row.id}-${column.id}`}
                data-grid-cell="true"
                data-row-index={rowIndex}
                data-col-index={colIndex}
                tabIndex={isEditing ? -1 : 0}
                className={cn(
                  "group/cell relative h-8 overflow-hidden border-r px-2 py-0.5 whitespace-nowrap outline-none",
                  "focus-visible:ring-ring/40 focus-visible:ring-2",
                  editable && "cursor-text",
                  draggingColumnId === column.id && "bg-muted/20"
                )}
                style={{
                  width: columnWidths[column.id],
                  minWidth: columnWidths[column.id],
                }}
                onDoubleClick={() => {
                  if (editable) startEditing(row, column.id)
                }}
                onKeyDown={(event) => onCellKeyDown(event, row, rowIndex, column, colIndex)}
              >
                {isEditing ? (
                  <input
                    ref={inputRef}
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        commitEdit()
                      }
                      if (event.key === "Escape") {
                        event.preventDefault()
                        cancelEdit()
                      }
                    }}
                    className="border-input focus-visible:ring-ring/30 h-7 w-full rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2"
                  />
                ) : (
                  <>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-150 group-hover/cell:border-ring/30 group-focus-within/cell:border-ring/30"
                    />
                    <div className="min-w-0 pr-8">{renderCell(row, column)}</div>
                    <div className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 opacity-0 transition-all group-hover/cell:pointer-events-auto group-hover/cell:opacity-100 group-focus-within/cell:pointer-events-auto group-focus-within/cell:opacity-100">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Open details for ${getRowLabel(row)} ${column.label}`}
                        title="Open drawer"
                        className="text-muted-foreground border-ring/20 bg-muted hover:text-foreground hover:bg-muted hover:border-ring/30 hover:shadow-md/5"
                        onPointerDown={(event) => {
                          event.stopPropagation()
                        }}
                        onDoubleClick={(event) => {
                          event.stopPropagation()
                        }}
                        onClick={(event) => {
                          event.stopPropagation()
                          onOpenDrawer({ rowId: row.id, columnId: column.id })
                        }}
                      >
                        <HugeiconsIcon
                          icon={ArrowUpRight01Icon}
                          strokeWidth={1.5}
                          className="size-4"
                        />
                      </Button>
                    </div>
                  </>
                )}
              </TableCell>
            )
          })}
          <TableCell className="h-8 px-2 py-0.5" />
          <TableCell className="h-8 p-0" />
        </TableRow>
      ))}
    </TableBody>
  )
}
