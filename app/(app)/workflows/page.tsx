import * as React from "react"

import { PageHeader } from "@/components/page-header"
import { PageMain } from "@/components/page-main"
import { PageContent } from "@/components/page-content"
import { PageInset } from "@/components/page-inset"
import { Card, CardContent } from "@/components/ui/card"

export default function WorkflowsPage() {
  return (
    <PageMain className="flex flex-col gap-0">
      <PageHeader breadcrumbs={[{ label: "Workflows" }]} />
      <PageContent>
        <PageInset>
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add your first Workflows view here.
              </p>
            </CardContent>
          </Card>
        </PageInset>
      </PageContent>
    </PageMain>
  )
}
