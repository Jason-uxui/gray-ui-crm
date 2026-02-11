"use client"

import * as React from "react"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Building01Icon,
  File01Icon,
  InboxIcon,
  LayoutIcon,
  SearchIcon,
  SparklesIcon,
  Task01Icon,
  Target01Icon,
  UserIcon,
  WorkflowCircle01Icon,
  CommandIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href?: string
  active?: boolean
  icon?: React.ComponentProps<typeof HugeiconsIcon>["icon"]
}

const quickActions: NavItem[] = [
  { label: "AI Assistant", icon: SparklesIcon },
  { label: "Inbox", icon: InboxIcon },
]

const workspaces: NavItem[] = [
  { label: "People", href: "/people", active: true, icon: UserIcon },
  { label: "Companies", href: "/companies", icon: Building01Icon },
  { label: "Opportunities", href: "/opportunities", icon: Target01Icon },
  { label: "Tasks", href: "/tasks", icon: Task01Icon },
  { label: "Notes", href: "/notes", icon: File01Icon },
  { label: "Workflows", href: "/workflows", icon: WorkflowCircle01Icon },
  { label: "Dashboard", href: "/dashboard", icon: LayoutIcon },
]

export function Sidebar() {
  return (
    <div className="flex h-full flex-col gap-2 p-2 py-3 text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2">
        <WorkspaceSwitcher />
        <SearchButton />
      </div>

      <nav className="flex flex-col gap-1">
        {quickActions.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 pt-2">
        <div className="px-2 text-sm font-medium text-muted-foreground">
          Workspaces
        </div>
        <nav className="flex flex-col gap-1">
          {workspaces.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </nav>
      </div>
    </div>
  )
}

function SidebarItem({ item }: { item: NavItem }) {
  const content = (
    <>
      {item.icon ? (
        <HugeiconsIcon
          icon={item.icon}
          strokeWidth={1.5}
          className={cn(
            "size-4 text-muted-foreground transition-colors",
            item.active && "text-sidebar-accent-foreground",
            !item.active && "group-hover:text-sidebar-foreground"
          )}
        />
      ) : null}
      <span className="flex-1 truncate text-left">{item.label}</span>
    </>
  )

  const classes = cn(
    "group flex h-7 w-full items-center gap-2 rounded-md px-2 text-sm leading-none text-sidebar-foreground transition-colors",
    "hover:bg-sidebar-accent/60",
    item.active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
  )

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={classes}
        aria-current={item.active ? "page" : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={classes}>
      {content}
    </button>
  )
}

function WorkspaceSwitcher() {
  return (
    <button
      type="button"
      className={cn(
        "flex w-fit cursor-pointer items-center gap-2 rounded-md px-1.5 py-2 text-sm font-semibold",
        "text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
      )}
    >
      <span className="flex size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <HugeiconsIcon icon={CommandIcon} strokeWidth={1.5} className="size-3" />
      </span>
      <span className="text-left text-sm leading-5">Acme Inc</span>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        strokeWidth={1.5}
        className="size-4 text-muted-foreground"
      />
    </button>
  )
}

function SearchButton() {
  return (
    <button
      type="button"
      className={cn(
        "group flex cursor-pointer items-center justify-center rounded-md p-2 text-sidebar-foreground",
        "transition-colors hover:bg-sidebar-accent/60"
      )}
      aria-label="Search"
    >
      <HugeiconsIcon
        icon={SearchIcon}
        strokeWidth={1.5}
        className="size-4 text-muted-foreground transition-colors group-hover:text-sidebar-foreground"
      />
    </button>
  )
}
