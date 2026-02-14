import * as React from "react"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DragDropVerticalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { TableHead } from "@/components/ui/table"

import { type DataGridColumn } from "@/components/data-grid/types"

type SortableHeaderCellProps<ColumnId extends string> = {
  column: DataGridColumn<ColumnId>
  width: number
  isActive: boolean
  isDropTarget: boolean
  onResize: (event: React.PointerEvent<HTMLButtonElement>, columnId: ColumnId) => void
}

type SortableColumnOptionItemProps<ColumnId extends string> = {
  column: DataGridColumn<ColumnId>
  checked: boolean
  disabled: boolean
  onCheckedChange: (checked: boolean) => void
}

function ColumnHead<ColumnId extends string>({
  icon,
  label,
}: Pick<DataGridColumn<ColumnId>, "icon" | "label">) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 leading-none">
      <HugeiconsIcon
        icon={icon}
        strokeWidth={1.5}
        className="size-3.5 shrink-0 text-muted-foreground"
      />
      <span className="truncate">{label}</span>
    </span>
  )
}

export function SortableColumnOptionItem<ColumnId extends string>({
  column,
  checked,
  disabled,
  onCheckedChange,
}: SortableColumnOptionItemProps<ColumnId>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    disabled,
  })

  return (
    <DropdownMenuCheckboxItem
      ref={setNodeRef}
      checked={checked}
      disabled={disabled}
      onCheckedChange={(next) => onCheckedChange(next === true)}
      className={cn("touch-none pl-1.5", isDragging && "bg-muted/40 opacity-70")}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <span
        {...attributes}
        {...listeners}
        role="button"
        aria-label={`Reorder ${column.label}`}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        className="text-muted-foreground hover:text-foreground inline-flex size-5 shrink-0 cursor-grab items-center justify-center rounded-sm active:cursor-grabbing"
      >
        <HugeiconsIcon
          icon={DragDropVerticalIcon}
          strokeWidth={4}
          className="size-3.5 text-muted-foreground"
        />
      </span>
      <span className="truncate">{column.label}</span>
    </DropdownMenuCheckboxItem>
  )
}

export function SortableHeaderCell<ColumnId extends string>({
  column,
  width,
  isActive,
  isDropTarget,
  onResize,
}: SortableHeaderCellProps<ColumnId>) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: column.id,
  })

  return (
    <TableHead
      ref={setNodeRef}
      className={cn(
        "group/column-head relative h-8 overflow-hidden border-r px-2 pr-3 text-sm",
        isActive && "bg-muted/30",
        isDropTarget && "bg-muted/50"
      )}
      style={{
        width,
        minWidth: width,
        transition: "none",
        opacity: isDragging ? 0.35 : 1,
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex h-full min-w-0 cursor-grab select-none items-center overflow-hidden touch-none active:cursor-grabbing"
      >
        <ColumnHead icon={column.icon} label={column.label} />
      </div>
      <button
        type="button"
        aria-label={`Resize ${column.label} column`}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize opacity-0 transition-opacity group-hover/column-head:opacity-100"
        onPointerDown={(event) => onResize(event, column.id)}
      />
    </TableHead>
  )
}
