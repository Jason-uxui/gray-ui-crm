import * as React from "react"

type PageSubheaderProps = {
  children: React.ReactNode
}

export function PageSubheader({ children }: PageSubheaderProps) {
  return <div className="flex shrink-0 flex-wrap items-center gap-2 border-b p-3">{children}</div>
}
