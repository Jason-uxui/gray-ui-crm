"use client"

import * as React from "react"

import { Building01Icon } from "@hugeicons/core-free-icons"

import { CompanyDetailWorkspace } from "@/components/companies/company-detail-workspace"
import { PageContent } from "@/components/page-content"
import { PageHeader } from "@/components/page-header"
import { PageMain } from "@/components/page-main"
import { type CompanyRecord } from "@/lib/companies"

export function CompanyDetailPage({ company }: { company: CompanyRecord }) {
  const [companyState, setCompanyState] = React.useState(company)

  React.useEffect(() => {
    setCompanyState(company)
  }, [company])

  return (
    <PageMain className="flex flex-col gap-0">
      <PageHeader
        breadcrumbs={[
          { label: "Companies", icon: Building01Icon, href: "/companies" },
          { label: companyState.name },
        ]}
      />

      <PageContent className="scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-4 md:p-5">
        <CompanyDetailWorkspace
          company={companyState}
          onCompanyChange={(updater) => {
            setCompanyState((current) => updater(current))
          }}
        />
      </PageContent>
    </PageMain>
  )
}
