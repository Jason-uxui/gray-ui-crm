import * as React from "react"

import { cn } from "@/lib/utils"

type PageMainProps = React.ComponentProps<"div">

export function PageMain({ className, ...props }: PageMainProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0 m-2 rounded-md border border-border bg-background h-full",
        className
      )}
      {...props}
    />
  )
}

