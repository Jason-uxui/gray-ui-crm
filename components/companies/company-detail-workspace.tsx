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

import { getCompanyBrandPresentation } from "@/components/companies/company-brand"
import { EntityPickerDropdown, type EntityPickerOption } from "@/components/companies/entity-picker-dropdown"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  type CompanyRecord,
  formatCompanyCreatedAt,
  formatCompanyEmployeeCount,
  getCompanyAccountOwner,
  getCompanyCreatedBy,
  getCompanyUpdatedBy,
} from "@/lib/companies"
import { useCompanyTaskSession } from "@/lib/company-task-session-store"
import { OPPORTUNITY_OPTIONS, getOpportunityById } from "@/lib/opportunities"
import { PEOPLE_OPTIONS, getPersonNameById } from "@/lib/people"
import { cn } from "@/lib/utils"

type WorkspaceTabId = "timeline" | "tasks" | "notes" | "files" | "emails" | "calendar"
type ProfileFieldId = "domain" | "employees" | "linkedin" | "address"
type TimelineGroup = "Upcoming" | "Today" | "Yesterday" | "This week" | "Earlier"
type ActivityType = "status" | "meeting" | "email" | "note" | "workflow"
type ActivityFocus = "everything" | "conversations" | "meetings" | "emails" | "system"

type EmailPreview = {
  subject: string
  from: string
  to: string
  snippet: string
}

type ReviewThreadComment = {
  id: string
  author: string
  role: string
  body: string
  time: string
}

type ActivityItem = {
  id: string
  type: ActivityType
  actor: string
  action: string
  target: string
  summary?: string
  group: TimelineGroup
  time: string
  participants?: string[]
  relatedLabel?: string
  meetingChips?: string[]
  emailPreview?: EmailPreview
  reviewThread?: {
    title: string
    comments: ReviewThreadComment[]
  }
}

type NoteItem = {
  id: string
  author: string
  body: string
  time: string
}

type FileItem = {
  id: string
  name: string
  type: string
  size: string
  updatedAt: string
}

type EmailItem = {
  id: string
  subject: string
  from: string
  date: string
}

type CalendarItem = {
  id: string
  title: string
  date: string
  owner: string
}

const workspaceTabs: { id: WorkspaceTabId; label: string }[] = [
  { id: "timeline", label: "Timeline" },
  { id: "tasks", label: "Tasks" },
  { id: "notes", label: "Notes" },
  { id: "files", label: "Files" },
  { id: "emails", label: "Emails" },
  { id: "calendar", label: "Calendar" },
]

