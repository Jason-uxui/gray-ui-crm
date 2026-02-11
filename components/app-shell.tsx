import * as React from "react"

import { Sidebar } from "@/components/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh overflow-hidden bg-muted text-foreground">
      <div className="flex h-full overflow-hidden">
        <aside className="w-52 border-border bg-sidebar">
          <Sidebar />
        </aside>
        <main className="flex min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
