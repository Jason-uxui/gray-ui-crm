import { HugeiconsIcon } from "@hugeicons/react"

import { type DataGridColumn } from "@/components/data-grid/types"

type DataGridDragOverlayProps<ColumnId extends string> = {
  dragOverlayColumn: DataGridColumn<ColumnId> | null
  columnWidths: Record<ColumnId, number>
  dragOverlayHeight: number
}

export function DataGridDragOverlay<ColumnId extends string>({
  dragOverlayColumn,
  columnWidths,
  dragOverlayHeight,
}: DataGridDragOverlayProps<ColumnId>) {
  if (!dragOverlayColumn) return null

  return (
    <div
      className="pointer-events-none rounded-md border border-border/70 bg-background/95 shadow-lg"
      style={{
        width: columnWidths[dragOverlayColumn.id],
        height: dragOverlayHeight,
      }}
    >
      <div className="flex h-8 items-center gap-1.5 border-b px-2 text-xs font-medium">
        <HugeiconsIcon
          icon={dragOverlayColumn.icon}
          strokeWidth={1.5}
          className="size-3.5 text-muted-foreground"
        />
        <span className="truncate">{dragOverlayColumn.label}</span>
      </div>
    </div>
  )
}

type DataGridDropIndicatorProps = {
  dropIndicatorLeft: number | null
  dragTableRect: { top: number; height: number } | null
}

export function DataGridDropIndicator({
  dropIndicatorLeft,
  dragTableRect,
}: DataGridDropIndicatorProps) {
  if (dropIndicatorLeft === null || !dragTableRect) return null

  return (
    <div
      className="pointer-events-none fixed z-50 w-0.5 bg-muted-foreground/50"
      style={{
        left: dropIndicatorLeft - 1,
        top: dragTableRect.top,
        height: dragTableRect.height,
      }}
    />
  )
}
