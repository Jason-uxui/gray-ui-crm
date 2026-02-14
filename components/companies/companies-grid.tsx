"use client"

import * as React from "react"

import {
  Building01Icon,
  Calendar01Icon,
  Link01Icon,
  Linkedin01Icon,
  MapPinpoint01Icon,
  UserGroupIcon,
  UserIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  DataGrid,
  type DataGridColumn,
  type DataGridDrawerPanelProps,
  type DataGridFilterConfig,
  type DataGridSortConfig,
} from "@/components/data-grid"
import { CompanyDetailDrawer } from "@/components/companies/company-detail-drawer"
import { getCompanyBrandPresentation } from "@/components/companies/company-brand"
import {
  COMPANY_RECORDS,
  type CompanyRecord,
  getCompanyAccountOwner,
  getCompanyCreatedBy,
  formatCompanyCreatedAt,
  formatCompanyEmployeeCount,
} from "@/lib/companies"
import { cn } from "@/lib/utils"

type CompanyRow = CompanyRecord

type CompanyColumnId =
  | "name"
  | "domain"
  | "createdBy"
  | "accountOwner"
  | "creationDate"
  | "employees"
  | "linkedin"
  | "address"

type FilterPreset = "all" | "withDomain" | "withEmployees"
type SortPreset = "nameAsc" | "employeesDesc" | "newest"
type CompanySummaryKind = "countAll" | "maxEmployees" | "emptyLinkedinPercent" | "notEmptyAddress"

type CompanyColumn = DataGridColumn<CompanyColumnId> & {
  summaryKind?: CompanySummaryKind
}

type SummaryStats = {
  countAll: number
  maxEmployees: number
  emptyLinkedinPercent: number
  notEmptyAddress: number
}

const numberFormatter = new Intl.NumberFormat("en-US")

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

const EDITABLE_COLUMN_IDS: CompanyColumnId[] = [
  "name",
  "domain",
  "createdBy",
  "accountOwner",
  "employees",
  "linkedin",
  "address",
]

const filterConfig: DataGridFilterConfig<FilterPreset, CompanyRow> = {
  order: ["all", "withDomain", "withEmployees"],
  labels: {
    all: "All",
    withDomain: "Has domain",
    withEmployees: "Has employees",
  },
  defaultPreset: "all",
  apply: (row, preset) => {
    if (preset === "withDomain") return Boolean(row.domain)
    if (preset === "withEmployees") return typeof row.employees === "number"
    return true
  },
}

const sortConfig: DataGridSortConfig<SortPreset, CompanyRow> = {
  order: ["nameAsc", "employeesDesc", "newest"],
  labels: {
    nameAsc: "Name A-Z",
    employeesDesc: "Employees High-Low",
    newest: "Newest",
  },
  defaultPreset: "nameAsc",
  compare: (a, b, preset) => {
    if (preset === "nameAsc") return a.name.localeCompare(b.name)
    if (preset === "employeesDesc") {
      const left = a.employees ?? -1
      const right = b.employees ?? -1
      return right - left || a.name.localeCompare(b.name)
    }
    return a.createdAtMinutes - b.createdAtMinutes || a.name.localeCompare(b.name)
  },
}

function isEditableColumn(columnId: CompanyColumnId) {
  return EDITABLE_COLUMN_IDS.includes(columnId)
}

