import * as React from "react"

import { PageHeader } from "@/components/page-header"
import { PageMain } from "@/components/page-main"
import { PageContent } from "@/components/page-content"
import { PageInset } from "@/components/page-inset"
import { Card, CardContent } from "@/components/ui/card"

export default function TasksPage() {
  return (
    <PageMain className="flex flex-col gap-0">
      <PageHeader breadcrumbs={[{ label: "Tasks" }]} />
      <PageContent>
        <PageInset>
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add your first Tasks view here.
              </p>
            </CardContent>
          </Card>
        </PageInset>
      </PageContent>
    </PageMain>
  )
}