const timelineItems: ActivityItem[] = [
  {
    id: "a-1",
    type: "meeting",
    actor: "Yuri Santos",
    action: "scheduled",
    target: "Quarterly success review",
    summary: "Jan 12, 2026 · 8:15 AM to 9:45 AM · Google Meet",
    group: "Upcoming",
    time: "In 2 hours",
    participants: ["Yuri Santos", "Alex Kim"],
    relatedLabel: "Google Meet",
    meetingChips: ["Quarterly review", "Decision call", "Google Meet"],
  },
  {
    id: "a-2",
    type: "status",
    actor: "Santos Nitzsche",
    action: "changed status in",
    target: "IC List to In Review",
    summary: "Legal approved the compliance controls draft after review.",
    group: "Today",
    time: "3 hours ago",
  },
  {
    id: "a-3",
    type: "email",
    actor: "Yuri Santos",
    action: "replied to an email from",
    target: "Jerry Halfer",
    summary:
      "Thanks for the demo. The team will continue testing this week and share follow-up questions.",
    group: "Yesterday",
    time: "Yesterday · 18:24",
    relatedLabel: "CodeCraft Follow Up",
    emailPreview: {
      subject: "Re: Follow-up on enterprise rollout",
      from: "Yuri Santos <yuri@codecraft.io>",
      to: "Jerry Halfer <jerry@atlasglobal.com>",
      snippet:
        "Thanks for the demo. We will finish sandbox testing this week and share a final security checklist before Friday.",
    },
  },
  {
    id: "a-4",
    type: "note",
    actor: "Monty Hayton",
    action: "added a note",
    target: "Procurement blockers",
    summary: "Buyer requested an updated vendor risk matrix and migration checklist.",
    group: "This week",
    time: "2 days ago",
    reviewThread: {
      title: "Legal review thread",
      comments: [
        {
          id: "rt-1",
          author: "Marisa Cole",
          role: "Legal",
          body: "Please attach the latest DPA redlines before procurement submits final approval.",
          time: "2 days ago",
        },
        {
          id: "rt-2",
          author: "Monty Hayton",
          role: "Account executive",
          body: "Shared with buyer and scheduled a review call for tomorrow at 9:30 AM.",
          time: "1 day ago",
        },
      ],
    },
  },
  {
    id: "a-5",
    type: "workflow",
    actor: "Ops workflow",
    action: "completed",
    target: "Financial records import",
    summary: "QuickBooks and Stripe records were normalized for Q2 analysis.",
    group: "This week",
    time: "2 days ago",
  },
  {
    id: "a-6",
    type: "meeting",
    actor: "Melisa Pinto",
    action: "hosted",
    target: "Implementation kick-off",
    summary: "10:30 AM to 11:15 AM · Ho Chi Minh City · Zoom",
    group: "Today",
    time: "5 hours ago",
    participants: ["Melisa Pinto", "William Cooper", "Olivia Emmanuel", "Lara Kim"],
    relatedLabel: "Zoom",
    meetingChips: ["Kick-off", "Project scope"],
  },
  {
    id: "a-7",
    type: "email",
    actor: "Brianna Clinton",
    action: "sent a follow-up to",
    target: "Security team",
    summary: "Shared answers for SSO, audit logging, and data retention questions.",
    group: "Today",
    time: "7 hours ago",
    relatedLabel: "Security Q&A",
    emailPreview: {
      subject: "Re: Security questionnaire clarifications",
      from: "Brianna Clinton <brianna@timeless.io>",
      to: "security@atlasglobal.com",
      snippet:
        "Attached the updated answers for SSO and audit logging. Let us know if your team needs a short walkthrough this week.",
    },
  },
  {
    id: "a-8",
    type: "status",
    actor: "William Cooper",
    action: "updated milestone in",
    target: "Onboarding plan",
    summary: "Pilot timeline confirmed with IT team and procurement.",
    group: "Yesterday",
    time: "Yesterday · 09:40",
  },
  {
    id: "a-9",
    type: "note",
    actor: "Olivia Emmanuel",
    action: "added a note",
    target: "Contract redline summary",
    summary: "Legal asked for explicit language on data residency and sub-processor notice.",
    group: "This week",
    time: "4 days ago",
    reviewThread: {
      title: "Procurement thread",
      comments: [
        {
          id: "rt-3",
          author: "Olivia Emmanuel",
          role: "Legal",
          body: "Please include fallback SLA language for incident response in the draft.",
          time: "4 days ago",
        },
        {
          id: "rt-4",
          author: "Yuri Santos",
          role: "Account manager",
          body: "Noted. We will add it and send a clean redline before noon tomorrow.",
          time: "3 days ago",
        },
        {
          id: "rt-5",
          author: "Melisa Pinto",
          role: "Customer success",
          body: "Also confirm if notice window can be reduced from 30 to 15 days.",
          time: "3 days ago",
        },
      ],
    },
  },
  {
    id: "a-10",
    type: "workflow",
    actor: "RevOps automation",
    action: "generated",
    target: "Renewal risk digest",
    summary: "Detected two open dependencies: security review and billing entity verification.",
    group: "This week",
    time: "5 days ago",
  },
  {
    id: "a-11",
    type: "meeting",
    actor: "Sonny Lee",
    action: "scheduled",
    target: "Stakeholder alignment call",
    summary: "Monday · 2:00 PM to 2:45 PM · Google Meet",
    group: "Earlier",
    time: "8 days ago",
    participants: ["Sonny Lee", "Brianna Clinton", "Lara Kim", "William Cooper", "Alex Kim"],
    relatedLabel: "Google Meet",
    meetingChips: ["Stakeholders", "Roadmap"],
  },
  {
    id: "a-12",
    type: "email",
    actor: "Lara Kim",
    action: "replied to",
    target: "Procurement committee",
    summary: "Confirmed pricing guardrails and invoicing cadence for annual contract.",
    group: "Earlier",
    time: "10 days ago",
    relatedLabel: "Commercial terms",
    emailPreview: {
      subject: "Re: Annual agreement commercial terms",
      from: "Lara Kim <lara@timeless.io>",
      to: "procurement@atlasglobal.com",
      snippet:
        "We can align on annual invoicing with net 30 terms. Sharing an updated quote with itemized onboarding services.",
    },
  },
  {
    id: "a-13",
    type: "status",
    actor: "Monty Hayton",
    action: "moved deal stage to",
    target: "Final review",
    summary: "All approvers identified and timeline confirmed for final sign-off.",
    group: "Earlier",
    time: "12 days ago",
  },
  {
    id: "a-14",
    type: "workflow",
    actor: "Ops workflow",
    action: "synced",
    target: "CRM and billing contacts",
    summary: "Found 3 duplicate contacts and merged records automatically.",
    group: "Earlier",
    time: "14 days ago",
  },
]

