"use client"

import * as React from "react"

import {
  Alert02Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  Note01Icon,
  SearchList01Icon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CompanyTaskBoard } from "@/components/companies/tasks/company-task-board"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { type CompanyRecord } from "@/lib/companies"
import {
  type ActivityFilterId,
  type ActivityType,
  type ActivityItem,
  type CompanyDetailWorkspaceTabId as WorkspaceTabId,
  type TimelineGroup,
  calendarItems,
  emailItems,
  fileItems,
  noteItems,
  timelineFilterOptions,
  timelineGroupOrder,
  timelineItems,
} from "@/lib/company-detail-workspace-data"
import { type CompanyTaskItem } from "@/lib/company-tasks"
import { cn } from "@/lib/utils"

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function getTimelineActivityIcon(type: ActivityType) {
  if (type === "meeting") return Calendar03Icon
  if (type === "status") return CheckmarkCircle01Icon
  if (type === "email") return SearchList01Icon
  if (type === "note") return Note01Icon
  if (type === "workflow") return TaskDone01Icon
  return SearchList01Icon
}

function getTimelineActivityToneClass(type: ActivityType) {
  if (type === "meeting") return "border-sky-200 bg-sky-50 text-sky-700"
  if (type === "status") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (type === "email") return "border-violet-200 bg-violet-50 text-violet-700"
  if (type === "note") return "border-amber-200 bg-amber-50 text-amber-700"
  if (type === "workflow") return "border-zinc-200 bg-zinc-100 text-zinc-700"
  return "border-muted bg-muted text-muted-foreground"
}

