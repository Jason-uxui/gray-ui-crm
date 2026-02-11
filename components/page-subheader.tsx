import * as React from "react"

type PageSubheaderProps = {
  children: React.ReactNode
}

export function PageSubheader({ children }: PageSubheaderProps) {
  return <div className="flex flex-wrap p-3 border-b items-center gap-2">{children}</div>
}
