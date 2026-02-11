import * as React from "react"

type PageSubheaderProps = {
  children: React.ReactNode
  actions?: React.ReactNode
}

/**
 * Optional secondary action/filter row below `PageHeader`.
 * Use for controls that should stay outside scrollable page content.
 */
export function PageSubheader({ children, actions }: PageSubheaderProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 p-3 py-2">
      <div className="min-w-0 flex-1">{children}</div>
      {actions ? <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
