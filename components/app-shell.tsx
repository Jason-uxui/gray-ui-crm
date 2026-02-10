import * as React from "react"

import { Sidebar } from "@/components/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-border bg-sidebar">
          <Sidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
