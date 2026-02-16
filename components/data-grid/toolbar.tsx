import * as React from "react"

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Menu11Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SortableColumnOptionItem } from "@/components/data-grid/sortable-parts"
import {
  type DataGridColumn,
  type DataGridFilterConfig,
  type DataGridRowBase,
  type DataGridSortConfig,
} from "@/components/data-grid/types"

type DataGridToolbarProps<
  Row extends DataGridRowBase,
  ColumnId extends string,
  FilterPreset extends string,
  SortPreset extends string,
> = {
  viewLabel: string
  visibleRowCount: number
  filter: DataGridFilterConfig<FilterPreset, Row>
  sort: DataGridSortConfig<SortPreset, Row>
  filterPreset: FilterPreset
  sortPreset: SortPreset
  onFilterPresetChange: (next: FilterPreset) => void
  onSortPresetChange: (next: SortPreset) => void
  showSummaries: boolean
  onShowSummariesChange: (next: boolean) => void
  optionsSensors: NonNullable<React.ComponentProps<typeof DndContext>["sensors"]>
  onOptionColumnDragEnd: (event: DragEndEvent) => void
  visibleColumns: DataGridColumn<ColumnId>[]
  visibleColumnIds: ColumnId[]
  hiddenColumns: DataGridColumn<ColumnId>[]
  toggleColumnVisibility: (columnId: ColumnId, visible: boolean) => void
  optionsDndContextId: string
}

const numberFormatter = new Intl.NumberFormat("en-US")

export function DataGridToolbar<
  Row extends DataGridRowBase,
  ColumnId extends string,
  FilterPreset extends string,
  SortPreset extends string,
>({
  viewLabel,
  visibleRowCount,
  filter,
  sort,
  filterPreset,
  sortPreset,
  onFilterPresetChange,
  onSortPresetChange,
  showSummaries,
  onShowSummariesChange,
  optionsSensors,
  onOptionColumnDragEnd,
  visibleColumns,
  visibleColumnIds,
  hiddenColumns,
  toggleColumnVisibility,
  optionsDndContextId,
}: DataGridToolbarProps<Row, ColumnId, FilterPreset, SortPreset>) {
  return (
    <div className="flex items-center justify-between border-b px-2 py-1.5">
      <Button variant="ghost" className="-ml-1 text-muted-foreground">
        <HugeiconsIcon
          icon={Menu11Icon}
          strokeWidth={1.5}
          className="size-4 text-muted-foreground"
        />
        {viewLabel}
        <span className="text-muted-foreground">&middot; {numberFormatter.format(visibleRowCount)}</span>
      </Button>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="text-muted-foreground"
                aria-label="Open filter menu"
              />
            }
          >
            {filter.labels[filterPreset]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Filter</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filterPreset}
              onValueChange={(value) => onFilterPresetChange(value as FilterPreset)}
            >
              {filter.order.map((preset) => (
                <DropdownMenuRadioItem key={preset} value={preset}>
                  {filter.labels[preset]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="text-muted-foreground"
                aria-label="Open sort menu"
              />
            }
          >
            {sort.labels[sortPreset]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sortPreset}
              onValueChange={(value) => onSortPresetChange(value as SortPreset)}
            >
              {sort.order.map((preset) => (
                <DropdownMenuRadioItem key={preset} value={preset}>
                  {sort.labels[preset]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="text-muted-foreground"
                aria-label="Open options menu"
              />
            }
          >
            Options
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showSummaries}
              onCheckedChange={(checked) => onShowSummariesChange(checked === true)}
            >
              Show summary row
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DndContext
              id={optionsDndContextId}
              sensors={optionsSensors}
              collisionDetection={closestCenter}
              onDragEnd={onOptionColumnDragEnd}
            >
              <SortableContext
                items={visibleColumns.map((column) => column.id)}
                strategy={verticalListSortingStrategy}
              >
                {visibleColumns.map((column) => (
                  <SortableColumnOptionItem
                    key={column.id}
                    column={column}
                    checked
                    disabled={visibleColumnIds.length === 1}
                    onCheckedChange={(checked) => toggleColumnVisibility(column.id, checked)}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {hiddenColumns.length > 0 ? <DropdownMenuSeparator /> : null}
            {hiddenColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={false}
                onCheckedChange={(checked) =>
                  toggleColumnVisibility(column.id, checked === true)
                }
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
