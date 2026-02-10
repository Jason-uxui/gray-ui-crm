import * as React from "react"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Dashboard" description="This section is coming soon." />
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add your first Dashboard view here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
