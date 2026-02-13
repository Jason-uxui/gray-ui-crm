"use client"

import * as React from "react"

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import {
  AirbnbIcon,
  Add01Icon,
  AmazonIcon,
  AppleIcon,
  ArrowUpRight01Icon,
  Building01Icon,
  Calendar01Icon,
  DragDropVerticalIcon,
  DropboxIcon,
  FigmaIcon,
  GithubIcon,
  GitlabIcon,
  GoogleIcon,
  Link01Icon,
  Linkedin01Icon,
  MapPinpoint01Icon,
  Menu11Icon,
  MetaIcon,
  MicrosoftIcon,
  NotionIcon,
  PaypalIcon,
  ShopifyIcon,
  SlackIcon,
  SpotifyIcon,
  StripeIcon,
  UserGroupIcon,
  UserIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type CompanyRow = {
  id: string
  logo: string
  logoIcon?: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  logoClassName: string
  name: string
  domain?: string
  createdBy: string
  accountOwner?: string
  createdAtMinutes: number
  employees?: number
  linkedin?: string
  address?: string
}

type CompanyColumnId =
  | "name"
  | "domain"
  | "createdBy"
  | "accountOwner"
  | "creationDate"
  | "employees"
  | "linkedin"
  | "address"

type CompanyColumn = {
  id: CompanyColumnId
  label: string
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  defaultWidth: number
  minWidth?: number
  summaryKind?: "countAll" | "maxEmployees" | "emptyLinkedinPercent" | "notEmptyAddress"
}

type FilterPreset = "all" | "withDomain" | "withEmployees"
type SortPreset = "nameAsc" | "employeesDesc" | "newest"

type EditingCell = {
  rowId: string
  columnId: CompanyColumnId
}

type SummaryStats = {
  countAll: number
  maxEmployees: number
  emptyLinkedinPercent: number
  notEmptyAddress: number
}

const FILTER_ORDER: FilterPreset[] = ["all", "withDomain", "withEmployees"]
const SORT_ORDER: SortPreset[] = ["nameAsc", "employeesDesc", "newest"]

const FILTER_LABELS: Record<FilterPreset, string> = {
  all: "All",
  withDomain: "Has domain",
  withEmployees: "Has employees",
}

const SORT_LABELS: Record<SortPreset, string> = {
  nameAsc: "Name A-Z",
  employeesDesc: "Employees High-Low",
  newest: "Newest",
}

const numberFormatter = new Intl.NumberFormat("en-US")
const MIN_COLUMN_WIDTH = 96
const CONTROL_COLUMN_WIDTH = 40

const INITIAL_COMPANY_ROWS: CompanyRow[] = [
  {
    id: "airbnb",
    logo: "A",
    logoIcon: AirbnbIcon,
    logoClassName: "bg-rose-600 text-white",
    name: "Airbnb",
    domain: "airbnb.com",
    createdBy: "System",
    accountOwner: "Linh Tran",
    createdAtMinutes: 3,
    employees: 6900,
    linkedin: "linkedin.com/company/airbnb",
    address: "888 Brannan St, San Francisco, CA",
  },
  {
    id: "amazon",
    logo: "A",
    logoIcon: AmazonIcon,
    logoClassName: "bg-orange-600 text-white",
    name: "Amazon",
    domain: "amazon.com",
    createdBy: "System",
    accountOwner: "Ngoc Tran",
    createdAtMinutes: 8,
    employees: 1525000,
    linkedin: "linkedin.com/company/amazon",
    address: "410 Terry Ave N, Seattle, WA",
  },
  {
    id: "apple",
    logo: "A",
    logoIcon: AppleIcon,
    logoClassName: "bg-zinc-900 text-white",
    name: "Apple",
    domain: "apple.com",
    createdBy: "System",
    accountOwner: "Hung Nguyen",
    createdAtMinutes: 11,
    employees: 161000,
    linkedin: "linkedin.com/company/apple",
    address: "One Apple Park Way, Cupertino, CA",
  },
  {
    id: "dropbox",
    logo: "D",
    logoIcon: DropboxIcon,
    logoClassName: "bg-blue-600 text-white",
    name: "Dropbox",
    domain: "dropbox.com",
    createdBy: "Mai Le",
    accountOwner: "Duc Nguyen",
    createdAtMinutes: 54,
    employees: 2600,
    linkedin: "linkedin.com/company/dropbox",
    address: "1800 Owens St, San Francisco, CA",
  },
  {
    id: "figma",
    logo: "F",
    logoIcon: FigmaIcon,
    logoClassName: "bg-zinc-900 text-white",
    name: "Figma",
    domain: "figma.com",
    createdBy: "System",
    accountOwner: "Duy Pham",
    createdAtMinutes: 2,
    employees: 1300,
    linkedin: "linkedin.com/company/figma",
    address: "760 Market St, Floor 10, San Francisco, CA",
  },
  {
    id: "github",
    logo: "G",
    logoIcon: GithubIcon,
    logoClassName: "bg-zinc-900 text-white",
    name: "GitHub",
    domain: "github.com",
    createdBy: "System",
    accountOwner: "Trang Vo",
    createdAtMinutes: 19,
    employees: 3500,
    linkedin: "linkedin.com/company/github",
    address: "88 Colin P Kelly Jr St, San Francisco, CA",
  },
  {
    id: "gitlab",
    logo: "G",
    logoIcon: GitlabIcon,
    logoClassName: "bg-amber-600 text-white",
    name: "GitLab",
    domain: "gitlab.com",
    createdBy: "System",
    accountOwner: "Lan Anh",
    createdAtMinutes: 28,
    employees: 2200,
    linkedin: "linkedin.com/company/gitlab-com",
    address: "268 Bush St, San Francisco, CA",
  },
  {
    id: "google",
    logo: "G",
    logoIcon: GoogleIcon,
    logoClassName: "bg-sky-600 text-white",
    name: "Google",
    domain: "google.com",
    createdBy: "System",
    accountOwner: "Phuong Le",
    createdAtMinutes: 14,
    employees: 182000,
    linkedin: "linkedin.com/company/google",
    address: "1600 Amphitheatre Pkwy, Mountain View, CA",
  },
  {
    id: "meta",
    logo: "M",
    logoIcon: MetaIcon,
    logoClassName: "bg-blue-600 text-white",
    name: "Meta",
    domain: "meta.com",
    createdBy: "System",
    accountOwner: "Kiet Pham",
    createdAtMinutes: 24,
    employees: 76000,
    linkedin: "linkedin.com/company/meta",
    address: "1 Hacker Way, Menlo Park, CA",
  },
  {
    id: "microsoft",
    logo: "M",
    logoIcon: MicrosoftIcon,
    logoClassName: "bg-emerald-600 text-white",
    name: "Microsoft",
    domain: "microsoft.com",
    createdBy: "System",
    accountOwner: "Linh Tran",
    createdAtMinutes: 16,
    employees: 221000,
    linkedin: "linkedin.com/company/microsoft",
    address: "One Microsoft Way, Redmond, WA",
  },
  {
    id: "notion",
    logo: "N",
    logoIcon: NotionIcon,
    logoClassName: "bg-zinc-900 text-white",
    name: "Notion",
    domain: "notion.com",
    createdBy: "System",
    accountOwner: "Ngoc Tran",
    createdAtMinutes: 9,
    employees: 1200,
    linkedin: "linkedin.com/company/notionhq",
    address: "2300 Harrison St, San Francisco, CA",
  },
  {
    id: "paypal",
    logo: "P",
    logoIcon: PaypalIcon,
    logoClassName: "bg-indigo-600 text-white",
    name: "PayPal",
    domain: "paypal.com",
    createdBy: "Minh Nguyen",
    accountOwner: "Lan Anh",
    createdAtMinutes: 37,
    employees: 29000,
    linkedin: "linkedin.com/company/paypal",
    address: "2211 N First St, San Jose, CA",
  },
  {
    id: "shopify",
    logo: "S",
    logoIcon: ShopifyIcon,
    logoClassName: "bg-lime-600 text-white",
    name: "Shopify",
    domain: "shopify.com",
    createdBy: "Mai Le",
    accountOwner: "Khanh Nguyen",
    createdAtMinutes: 36,
    employees: 8300,
    linkedin: "linkedin.com/company/shopify",
    address: "151 O'Connor St, Ottawa, ON",
  },
  {
    id: "slack",
    logo: "S",
    logoIcon: SlackIcon,
    logoClassName: "bg-fuchsia-600 text-white",
    name: "Slack",
    domain: "slack.com",
    createdBy: "System",
    accountOwner: "Hoang Le",
    createdAtMinutes: 12,
    employees: 3000,
    linkedin: "linkedin.com/company/slack-technologies",
    address: "500 Howard St, San Francisco, CA",
  },
  {
    id: "spotify",
    logo: "S",
    logoIcon: SpotifyIcon,
    logoClassName: "bg-green-600 text-white",
    name: "Spotify",
    domain: "spotify.com",
    createdBy: "System",
    accountOwner: "Bao Tran",
    createdAtMinutes: 41,
    employees: 10500,
    linkedin: "linkedin.com/company/spotify",
    address: "4 World Trade Center, New York, NY",
  },
  {
    id: "stripe",
    logo: "S",
    logoIcon: StripeIcon,
    logoClassName: "bg-indigo-600 text-white",
    name: "Stripe",
    domain: "stripe.com",
    createdBy: "System",
    accountOwner: "Thao Nguyen",
    createdAtMinutes: 5,
    employees: 10000,
    linkedin: "linkedin.com/company/stripe",
    address: "354 Oyster Point Blvd, South San Francisco, CA",
  },
]

const companyColumns: CompanyColumn[] = [
  {
    id: "name",
    label: "Name",
    icon: Building01Icon,
    defaultWidth: 190,
    minWidth: 140,
    summaryKind: "countAll",
  },
  {
    id: "domain",
    label: "Domain",
    icon: Link01Icon,
    defaultWidth: 150,
  },
  {
    id: "createdBy",
    label: "Created by",
    icon: UserIcon,
    defaultWidth: 130,
  },
  {
    id: "accountOwner",
    label: "Account Owner",
    icon: UserMultipleIcon,
    defaultWidth: 135,
  },
  {
    id: "creationDate",
    label: "Creation date",
    icon: Calendar01Icon,
    defaultWidth: 150,
  },
  {
    id: "employees",
    label: "Employees",
    icon: UserGroupIcon,
    defaultWidth: 130,
    summaryKind: "maxEmployees",
  },
  {
    id: "linkedin",
    label: "Linkedin",
    icon: Linkedin01Icon,
    defaultWidth: 150,
    summaryKind: "emptyLinkedinPercent",
  },
  {
    id: "address",
    label: "Address",
    icon: MapPinpoint01Icon,
    defaultWidth: 220,
    minWidth: 180,
    summaryKind: "notEmptyAddress",
  },
]

const COLUMN_ORDER = companyColumns.map((column) => column.id)

const EDITABLE_COLUMN_IDS: CompanyColumnId[] = [
  "name",
  "domain",
  "createdBy",
  "accountOwner",
  "employees",
  "linkedin",
  "address",
]

function getInitialColumnWidths() {
  return companyColumns.reduce<Record<CompanyColumnId, number>>((acc, column) => {
    acc[column.id] = column.defaultWidth
    return acc
  }, {} as Record<CompanyColumnId, number>)
}

function formatCreatedAt(minutes: number) {
  if (minutes <= 0) return "less than a minute ago"
  if (minutes === 1) return "1 minute ago"
  return `${minutes} minutes ago`
}

function formatEmployeeCount(value?: number) {
  if (typeof value !== "number") return ""
  return numberFormatter.format(value)
}

function isEditableColumn(columnId: CompanyColumnId) {
  return EDITABLE_COLUMN_IDS.includes(columnId)
}

function getCellEditValue(row: CompanyRow, columnId: CompanyColumnId) {
  switch (columnId) {
    case "name":
      return row.name
    case "domain":
      return row.domain ?? ""
    case "createdBy":
      return row.createdBy
    case "accountOwner":
      return row.accountOwner ?? ""
    case "employees":
      return typeof row.employees === "number" ? String(row.employees) : ""
    case "linkedin":
      return row.linkedin ?? ""
    case "address":
      return row.address ?? ""
    default:
      return ""
  }
}

function applyCellEdit(row: CompanyRow, columnId: CompanyColumnId, nextValue: string) {
  const trimmedValue = nextValue.trim()

  switch (columnId) {
    case "name":
      return { ...row, name: trimmedValue || row.name }
    case "domain":
      return { ...row, domain: trimmedValue || undefined }
    case "createdBy":
      return { ...row, createdBy: trimmedValue || row.createdBy }
    case "accountOwner":
      return { ...row, accountOwner: trimmedValue || undefined }
    case "employees": {
      if (!trimmedValue) return { ...row, employees: undefined }
      const numericValue = Number(trimmedValue.replaceAll(",", ""))
      if (Number.isNaN(numericValue)) return row
      return { ...row, employees: numericValue }
    }
    case "linkedin":
      return { ...row, linkedin: trimmedValue || undefined }
    case "address":
      return { ...row, address: trimmedValue || undefined }
    default:
      return row
  }
}

function ColumnHead({
  icon,
  label,
}: Pick<CompanyColumn, "icon" | "label">) {
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

type SortableHeaderCellProps = {
  column: CompanyColumn
  width: number
  isActive: boolean
  isDropTarget: boolean
  onResize: (event: React.PointerEvent<HTMLButtonElement>, columnId: CompanyColumnId) => void
}

type SortableColumnOptionItemProps = {
  column: CompanyColumn
  checked: boolean
  disabled: boolean
  onCheckedChange: (checked: boolean) => void
}

function SortableColumnOptionItem({
  column,
  checked,
  disabled,
  onCheckedChange,
}: SortableColumnOptionItemProps) {
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
      className={cn(
        "touch-none pl-1.5",
        isDragging && "bg-muted/40 opacity-70"
      )}
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
        className="text-muted-foreground hover:text-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-sm cursor-grab active:cursor-grabbing"
      >
        <HugeiconsIcon icon={DragDropVerticalIcon} strokeWidth={4} className="size-3.5 text-muted-foreground" />
      </span>
      <span className="truncate">{column.label}</span>
    </DropdownMenuCheckboxItem>
  )
}

function SortableHeaderCell({
  column,
  width,
  isActive,
  isDropTarget,
  onResize,
}: SortableHeaderCellProps) {
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
        className="flex h-full min-w-0 items-center overflow-hidden cursor-grab select-none touch-none active:cursor-grabbing"
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

function PersonCell({ value }: { value: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span className="bg-muted text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
        {value.charAt(0).toUpperCase()}
      </span>
      <span className="truncate">{value}</span>
    </span>
  )
}

function renderSummary(column: CompanyColumn, stats: SummaryStats) {
  if (!column.summaryKind) return null

  switch (column.summaryKind) {
    case "countAll":
      return `${numberFormatter.format(stats.countAll)} COMPANIES`
    case "maxEmployees":
      return numberFormatter.format(stats.maxEmployees)
    case "emptyLinkedinPercent":
      return `${numberFormatter.format(stats.emptyLinkedinPercent)}%`
    case "notEmptyAddress":
      return numberFormatter.format(stats.notEmptyAddress)
    default:
      return null
  }
}

function hasSummary(column: CompanyColumn) {
  return Boolean(column.summaryKind)
}

function renderCell(row: CompanyRow, column: CompanyColumn) {
  switch (column.id) {
    case "name":
      return (
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "inline-flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold",
              row.logoClassName
            )}
          >
            {row.logoIcon ? (
              <HugeiconsIcon icon={row.logoIcon} strokeWidth={2} className="size-3.5" />
            ) : (
              row.logo
            )}
          </span>
          <span className={cn("truncate", row.id === "untitled" && "text-muted-foreground")}>
            {row.name}
          </span>
        </div>
      )
    case "domain":
      return row.domain ? (
        <span className="bg-muted/40 inline-flex h-6 items-center rounded-full border px-2 text-xs">
          {row.domain}
        </span>
      ) : null
    case "createdBy":
      return <PersonCell value={row.createdBy} />
    case "accountOwner":
      return row.accountOwner ? <PersonCell value={row.accountOwner} /> : null
    case "creationDate":
      return (
        <span className="text-muted-foreground block truncate">
          {formatCreatedAt(row.createdAtMinutes)}
        </span>
      )
    case "employees":
      return formatEmployeeCount(row.employees)
    case "linkedin":
      return row.linkedin ?? null
    case "address":
      return <span className="block truncate">{row.address ?? null}</span>
    default:
      return null
  }
}

