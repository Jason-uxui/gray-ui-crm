"use client"

import * as React from "react"

import {
  Alert02Icon,
  Building03Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  Note01Icon,
  SearchList01Icon,
  TaskDone01Icon,
  User03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  type CompanyRecord,
  getCompanyAccountOwner,
  getCompanyCreatedBy,
  getCompanyUpdatedBy,
} from "@/lib/companies"
import { OPPORTUNITY_OPTIONS, getOpportunityById } from "@/lib/opportunities"
import { PEOPLE_OPTIONS, getPersonNameById } from "@/lib/people"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EntityPickerDropdown, type EntityPickerOption } from "@/components/companies/entity-picker-dropdown"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type DetailTabId = "home" | "people" | "opportunities" | "tasks" | "notes"
type PreviewState = "success" | "loading" | "empty" | "error"
type CompanyProfileDraft = {
  value: string
}
type ProfileFieldId = "domain" | "employees" | "linkedin" | "address"

const detailTabs: { id: DetailTabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "people", label: "People" },
  { id: "opportunities", label: "Opportunities" },
  { id: "tasks", label: "Tasks" },
  { id: "notes", label: "Notes" },
]

const mockPeople = [
  { id: "p-1", name: "Ngoc Tran", role: "Procurement Lead", email: "ngoc@company.com" },
  { id: "p-2", name: "Linh Pham", role: "Finance Manager", email: "linh@company.com" },
]

const mockOpportunities = [
  { id: "o-1", name: "Expansion Q2", stage: "Proposal", value: "$45,000", owner: "Linh Tran" },
  { id: "o-2", name: "Renewal 2026", stage: "Negotiation", value: "$120,000", owner: "Ngoc Tran" },
]

const mockTasks = [
  { id: "t-1", title: "Schedule quarterly review", due: "Tomorrow", priority: "High" },
  { id: "t-2", title: "Prepare renewal brief", due: "In 3 days", priority: "Medium" },
]

