"use client"

import * as React from "react"

import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { getCompanyBrandPresentation } from "@/components/companies/company-brand"
import { EntityPickerDropdown, type EntityPickerOption } from "@/components/companies/entity-picker-dropdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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

type ProfileFieldId = "domain" | "employees" | "linkedin" | "address"

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

export function CompanyDetailSidebar({
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
      <div className="">
        <div className="gap-1 grid auto-rows-min items-start space-y-4">
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
              <div className="font-medium truncate text-lg">{company.name}</div>
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
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">Ownership</div>

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-2 py-1">
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

          <div className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-2 py-1">
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

          <div className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-2 py-1">
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
                <div key={field.id} className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-2 py-1">
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
                        className="hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-ring/30 block w-full rounded-sm px-2 py-1 text-left text-sm outline-none transition-colors focus-visible:ring-2"
                        onClick={() => startEditing(field.id)}
                      >
                        <span className={cn("block wrap-break-word font-medium", !field.value && "text-muted-foreground")}>
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
        </div>
      </div>

      <div className="">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">
                People{" "}
                <span className="text-muted-foreground">
                  {(company.peopleIds ?? []).length > 0 ? `All (${(company.peopleIds ?? []).length})` : ""}
                </span>
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
                Opportunities{" "}
                <span className="text-muted-foreground">
                  {(company.opportunityIds ?? []).length > 0
                    ? `All (${(company.opportunityIds ?? []).length})`
                    : ""}
                </span>
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
        </div>
      </div>
    </div>
  )
}
