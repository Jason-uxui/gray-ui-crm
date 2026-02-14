"use client"

import * as React from "react"

import {
  Building01Icon,
  Calendar01Icon,
  Link01Icon,
  Task01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"

import {
  DataGrid,
  type DataGridColumn,
  type DataGridFilterConfig,
  type DataGridSortConfig,
} from "@/components/data-grid"

type PersonRow = {
  id: string
  name: string
  title: string
  email: string
  company?: string
  lastContactMinutes: number
  openTasks?: number
}

type PeopleColumnId = "name" | "title" | "email" | "company" | "lastContact" | "openTasks"
type FilterPreset = "all" | "withCompany" | "hasTasks"
type SortPreset = "nameAsc" | "companyAsc" | "recentContact"
type PeopleSummaryKind = "countAll" | "openTasksTotal"

type PeopleColumn = DataGridColumn<PeopleColumnId> & {
  summaryKind?: PeopleSummaryKind
}

type PeopleSummaryStats = {
  countAll: number
  openTasksTotal: number
}

const numberFormatter = new Intl.NumberFormat("en-US")

const INITIAL_PEOPLE_ROWS: PersonRow[] = [
  {
    id: "ngoc-tran",
    name: "Ngoc Tran",
    title: "Account Executive",
    email: "ngoc@acme.com",
    company: "Airbnb",
    lastContactMinutes: 8,
    openTasks: 3,
  },
  {
    id: "linh-phan",
    name: "Linh Phan",
    title: "Customer Success Manager",
    email: "linh@acme.com",
    company: "Notion",
    lastContactMinutes: 15,
    openTasks: 1,
  },
  {
    id: "bao-le",
    name: "Bao Le",
    title: "Design Engineer",
    email: "bao@acme.com",
    company: "Figma",
    lastContactMinutes: 2,
    openTasks: 5,
  },
  {
    id: "thao-nguyen",
    name: "Thao Nguyen",
    title: "Product Marketing",
    email: "thao@acme.com",
    company: "Stripe",
    lastContactMinutes: 31,
    openTasks: 0,
  },
  {
    id: "duc-vo",
    name: "Duc Vo",
    title: "Solutions Architect",
    email: "duc@acme.com",
    lastContactMinutes: 48,
  },
  {
    id: "mai-ho",
    name: "Mai Ho",
    title: "Partnerships Lead",
    email: "mai@acme.com",
    company: "Shopify",
    lastContactMinutes: 11,
    openTasks: 2,
  },
]

const peopleColumns: PeopleColumn[] = [
  {
    id: "name",
    label: "Name",
    icon: UserIcon,
    defaultWidth: 190,
    minWidth: 150,
    summaryKind: "countAll",
  },
  {
    id: "title",
    label: "Title",
    icon: Task01Icon,
    defaultWidth: 200,
    minWidth: 160,
  },
  {
    id: "email",
    label: "Email",
    icon: Link01Icon,
    defaultWidth: 220,
    minWidth: 190,
  },
  {
    id: "company",
    label: "Company",
    icon: Building01Icon,
    defaultWidth: 160,
    minWidth: 130,
  },
  {
    id: "lastContact",
    label: "Last contact",
    icon: Calendar01Icon,
    defaultWidth: 150,
    minWidth: 120,
  },
  {
    id: "openTasks",
    label: "Open tasks",
    icon: Task01Icon,
    defaultWidth: 120,
    minWidth: 100,
    summaryKind: "openTasksTotal",
  },
]

const EDITABLE_COLUMN_IDS: PeopleColumnId[] = ["name", "title", "email", "company", "openTasks"]

const filterConfig: DataGridFilterConfig<FilterPreset, PersonRow> = {
  order: ["all", "withCompany", "hasTasks"],
  labels: {
    all: "All",
    withCompany: "Has company",
    hasTasks: "Has open tasks",
  },
  defaultPreset: "all",
  apply: (row, preset) => {
    if (preset === "withCompany") return Boolean(row.company)
    if (preset === "hasTasks") return (row.openTasks ?? 0) > 0
    return true
  },
}

const sortConfig: DataGridSortConfig<SortPreset, PersonRow> = {
  order: ["nameAsc", "companyAsc", "recentContact"],
  labels: {
    nameAsc: "Name A-Z",
    companyAsc: "Company A-Z",
    recentContact: "Most recent",
  },
  defaultPreset: "nameAsc",
  compare: (a, b, preset) => {
    if (preset === "nameAsc") return a.name.localeCompare(b.name)
    if (preset === "companyAsc") {
      const left = a.company ?? ""
      const right = b.company ?? ""
      return left.localeCompare(right) || a.name.localeCompare(b.name)
    }
    return a.lastContactMinutes - b.lastContactMinutes || a.name.localeCompare(b.name)
  },
}

function formatLastContact(minutes: number) {
  if (minutes <= 0) return "just now"
  if (minutes === 1) return "1 minute ago"
  return `${minutes} minutes ago`
}

function isEditableColumn(columnId: PeopleColumnId) {
  return EDITABLE_COLUMN_IDS.includes(columnId)
}

function getCellEditValue(row: PersonRow, columnId: PeopleColumnId) {
  switch (columnId) {
    case "name":
      return row.name
    case "title":
      return row.title
    case "email":
      return row.email
    case "company":
      return row.company ?? ""
    case "openTasks":
      return typeof row.openTasks === "number" ? String(row.openTasks) : ""
    default:
      return ""
  }
}

function applyCellEdit(row: PersonRow, columnId: PeopleColumnId, nextValue: string) {
  const trimmedValue = nextValue.trim()

  switch (columnId) {
    case "name":
      return { ...row, name: trimmedValue || row.name }
    case "title":
      return { ...row, title: trimmedValue || row.title }
    case "email":
      return { ...row, email: trimmedValue || row.email }
    case "company":
      return { ...row, company: trimmedValue || undefined }
    case "openTasks": {
      if (!trimmedValue) return { ...row, openTasks: undefined }
      const value = Number(trimmedValue)
      if (Number.isNaN(value)) return row
      return { ...row, openTasks: value }
    }
    default:
      return row
  }
}

function renderCell(row: PersonRow, column: DataGridColumn<PeopleColumnId>) {
  switch (column.id) {
    case "name":
      return (
        <span className="inline-flex min-w-0 items-center gap-2">
          <span className="bg-muted text-muted-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium">
            {row.name.charAt(0).toUpperCase()}
          </span>
          <span className="truncate">{row.name}</span>
        </span>
      )
    case "title":
      return <span className="truncate">{row.title}</span>
    case "email":
      return <span className="text-muted-foreground truncate">{row.email}</span>
    case "company":
      return row.company ?? null
    case "lastContact":
      return <span className="text-muted-foreground">{formatLastContact(row.lastContactMinutes)}</span>
    case "openTasks":
      return typeof row.openTasks === "number" ? numberFormatter.format(row.openTasks) : null
    default:
      return null
  }
}

function getDrawerCellValue(row: PersonRow, columnId: PeopleColumnId) {
  switch (columnId) {
    case "name":
      return row.name
    case "title":
      return row.title
    case "email":
      return row.email
    case "company":
      return row.company ?? null
    case "lastContact":
      return formatLastContact(row.lastContactMinutes)
    case "openTasks":
      return typeof row.openTasks === "number" ? numberFormatter.format(row.openTasks) : null
    default:
      return null
  }
}

function getSummaryStats(rows: PersonRow[]): PeopleSummaryStats {
  return {
    countAll: rows.length,
    openTasksTotal: rows.reduce((sum, row) => sum + (row.openTasks ?? 0), 0),
  }
}

function renderSummary(column: DataGridColumn<PeopleColumnId>, visibleRows: PersonRow[]) {
  const targetColumn = peopleColumns.find((item) => item.id === column.id)
  if (!targetColumn?.summaryKind) return null

  const stats = getSummaryStats(visibleRows)

  switch (targetColumn.summaryKind) {
    case "countAll":
      return <span className="tracking-[0.06em] uppercase">{numberFormatter.format(stats.countAll)} PEOPLE</span>
    case "openTasksTotal":
      return numberFormatter.format(stats.openTasksTotal)
    default:
      return null
  }
}

export function PeopleGrid() {
  return (
    <DataGrid<PersonRow, PeopleColumnId, FilterPreset, SortPreset>
      initialRows={INITIAL_PEOPLE_ROWS}
      columns={peopleColumns}
      viewLabel="All People"
      getRowLabel={(row) => row.name}
      renderCell={renderCell}
      isEditableColumn={isEditableColumn}
      getCellEditValue={getCellEditValue}
      applyCellEdit={applyCellEdit}
      getDrawerCellValue={getDrawerCellValue}
      filter={filterConfig}
      sort={sortConfig}
      renderSummary={renderSummary}
      drawerModal={false}
      disablePointerDismissal={true}
    />
  )
}
