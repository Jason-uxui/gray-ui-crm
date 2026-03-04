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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { type CompanyRecord } from "@/lib/companies"
import {
  type ActivityType,
  type CompanyDetailWorkspaceTabId as WorkspaceTabId,
  calendarItems,
  emailItems,
  fileItems,
  noteItems,
  timelineGroupOrder,
  timelineItems,
} from "@/lib/company-detail-workspace-data"
import { type CompanyTaskItem } from "@/lib/company-tasks"
import { cn } from "@/lib/utils"

type ActivityFocus = "everything" | "conversations" | "meetings" | "emails" | "system"

const activityFocusOptions: { id: ActivityFocus; label: string }[] = [
  { id: "everything", label: "Everything" },
  { id: "conversations", label: "Conversations" },
  { id: "meetings", label: "Meetings" },
  { id: "emails", label: "Emails" },
  { id: "system", label: "System updates" },
]

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

function getActivityNodeClass() {
  return "bg-muted text-muted-foreground ring-border"
}

function flattenTimelineItems() {
  return timelineGroupOrder.flatMap((group) => timelineItems.filter((item) => item.group === group))
}

function isLowSignal(type: ActivityType) {
  return type === "status" || type === "workflow"
}

function matchesFocus(type: ActivityType, focus: ActivityFocus) {
  if (focus === "everything") return true
  if (focus === "conversations") return type === "note" || type === "status"
  if (focus === "meetings") return type === "meeting"
  if (focus === "emails") return type === "email"
  if (focus === "system") return type === "workflow"
  return true
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
  const [activityDraft, setActivityDraft] = React.useState("")
  const [showAllActivity, setShowAllActivity] = React.useState(true)
  const [activityFocus, setActivityFocus] = React.useState<ActivityFocus>("everything")
  const [expandedItemIds, setExpandedItemIds] = React.useState<Record<string, boolean>>({})
  const [expandedThreadIds, setExpandedThreadIds] = React.useState<Record<string, boolean>>({})
  const [composerFormatting, setComposerFormatting] = React.useState({
    bold: false,
    italic: false,
    underline: false,
  })
  const composerInputId = "timeline-activity-composer"
  const flattenedActivities = React.useMemo(() => flattenTimelineItems(), [])
  const visibleActivities = React.useMemo(
    () =>
      flattenedActivities
        .filter((item) => matchesFocus(item.type, activityFocus))
        .filter((item) => showAllActivity || !isLowSignal(item.type)),
    [activityFocus, flattenedActivities, showAllActivity]
  )

  const saveActivityDraft = () => {
    if (!activityDraft.trim()) return
    setActivityDraft("")
  }
  const hasFocusFilter = activityFocus !== "everything"
  const emptyTitle = showAllActivity ? "No activity to display" : "No key activity"
  const emptyDescription = showAllActivity
    ? hasFocusFilter
      ? "Try another activity focus to see more timeline events."
      : "Start by adding your first activity update for this account."
    : "Turn on show all activity to include low-signal and system updates."

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">Activity Log</h3>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 rounded-full px-2"
            aria-label="Toggle show all activity"
            aria-pressed={showAllActivity}
            onClick={() => setShowAllActivity((current) => !current)}
          >
            <span className="text-muted-foreground text-xs">Show all activity</span>
            <span
              className={cn(
                "inline-flex h-4 w-7 items-center rounded-full border p-0.5 transition-colors",
                showAllActivity ? "bg-primary/15 border-primary/30" : "bg-muted border-border"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-3 rounded-full bg-background shadow-xs transition-transform",
                  showAllActivity ? "translate-x-3" : "translate-x-0"
                )}
              />
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 rounded-full"
                  aria-label="Activity focus filter"
                />
              }
            >
              <HugeiconsIcon icon={SearchList01Icon} strokeWidth={1.8} className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {activityFocusOptions.map((option) => (
                <DropdownMenuItem key={option.id} onClick={() => setActivityFocus(option.id)}>
                  <span className="flex-1">{option.label}</span>
                  {activityFocus === option.id ? (
                    <span className="text-primary text-xs font-semibold">ON</span>
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2">
        <InputGroup className="h-10 min-w-0 rounded-xl">
          <InputGroupInput
            id={composerInputId}
            value={activityDraft}
            onChange={(event) => setActivityDraft(event.target.value)}
            placeholder="Comment or type '/' for comments"
            className="h-10 text-sm"
            aria-label="Activity composer"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                saveActivityDraft()
              }
            }}
          />
          <InputGroupAddon align="inline-end" className="gap-0.5 pr-1">
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              className="size-7 rounded-md text-sm"
              aria-label="Mention teammate"
            >
              @
            </InputGroupButton>
            <InputGroupButton
              variant={composerFormatting.bold ? "secondary" : "ghost"}
              size="icon-xs"
              className="size-7 rounded-md text-sm font-semibold"
              aria-label="Toggle bold"
              onClick={() =>
                setComposerFormatting((current) => ({ ...current, bold: !current.bold }))
              }
            >
              B
            </InputGroupButton>
            <InputGroupButton
              variant={composerFormatting.italic ? "secondary" : "ghost"}
              size="icon-xs"
              className="size-7 rounded-md text-sm italic"
              aria-label="Toggle italic"
              onClick={() =>
                setComposerFormatting((current) => ({ ...current, italic: !current.italic }))
              }
            >
              I
            </InputGroupButton>
            <InputGroupButton
              variant={composerFormatting.underline ? "secondary" : "ghost"}
              size="icon-xs"
              className="size-7 rounded-md text-sm underline"
              aria-label="Toggle underline"
              onClick={() =>
                setComposerFormatting((current) => ({
                  ...current,
                  underline: !current.underline,
                }))
              }
            >
              U
            </InputGroupButton>
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              className="size-7 rounded-md text-base leading-none"
              aria-label="More composer actions"
            >
              ...
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {visibleActivities.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-start gap-3 py-6">
            <Badge variant="outline">Empty</Badge>
            <div>
              <div className="text-sm font-medium">{emptyTitle}</div>
              <div className="text-muted-foreground text-sm">{emptyDescription}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById(composerInputId)?.focus()}
              >
                Log activity
              </Button>
              {(hasFocusFilter || !showAllActivity) ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAllActivity(true)
                    setActivityFocus("everything")
                  }}
                >
                  Reset view
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <div className="bg-border absolute top-2 bottom-2 left-2.5 w-px" />
          <div className="space-y-4">
            {visibleActivities.map((item) => {
              const activityIcon = getTimelineActivityIcon(item.type)
              const isExpanded = Boolean(expandedItemIds[item.id])
              const isThreadExpanded = Boolean(expandedThreadIds[item.id])
              const threadComments = item.reviewThread?.comments ?? []
              const threadCommentsToRender = isThreadExpanded
                ? threadComments
                : threadComments.slice(0, 1)
              const hiddenThreadCount = threadComments.length - threadCommentsToRender.length
              const previewSnippet =
                item.summary ?? item.emailPreview?.snippet ?? threadComments[0]?.body ?? ""
              const hasExpandableContent = Boolean(
                item.summary ||
                  item.emailPreview ||
                  item.reviewThread ||
                  item.relatedLabel ||
                  item.meetingChips?.length ||
                  item.participants?.length
              )
              const visibleParticipants = item.participants?.slice(0, 3) ?? []
              const remainingParticipants = (item.participants?.length ?? 0) - visibleParticipants.length

              return (
                <article key={item.id} className="group relative pl-9">
                  <span
                    className={cn(
                      "absolute top-1 left-0 inline-flex size-5 items-center justify-center rounded-full ring-1",
                      getActivityNodeClass()
                    )}
                  >
                    <HugeiconsIcon icon={activityIcon} strokeWidth={1.9} className="size-3" />
                  </span>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 text-sm leading-relaxed">
                        <span className="font-medium">{item.actor}</span>{" "}
                        <span className="text-muted-foreground">{item.action}</span>{" "}
                        <span className="font-medium">{item.target}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground text-xs">{item.time}</span>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                          {(item.type === "note" || item.type === "email") ? (
                            <Button variant="ghost" size="icon-xs" className="size-6" aria-label="Reply to activity">
                              R
                            </Button>
                          ) : null}
                          <Button variant="ghost" size="icon-xs" className="size-6" aria-label="More activity actions">
                            ...
                          </Button>
                        </div>
                      </div>
                    </div>

                    {previewSnippet ? (
                      <p className="text-muted-foreground overflow-hidden text-sm [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">
                        {previewSnippet}
                      </p>
                    ) : null}

                    {hasExpandableContent ? (
                      <button
                        type="button"
                        className="text-primary text-xs font-medium hover:underline"
                        onClick={() =>
                          setExpandedItemIds((current) => ({
                            ...current,
                            [item.id]: !current[item.id],
                          }))
                        }
                      >
                        {isExpanded ? "Hide details" : "View details"}
                      </button>
                    ) : null}

                    {isExpanded ? (
                      <div className="space-y-2 rounded-xl border bg-background/80 p-3">
                        {item.emailPreview ? (
                          <div className="rounded-lg border bg-muted/20 p-3">
                            <div className="text-sm font-medium">{item.emailPreview.subject}</div>
                            <div className="text-muted-foreground mt-1 text-xs">From {item.emailPreview.from}</div>
                            <div className="text-muted-foreground text-xs">To {item.emailPreview.to}</div>
                            <div className="text-muted-foreground mt-2 text-sm">{item.emailPreview.snippet}</div>
                          </div>
                        ) : null}

                        {!item.emailPreview && item.summary ? (
                          <p className="text-muted-foreground text-sm leading-relaxed">{item.summary}</p>
                        ) : null}

                        {item.reviewThread ? (
                          <div className="space-y-2 rounded-lg bg-muted/30 p-2.5">
                            <div className="text-sm font-medium">{item.reviewThread.title}</div>
                            {threadCommentsToRender.map((comment) => (
                              <div key={comment.id} className="rounded-md border bg-background/90 p-2.5">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="text-xs font-medium">
                                    {comment.author} · <span className="text-muted-foreground">{comment.role}</span>
                                  </div>
                                  <span className="text-muted-foreground text-xs">{comment.time}</span>
                                </div>
                                <div className="text-muted-foreground mt-1 text-sm">{comment.body}</div>
                              </div>
                            ))}
                            {threadComments.length > 1 ? (
                              <button
                                type="button"
                                className="text-primary text-xs font-medium hover:underline"
                                onClick={() =>
                                  setExpandedThreadIds((current) => ({
                                    ...current,
                                    [item.id]: !current[item.id],
                                  }))
                                }
                              >
                                {isThreadExpanded
                                  ? "Show fewer replies"
                                  : `View ${hiddenThreadCount} more ${hiddenThreadCount === 1 ? "reply" : "replies"}`}
                              </button>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="h-5 rounded-full px-2 capitalize">
                            {item.type}
                          </Badge>

                          {item.relatedLabel ? (
                            <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
                              {item.relatedLabel}
                            </span>
                          ) : null}

                          {item.meetingChips?.length ? (
                            <>
                              {item.meetingChips.map((chip) => (
                                <Badge key={chip} variant="secondary" className="h-5 rounded-full px-2 text-[11px]">
                                  {chip}
                                </Badge>
                              ))}
                            </>
                          ) : null}

                          {visibleParticipants.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {visibleParticipants.map((participant, index) => (
                                  <span
                                    key={participant}
                                    className={cn(
                                      "bg-muted text-muted-foreground inline-flex size-6 items-center justify-center rounded-full border text-[10px] font-semibold",
                                      index > 0 && "-ml-1.5"
                                    )}
                                    title={participant}
                                  >
                                    {getInitials(participant)}
                                  </span>
                                ))}
                              </div>
                              {remainingParticipants > 0 ? (
                                <span className="text-muted-foreground text-xs">
                                  and {remainingParticipants} others
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
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
