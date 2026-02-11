import * as React from "react"

import { Separator } from "@/components/ui/separator"

type PageHeaderProps = {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-0 p-3 border-b">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.15px]">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  )
}
