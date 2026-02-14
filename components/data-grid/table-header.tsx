import * as React from "react"

import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Checkbox } from "@/components/ui/checkbox"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { SortableHeaderCell } from "@/components/data-grid/sortable-parts"
import { type DataGridColumn } from "@/components/data-grid/types"

const CONTROL_COLUMN_WIDTH = 40

type DataGridTableHeaderProps<ColumnId extends string> = {
  visibleColumns: DataGridColumn<ColumnId>[]
  columnWidths: Record<ColumnId, number>
  draggingColumnId: ColumnId | null
  dragOverColumnId: ColumnId | null
  onResizeStart: (event: React.PointerEvent<HTMLButtonElement>, columnId: ColumnId) => void
}

export function DataGridTableHeader<ColumnId extends string>({
  visibleColumns,
  columnWidths,
  draggingColumnId,
  dragOverColumnId,
  onResizeStart,
}: DataGridTableHeaderProps<ColumnId>) {
  return (
    <>
      <colgroup>
        <col style={{ width: CONTROL_COLUMN_WIDTH }} />
        {visibleColumns.map((column) => (
          <col key={`col-${column.id}`} style={{ width: columnWidths[column.id] }} />
        ))}
        <col style={{ width: CONTROL_COLUMN_WIDTH }} />
        <col />
      </colgroup>

      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-8 w-10 border-r px-0 text-center">
            <Checkbox aria-label="Select all rows" className="mx-auto" />
          </TableHead>
          <SortableContext
            items={visibleColumns.map((column) => column.id)}
            strategy={horizontalListSortingStrategy}
          >
            {visibleColumns.map((column) => (
              <SortableHeaderCell
                key={column.id}
                column={column}
                width={columnWidths[column.id]}
                isActive={draggingColumnId === column.id}
                isDropTarget={
                  dragOverColumnId === column.id &&
                  Boolean(draggingColumnId) &&
                  draggingColumnId !== column.id
                }
                onResize={onResizeStart}
              />
            ))}
          </SortableContext>
          <TableHead className="h-8 w-10 px-2 text-center text-xs">
            <HugeiconsIcon icon={Add01Icon} strokeWidth={1.5} className="mx-auto size-4" />
          </TableHead>
          <TableHead className="h-8 p-0" />
        </TableRow>
      </TableHeader>
    </>
  )
}
