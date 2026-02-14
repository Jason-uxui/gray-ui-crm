"use client"

import * as React from "react"

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { DrawerPanel } from "@/components/data-grid/drawer-panel"
import { DataGridTableView } from "@/components/data-grid/table-view"
import { DataGridToolbar } from "@/components/data-grid/toolbar"
import { useGridColumns } from "@/components/data-grid/use-grid-columns"
import { useGridData } from "@/components/data-grid/use-grid-data"
import { useGridEditing } from "@/components/data-grid/use-grid-editing"
import {
  type DataGridProps,
  type DataGridRowBase,
  type DataGridDrawerPanelProps,
  type EditingCell,
} from "@/components/data-grid/types"

export type {
  DataGridColumn,
  DataGridDrawerPanelProps,
  DataGridFilterConfig,
  DataGridProps,
  DataGridRowBase,
  DataGridSortConfig,
} from "@/components/data-grid/types"

const MIN_COLUMN_WIDTH = 96
const CONTROL_COLUMN_WIDTH = 40

function isEmptyValue(value: React.ReactNode) {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim().length === 0
  return false
}

export function DataGrid<
  Row extends DataGridRowBase,
  ColumnId extends string,
  FilterPreset extends string,
  SortPreset extends string,
>({
  initialRows,
  columns,
  viewLabel,
  getRowLabel,
  renderCell,
  isEditableColumn,
  getCellEditValue,
  applyCellEdit,
  getDrawerCellValue,
  filter,
  sort,
  renderSummary,
  renderDrawerPanel,
  drawerModal = false,
  disablePointerDismissal = true,
  onRowsChange,
}: DataGridProps<Row, ColumnId, FilterPreset, SortPreset>) {
  const [filterPreset, setFilterPreset] = React.useState<FilterPreset>(filter.defaultPreset)
  const [sortPreset, setSortPreset] = React.useState<SortPreset>(sort.defaultPreset)
  const [showSummaries, setShowSummaries] = React.useState(true)
  const [drawerCell, setDrawerCell] = React.useState<EditingCell<ColumnId> | null>(null)

  const gridRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const tableRef = React.useRef<HTMLTableElement>(null)

  const {
    columnWidths,
    visibleColumnIds,
    draggingColumnId,
    dragOverColumnId,
    dragOverlayHeight,
    dropIndicatorLeft,
    dragTableRect,
    visibleColumns,
    gridMinWidth,
    hiddenColumns,
    toggleColumnVisibility,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDragEnd,
    handleOptionColumnDragEnd,
    handleColumnDragCancel,
    beginResize,
    dragOverlayColumn,
  } = useGridColumns({
    columns,
    tableRef,
    minColumnWidth: MIN_COLUMN_WIDTH,
    controlColumnWidth: CONTROL_COLUMN_WIDTH,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const optionsSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  )
  const {
    visibleRows,
    drawerRow,
    drawerColumn,
    drawerCellValue,
    commitRows,
  } = useGridData<Row, ColumnId, FilterPreset, SortPreset>({
    initialRows,
    columns,
    filter,
    sort,
    filterPreset,
    sortPreset,
    drawerCell,
    getDrawerCellValue,
    onRowsChange,
  })

  const {
    editingCell,
    draftValue,
    setDraftValue,
    startEditing,
    commitEdit,
    cancelEdit,
    handleCellKeyDown,
  } = useGridEditing<Row, ColumnId>({
    gridRef,
    inputRef,
    visibleRowCount: visibleRows.length,
    visibleColumnCount: visibleColumns.length,
    isEditableColumn,
    getCellEditValue,
    applyCellEdit,
    commitRows,
  })

  const closeDrawer = React.useCallback(() => {
    setDrawerCell(null)
  }, [])

  const updateRow = React.useCallback(
    (rowId: string, updater: (row: Row) => Row) => {
      commitRows((currentRows) => {
        return currentRows.map((row) => (row.id === rowId ? updater(row) : row))
      })
    },
    [commitRows]
  )

  const drawerPanelProps: DataGridDrawerPanelProps<Row, ColumnId> = {
    drawerRow,
    drawerColumn,
    drawerCellValue,
    getRowLabel,
    isEditableColumn,
    isEmptyValue,
    updateRow,
    closeDrawer,
  }

  return (
    <DialogPrimitive.Root
      open={drawerCell !== null}
      modal={drawerModal}
      disablePointerDismissal={disablePointerDismissal}
      onOpenChange={(open) => {
        if (!open) closeDrawer()
      }}
    >
      <div className="min-h-0" ref={gridRef}>
        <DataGridToolbar
          viewLabel={viewLabel}
          visibleRowCount={visibleRows.length}
          filter={filter}
          sort={sort}
          filterPreset={filterPreset}
          sortPreset={sortPreset}
          onFilterPresetChange={setFilterPreset}
          onSortPresetChange={setSortPreset}
          showSummaries={showSummaries}
          onShowSummariesChange={setShowSummaries}
          optionsSensors={optionsSensors}
          onOptionColumnDragEnd={handleOptionColumnDragEnd}
          visibleColumns={visibleColumns}
          visibleColumnIds={visibleColumnIds}
          hiddenColumns={hiddenColumns}
          toggleColumnVisibility={toggleColumnVisibility}
        />

        <DataGridTableView
          sensors={sensors}
          tableRef={tableRef}
          gridMinWidth={gridMinWidth}
          visibleColumns={visibleColumns}
          columnWidths={columnWidths}
          draggingColumnId={draggingColumnId}
          dragOverColumnId={dragOverColumnId}
          visibleRows={visibleRows}
          getRowLabel={getRowLabel}
          editingCell={editingCell}
          isEditableColumn={isEditableColumn}
          startEditing={startEditing}
          onCellKeyDown={handleCellKeyDown}
          inputRef={inputRef}
          draftValue={draftValue}
          setDraftValue={setDraftValue}
          commitEdit={commitEdit}
          cancelEdit={cancelEdit}
          renderCell={renderCell}
          onOpenDrawer={setDrawerCell}
          showSummaries={showSummaries}
          renderSummary={renderSummary}
          isEmptyValue={isEmptyValue}
          onColumnDragStart={handleColumnDragStart}
          onColumnDragOver={handleColumnDragOver}
          onColumnDragEnd={handleColumnDragEnd}
          onColumnDragCancel={handleColumnDragCancel}
          onResizeStart={beginResize}
          dragOverlayColumn={dragOverlayColumn}
          dragOverlayHeight={dragOverlayHeight}
          dropIndicatorLeft={dropIndicatorLeft}
          dragTableRect={dragTableRect}
        />
      </div>

      {renderDrawerPanel ? (
        renderDrawerPanel(drawerPanelProps)
      ) : (
        <DrawerPanel
          drawerRow={drawerRow}
          drawerColumn={drawerColumn}
          drawerCellValue={drawerCellValue}
          getRowLabel={getRowLabel}
          isEditableColumn={isEditableColumn}
          isEmptyValue={isEmptyValue}
        />
      )}
    </DialogPrimitive.Root>
  )
}
