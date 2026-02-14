"use client"

import * as React from "react"

import {
  AirbnbIcon,
  AmazonIcon,
  AppleIcon,
  Building01Icon,
  Calendar01Icon,
  DropboxIcon,
  FigmaIcon,
  GithubIcon,
  GitlabIcon,
  GoogleIcon,
  Link01Icon,
  Linkedin01Icon,
  MapPinpoint01Icon,
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

import {
  DataGrid,
  type DataGridColumn,
  type DataGridFilterConfig,
  type DataGridSortConfig,
} from "@/components/data-grid"
import { cn } from "@/lib/utils"

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
      return <span className="text-muted-foreground block truncate">{formatCreatedAt(row.createdAtMinutes)}</span>
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

function getDrawerCellValue(row: CompanyRow, columnId: CompanyColumnId) {
  switch (columnId) {
    case "name":
      return row.name
    case "domain":
      return row.domain ?? null
    case "createdBy":
      return row.createdBy
    case "accountOwner":
      return row.accountOwner ?? null
    case "creationDate":
      return formatCreatedAt(row.createdAtMinutes)
    case "employees":
      return formatEmployeeCount(row.employees)
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

export function CompaniesGrid() {
  return (
    <DataGrid<CompanyRow, CompanyColumnId, FilterPreset, SortPreset>
      initialRows={INITIAL_COMPANY_ROWS}
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
      drawerModal={false}
      disablePointerDismissal={true}
    />
  )
}
