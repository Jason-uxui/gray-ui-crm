import * as React from "react"

import { cn } from "@/lib/utils"
import { TableCell, TableFooter, TableRow } from "@/components/ui/table"

import {
  type DataGridColumn,
  type DataGridRowBase,
} from "@/components/data-grid/types"

type DataGridSummaryFooterProps<Row extends DataGridRowBase, ColumnId extends string> = {
  showSummaries: boolean
  renderSummary?: (column: DataGridColumn<ColumnId>, visibleRows: Row[]) => React.ReactNode
  visibleColumns: DataGridColumn<ColumnId>[]
  visibleRows: Row[]
  columnWidths: Record<ColumnId, number>
  draggingColumnId: ColumnId | null
  isEmptyValue: (value: React.ReactNode) => boolean
}

export function DataGridSummaryFooter<Row extends DataGridRowBase, ColumnId extends string>({
  showSummaries,
  renderSummary,
  visibleColumns,
  visibleRows,
  columnWidths,
  draggingColumnId,
  isEmptyValue,
}: DataGridSummaryFooterProps<Row, ColumnId>) {
  if (!showSummaries || !renderSummary) return null

  return (
    <TableFooter className="bg-background border-b font-normal">
      <TableRow className="hover:bg-transparent">
        <TableCell className="h-8 border-r px-2 py-0.5" />
        {visibleColumns.map((column) => {
          const summaryContent = renderSummary(column, visibleRows)

          return (
            <TableCell
              key={`summary-${column.id}`}
              className={cn(
                "h-8 border-r px-2 py-0.5 text-left text-xs text-muted-foreground whitespace-nowrap",
                draggingColumnId === column.id && "bg-muted/20"
              )}
              style={{
                width: columnWidths[column.id],
                minWidth: columnWidths[column.id],
              }}
            >
              {!isEmptyValue(summaryContent) ? (
                <span className="inline-block">{summaryContent}</span>
              ) : null}
            </TableCell>
          )
        })}
        <TableCell className="h-8 px-2 py-0.5" />
        <TableCell className="h-8 p-0" />
      </TableRow>
    </TableFooter>
  )
}
