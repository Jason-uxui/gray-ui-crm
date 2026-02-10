"use client"

import * as React from "react"

import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href?: string
  active?: boolean
}

const quickActions: NavItem[] = [
  { label: "Search" },
  { label: "AI Assistant" },
  { label: "Inbox" },
]

const workspaces: NavItem[] = [
  { label: "People", href: "/people", active: true },
  { label: "Companies", href: "/companies" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Tasks", href: "/tasks" },
  { label: "Notes", href: "/notes" },
  { label: "Workflows", href: "/workflows" },
  { label: "Dashboard", href: "/dashboard" },
]

export function Sidebar() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border text-sm font-semibold">
          AC
        </div>
        <div className="text-sm font-semibold">Acme Inc</div>
      </div>

      <Input placeholder="Search" />

      <div className="space-y-1">
        {quickActions.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="text-xs font-medium uppercase text-muted-foreground">
          Workspaces
        </div>
        <div className="space-y-1">
          {workspaces.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ item }: { item: NavItem }) {
  if (item.href) {
    return (
      <Link
        href={item.href}
        className={cn(
          buttonVariants({ variant: item.active ? "secondary" : "ghost" }),
          "w-full justify-start",
          item.active && "font-medium"
        )}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <Button
      variant="ghost"
      className={cn("w-full justify-start", item.active && "font-medium")}
    >
      {item.label}
    </Button>
  )
}
