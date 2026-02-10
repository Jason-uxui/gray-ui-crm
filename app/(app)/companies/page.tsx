import * as React from "react"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"

export default function CompaniesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Companies" description="This section is coming soon." />
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add your first Companies view here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
