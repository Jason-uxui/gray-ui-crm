import * as React from "react"

import { Add01Icon, Building01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CompaniesGrid } from "@/components/companies-grid"
import { PageHeader } from "@/components/page-header"
import { PageMain } from "@/components/page-main"
import { PageContent } from "@/components/page-content"
import { Button } from "@/components/ui/button"

export default function CompaniesPage() {
  return (
    <PageMain className="flex flex-col gap-0">
      <PageHeader
        breadcrumbs={[{ label: "Companies", icon: Building01Icon }]}
        actions={
          <Button variant="outline" size="default">
            <HugeiconsIcon icon={Add01Icon} strokeWidth={1.5} className="text-muted-foreground" />
            New record
          </Button>
        }
      />
      <PageContent>
        <CompaniesGrid />
      </PageContent>
    </PageMain>
  )
}
