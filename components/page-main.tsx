import * as React from "react"

import { cn } from "@/lib/utils"

type PageMainProps = React.ComponentProps<"div">

export function PageMain({ className, ...props }: PageMainProps) {
  return (
    <div
      className={cn(
        "m-2 flex min-h-0 flex-1 flex-col gap-0 overflow-hidden rounded-md border border-border bg-background",
        className
      )}
      {...props}
    />
  )
}
