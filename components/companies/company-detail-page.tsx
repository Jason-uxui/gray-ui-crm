"use client"

import * as React from "react"

import {
  Add01Icon,
  Building01Icon,
  Task01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { getCompanyBrandPresentation } from "@/components/companies/company-brand"
import { CompanyDetailTabs } from "@/components/companies/company-detail-tabs"
import { PageContent } from "@/components/page-content"
import { PageHeader } from "@/components/page-header"
import { PageMain } from "@/components/page-main"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type CompanyRecord,
  formatCompanyCreatedAt,
} from "@/lib/companies"
import { cn } from "@/lib/utils"

export function CompanyDetailPage({ company }: { company: CompanyRecord }) {
  const [companyState, setCompanyState] = React.useState(company)

  React.useEffect(() => {
    setCompanyState(company)
  }, [company])

  const brand = getCompanyBrandPresentation(companyState.id, companyState.name)

  return (
    <PageMain className="flex flex-col gap-0">
      <PageHeader
        breadcrumbs={[
          { label: "Companies", icon: Building01Icon, href: "/companies" },
          { label: companyState.name },
        ]}
        actions={
          <>
            <Button variant="outline" size="default">
              <HugeiconsIcon icon={Task01Icon} strokeWidth={1.5} className="text-muted-foreground" />
              Add task
            </Button>
            <Button variant="outline" size="default">
              <HugeiconsIcon icon={Add01Icon} strokeWidth={1.5} className="text-muted-foreground" />
              Edit company
            </Button>
          </>
        }
      />

      <PageContent className="p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
              brand.className
            )}
          >
            {brand.icon ? (
              <HugeiconsIcon icon={brand.icon} strokeWidth={2} className="size-4.5" />
            ) : (
              brand.fallback
            )}
          </span>
          <h1 className="text-lg font-semibold">{companyState.name}</h1>
          <Badge variant="outline">Company</Badge>
          <span className="text-muted-foreground text-sm">{formatCompanyCreatedAt(companyState.createdAtMinutes)}</span>
        </div>

        <CompanyDetailTabs
          company={companyState}
          onCompanyChange={(updater) => {
            setCompanyState((current) => updater(current))
          }}
        />
      </PageContent>
    </PageMain>
  )
}
