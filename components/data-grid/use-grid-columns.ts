import * as React from "react"

import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

import { type DataGridColumn } from "@/components/data-grid/types"

function createInitialColumnWidths<ColumnId extends string>(
  columns: DataGridColumn<ColumnId>[]
): Record<ColumnId, number> {
  return columns.reduce<Record<ColumnId, number>>((acc, column) => {
    acc[column.id] = column.defaultWidth
    return acc
  }, {} as Record<ColumnId, number>)
}

type UseGridColumnsParams<ColumnId extends string> = {
  columns: DataGridColumn<ColumnId>[]
  tableRef: React.RefObject<HTMLTableElement | null>
  minColumnWidth: number
  controlColumnWidth: number
}

export function useGridColumns<ColumnId extends string>({
  columns,
  tableRef,
  minColumnWidth,
  controlColumnWidth,
}: UseGridColumnsParams<ColumnId>) {
  const columnOrder = React.useMemo(() => columns.map((column) => column.id), [columns])

  const [columnWidths, setColumnWidths] = React.useState<Record<ColumnId, number>>(
    () => createInitialColumnWidths(columns)
  )
  const [visibleColumnIds, setVisibleColumnIds] = React.useState<ColumnId[]>(() => columnOrder)
  const [draggingColumnId, setDraggingColumnId] = React.useState<ColumnId | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = React.useState<ColumnId | null>(null)
  const [dragOverlayHeight, setDragOverlayHeight] = React.useState(280)
  const [dropIndicatorLeft, setDropIndicatorLeft] = React.useState<number | null>(null)
  const [dragTableRect, setDragTableRect] = React.useState<{
    top: number
    height: number
  } | null>(null)

  const resizingRef = React.useRef<{
    columnId: ColumnId
    startX: number
    startWidth: number
  } | null>(null)
  const orderBeforeDragRef = React.useRef<ColumnId[]>(columnOrder)

  React.useEffect(() => {
    const allowedIds = new Set(columnOrder)

    setColumnWidths((current) => {
      const next = createInitialColumnWidths(columns)
      columns.forEach((column) => {
        if (typeof current[column.id] === "number") {
          next[column.id] = current[column.id]
        }
      })
      return next
    })

    setVisibleColumnIds((current) => {
      const kept = current.filter((id) => allowedIds.has(id))
      const missing = columnOrder.filter((id) => !kept.includes(id))
      return [...kept, ...missing]
    })

    orderBeforeDragRef.current = columnOrder
  }, [columns, columnOrder])

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const activeResize = resizingRef.current
      if (!activeResize) return

      const column = columns.find((item) => item.id === activeResize.columnId)
      const minWidth = column?.minWidth ?? minColumnWidth
      const deltaX = event.clientX - activeResize.startX
      const nextWidth = Math.max(minWidth, activeResize.startWidth + deltaX)

      setColumnWidths((currentWidths) => ({
        ...currentWidths,
        [activeResize.columnId]: nextWidth,
      }))
    }

    const handlePointerUp = () => {
      if (!resizingRef.current) return
      resizingRef.current = null
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }
  }, [columns, minColumnWidth])

  const visibleColumns = React.useMemo(() => {
    return visibleColumnIds
      .map((columnId) => columns.find((column) => column.id === columnId))
      .filter((column): column is DataGridColumn<ColumnId> => Boolean(column))
  }, [visibleColumnIds, columns])

  const gridMinWidth = React.useMemo(() => {
    const contentWidth = visibleColumns.reduce((sum, column) => {
      return sum + (columnWidths[column.id] ?? column.defaultWidth)
    }, 0)
    return controlColumnWidth * 2 + contentWidth
  }, [visibleColumns, columnWidths, controlColumnWidth])

  const hiddenColumns = React.useMemo(() => {
    return columns.filter((column) => !visibleColumnIds.includes(column.id))
  }, [columns, visibleColumnIds])

  const toggleColumnVisibility = React.useCallback((columnId: ColumnId, visible: boolean) => {
    setVisibleColumnIds((currentColumns) => {
      if (visible) {
        if (currentColumns.includes(columnId)) return currentColumns
        return [...currentColumns, columnId]
      }

      if (currentColumns.length === 1 && currentColumns.includes(columnId)) return currentColumns

      return currentColumns.filter((id) => id !== columnId)
    })
  }, [])

  const handleColumnDragStart = React.useCallback(
    (event: DragStartEvent) => {
      const activeId = String(event.active.id) as ColumnId
      const tableRect = tableRef.current?.getBoundingClientRect()
      orderBeforeDragRef.current = visibleColumnIds
      setDraggingColumnId(activeId)
      setDragOverColumnId(activeId)
      setDragOverlayHeight(tableRect?.height ?? 280)
      if (tableRect) {
        setDragTableRect({ top: tableRect.top, height: tableRect.height })
      }
    },
    [tableRef, visibleColumnIds]
  )

  const handleColumnDragOver = React.useCallback(
    (event: DragOverEvent) => {
      if (!event.over) return

      const activeId = String(event.active.id) as ColumnId
      const overId = String(event.over.id) as ColumnId
      const overRect = event.over.rect
      setDragOverColumnId(overId)

      const currentIndex = visibleColumnIds.indexOf(activeId)
      const targetIndex = visibleColumnIds.indexOf(overId)
      const indicatorLeft =
        currentIndex > -1 && targetIndex > -1 && currentIndex < targetIndex
          ? overRect.left + overRect.width
          : overRect.left
      setDropIndicatorLeft(indicatorLeft)

      if (activeId === overId) return

      setVisibleColumnIds((currentColumns) => {
        const oldIndex = currentColumns.indexOf(activeId)
        const newIndex = currentColumns.indexOf(overId)
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return currentColumns
        return arrayMove(currentColumns, oldIndex, newIndex)
      })
    },
    [visibleColumnIds]
  )

  const handleColumnDragEnd = React.useCallback((event: DragEndEvent) => {
    if (!event.over) {
      setVisibleColumnIds(orderBeforeDragRef.current)
    }

    setDraggingColumnId(null)
    setDragOverColumnId(null)
    setDropIndicatorLeft(null)
    setDragTableRect(null)
  }, [])

  const handleOptionColumnDragEnd = React.useCallback((event: DragEndEvent) => {
    if (!event.over) return

    const activeId = String(event.active.id) as ColumnId
    const overId = String(event.over.id) as ColumnId
    if (activeId === overId) return

    setVisibleColumnIds((currentColumns) => {
      const oldIndex = currentColumns.indexOf(activeId)
      const newIndex = currentColumns.indexOf(overId)
      if (oldIndex === -1 || newIndex === -1) return currentColumns
      return arrayMove(currentColumns, oldIndex, newIndex)
    })
  }, [])

  const handleColumnDragCancel = React.useCallback(() => {
    setVisibleColumnIds(orderBeforeDragRef.current)
    setDraggingColumnId(null)
    setDragOverColumnId(null)
    setDropIndicatorLeft(null)
    setDragTableRect(null)
  }, [])

  const beginResize = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, columnId: ColumnId) => {
      event.preventDefault()
      event.stopPropagation()

      resizingRef.current = {
        columnId,
        startX: event.clientX,
        startWidth: columnWidths[columnId],
      }

      document.body.style.userSelect = "none"
      document.body.style.cursor = "col-resize"
    },
    [columnWidths]
  )

  const dragOverlayColumn = React.useMemo(() => {
    if (!draggingColumnId) return null
    return columns.find((column) => column.id === draggingColumnId) ?? null
  }, [draggingColumnId, columns])

  return {
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
  }
}
