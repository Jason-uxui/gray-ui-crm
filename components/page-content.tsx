import * as React from "react"

import { cn } from "@/lib/utils"

type PageContentProps = React.ComponentProps<"div">

export function PageContent({ className, ...props }: PageContentProps) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto p-0", className)} {...props} />
}
