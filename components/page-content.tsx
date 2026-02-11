import * as React from "react"

import { cn } from "@/lib/utils"

type PageContentProps = React.ComponentProps<"div">

export function PageContent({ className, ...props }: PageContentProps) {
  return <div className={cn("p-0", className)} {...props} />
}

