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
import { OPPORTUNITY_OPTIONS, getOpportunityById } from "@/lib/opportunities"
import { PEOPLE_OPTIONS, getPersonNameById } from "@/lib/people"
import { cn } from "@/lib/utils"

type WorkspaceTabId = "timeline" | "tasks" | "notes" | "files" | "emails" | "calendar"
type ProfileFieldId = "domain" | "employees" | "linkedin" | "address"

type ActivityItem = {
  id: string
  title: string
  description: string
  time: string
}

type TaskItem = {
  id: string
  title: string
  due: string
  priority: "High" | "Medium" | "Low"
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
    title: "Intro call completed",
    description: "Customer asked for rollout timing and migration support details.",
    time: "Today · 10:20",
  },
  {
    id: "a-2",
    title: "Security questionnaire shared",
    description: "The legal team has reviewed baseline security requirements.",
    time: "Yesterday · 16:40",
  },
]

const taskItems: TaskItem[] = [
  { id: "t-1", title: "Prepare renewal proposal", due: "Tomorrow", priority: "High" },
  { id: "t-2", title: "Confirm procurement workflow", due: "In 2 days", priority: "Medium" },
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
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="inline-flex items-center gap-1.5">
            <HugeiconsIcon icon={SearchList01Icon} strokeWidth={1.6} className="size-4" />
            Log activity
          </CardTitle>
          <CardDescription>Capture call notes, blockers, and customer signals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 py-4">
          <Textarea placeholder="Write an activity update..." rows={4} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                Meeting
              </Button>
              <Button variant="outline" size="sm">
                Email
              </Button>
              <Button variant="outline" size="sm">
                Call
              </Button>
            </div>
            <Button size="sm">Save activity</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-4">
          {timelineItems.map((item) => (
            <div key={item.id} className="rounded-md border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-medium">{item.title}</div>
                <span className="text-muted-foreground text-xs">{item.time}</span>
              </div>
              <div className="text-muted-foreground mt-1 text-sm">{item.description}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button size="sm">Log activity</Button>
      </div>
    </div>
  )
}

function TasksTab() {
  if (taskItems.length === 0) {
    return (
      <EmptyWorkspaceState
        title="No tasks yet"
        description="Create tasks to keep this account moving forward."
        primaryAction="Create task"
        secondaryAction="Log activity"
      />
    )
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="inline-flex items-center gap-1.5">
            <HugeiconsIcon icon={TaskDone01Icon} strokeWidth={1.6} className="size-4" />
            Open tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-4">
          {taskItems.map((task) => (
            <div key={task.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">{task.title}</div>
                <Badge variant={task.priority === "High" ? "destructive" : "outline"}>{task.priority}</Badge>
              </div>
              <div className="text-muted-foreground mt-1 inline-flex items-center gap-1.5 text-sm">
                <HugeiconsIcon icon={Calendar03Icon} strokeWidth={1.6} className="size-4" />
                Due {task.due}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button variant="outline" size="sm">
          Add task
        </Button>
      </div>
    </div>
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

  return (
    <Card>
      <CardHeader className="space-y-4 pb-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold",
              brand.className
            )}
          >
            {brand.icon ? (
              <HugeiconsIcon icon={brand.icon} strokeWidth={2} className="size-5" />
            ) : (
              brand.fallback
            )}
          </span>
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{company.name}</CardTitle>
            <CardDescription>{formatCompanyCreatedAt(company.createdAtMinutes)}</CardDescription>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border p-2">
            <div className="text-muted-foreground text-xs">Owner</div>
            <div className="mt-1 text-sm font-medium">{accountOwnerLabel || "Unassigned"}</div>
          </div>
          <div className="rounded-md border p-2">
            <div className="text-muted-foreground text-xs">Account Health</div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={1.6} className="size-4 text-emerald-600" />
              On Track
            </div>
          </div>
        </div>
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

        <Separator />

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
          {(company.peopleIds ?? []).length === 0 ? <div className="text-muted-foreground text-sm">No people linked</div> : null}
        </div>

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

  const tabCounts = React.useMemo<Record<WorkspaceTabId, number>>(
    () => ({
      timeline: timelineItems.length,
      tasks: taskItems.length,
      notes: noteItems.length,
      files: fileItems.length,
      emails: emailItems.length,
      calendar: calendarItems.length,
    }),
    []
  )

  const renderActiveTab = () => {
    if (activeTab === "timeline") return <TimelineTab />
    if (activeTab === "tasks") return <TasksTab />
    if (activeTab === "notes") return <NotesTab />
    if (activeTab === "files") return <FilesTab />
    if (activeTab === "emails") return <EmailsTab />
    if (activeTab === "calendar") return <CalendarTab />
    return <ErrorWorkspaceState />
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,_1fr)] xl:items-start">
      <aside className="min-w-0 xl:sticky xl:top-5 xl:max-h-[calc(100dvh-8.5rem)] xl:overflow-y-auto">
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