function getCellEditValue(row: CompanyRow, columnId: CompanyColumnId) {
  const createdBy = getCompanyCreatedBy(row)
  const accountOwner = getCompanyAccountOwner(row)

  switch (columnId) {
    case "name":
      return row.name
    case "domain":
      return row.domain ?? ""
    case "createdBy":
      return createdBy
    case "accountOwner":
      return accountOwner ?? ""
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
      return {
        ...row,
        createdBy: trimmedValue || getCompanyCreatedBy(row),
        createdById: undefined,
      }
    case "accountOwner":
      return { ...row, accountOwner: trimmedValue || undefined, accountOwnerId: undefined }
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

function renderCell(row: CompanyRow, column: DataGridColumn<CompanyColumnId>) {
  const createdBy = getCompanyCreatedBy(row)
  const accountOwner = getCompanyAccountOwner(row)

  switch (column.id) {
    case "name": {
      const brand = getCompanyBrandPresentation(row.id, row.name)

      return (
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "inline-flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold",
              brand.className
            )}
          >
            {brand.icon ? (
              <HugeiconsIcon icon={brand.icon} strokeWidth={2} className="size-3.5" />
            ) : (
              brand.fallback
            )}
          </span>
          <span className={cn("truncate", row.id === "untitled" && "text-muted-foreground")}>
            {row.name}
          </span>
        </div>
      )
    }
    case "domain":
      return row.domain ? (
        <span className="bg-muted/40 inline-flex h-6 items-center rounded-full border px-2 text-xs">
          {row.domain}
        </span>
      ) : null
    case "createdBy":
      return <PersonCell value={createdBy} />
    case "accountOwner":
      return accountOwner ? <PersonCell value={accountOwner} /> : null
    case "creationDate":
      return <span className="text-muted-foreground block truncate">{formatCompanyCreatedAt(row.createdAtMinutes)}</span>
    case "employees":
      return formatCompanyEmployeeCount(row.employees)
    case "linkedin":
      return row.linkedin ?? null
    case "address":
      return <span className="block truncate">{row.address ?? null}</span>
    default:
      return null
  }
}

function getDrawerCellValue(row: CompanyRow, columnId: CompanyColumnId) {
  const createdBy = getCompanyCreatedBy(row)
  const accountOwner = getCompanyAccountOwner(row)

  switch (columnId) {
    case "name":
      return row.name
    case "domain":
      return row.domain ?? null
    case "createdBy":
      return createdBy
    case "accountOwner":
      return accountOwner ?? null
    case "creationDate":
      return formatCompanyCreatedAt(row.createdAtMinutes)
    case "employees":
      return formatCompanyEmployeeCount(row.employees)
    case "linkedin":
      return row.linkedin ?? null
    case "address":
      return row.address ?? null
    default:
      return null
  }
}

function getSummaryStats(rows: CompanyRow[]): SummaryStats {
  const countAll = rows.length
  const maxEmployees = rows.reduce((max, row) => {
    return Math.max(max, row.employees ?? 0)
  }, 0)
  const emptyLinkedinCount = rows.filter((row) => !row.linkedin).length
  const emptyLinkedinPercent = countAll === 0 ? 0 : Math.round((emptyLinkedinCount / countAll) * 100)
  const notEmptyAddress = rows.filter((row) => Boolean(row.address)).length

  return { countAll, maxEmployees, emptyLinkedinPercent, notEmptyAddress }
}

function renderSummary(column: DataGridColumn<CompanyColumnId>, visibleRows: CompanyRow[]) {
  const targetColumn = companyColumns.find((item) => item.id === column.id)
  if (!targetColumn?.summaryKind) return null

  const stats = getSummaryStats(visibleRows)

  switch (targetColumn.summaryKind) {
    case "countAll":
      return <span className="tracking-[0.06em] uppercase">{numberFormatter.format(stats.countAll)} COMPANIES</span>
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

function renderCompanyDrawer(
  props: DataGridDrawerPanelProps<CompanyRow, CompanyColumnId>
) {
  return <CompanyDetailDrawer {...props} />
}

export function CompaniesGrid() {
  return (
    <DataGrid<CompanyRow, CompanyColumnId, FilterPreset, SortPreset>
      initialRows={COMPANY_RECORDS}
      columns={companyColumns}
      viewLabel="All Companies"
      getRowLabel={(row) => row.name}
      renderCell={renderCell}
      isEditableColumn={isEditableColumn}
      getCellEditValue={getCellEditValue}
      applyCellEdit={applyCellEdit}
      getDrawerCellValue={getDrawerCellValue}
      filter={filterConfig}
      sort={sortConfig}
      renderSummary={renderSummary}
      renderDrawerPanel={renderCompanyDrawer}
      drawerModal={false}
      disablePointerDismissal={true}
    />
  )
}