const timelineGroupOrder: TimelineGroup[] = ["Upcoming", "Today", "Yesterday", "This week", "Earlier"]
const activityFocusOptions: { id: ActivityFocus; label: string }[] = [
  { id: "everything", label: "Everything" },
  { id: "conversations", label: "Conversations" },
  { id: "meetings", label: "Meetings" },
  { id: "emails", label: "Emails" },
  { id: "system", label: "System updates" },
]

const noteItems: NoteItem[] = [
  {
    id: "n-1",
    author: "Sales",
    body: "The buyer requested a side-by-side comparison with the current vendor.",
    time: "Today",
  },
  {
    id: "n-2",
    author: "CSM",
    body: "Technical workshop planned for next week with platform and security teams.",
    time: "Yesterday",
  },
]

const fileItems: FileItem[] = [
  {
    id: "f-1",
    name: "Security-Questionnaire-v3.pdf",
    type: "PDF",
    size: "1.8 MB",
    updatedAt: "2 days ago",
  },
]

const emailItems: EmailItem[] = [
  {
    id: "e-1",
    subject: "Follow-up on enterprise rollout",
    from: "buyer@company.com",
    date: "Today",
  },
]

const calendarItems: CalendarItem[] = [
  {
    id: "c-1",
    title: "Technical deep-dive",
    date: "Wed, Mar 12 · 10:00",
    owner: "Account owner",
  },
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

function flattenTimelineItems(groupOrder: TimelineGroup[], items: ActivityItem[]) {
  return groupOrder.flatMap((group) => items.filter((item) => item.group === group))
}

function isLowSignal(item: ActivityItem) {
  return item.type === "status" || item.type === "workflow"
}

function matchesFocus(item: ActivityItem, focus: ActivityFocus) {
  if (focus === "everything") return true
  if (focus === "conversations") return item.type === "note" || item.type === "status"
  if (focus === "meetings") return item.type === "meeting"
  if (focus === "emails") return item.type === "email"
  if (focus === "system") return item.type === "workflow"
  return true
}

function RelationToken({
  label,
  leading,
  onRemove,
}: {
  label: string
  leading?: React.ReactNode
  onRemove: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="bg-muted hover:bg-muted/80 h-auto rounded-md border px-2 py-1 text-sm font-normal"
            aria-label={`${label} actions`}
          />
        }
      >
        <span className="inline-flex items-center gap-1.5">
          {leading}
          <span>{label}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        <DropdownMenuItem variant="destructive" onClick={onRemove}>
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
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
  const flattenedActivities = React.useMemo(
    () => flattenTimelineItems(timelineGroupOrder, timelineItems),
    []
  )
  const visibleActivities = React.useMemo(
    () =>
      flattenedActivities
        .filter((item) => matchesFocus(item, activityFocus))
        .filter((item) => showAllActivity || !isLowSignal(item)),
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
  tasks: ReturnType<typeof useCompanyTaskSession>["tasks"]
  onTasksChange: ReturnType<typeof useCompanyTaskSession>["setTasks"]
}) {
  return (
    <CompanyTaskBoard
      tasks={tasks}
      onTasksChange={onTasksChange}
      companyId={company.id}
    />
  )
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

function CompanySidebar({
  company,
  onCompanyChange,
}: {
  company: CompanyRecord
  onCompanyChange: (updater: (current: CompanyRecord) => CompanyRecord) => void
}) {
  const brand = getCompanyBrandPresentation(company.id, company.name)
  const createdByLabel = getCompanyCreatedBy(company)
  const updatedByLabel = getCompanyUpdatedBy(company)
  const accountOwnerLabel = getCompanyAccountOwner(company)

  const [editingField, setEditingField] = React.useState<ProfileFieldId | null>(null)
  const [draftValue, setDraftValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const skipBlurCommitRef = React.useRef(false)

  const ownerPeopleOptions = React.useMemo<EntityPickerOption[]>(
    () =>
      PEOPLE_OPTIONS.filter((person) => person.id !== "system").map((person) => ({
        id: person.id,
        label: person.name,
      })),
    []
  )

  const relationPeopleOptions = React.useMemo<EntityPickerOption[]>(
    () => PEOPLE_OPTIONS.map((person) => ({ id: person.id, label: person.name })),
    []
  )

  const availablePeople = PEOPLE_OPTIONS.filter(
    (person) => person.id !== "system" && !(company.peopleIds ?? []).includes(person.id)
  )

  const availablePeoplePickerOptions: EntityPickerOption[] = availablePeople.map((person) => ({
    id: person.id,
    label: person.name,
    leading: (
      <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
        {person.name.trim().charAt(0).toUpperCase()}
      </span>
    ),
  }))

  const availableOpportunities = OPPORTUNITY_OPTIONS.filter(
    (item) => !(company.opportunityIds ?? []).includes(item.id)
  )

  const availableOpportunitiesPickerOptions: EntityPickerOption[] = availableOpportunities.map((item) => ({
    id: item.id,
    label: item.name,
    leading: (
      <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
        {item.name.trim().charAt(0).toUpperCase()}
      </span>
    ),
  }))

  const profileFields: {
    id: ProfileFieldId
    label: string
    value: string
    placeholder: string
    inputType?: "text" | "number"
  }[] = [
    {
      id: "domain",
      label: "Domain",
      value: company.domain ?? "",
      placeholder: "Add domain",
    },
    {
      id: "employees",
      label: "Employees",
      value: formatCompanyEmployeeCount(company.employees),
      placeholder: "Add employee count",
      inputType: "number",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: company.linkedin ?? "",
      placeholder: "Add LinkedIn profile",
    },
    {
      id: "address",
      label: "Address",
      value: company.address ?? "",
      placeholder: "Add address",
    },
  ]

  const getCurrentValue = (fieldId: ProfileFieldId) => {
    switch (fieldId) {
      case "domain":
        return company.domain ?? ""
      case "employees":
        return typeof company.employees === "number" ? String(company.employees) : ""
      case "linkedin":
        return company.linkedin ?? ""
      case "address":
        return company.address ?? ""
      default:
        return ""
    }
  }

  const resetEditState = () => {
    setEditingField(null)
    setDraftValue("")
    setError(null)
  }

  const startEditing = (fieldId: ProfileFieldId) => {
    skipBlurCommitRef.current = false
    setEditingField(fieldId)
    setDraftValue(getCurrentValue(fieldId))
    setError(null)
  }

  const cancelEditing = () => {
    skipBlurCommitRef.current = true
    resetEditState()
  }

  const saveEditing = () => {
    if (!editingField) return

    if (editingField === "employees" && draftValue.trim()) {
      const parsed = Number(draftValue.trim().replaceAll(",", ""))
      if (Number.isNaN(parsed)) {
        setError("Employees must be a valid number")
        return
      }
    }

    onCompanyChange((current) => {
      const trimmed = draftValue.trim()

      if (editingField === "employees") {
        if (!trimmed) return { ...current, employees: undefined }
        const parsed = Number(trimmed.replaceAll(",", ""))
        if (Number.isNaN(parsed)) return current
        return { ...current, employees: parsed }
      }

      if (editingField === "domain") return { ...current, domain: trimmed || undefined }
      if (editingField === "linkedin") return { ...current, linkedin: trimmed || undefined }
      if (editingField === "address") return { ...current, address: trimmed || undefined }

      return current
    })

    skipBlurCommitRef.current = false
    resetEditState()
  }

  const commitFromBlurOrEnter = () => {
    if (skipBlurCommitRef.current) {
      skipBlurCommitRef.current = false
      return
    }

    saveEditing()
  }

  const companyIdLabel = company.id.replace(/^c-/, "").padStart(4, "0")

  return (
    <div className="space-y-3">
      <Card className="border-zinc-200/80 bg-gradient-to-b from-zinc-50/60 to-background">
        <CardHeader className="space-y-4 pb-3">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "inline-flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-background text-base font-semibold shadow-sm",
                brand.className
              )}
            >
              {brand.icon ? (
                <HugeiconsIcon icon={brand.icon} strokeWidth={2} className="size-5" />
              ) : (
                brand.fallback
              )}
            </span>
            <div className="min-w-0 space-y-1">
              <CardTitle className="truncate text-lg">{company.name}</CardTitle>
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <span>#{companyIdLabel}</span>
                <span>•</span>
                <span>{formatCompanyCreatedAt(company.createdAtMinutes)}</span>
              </div>
              <Badge variant="outline" className="h-6 rounded-full px-2.5 text-xs font-medium">
                Pending
              </Badge>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border bg-background/80 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs">Account owner</span>
              <span className="text-sm font-medium">{accountOwnerLabel || "Unassigned"}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs">Account health</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={1.6} className="size-4" />
                On Track
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs">Last editor</span>
              <span className="text-sm font-medium">{updatedByLabel || "System"}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" className="h-8 px-2 text-xs">
              Log
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-2 text-xs">
              Task
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-2 text-xs">
              Note
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ownership & profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 py-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Ownership</div>

            <div className="grid grid-cols-[120px_minmax(0,_1fr)] items-start gap-2 py-1">
              <div className="text-muted-foreground pt-1 text-sm">Created by</div>
              <EntityPickerDropdown
                trigger="badge"
                valueId={company.createdById}
                valueLabel={createdByLabel}
                placeholder="System"
                options={relationPeopleOptions}
                searchPlaceholder="Search person..."
                emptySearchLabel="No person found."
                contentClassName="w-64"
                align="start"
                showAvatarFallback
                onOpen={() => {
                  setEditingField(null)
                  setError(null)
                }}
                onSelect={(personId) => {
                  onCompanyChange((current) => ({
                    ...current,
                    createdById: personId,
                    createdBy: getPersonNameById(personId, current.createdBy),
                  }))
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-[120px_minmax(0,_1fr)] items-start gap-2 py-1">
            <div className="text-muted-foreground pt-1 text-sm">Owner</div>
            <EntityPickerDropdown
              trigger="badge"
              valueId={company.accountOwnerId}
              valueLabel={accountOwnerLabel}
              placeholder="Add owner"
              options={ownerPeopleOptions}
              allowUnset
              unsetLabel="Unassigned"
              searchPlaceholder="Search person..."
              emptySearchLabel="No person found."
              contentClassName="w-64"
              align="start"
              showAvatarFallback
              onOpen={() => {
                setEditingField(null)
                setError(null)
              }}
              onSelect={(personId) => {
                onCompanyChange((current) => ({
                  ...current,
                  accountOwnerId: personId,
                  accountOwner: personId ? getPersonNameById(personId, current.accountOwner) : undefined,
                }))
              }}
            />
          </div>

          <div className="grid grid-cols-[120px_minmax(0,_1fr)] items-start gap-2 py-1">
            <div className="text-muted-foreground pt-1 text-sm">Updated by</div>
            <EntityPickerDropdown
              trigger="badge"
              valueId={company.updatedById}
              valueLabel={updatedByLabel}
              placeholder="System"
              options={relationPeopleOptions}
              searchPlaceholder="Search person..."
              emptySearchLabel="No person found."
              contentClassName="w-64"
              align="start"
              showAvatarFallback
              onOpen={() => {
                setEditingField(null)
                setError(null)
              }}
              onSelect={(personId) => {
                onCompanyChange((current) => ({
                  ...current,
                  updatedById: personId,
                }))
              }}
            />
          </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Company profile</div>
          {profileFields.map((field) => {
            const isEditingField = editingField === field.id

            return (
              <div key={field.id} className="grid grid-cols-[120px_minmax(0,_1fr)] items-start gap-2 py-1">
                <div className="text-muted-foreground pt-1 text-sm">{field.label}</div>
                <div className="min-w-0">
                  {isEditingField ? (
                    <Input
                      type={field.inputType ?? "text"}
                      value={draftValue}
                      onChange={(event) => {
                        setDraftValue(event.target.value)
                        if (error) setError(null)
                      }}
                      placeholder={field.placeholder}
                      className="h-8"
                      onBlur={commitFromBlurOrEnter}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          commitFromBlurOrEnter()
                        }
                        if (event.key === "Escape") {
                          event.preventDefault()
                          cancelEditing()
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      className="hover:bg-muted/50 block w-full rounded-sm px-2 py-1 text-left text-sm transition-colors"
                      onClick={() => startEditing(field.id)}
                    >
                      <span
                        className={cn("block break-words font-medium", !field.value && "text-muted-foreground")}
                      >
                        {field.value || field.placeholder}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {error ? <div className="text-destructive px-1 text-xs">{error}</div> : null}
          {editingField ? (
            <div className="text-muted-foreground px-1 text-xs">Press Esc to cancel this field.</div>
          ) : null}
        </div>
      </CardContent>
    </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Relations</CardTitle>
          <CardDescription>Link people and opportunities connected to this account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">
                People <span className="text-muted-foreground">{(company.peopleIds ?? []).length > 0 ? `All (${(company.peopleIds ?? []).length})` : ""}</span>
              </div>
              <EntityPickerDropdown
                trigger="plus"
                options={availablePeoplePickerOptions}
                placeholder="Add person"
                searchPlaceholder="Search people..."
                emptySearchLabel="No people found."
                emptyOptionsLabel="No people available"
                contentClassName="w-56"
                align="end"
                onSelect={(personId) => {
                  if (!personId) return
                  onCompanyChange((current) => ({
                    ...current,
                    peopleIds: Array.from(new Set<string>([...(current.peopleIds ?? []), personId])),
                  }))
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(company.peopleIds ?? []).map((personId) => (
                <RelationToken
                  key={personId}
                  label={getPersonNameById(personId)}
                  leading={
                    <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
                      {getPersonNameById(personId).trim().charAt(0).toUpperCase()}
                    </span>
                  }
                  onRemove={() => {
                    onCompanyChange((current) => ({
                      ...current,
                      peopleIds: (current.peopleIds ?? []).filter((id) => id !== personId),
                    }))
                  }}
                />
              ))}
            </div>
            {(company.peopleIds ?? []).length === 0 ? (
              <div className="text-muted-foreground text-sm">No people linked</div>
            ) : null}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">
                Opportunities <span className="text-muted-foreground">{(company.opportunityIds ?? []).length > 0 ? `All (${(company.opportunityIds ?? []).length})` : ""}</span>
              </div>
              <EntityPickerDropdown
                trigger="plus"
                options={availableOpportunitiesPickerOptions}
                placeholder="Add opportunity"
                searchPlaceholder="Search opportunities..."
                emptySearchLabel="No opportunities found."
                emptyOptionsLabel="No opportunities available"
                contentClassName="w-64"
                align="end"
                onSelect={(opportunityId) => {
                  if (!opportunityId) return
                  onCompanyChange((current) => ({
                    ...current,
                    opportunityIds: Array.from(
                      new Set<string>([...(current.opportunityIds ?? []), opportunityId])
                    ),
                  }))
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(company.opportunityIds ?? []).map((opportunityId) => {
                const targetOpportunity = getOpportunityById(opportunityId)
                if (!targetOpportunity) return null

                return (
                  <RelationToken
                    key={opportunityId}
                    label={targetOpportunity.name}
                    leading={
                      <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
                        {targetOpportunity.name.trim().charAt(0).toUpperCase()}
                      </span>
                    }
                    onRemove={() => {
                      onCompanyChange((current) => ({
                        ...current,
                        opportunityIds: (current.opportunityIds ?? []).filter((id) => id !== opportunityId),
                      }))
                    }}
                  />
                )
              })}
            </div>
            {(company.opportunityIds ?? []).length === 0 ? (
              <div className="text-muted-foreground text-sm">No opportunities yet</div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CompanyDetailWorkspace({
  company,
  onCompanyChange,
}: {
  company: CompanyRecord
  onCompanyChange: (updater: (current: CompanyRecord) => CompanyRecord) => void
}) {
  const [activeTab, setActiveTab] = React.useState<WorkspaceTabId>("timeline")
  const { tasks, setTasks } = useCompanyTaskSession(company)

  const tabCounts = React.useMemo<Record<WorkspaceTabId, number>>(
    () => ({
      timeline: timelineItems.length,
      tasks: tasks.length,
      notes: noteItems.length,
      files: fileItems.length,
      emails: emailItems.length,
      calendar: calendarItems.length,
    }),
    [tasks.length]
  )

  const renderActiveTab = () => {
    if (activeTab === "timeline") return <TimelineTab />
    if (activeTab === "tasks") return <TasksTab company={company} tasks={tasks} onTasksChange={setTasks} />
    if (activeTab === "notes") return <NotesTab />
    if (activeTab === "files") return <FilesTab />
    if (activeTab === "emails") return <EmailsTab />
    if (activeTab === "calendar") return <CalendarTab />
    return <ErrorWorkspaceState />
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,_1fr)] xl:items-start">
      <aside className="scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-0 xl:sticky xl:top-5 xl:max-h-[calc(100dvh-8.5rem)] xl:overflow-y-auto">
        <CompanySidebar company={company} onCompanyChange={onCompanyChange} />
      </aside>

      <section className="min-w-0 space-y-3">
        <div className="sticky top-0 z-20 space-y-3 border-b bg-background/95 pb-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="-mx-1 overflow-x-auto px-1">
            <div className="flex w-max items-center gap-1.5">
              {workspaceTabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn("h-8 rounded-md", isActive && "shadow-xs")}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[11px]",
                        isActive ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {tabCounts[tab.id]}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {renderActiveTab()}
      </section>
    </div>
  )
}
