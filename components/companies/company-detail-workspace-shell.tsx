"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { CompanyDetailSidebar } from "@/components/companies/company-detail-sidebar"
import { CompanyDetailWorkspaceTabPanel } from "@/components/companies/company-detail-workspace-panels"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type CompanyRecord } from "@/lib/companies"
import { getWorkspaceTabCounts, isWorkspaceTabId, workspaceTabs } from "@/lib/company-detail-workspace-data"
import { useCompanyTaskSession } from "@/lib/company-task-session-store"

const tabSearchParamKey = "tab"
const defaultWorkspaceTab = "timeline"

export function CompanyDetailWorkspace({
  company,
  onCompanyChange,
}: {
  company: CompanyRecord
  onCompanyChange: (updater: (current: CompanyRecord) => CompanyRecord) => void
}) {
  const { tasks, setTasks } = useCompanyTaskSession(company)
  const tabCounts = React.useMemo(() => getWorkspaceTabCounts(tasks.length), [tasks.length])

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeTab = React.useMemo(() => {
    const tabFromUrl = searchParams.get(tabSearchParamKey)
    if (!isWorkspaceTabId(tabFromUrl)) return defaultWorkspaceTab
    return tabFromUrl
  }, [searchParams])

  const handleTabChange = React.useCallback(
    (nextTab: string) => {
      if (!isWorkspaceTabId(nextTab)) return

      const nextSearchParams = new URLSearchParams(searchParams.toString())
      if (nextTab === defaultWorkspaceTab) {
        nextSearchParams.delete(tabSearchParamKey)
      } else {
        nextSearchParams.set(tabSearchParamKey, nextTab)
      }

      const nextUrl = nextSearchParams.size > 0 ? `${pathname}?${nextSearchParams.toString()}` : pathname
      router.replace(nextUrl, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
      <aside className="scrollbar-none min-w-0 xl:sticky xl:top-5 xl:max-h-[calc(100dvh-8.5rem)] xl:overflow-y-auto">
        <CompanyDetailSidebar company={company} onCompanyChange={onCompanyChange} />
      </aside>

      <section className="min-w-0 space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="sticky top-0 z-20 space-y-3 bg-card pb-3 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="-mx-1 overflow-x-auto px-1">
              <TabsList className="w-max">
                {workspaceTabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="h-8">
                    <span>{tab.label}</span>
                    <span className="bg-muted text-muted-foreground aria-selected:bg-background aria-selected:text-foreground rounded-full px-1.5 py-0.5 text-[11px]">
                      {tabCounts[tab.id]}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {workspaceTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <CompanyDetailWorkspaceTabPanel
                activeTab={tab.id}
                company={company}
                tasks={tasks}
                onTasksChange={setTasks}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  )
}
