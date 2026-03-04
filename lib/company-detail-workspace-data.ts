export type CompanyDetailWorkspaceTabId =
  | "timeline"
  | "tasks"
  | "notes"
  | "files"
  | "emails"
  | "calendar"

export type TimelineGroup = "Upcoming" | "Today" | "Yesterday" | "This week" | "Earlier"

export type ActivityType = "status" | "meeting" | "email" | "note" | "workflow"

export type ActivityFilterId = "all" | ActivityType

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

export type ActivityItem = {
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

export const workspaceTabs: { id: CompanyDetailWorkspaceTabId; label: string }[] = [
  { id: "timeline", label: "Timeline" },
  { id: "tasks", label: "Tasks" },
  { id: "notes", label: "Notes" },
  { id: "files", label: "Files" },
  { id: "emails", label: "Emails" },
  { id: "calendar", label: "Calendar" },
]

export const timelineItems: ActivityItem[] = [
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
]

export const timelineGroupOrder: TimelineGroup[] = [
  "Upcoming",
  "Today",
  "Yesterday",
  "This week",
  "Earlier",
]

export const timelineFilterOptions: { id: ActivityFilterId; label: string }[] = [
  { id: "all", label: "All activities" },
  { id: "status", label: "Status updates" },
  { id: "meeting", label: "Meetings" },
  { id: "email", label: "Emails" },
  { id: "note", label: "Notes" },
  { id: "workflow", label: "Workflows" },
]

export const noteItems: NoteItem[] = [
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

export const fileItems: FileItem[] = [
  {
    id: "f-1",
    name: "Security-Questionnaire-v3.pdf",
    type: "PDF",
    size: "1.8 MB",
    updatedAt: "2 days ago",
  },
]

export const emailItems: EmailItem[] = [
  {
    id: "e-1",
    subject: "Follow-up on enterprise rollout",
    from: "buyer@company.com",
    date: "Today",
  },
]

export const calendarItems: CalendarItem[] = [
  {
    id: "c-1",
    title: "Technical deep-dive",
    date: "Wed, Mar 12 · 10:00",
    owner: "Account owner",
  },
]

export function getWorkspaceTabCounts(
  taskCount: number
): Record<CompanyDetailWorkspaceTabId, number> {
  return {
    timeline: timelineItems.length,
    tasks: taskCount,
    notes: noteItems.length,
    files: fileItems.length,
    emails: emailItems.length,
    calendar: calendarItems.length,
  }
}

export function isWorkspaceTabId(
  value: string | null
): value is CompanyDetailWorkspaceTabId {
  return value !== null && workspaceTabs.some((tab) => tab.id === value)
}
