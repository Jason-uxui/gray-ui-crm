import * as React from "react"

import { cn } from "@/lib/utils"

type PageInsetProps = React.ComponentProps<"div">

/**
 * Inner spacing wrapper for page body content.
 * Use inside `PageContent` for detail/form/card pages.
 * Skip this on full-bleed list/table pages.
 */
export function PageInset({ className, ...props }: PageInsetProps) {
  return <div className={cn("p-3 md:p-4", className)} {...props} />
}