const mockNotes = [
  { id: "n-1", author: "Khanh", body: "Customer asked for multi-year pricing options.", time: "Today" },
  { id: "n-2", author: "Linh", body: "Security questionnaire shared with legal team.", time: "Yesterday" },
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

function LoadingBlock() {
  return (
    <div className="space-y-2">
      <div className="bg-muted h-10 animate-pulse rounded-md" />
      <div className="bg-muted h-10 animate-pulse rounded-md" />
      <div className="bg-muted h-10 animate-pulse rounded-md" />
    </div>
  )
}

function EmptyState({
  title,
  description,
  actionLabel,
}: {
  title: string
  description: string
  actionLabel: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-3 py-4">
        <Badge variant="outline">Empty</Badge>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-muted-foreground text-sm">{description}</div>
        </div>
        <Button variant="outline">{actionLabel}</Button>
      </CardContent>
    </Card>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive inline-flex items-center gap-2">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={1.6} className="size-4" />
          Failed to load section
        </CardTitle>
        <CardDescription>
          Temporary data issue. Try again or switch to another tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </Card>
  )
}

function OverviewCards({ company }: { company: CompanyRecord }) {
  const accountOwnerLabel = getCompanyAccountOwner(company)

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Owner</CardDescription>
          <CardTitle>{accountOwnerLabel || "Unassigned"}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Primary Domain</CardDescription>
          <CardTitle>{company.domain || "No domain"}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Account Health</CardDescription>
          <CardTitle className="inline-flex items-center gap-1.5">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={1.6} className="size-4 text-emerald-600" />
            On Track
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

function EditableProfileCard({
  company,
  onCompanyChange,
}: {
  company: CompanyRecord
  onCompanyChange: (updater: (current: CompanyRecord) => CompanyRecord) => void
}) {
  const [editingField, setEditingField] = React.useState<ProfileFieldId | null>(null)
  const [draft, setDraft] = React.useState<CompanyProfileDraft>({ value: "" })
  const [error, setError] = React.useState<string | null>(null)
  const skipBlurCommitRef = React.useRef(false)
  const createdByLabel = getCompanyCreatedBy(company)
  const updatedByLabel = getCompanyUpdatedBy(company)
  const accountOwnerLabel = getCompanyAccountOwner(company)
  const relationPeopleOptions = React.useMemo<EntityPickerOption[]>(
    () => PEOPLE_OPTIONS.map((person) => ({ id: person.id, label: person.name })),
    []
  )
  const ownerPeopleOptions = React.useMemo<EntityPickerOption[]>(
    () =>
      PEOPLE_OPTIONS.filter((person) => person.id !== "system").map((person) => ({
        id: person.id,
        label: person.name,
      })),
    []
  )

  const profileFields: {
    id: ProfileFieldId
    label: string
    value: React.ReactNode
    placeholder: string
    inputType?: "text" | "number"
  }[] = [
    {
      id: "domain",
      label: "Domain",
      value: company.domain || <span className="text-muted-foreground">No domain</span>,
      placeholder: "example.com",
    },
    {
      id: "employees",
      label: "Employees",
      value:
        typeof company.employees === "number" ? (
          company.employees.toLocaleString("en-US")
        ) : (
          <span className="text-muted-foreground">Unknown</span>
        ),
      placeholder: "Number of employees",
      inputType: "number",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: company.linkedin || <span className="text-muted-foreground">Not linked</span>,
      placeholder: "linkedin.com/company/...",
    },
    {
      id: "address",
      label: "Address",
      value: company.address || <span className="text-muted-foreground">No address</span>,
      placeholder: "Address",
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
    setDraft({ value: "" })
    setError(null)
  }

  const startEditing = (fieldId: ProfileFieldId) => {
    skipBlurCommitRef.current = false
    setEditingField(fieldId)
    setDraft({ value: getCurrentValue(fieldId) })
    setError(null)
  }

  const cancelEditing = () => {
    skipBlurCommitRef.current = true
    resetEditState()
  }

  const saveEditing = () => {
    if (!editingField) return

    if (editingField === "employees" && draft.value.trim()) {
      const parsed = Number(draft.value.trim().replaceAll(",", ""))
      if (Number.isNaN(parsed)) {
        setError("Employees must be a valid number")
        return
      }
    }

    onCompanyChange((current) => {
      const trimmed = draft.value.trim()

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

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Click any value to edit. Enter or blur saves automatically.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 py-3">
        <div className="grid grid-cols-[140px_minmax(0,_1fr)] items-start gap-2 rounded-md border p-2">
          <div className="text-muted-foreground pt-1 text-sm">Created by</div>
          <div className="pt-0.5">
            <EntityPickerDropdown
              trigger="badge"
              valueId={company.createdById}
              valueLabel={createdByLabel}
              placeholder="System"
              options={relationPeopleOptions}
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
              searchPlaceholder="Search person..."
              emptySearchLabel="No person found."
              contentClassName="w-64"
              align="start"
              showAvatarFallback
            />
          </div>
        </div>

        <div className="grid grid-cols-[140px_minmax(0,_1fr)] items-start gap-2 rounded-md border p-2">
          <div className="text-muted-foreground pt-1 text-sm">Account owner</div>
          <div className="pt-0.5">
            <EntityPickerDropdown
              trigger="badge"
              valueId={company.accountOwnerId}
              valueLabel={accountOwnerLabel}
              placeholder="Add owner"
              options={ownerPeopleOptions}
              allowUnset
              unsetLabel="Unassigned"
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
              searchPlaceholder="Search person..."
              emptySearchLabel="No person found."
              contentClassName="w-64"
              align="start"
              showAvatarFallback
            />
          </div>
        </div>

        <div className="grid grid-cols-[140px_minmax(0,_1fr)] items-start gap-2 rounded-md border p-2">
          <div className="text-muted-foreground pt-1 text-sm">Updated by</div>
          <div className="pt-0.5">
            <EntityPickerDropdown
              trigger="badge"
              valueId={company.updatedById}
              valueLabel={updatedByLabel}
              placeholder="System"
              options={relationPeopleOptions}
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
              searchPlaceholder="Search person..."
              emptySearchLabel="No person found."
              contentClassName="w-64"
              align="start"
              showAvatarFallback
            />
          </div>
        </div>

        <div className="space-y-1">
          {profileFields.map((field) => {
            const isEditingField = editingField === field.id

            return (
              <div key={field.id} className="grid grid-cols-[140px_minmax(0,_1fr)] items-start gap-2 rounded-md border p-2">
                <div className="text-muted-foreground pt-1 text-sm">{field.label}</div>
                <div className="min-w-0">
                  {isEditingField ? (
                    <Input
                      type={field.inputType ?? "text"}
                      value={draft.value}
                      onChange={(event) => {
                        setDraft({ value: event.target.value })
                        if (error) setError(null)
                      }}
                      placeholder={field.placeholder}
                      className="h-7"
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
                      className="hover:bg-muted/60 block w-full rounded-md px-2 py-1 text-left text-sm transition-colors"
                      onClick={() => startEditing(field.id)}
                    >
                      <span className="block break-words font-medium">{field.value}</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
          {error ? (
            <div className="text-destructive px-1 text-xs">{error}</div>
          ) : null}
          {editingField ? (
            <div className="text-muted-foreground px-1 text-xs">
              Press Esc to cancel this field.
            </div>
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
              onSelect={(personId) => {
                if (!personId) return
                onCompanyChange((current) => ({
                  ...current,
                  peopleIds: Array.from(new Set<string>([...(current.peopleIds ?? []), personId])),
                }))
              }}
              searchPlaceholder="Search people..."
              emptySearchLabel="No people found."
              emptyOptionsLabel="No people available"
              contentClassName="w-56"
              align="end"
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

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-medium">
              Opportunities <span className="text-muted-foreground">{(company.opportunityIds ?? []).length > 0 ? `All (${(company.opportunityIds ?? []).length})` : ""}</span>
            </div>
            <EntityPickerDropdown
              trigger="plus"
              options={availableOpportunitiesPickerOptions}
              placeholder="Add opportunity"
              onSelect={(opportunityId) => {
                if (!opportunityId) return
                onCompanyChange((current) => ({
                  ...current,
                  opportunityIds: Array.from(
                    new Set<string>([...(current.opportunityIds ?? []), opportunityId])
                  ),
                }))
              }}
              searchPlaceholder="Search opportunities..."
              emptySearchLabel="No opportunities found."
              emptyOptionsLabel="No opportunities available"
              contentClassName="w-64"
              align="end"
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
                      opportunityIds: (current.opportunityIds ?? []).filter(
                        (id) => id !== opportunityId
                      ),
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

function SuccessPeople() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="inline-flex items-center gap-1.5">
          <HugeiconsIcon icon={User03Icon} strokeWidth={1.6} className="size-4" />
          Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-3">
        {mockPeople.map((person) => (
          <div key={person.id} className="rounded-md border p-3">
            <div className="text-sm font-medium">{person.name}</div>
            <div className="text-muted-foreground text-sm">{person.role}</div>
            <div className="text-muted-foreground text-sm">{person.email}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function SuccessOpportunities() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="inline-flex items-center gap-1.5">
          <HugeiconsIcon icon={Building03Icon} strokeWidth={1.6} className="size-4" />
          Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-3">
        {mockOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="rounded-md border p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">{opportunity.name}</div>
              <Badge variant="secondary">{opportunity.stage}</Badge>
            </div>
            <div className="text-muted-foreground mt-1 text-sm">
              {opportunity.value} · Owner: {opportunity.owner}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function SuccessTasks() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="inline-flex items-center gap-1.5">
          <HugeiconsIcon icon={TaskDone01Icon} strokeWidth={1.6} className="size-4" />
          Open Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-3">
        {mockTasks.map((task) => (
          <div key={task.id} className="rounded-md border p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">{task.title}</div>
              <Badge variant={task.priority === "High" ? "destructive" : "outline"}>
                {task.priority}
              </Badge>
            </div>
            <div className="text-muted-foreground mt-1 inline-flex items-center gap-1.5 text-sm">
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={1.6} className="size-4" />
              Due {task.due}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function SuccessNotes() {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="inline-flex items-center gap-1.5">
            <HugeiconsIcon icon={Note01Icon} strokeWidth={1.6} className="size-4" />
            Add Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-3">
          <Input placeholder="Note title" />
          <Textarea placeholder="Write context, blockers, and next actions..." rows={4} />
          <div className="flex justify-end">
            <Button>Save Note</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-3">
          {mockNotes.map((note) => (
            <div key={note.id} className="rounded-md border p-3">
              <div className="text-sm font-medium">
                {note.author} · <span className="text-muted-foreground">{note.time}</span>
              </div>
              <div className="text-muted-foreground mt-1 text-sm">{note.body}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function CompanyDetailTabs({
  company,
  onCompanyChange,
}: {
  company: CompanyRecord
  onCompanyChange: (updater: (current: CompanyRecord) => CompanyRecord) => void
}) {
  const [activeTab, setActiveTab] = React.useState<DetailTabId>("home")
  const [previewState, setPreviewState] = React.useState<PreviewState>("success")

  const renderByState = (successContent: React.ReactNode, entityLabel: string) => {
    if (previewState === "loading") {
      return <LoadingBlock />
    }
    if (previewState === "error") {
      return <ErrorState onRetry={() => setPreviewState("success")} />
    }
    if (previewState === "empty") {
      return (
        <EmptyState
          title={`No ${entityLabel} yet`}
          description={`This company does not have any ${entityLabel} records yet.`}
          actionLabel={`Create ${entityLabel}`}
        />
      )
    }
    return successContent
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {detailTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              size="sm"
              className={cn("h-7 rounded-md", activeTab === tab.id && "shadow-xs")}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Preview State</span>
          <Select value={previewState} onValueChange={(value) => setPreviewState(value as PreviewState)}>
            <SelectTrigger className="w-36" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="loading">Loading</SelectItem>
              <SelectItem value="empty">Empty</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {activeTab === "home" && (
        <div className="space-y-4">
          <OverviewCards company={company} />
          <EditableProfileCard company={company} onCompanyChange={onCompanyChange} />
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="inline-flex items-center gap-1.5">
                <HugeiconsIcon icon={SearchList01Icon} strokeWidth={1.6} className="size-4" />
                Working Summary
              </CardTitle>
              <CardDescription>
                One-screen context for sales, success, and operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 py-3 text-sm">
              <div className="rounded-md border p-3">
                Account owner is <span className="font-medium">{getCompanyAccountOwner(company) || "unassigned"}</span>.
              </div>
              <div className="rounded-md border p-3">
                Primary contact channel is <span className="font-medium">{company.domain || "missing domain"}</span>.
              </div>
              <div className="rounded-md border p-3">
                Focus this week: confirm opportunities and next actions.
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "people" && renderByState(<SuccessPeople />, "people")}
      {activeTab === "opportunities" && renderByState(<SuccessOpportunities />, "opportunities")}
      {activeTab === "tasks" && renderByState(<SuccessTasks />, "tasks")}
      {activeTab === "notes" && renderByState(<SuccessNotes />, "notes")}
    </div>
  )
}
