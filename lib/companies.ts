import { getPersonNameById } from "@/lib/people"

const numberFormatter = new Intl.NumberFormat("en-US")

export type CompanyRecord = {
  id: string
  name: string
  domain?: string
  createdBy?: string
  createdById?: string
  updatedById?: string
  accountOwner?: string
  accountOwnerId?: string
  createdAtMinutes: number
  employees?: number
  linkedin?: string
  address?: string
  peopleIds?: string[]
  opportunityIds?: string[]
}

export const COMPANY_RECORDS: CompanyRecord[] = [
  {
    id: "airbnb",
    name: "Airbnb",
    domain: "airbnb.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Linh Tran",
    accountOwnerId: "linh-tran",
    createdAtMinutes: 3,
    employees: 6900,
    linkedin: "linkedin.com/company/airbnb",
    address: "888 Brannan St, San Francisco, CA",
    peopleIds: ["linh-tran", "ngoc-tran"],
    opportunityIds: ["enterprise-plan-upgrade"],
  },
  {
    id: "amazon",
    name: "Amazon",
    domain: "amazon.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Ngoc Tran",
    accountOwnerId: "ngoc-tran",
    createdAtMinutes: 8,
    employees: 1525000,
    linkedin: "linkedin.com/company/amazon",
    address: "410 Terry Ave N, Seattle, WA",
    peopleIds: ["ngoc-tran", "hung-nguyen"],
    opportunityIds: ["renewal-fy26"],
  },
  {
    id: "apple",
    name: "Apple",
    domain: "apple.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Hung Nguyen",
    accountOwnerId: "hung-nguyen",
    createdAtMinutes: 11,
    employees: 161000,
    linkedin: "linkedin.com/company/apple",
    address: "One Apple Park Way, Cupertino, CA",
    peopleIds: ["hung-nguyen"],
    opportunityIds: ["security-addon"],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    domain: "dropbox.com",
    createdBy: "Mai Le",
    createdById: "mai-le",
    updatedById: "mai-le",
    accountOwner: "Duc Nguyen",
    accountOwnerId: "duc-nguyen",
    createdAtMinutes: 54,
    employees: 2600,
    linkedin: "linkedin.com/company/dropbox",
    address: "1800 Owens St, San Francisco, CA",
    peopleIds: ["mai-le", "duc-nguyen"],
    opportunityIds: [],
  },
  {
    id: "figma",
    name: "Figma",
    domain: "figma.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Duy Pham",
    accountOwnerId: "duy-pham",
    createdAtMinutes: 2,
    employees: 1300,
    linkedin: "linkedin.com/company/figma",
    address: "760 Market St, Floor 10, San Francisco, CA",
    peopleIds: ["duy-pham"],
    opportunityIds: ["new-region-rollout"],
  },
  {
    id: "github",
    name: "GitHub",
    domain: "github.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Trang Vo",
    accountOwnerId: "trang-vo",
    createdAtMinutes: 19,
    employees: 3500,
    linkedin: "linkedin.com/company/github",
    address: "88 Colin P Kelly Jr St, San Francisco, CA",
    peopleIds: ["trang-vo"],
    opportunityIds: [],
  },
  {
    id: "gitlab",
    name: "GitLab",
    domain: "gitlab.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Lan Anh",
    accountOwnerId: "lan-anh",
    createdAtMinutes: 28,
    employees: 2200,
    linkedin: "linkedin.com/company/gitlab-com",
    address: "268 Bush St, San Francisco, CA",
    peopleIds: ["lan-anh"],
    opportunityIds: ["multi-year-commit"],
  },
  {
    id: "google",
    name: "Google",
    domain: "google.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Phuong Le",
    accountOwnerId: "phuong-le",
    createdAtMinutes: 14,
    employees: 182000,
    linkedin: "linkedin.com/company/google",
    address: "1600 Amphitheatre Pkwy, Mountain View, CA",
    peopleIds: ["phuong-le"],
    opportunityIds: ["renewal-fy26"],
  },
  {
    id: "meta",
    name: "Meta",
    domain: "meta.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Kiet Pham",
    accountOwnerId: "kiet-pham",
    createdAtMinutes: 24,
    employees: 76000,
    linkedin: "linkedin.com/company/meta",
    address: "1 Hacker Way, Menlo Park, CA",
    peopleIds: ["kiet-pham", "linh-tran"],
    opportunityIds: [],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    domain: "microsoft.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Linh Tran",
    accountOwnerId: "linh-tran",
    createdAtMinutes: 16,
    employees: 221000,
    linkedin: "linkedin.com/company/microsoft",
    address: "One Microsoft Way, Redmond, WA",
    peopleIds: ["linh-tran", "thao-nguyen"],
    opportunityIds: ["enterprise-plan-upgrade"],
  },
  {
    id: "notion",
    name: "Notion",
    domain: "notion.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Ngoc Tran",
    accountOwnerId: "ngoc-tran",
    createdAtMinutes: 9,
    employees: 1200,
    linkedin: "linkedin.com/company/notionhq",
    address: "2300 Harrison St, San Francisco, CA",
    peopleIds: ["ngoc-tran"],
    opportunityIds: ["security-addon"],
  },
  {
    id: "paypal",
    name: "PayPal",
    domain: "paypal.com",
    createdBy: "Minh Nguyen",
    createdById: "minh-nguyen",
    updatedById: "minh-nguyen",
    accountOwner: "Lan Anh",
    accountOwnerId: "lan-anh",
    createdAtMinutes: 37,
    employees: 29000,
    linkedin: "linkedin.com/company/paypal",
    address: "2211 N First St, San Jose, CA",
    peopleIds: ["minh-nguyen", "lan-anh"],
    opportunityIds: [],
  },
  {
    id: "shopify",
    name: "Shopify",
    domain: "shopify.com",
    createdBy: "Mai Le",
    createdById: "mai-le",
    updatedById: "mai-le",
    accountOwner: "Khanh Nguyen",
    accountOwnerId: "khanh-nguyen",
    createdAtMinutes: 36,
    employees: 8300,
    linkedin: "linkedin.com/company/shopify",
    address: "151 O'Connor St, Ottawa, ON",
    peopleIds: ["mai-le", "khanh-nguyen"],
    opportunityIds: ["new-region-rollout"],
  },
  {
    id: "slack",
    name: "Slack",
    domain: "slack.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Hoang Le",
    accountOwnerId: "hoang-le",
    createdAtMinutes: 12,
    employees: 3000,
    linkedin: "linkedin.com/company/slack-technologies",
    address: "500 Howard St, San Francisco, CA",
    peopleIds: ["hoang-le"],
    opportunityIds: ["multi-year-commit"],
  },
  {
    id: "spotify",
    name: "Spotify",
    domain: "spotify.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Bao Tran",
    accountOwnerId: "bao-tran",
    createdAtMinutes: 41,
    employees: 10500,
    linkedin: "linkedin.com/company/spotify",
    address: "4 World Trade Center, New York, NY",
    peopleIds: ["bao-tran"],
    opportunityIds: [],
  },
  {
    id: "stripe",
    name: "Stripe",
    domain: "stripe.com",
    createdBy: "System",
    createdById: "system",
    updatedById: "system",
    accountOwner: "Thao Nguyen",
    accountOwnerId: "thao-nguyen",
    createdAtMinutes: 5,
    employees: 10000,
    linkedin: "linkedin.com/company/stripe",
    address: "354 Oyster Point Blvd, South San Francisco, CA",
    peopleIds: ["thao-nguyen", "linh-tran"],
    opportunityIds: ["enterprise-plan-upgrade"],
  },
]

export function formatCompanyCreatedAt(minutes: number) {
  if (minutes <= 0) return "less than a minute ago"
  if (minutes === 1) return "1 minute ago"
  return `${minutes} minutes ago`
}

export function formatCompanyEmployeeCount(value?: number) {
  if (typeof value !== "number") return ""
  return numberFormatter.format(value)
}

export function getCompanyCreatedBy(company: CompanyRecord) {
  return getPersonNameById(company.createdById, company.createdBy)
}

export function getCompanyUpdatedBy(company: CompanyRecord) {
  return getPersonNameById(company.updatedById, company.createdBy)
}

export function getCompanyAccountOwner(company: CompanyRecord) {
  if (!company.accountOwnerId && !company.accountOwner) return undefined
  return getPersonNameById(company.accountOwnerId, company.accountOwner)
}

export function getCompanyById(companyId: string) {
  return COMPANY_RECORDS.find((item) => item.id === companyId) ?? null
}
