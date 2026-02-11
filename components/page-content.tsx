import * as React from "react"

import { cn } from "@/lib/utils"

type PageContentProps = React.ComponentProps<"div">

/**
 * Scrollable content area for a page.
 * Default is `p-0` to support full-bleed layouts (table/list pages).
 * Wrap children with `PageInset` when a page needs inner spacing.
 */
export function PageContent({ className, ...props }: PageContentProps) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto p-0", className)} {...props} />
}