export function CompaniesGrid() {
  const [rows, setRows] = React.useState<CompanyRow[]>(INITIAL_COMPANY_ROWS)
  const [filterPreset, setFilterPreset] = React.useState<FilterPreset>("all")
  const [sortPreset, setSortPreset] = React.useState<SortPreset>("nameAsc")
  const [showSummaries, setShowSummaries] = React.useState(true)
  const [columnWidths, setColumnWidths] = React.useState<Record<CompanyColumnId, number>>(
    () => getInitialColumnWidths()
  )
  const [visibleColumnIds, setVisibleColumnIds] = React.useState<CompanyColumnId[]>(
    () => COLUMN_ORDER
  )
  const [draggingColumnId, setDraggingColumnId] = React.useState<CompanyColumnId | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = React.useState<CompanyColumnId | null>(null)
  const [dragOverlayHeight, setDragOverlayHeight] = React.useState(280)
  const [dropIndicatorLeft, setDropIndicatorLeft] = React.useState<number | null>(null)
  const [dragTableRect, setDragTableRect] = React.useState<{
    top: number
    height: number
  } | null>(null)
  const [editingCell, setEditingCell] = React.useState<EditingCell | null>(null)
  const [draftValue, setDraftValue] = React.useState("")

  const gridRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const resizingRef = React.useRef<{
    columnId: CompanyColumnId
    startX: number
    startWidth: number
  } | null>(null)
  const orderBeforeDragRef = React.useRef<CompanyColumnId[]>(COLUMN_ORDER)

  const visibleColumns = React.useMemo(() => {
    return visibleColumnIds
      .map((columnId) => companyColumns.find((column) => column.id === columnId))
      .filter((column): column is CompanyColumn => Boolean(column))
  }, [visibleColumnIds])

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

  React.useEffect(() => {
    if (!editingCell) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editingCell])

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const activeResize = resizingRef.current
      if (!activeResize) return

      const column = companyColumns.find((item) => item.id === activeResize.columnId)
      const minWidth = column?.minWidth ?? MIN_COLUMN_WIDTH
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
  }, [])

  const gridMinWidth = React.useMemo(() => {
    const contentWidth = visibleColumns.reduce((sum, column) => {
      return sum + (columnWidths[column.id] ?? column.defaultWidth)
    }, 0)
    return CONTROL_COLUMN_WIDTH * 2 + contentWidth
  }, [visibleColumns, columnWidths])

  const visibleRows = React.useMemo(() => {
    const filteredRows = rows.filter((row) => {
      if (filterPreset === "withDomain") return Boolean(row.domain)
      if (filterPreset === "withEmployees") return typeof row.employees === "number"
      return true
    })

    return [...filteredRows].sort((a, b) => {
      if (sortPreset === "nameAsc") return a.name.localeCompare(b.name)
      if (sortPreset === "employeesDesc") {
        const left = a.employees ?? -1
        const right = b.employees ?? -1
        return right - left || a.name.localeCompare(b.name)
      }
      return a.createdAtMinutes - b.createdAtMinutes || a.name.localeCompare(b.name)
    })
  }, [rows, filterPreset, sortPreset])

  const summaryStats = React.useMemo<SummaryStats>(() => {
    const countAll = visibleRows.length
    const maxEmployees = visibleRows.reduce((max, row) => {
      return Math.max(max, row.employees ?? 0)
    }, 0)
    const emptyLinkedinCount = visibleRows.filter((row) => !row.linkedin).length
    const emptyLinkedinPercent =
      countAll === 0 ? 0 : Math.round((emptyLinkedinCount / countAll) * 100)
    const notEmptyAddress = visibleRows.filter((row) => Boolean(row.address)).length

    return { countAll, maxEmployees, emptyLinkedinPercent, notEmptyAddress }
  }, [visibleRows])

  const toggleColumnVisibility = React.useCallback((columnId: CompanyColumnId, visible: boolean) => {
    setVisibleColumnIds((currentColumns) => {
      if (visible) {
        if (currentColumns.includes(columnId)) return currentColumns
        return [...currentColumns, columnId]
      }

      if (currentColumns.length === 1 && currentColumns.includes(columnId)) return currentColumns

      return currentColumns.filter((id) => id !== columnId)
    })
  }, [])

  const hiddenColumns = React.useMemo(() => {
    return companyColumns.filter((column) => !visibleColumnIds.includes(column.id))
  }, [visibleColumnIds])

  const handleColumnDragStart = React.useCallback((event: DragStartEvent) => {
    const activeId = String(event.active.id) as CompanyColumnId
    const tableRect = tableRef.current?.getBoundingClientRect()
    orderBeforeDragRef.current = visibleColumnIds
    setDraggingColumnId(activeId)
    setDragOverColumnId(activeId)
    setDragOverlayHeight(tableRect?.height ?? 280)
    if (tableRect) {
      setDragTableRect({ top: tableRect.top, height: tableRect.height })
    }
  }, [visibleColumnIds])

  const handleColumnDragOver = React.useCallback((event: DragOverEvent) => {
    if (!event.over) return

    const activeId = String(event.active.id) as CompanyColumnId
    const overId = String(event.over.id) as CompanyColumnId
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
  }, [visibleColumnIds])

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

    const activeId = String(event.active.id) as CompanyColumnId
    const overId = String(event.over.id) as CompanyColumnId
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

  const startEditing = React.useCallback((row: CompanyRow, columnId: CompanyColumnId) => {
    if (!isEditableColumn(columnId)) return
    setEditingCell({ rowId: row.id, columnId })
    setDraftValue(getCellEditValue(row, columnId))
  }, [])

  const commitEdit = React.useCallback(() => {
    if (!editingCell) return

    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== editingCell.rowId) return row
        return applyCellEdit(row, editingCell.columnId, draftValue)
      })
    )
    setEditingCell(null)
    setDraftValue("")
  }, [editingCell, draftValue])

  const cancelEdit = React.useCallback(() => {
    setEditingCell(null)
    setDraftValue("")
  }, [])

  const focusCell = React.useCallback((rowIndex: number, colIndex: number) => {
    const targetCell = gridRef.current?.querySelector<HTMLElement>(
      `[data-grid-cell="true"][data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`
    )
    targetCell?.focus()
  }, [])

  const beginResize = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, columnId: CompanyColumnId) => {
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

  const handleCellKeyDown = React.useCallback(
    (
      event: React.KeyboardEvent<HTMLTableCellElement>,
      row: CompanyRow,
      rowIndex: number,
      column: CompanyColumn,
      colIndex: number
    ) => {
      const maxRowIndex = visibleRows.length - 1
      const maxColIndex = visibleColumns.length - 1

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
    [visibleRows.length, visibleColumns.length, focusCell, startEditing]
  )

  const dragOverlayColumn = React.useMemo(() => {
    if (!draggingColumnId) return null
    return companyColumns.find((column) => column.id === draggingColumnId) ?? null
  }, [draggingColumnId])

  return (
    <div className="min-h-0" ref={gridRef}>
      <div className="flex items-center justify-between border-b px-2 py-1.5">
        <Button variant="ghost" className="-ml-1 text-muted-foreground">
          <HugeiconsIcon
            icon={Menu11Icon}
            strokeWidth={1.5}
            className="size-4 text-muted-foreground"
          />
          All Companies
          <span className="text-muted-foreground">&middot; {numberFormatter.format(visibleRows.length)}</span>
        </Button>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" className="text-muted-foreground" aria-label="Open filter menu" />}
            >
              {FILTER_LABELS[filterPreset]}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={filterPreset}
                onValueChange={(value) => setFilterPreset(value as FilterPreset)}
              >
                {FILTER_ORDER.map((preset) => (
                  <DropdownMenuRadioItem key={preset} value={preset}>
                    {FILTER_LABELS[preset]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" className="text-muted-foreground" aria-label="Open sort menu" />}
            >
              {SORT_LABELS[sortPreset]}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Sort</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sortPreset}
                onValueChange={(value) => setSortPreset(value as SortPreset)}
              >
                {SORT_ORDER.map((preset) => (
                  <DropdownMenuRadioItem key={preset} value={preset}>
                    {SORT_LABELS[preset]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" className="text-muted-foreground" aria-label="Open options menu" />}
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
                onCheckedChange={(checked) => setShowSummaries(checked === true)}
              >
                Show summary row
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Columns</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DndContext
                sensors={optionsSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleOptionColumnDragEnd}
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleColumnDragStart}
        onDragOver={handleColumnDragOver}
        onDragEnd={handleColumnDragEnd}
        onDragCancel={handleColumnDragCancel}
      >
        <Table
          ref={tableRef}
          className="table-fixed"
          style={{ width: `max(100%, ${gridMinWidth}px)` }}
        >
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
                <Checkbox className="mx-auto" aria-label="Select all companies" />
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
                    onResize={beginResize}
                  />
                ))}
              </SortableContext>
              <TableHead className="h-8 w-10 px-2 text-center text-xs">
                <HugeiconsIcon icon={Add01Icon} strokeWidth={1.5} className="mx-auto size-4" />
              </TableHead>
              <TableHead className="h-8 p-0" />
            </TableRow>
          </TableHeader>
        <TableBody>
          {visibleRows.map((row, rowIndex) => (
            <TableRow key={row.id}>
              <TableCell className="h-8 border-r px-0 text-center">
                <Checkbox className="mx-auto" aria-label={`Select ${row.name}`} />
              </TableCell>
              {visibleColumns.map((column, colIndex) => {
                const isEditing =
                  editingCell?.rowId === row.id && editingCell.columnId === column.id
                const isEditable = isEditableColumn(column.id)

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
                      isEditable && "cursor-text",
                      draggingColumnId === column.id && "bg-muted/20"
                    )}
                    style={{
                      width: columnWidths[column.id],
                      minWidth: columnWidths[column.id],
                    }}
                    onDoubleClick={() => {
                      if (isEditable) startEditing(row, column.id)
                    }}
                    onKeyDown={(event) =>
                      handleCellKeyDown(event, row, rowIndex, column, colIndex)
                    }
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
                        <div className="absolute top-1/2 right-1.5 -translate-y-1/2 opacity-0 pointer-events-none transition-all group-hover/cell:opacity-100 group-hover/cell:pointer-events-auto group-focus-within/cell:opacity-100 group-focus-within/cell:pointer-events-auto">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`Open details for ${row.name} ${column.label}`}
                            title="Open drawer"
                            className="text-muted-foreground border-ring/20 hover:text-foreground bg-muted hover:bg-muted hover:shadow-md/5 hover:border-ring/30"
                            onPointerDown={(event) => {
                              event.stopPropagation()
                            }}
                            onDoubleClick={(event) => {
                              event.stopPropagation()
                            }}
                            onClick={(event) => {
                              event.stopPropagation()
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
        {showSummaries ? (
          <TableFooter className="bg-background font-normal border-b">
            <TableRow className="hover:bg-transparent">
              <TableCell className="h-8 border-r px-2 py-0.5" />
              {visibleColumns.map((column) => (
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
                  {hasSummary(column) ? (
                    <span
                      className={cn(
                        column.id === "name" && "tracking-[0.06em] uppercase",
                        "inline-block"
                      )}
                    >
                      {renderSummary(column, summaryStats)}
                    </span>
                  ) : null}
                </TableCell>
              ))}
              <TableCell className="h-8 px-2 py-0.5" />
              <TableCell className="h-8 p-0" />
            </TableRow>
          </TableFooter>
        ) : null}
        </Table>
        <DragOverlay>
          {dragOverlayColumn ? (
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
          ) : null}
        </DragOverlay>
      </DndContext>
      {dropIndicatorLeft !== null && dragTableRect ? (
        <div
          className="pointer-events-none fixed z-50 w-0.5 bg-muted-foreground/50"
          style={{
            left: dropIndicatorLeft - 1,
            top: dragTableRect.top,
            height: dragTableRect.height,
          }}
        />
      ) : null}
    </div>
  )
}
