"use client"

import * as React from "react"

import { type CompanyRecord } from "@/lib/companies"
import { buildCompanyTaskItems, type CompanyTaskItem } from "@/lib/company-tasks"

type UseCompanyTaskSessionResult = {
  tasks: CompanyTaskItem[]
  setTasks: (next: CompanyTaskItem[]) => void
  resetTasks: () => void
}

function getStorageKey(companyId: string) {
  return `crm:company-tasks:${companyId}`
}

function isValidTaskPayload(value: unknown): value is CompanyTaskItem[] {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== "object") return false
    const target = item as Partial<CompanyTaskItem>

    return (
      typeof target.id === "string" &&
      typeof target.status === "string" &&
      typeof target.title === "string" &&
      typeof target.subtitle === "string" &&
      typeof target.timeLabel === "string"
    )
  })
}

export function useCompanyTaskSession(company: CompanyRecord | null): UseCompanyTaskSessionResult {
  const seededTasks = React.useMemo(
    () => (company ? buildCompanyTaskItems(company) : []),
    [company]
  )

  const [tasks, setTasksState] = React.useState<CompanyTaskItem[]>(seededTasks)

  React.useEffect(() => {
    if (!company) {
      setTasksState([])
      return
    }

    const storageKey = getStorageKey(company.id)
    const fallbackTasks = buildCompanyTaskItems(company)

    try {
      const raw = window.sessionStorage.getItem(storageKey)
      if (!raw) {
        window.sessionStorage.setItem(storageKey, JSON.stringify(fallbackTasks))
        setTasksState(fallbackTasks)
        return
      }

      const parsed = JSON.parse(raw) as unknown
      if (!isValidTaskPayload(parsed)) {
        window.sessionStorage.setItem(storageKey, JSON.stringify(fallbackTasks))
        setTasksState(fallbackTasks)
        return
      }

      setTasksState(parsed)
    } catch {
      window.sessionStorage.setItem(storageKey, JSON.stringify(fallbackTasks))
      setTasksState(fallbackTasks)
    }
  }, [company])

  const setTasks = React.useCallback(
    (next: CompanyTaskItem[]) => {
      setTasksState(next)
      if (!company) return
      window.sessionStorage.setItem(getStorageKey(company.id), JSON.stringify(next))
    },
    [company]
  )

  const resetTasks = React.useCallback(() => {
    if (!company) {
      setTasksState([])
      return
    }

    const next = buildCompanyTaskItems(company)
    setTasksState(next)
    window.sessionStorage.setItem(getStorageKey(company.id), JSON.stringify(next))
  }, [company])

  return {
    tasks,
    setTasks,
    resetTasks,
  }
}