function EmptyWorkspaceState({
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  title: string
  description: string
  primaryAction: string
  secondaryAction: string
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-start gap-3 py-6">
        <Badge variant="outline">Empty</Badge>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-muted-foreground text-sm">{description}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button>{primaryAction}</Button>
          <Button variant="outline">{secondaryAction}</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorWorkspaceState() {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive inline-flex items-center gap-2">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={1.6} className="size-4" />
          Failed to load records
        </CardTitle>
        <CardDescription>Refresh the page or try another tab.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline">Retry</Button>
      </CardContent>
    </Card>
  )
}

function TimelineTab() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeFilter, setActiveFilter] = React.useState<ActivityFilterId>("all")
  const [composerOpen, setComposerOpen] = React.useState(false)

  const filteredActivities = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return timelineItems.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.type === activeFilter
      const matchesQuery =
        query.length === 0 ||
        `${item.actor} ${item.action} ${item.target} ${item.summary ?? ""} ${item.relatedLabel ?? ""} ${item.meetingChips?.join(" ") ?? ""} ${item.emailPreview?.subject ?? ""} ${item.emailPreview?.snippet ?? ""} ${item.emailPreview?.from ?? ""} ${item.emailPreview?.to ?? ""} ${item.reviewThread?.title ?? ""} ${(item.reviewThread?.comments ?? []).map((comment) => `${comment.author} ${comment.body}`).join(" ")}`
          .toLowerCase()
          .includes(query)

      return matchesFilter && matchesQuery
    })
  }, [activeFilter, searchQuery])

  const groupedActivities = React.useMemo<Record<TimelineGroup, ActivityItem[]>>(() => {
    const grouped: Record<TimelineGroup, ActivityItem[]> = {
      Upcoming: [],
      Today: [],
      Yesterday: [],
      "This week": [],
      Earlier: [],
    }

    filteredActivities.forEach((item) => {
      grouped[item.group].push(item)
    })

    return grouped
  }, [filteredActivities])

  const activeFilterLabel =
    timelineFilterOptions.find((option) => option.id === activeFilter)?.label ?? "All activities"

  const visibleGroups = timelineGroupOrder.filter((group) => groupedActivities[group].length > 0)

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="inline-flex items-center gap-1.5">
            <HugeiconsIcon icon={SearchList01Icon} strokeWidth={1.6} className="size-4" />
            Timeline
          </CardTitle>
          <CardDescription>
            Search and filter activity across meetings, emails, notes, and workflow updates.
          </CardDescription>
        </CardHeader>
        <div className="px-6 py-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search activity"
              className="h-9 min-w-55 flex-1"
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" className="h-9" aria-label="Filter activity" />}
              >
                {activeFilterLabel}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {timelineFilterOptions.map((option) => (
                  <DropdownMenuItem key={option.id} onClick={() => setActiveFilter(option.id)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-9" onClick={() => setComposerOpen((open) => !open)}>
              {composerOpen ? "Close composer" : "Log new activity"}
            </Button>
          </div>

          {composerOpen ? (
            <div className="rounded-md border border-dashed p-3">
              <Textarea placeholder="Write an update for this company..." rows={3} />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Meeting
                  </Button>
                  <Button variant="outline" size="sm">
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    Note
                  </Button>
                </div>
                <Button size="sm">Save activity</Button>
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      {visibleGroups.length === 0 ? (
        <EmptyWorkspaceState
          title="No matching activity"
          description="Try another filter or log a fresh update for this account."
          primaryAction="Log activity"
          secondaryAction="Clear filters"
        />
      ) : (
        <Card>
          <div className="px-6 py-4 space-y-5">
            {visibleGroups.map((group) => (
              <section key={group} className="space-y-3">
                <div className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {group}
                </div>

                <div className="relative space-y-3">
                  <div className="bg-border absolute top-2 bottom-2 left-4 w-px" />

                  {groupedActivities[group].map((item) => {
                    const activityIcon = getTimelineActivityIcon(item.type)

                    return (
                      <article key={item.id} className="relative pl-11">
                        <span
                          className={cn(
                            "absolute top-1 left-0 inline-flex size-8 items-center justify-center rounded-full border",
                            getTimelineActivityToneClass(item.type)
                          )}
                        >
                          <HugeiconsIcon icon={activityIcon} strokeWidth={1.8} className="size-4" />
                        </span>

                        <div className="rounded-md border p-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="text-sm leading-relaxed">
                              <span className="font-medium">{item.actor}</span>{" "}
                              <span className="text-muted-foreground">{item.action}</span>{" "}
                              <span className="font-medium">{item.target}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">{item.time}</span>
                          </div>

                          {item.summary ? (
                            <div className="text-muted-foreground mt-1 text-sm">{item.summary}</div>
                          ) : null}

                          {item.meetingChips?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {item.meetingChips.map((chip) => (
                                <Badge key={chip} variant="secondary" className="h-6 rounded-full px-2 text-[11px]">
                                  {chip}
                                </Badge>
                              ))}
                            </div>
                          ) : null}

                          {item.emailPreview ? (
                            <div className="mt-3 rounded-md border bg-muted/25 p-3">
                              <div className="text-sm font-medium">{item.emailPreview.subject}</div>
                              <div className="text-muted-foreground mt-1 text-xs">
                                From {item.emailPreview.from}
                              </div>
                              <div className="text-muted-foreground text-xs">To {item.emailPreview.to}</div>
                              <div className="text-muted-foreground mt-2 text-sm">
                                {item.emailPreview.snippet}
                              </div>
                            </div>
                          ) : null}

                          {item.reviewThread ? (
                            <div className="mt-3 space-y-2 rounded-md border bg-muted/25 p-3">
                              <div className="text-sm font-medium">{item.reviewThread.title}</div>
                              <div className="space-y-2">
                                {item.reviewThread.comments.map((comment) => (
                                  <div key={comment.id} className="rounded-md border bg-background/80 p-2.5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="text-xs font-medium">
                                        {comment.author} ·{" "}
                                        <span className="text-muted-foreground">{comment.role}</span>
                                      </div>
                                      <span className="text-muted-foreground text-xs">{comment.time}</span>
                                    </div>
                                    <div className="text-muted-foreground mt-1 text-sm">{comment.body}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {item.type}
                            </Badge>

                            {item.relatedLabel ? (
                              <span className="text-muted-foreground rounded-md border px-2 py-0.5 text-xs">
                                {item.relatedLabel}
                              </span>
                            ) : null}

                            {item.participants?.length ? (
                              <div className="flex items-center gap-1.5">
                                {item.participants.slice(0, 3).map((participant) => (
                                  <span
                                    key={participant}
                                    className="bg-muted text-muted-foreground inline-flex size-6 items-center justify-center rounded-full text-[10px] font-semibold"
                                    title={participant}
                                  >
                                    {getInitials(participant)}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function TasksTab({
  company,
  tasks,
  onTasksChange,
}: {
  company: CompanyRecord
  tasks: CompanyTaskItem[]
  onTasksChange: (next: CompanyTaskItem[]) => void
}) {
  return <CompanyTaskBoard tasks={tasks} onTasksChange={onTasksChange} companyId={company.id} />
}

function NotesTab() {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="inline-flex items-center gap-1.5">
            <HugeiconsIcon icon={Note01Icon} strokeWidth={1.6} className="size-4" />
            Add note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-4">
          <Input placeholder="Note title" />
          <Textarea placeholder="Write context and next actions..." rows={4} />
          <div className="flex justify-end">
            <Button size="sm">Save note</Button>
          </div>
        </CardContent>
      </Card>

      {noteItems.length === 0 ? (
        <EmptyWorkspaceState
          title="No notes yet"
          description="Document customer context to keep the team aligned."
          primaryAction="Create note"
          secondaryAction="Import notes"
        />
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 py-4">
              {noteItems.map((note) => (
                <div key={note.id} className="rounded-md border p-3">
                  <div className="text-sm font-medium">
                    {note.author} · <span className="text-muted-foreground">{note.time}</span>
                  </div>
                  <div className="text-muted-foreground mt-1 text-sm">{note.body}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="outline" size="sm">
              Add note
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function FilesTab() {
  if (fileItems.length === 0) {
    return (
      <EmptyWorkspaceState
        title="No files attached"
        description="Attach proposals, contracts, and requirement docs."
        primaryAction="Upload file"
        secondaryAction="Create folder"
      />
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-4">
        {fileItems.map((file) => (
          <div key={file.id} className="rounded-md border p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">{file.name}</div>
              <Badge variant="outline">{file.type}</Badge>
            </div>
            <div className="text-muted-foreground mt-1 text-sm">
              {file.size} · Updated {file.updatedAt}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function EmailsTab() {
  if (emailItems.length === 0) {
    return (
      <EmptyWorkspaceState
        title="No email activity"
        description="Sync mailbox to track customer communication in one place."
        primaryAction="Connect email"
        secondaryAction="Log manual email"
      />
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Emails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-4">
        {emailItems.map((email) => (
          <div key={email.id} className="rounded-md border p-3">
            <div className="text-sm font-medium">{email.subject}</div>
            <div className="text-muted-foreground mt-1 text-sm">
              From {email.from} · {email.date}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function CalendarTab() {
  if (calendarItems.length === 0) {
    return (
      <EmptyWorkspaceState
        title="No events scheduled"
        description="Create meetings to align decision-makers and next steps."
        primaryAction="Schedule event"
        secondaryAction="Share availability"
      />
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Upcoming meetings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-4">
        {calendarItems.map((item) => (
          <div key={item.id} className="rounded-md border p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">{item.title}</div>
              <span className="text-muted-foreground text-xs">{item.owner}</span>
            </div>
            <div className="text-muted-foreground mt-1 text-sm">{item.date}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function CompanyDetailWorkspaceTabPanel({
  activeTab,
  company,
  tasks,
  onTasksChange,
}: {
  activeTab: WorkspaceTabId
  company: CompanyRecord
  tasks: CompanyTaskItem[]
  onTasksChange: (next: CompanyTaskItem[]) => void
}) {
  if (activeTab === "timeline") return <TimelineTab />
  if (activeTab === "tasks") return <TasksTab company={company} tasks={tasks} onTasksChange={onTasksChange} />
  if (activeTab === "notes") return <NotesTab />
  if (activeTab === "files") return <FilesTab />
  if (activeTab === "emails") return <EmailsTab />
  if (activeTab === "calendar") return <CalendarTab />
  return <ErrorWorkspaceState />
}
