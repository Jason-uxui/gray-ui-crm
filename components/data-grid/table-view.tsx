import * as React from "react"

import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"

import { Table } from "@/components/ui/table"
import {
  DataGridDragOverlay,
  DataGridDropIndicator,
  DataGridSummaryFooter,
  DataGridTableBody,
  DataGridTableHeader,
} from "@/components/data-grid/table-parts"
import {
  type DataGridColumn,
  type DataGridRowBase,
  type EditingCell,
} from "@/components/data-grid/types"

type DataGridTableViewProps<Row extends DataGridRowBase, ColumnId extends string> = {
  sensors: NonNullable<React.ComponentProps<typeof DndContext>["sensors"]>
  columnDndContextId: string
  tableRef: React.RefObject<HTMLTableElement | null>
  gridMinWidth: number
  visibleColumns: DataGridColumn<ColumnId>[]
  columnWidths: Record<ColumnId, number>
  draggingColumnId: ColumnId | null
  dragOverColumnId: ColumnId | null
  visibleRows: Row[]
  getRowLabel: (row: Row) => string
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
  showSummaries: boolean
  renderSummary?: (column: DataGridColumn<ColumnId>, visibleRows: Row[]) => React.ReactNode
  isEmptyValue: (value: React.ReactNode) => boolean
  onColumnDragStart: (event: DragStartEvent) => void
  onColumnDragOver: (event: DragOverEvent) => void
  onColumnDragEnd: (event: DragEndEvent) => void
  onColumnDragCancel: () => void
  onResizeStart: (event: React.PointerEvent<HTMLButtonElement>, columnId: ColumnId) => void
  dragOverlayColumn: DataGridColumn<ColumnId> | null
  dragOverlayHeight: number
  dropIndicatorLeft: number | null
  dragTableRect: { top: number; height: number } | null
}

export function DataGridTableView<Row extends DataGridRowBase, ColumnId extends string>({
  sensors,
  columnDndContextId,
  tableRef,
  gridMinWidth,
  visibleColumns,
  columnWidths,
  draggingColumnId,
  dragOverColumnId,
  visibleRows,
  getRowLabel,
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
  showSummaries,
  renderSummary,
  isEmptyValue,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDragEnd,
  onColumnDragCancel,
  onResizeStart,
  dragOverlayColumn,
  dragOverlayHeight,
  dropIndicatorLeft,
  dragTableRect,
}: DataGridTableViewProps<Row, ColumnId>) {
  return (
    <>
      <DndContext
        id={columnDndContextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onColumnDragStart}
        onDragOver={onColumnDragOver}
        onDragEnd={onColumnDragEnd}
        onDragCancel={onColumnDragCancel}
      >
        <Table
          ref={tableRef}
          className="table-fixed"
          style={{ width: `max(100%, ${gridMinWidth}px)` }}
        >
          <DataGridTableHeader
            visibleColumns={visibleColumns}
            columnWidths={columnWidths}
            draggingColumnId={draggingColumnId}
            dragOverColumnId={dragOverColumnId}
            onResizeStart={onResizeStart}
          />

          <DataGridTableBody
            visibleRows={visibleRows}
            getRowLabel={getRowLabel}
            visibleColumns={visibleColumns}
            editingCell={editingCell}
            isEditableColumn={isEditableColumn}
            startEditing={startEditing}
            onCellKeyDown={onCellKeyDown}
            inputRef={inputRef}
            draftValue={draftValue}
            setDraftValue={setDraftValue}
            commitEdit={commitEdit}
            cancelEdit={cancelEdit}
            renderCell={renderCell}
            onOpenDrawer={onOpenDrawer}
            columnWidths={columnWidths}
            draggingColumnId={draggingColumnId}
          />

          <DataGridSummaryFooter
            showSummaries={showSummaries}
            renderSummary={renderSummary}
            visibleColumns={visibleColumns}
            visibleRows={visibleRows}
            columnWidths={columnWidths}
            draggingColumnId={draggingColumnId}
            isEmptyValue={isEmptyValue}
          />
        </Table>

        <DragOverlay>
          <DataGridDragOverlay
            dragOverlayColumn={dragOverlayColumn}
            columnWidths={columnWidths}
            dragOverlayHeight={dragOverlayHeight}
          />
        </DragOverlay>
      </DndContext>

      <DataGridDropIndicator
        dropIndicatorLeft={dropIndicatorLeft}
        dragTableRect={dragTableRect}
      />
    </>
  )
}
