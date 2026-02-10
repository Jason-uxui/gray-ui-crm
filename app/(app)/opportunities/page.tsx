import * as React from "react"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"

export default function OpportunitiesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Opportunities" description="This section is coming soon." />
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add your first Opportunities view here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
