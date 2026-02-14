"use client"

import * as React from "react"
import Link from "next/link"

import {
  Archive01Icon,
  Calendar01Icon,
  Cancel01Icon,
  Copy01Icon,
  Delete02Icon,
  Link01Icon,
  Linkedin01Icon,
  MapPinpoint01Icon,
  UserGroupIcon,
  UserIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { type DataGridDrawerPanelProps } from "@/components/data-grid"
import { getCompanyBrandPresentation } from "@/components/companies/company-brand"
import {
  EntityPickerDropdown,
  type EntityPickerOption,
} from "@/components/companies/entity-picker-dropdown"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  getCompanyAccountOwner,
  getCompanyCreatedBy,
  getCompanyUpdatedBy,
  formatCompanyCreatedAt,
  formatCompanyEmployeeCount,
  type CompanyRecord,
} from "@/lib/companies"
import { OPPORTUNITY_OPTIONS, getOpportunityById } from "@/lib/opportunities"
import { PEOPLE_OPTIONS, getPersonNameById } from "@/lib/people"
import { cn } from "@/lib/utils"

type DrawerTab = "home" | "tasks" | "notes" | "files"
type TextEditableFieldId = "domain" | "employees" | "linkedin" | "address"
type CompanyDrawerColumnId =
  | "name"
  | "domain"
  | "createdBy"
  | "accountOwner"
  | "creationDate"
  | "employees"
  | "linkedin"
  | "address"
type CompanyDetailDrawerProps = DataGridDrawerPanelProps<CompanyRecord, CompanyDrawerColumnId>

type TextFieldItem = {
  id: CompanyDrawerColumnId
  label: string
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  value: string
  placeholder: string
  editableFieldId: TextEditableFieldId | null
  inputType?: "text" | "number"
}

const tabs: { id: DrawerTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "tasks", label: "Tasks" },
  { id: "notes", label: "Notes" },
  { id: "files", label: "Files" },
]

function toDraftValue(row: CompanyRecord, fieldId: TextEditableFieldId) {
  switch (fieldId) {
    case "domain":
      return row.domain ?? ""
    case "employees":
      return typeof row.employees === "number" ? String(row.employees) : ""
    case "linkedin":
      return row.linkedin ?? ""
    case "address":
      return row.address ?? ""
    default:
      return ""
  }
}

function applyTextDraftValue(row: CompanyRecord, fieldId: TextEditableFieldId, draftValue: string) {
  const trimmed = draftValue.trim()

  switch (fieldId) {
    case "domain":
      return { ...row, domain: trimmed || undefined }
    case "employees": {
      if (!trimmed) return { ...row, employees: undefined }
      const parsed = Number(trimmed.replaceAll(",", ""))
      if (Number.isNaN(parsed)) return row
      return { ...row, employees: parsed }
    }
    case "linkedin":
      return { ...row, linkedin: trimmed || undefined }
    case "address":
      return { ...row, address: trimmed || undefined }
    default:
      return row
  }
}

function getTextFieldValidationError(fieldId: TextEditableFieldId, draftValue: string) {
  if (fieldId !== "employees") return null
  if (!draftValue.trim()) return null

  const parsed = Number(draftValue.trim().replaceAll(",", ""))
  if (Number.isNaN(parsed)) {
    return "Employees must be a valid number"
  }

  return null
}

function RelationChip({
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

function TextFieldRow({
  item,
  selected,
  isEditing,
  draftValue,
  draftError,
  onStartEdit,
  onCancelEdit,
  onDraftChange,
  onCommitEdit,
}: {
  item: TextFieldItem
  selected: boolean
  isEditing: boolean
  draftValue: string
  draftError: string | null
  onStartEdit: () => void
  onCancelEdit: () => void
  onDraftChange: (value: string) => void
  onCommitEdit: () => void
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(112px,_1fr)_minmax(0,_1.5fr)] items-start gap-3 border-b px-4 py-2.5 text-sm",
        selected && "bg-muted/50"
      )}
    >
      <div className="text-muted-foreground inline-flex items-center gap-1.5 pt-1">
        <HugeiconsIcon icon={item.icon} strokeWidth={1.6} className="size-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </div>

      {isEditing ? (
        <div className="space-y-1.5">
          <Input
            type={item.inputType ?? "text"}
            value={draftValue}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder={item.placeholder}
            className="h-7"
            onBlur={onCommitEdit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                onCommitEdit()
              }
              if (event.key === "Escape") {
                event.preventDefault()
                onCancelEdit()
              }
            }}
            autoFocus
          />
          {draftError ? <div className="text-destructive text-xs">{draftError}</div> : null}
        </div>
      ) : (
        <button
          type="button"
          className={cn(
            "hover:bg-muted/60 min-w-0 rounded-md px-2 py-1 text-left transition-colors",
            !item.editableFieldId && "pointer-events-none hover:bg-transparent"
          )}
          onClick={onStartEdit}
          disabled={!item.editableFieldId}
        >
          <span className={cn("block break-words font-medium", item.value ? "" : "text-muted-foreground")}> 
            {item.value || item.placeholder}
          </span>
        </button>
      )}
    </div>
  )
}

function RelationPickerRow({
  label,
  icon,
  valueId,
  valueLabel,
  placeholder,
  options,
  selected,
  allowUnset = false,
  unsetLabel,
  onSelect,
}: {
  label: string
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  valueId?: string
  valueLabel?: string
  placeholder: string
  options: EntityPickerOption[]
  selected: boolean
  allowUnset?: boolean
  unsetLabel?: string
  onSelect: (id?: string) => void
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(112px,_1fr)_minmax(0,_1.5fr)] items-start gap-3 border-b px-4 py-2.5 text-sm",
        selected && "bg-muted/50"
      )}
    >
      <div className="text-muted-foreground inline-flex items-center gap-1.5 pt-1">
        <HugeiconsIcon icon={icon} strokeWidth={1.6} className="size-4 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <div className="pt-0.5">
        <EntityPickerDropdown
          trigger="badge"
          options={options}
          valueId={valueId}
          valueLabel={valueLabel}
          placeholder={placeholder}
          allowUnset={allowUnset}
          unsetLabel={unsetLabel}
          onSelect={onSelect}
          searchPlaceholder="Search person..."
          emptySearchLabel="No person found."
          contentClassName="w-64"
          align="start"
          showAvatarFallback
        />
      </div>
    </div>
  )
}

function ChipsSection({
  title,
  values,
  emptyPlaceholder,
  addLabel,
  options,
  onAdd,
  onRemove,
  pickerOptions,
}: {
  title: string
  values: { id: string; label: string; leading?: React.ReactNode }[]
  emptyPlaceholder: string
  addLabel: string
  options: { id: string; label: string }[]
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  pickerOptions?: EntityPickerOption[]
}) {
  const resolvedPickerOptions = pickerOptions ?? options

  return (
    <div className="border-b px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-sm font-medium">
          {title} <span className="text-muted-foreground">{values.length > 0 ? `All (${values.length})` : ""}</span>
        </div>
        <EntityPickerDropdown
          trigger="plus"
          options={resolvedPickerOptions}
          placeholder={addLabel}
          onSelect={(id) => {
            if (!id) return
            onAdd(id)
          }}
          searchPlaceholder={`Search ${title.toLowerCase()}...`}
          emptySearchLabel={`No ${title.toLowerCase()} found.`}
          emptyOptionsLabel={`No ${title.toLowerCase()} available`}
          contentClassName="w-56"
          align="end"
        />
      </div>

      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((item) => (
            <RelationChip key={item.id} label={item.label} leading={item.leading} onRemove={() => onRemove(item.id)} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">{emptyPlaceholder}</div>
      )}
    </div>
  )
}

export function CompanyDetailDrawer({
  drawerRow,
  drawerColumn,
  updateRow,
}: CompanyDetailDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<DrawerTab>("home")
  const [editingField, setEditingField] = React.useState<TextEditableFieldId | null>(null)
  const [draftValue, setDraftValue] = React.useState("")
  const [draftError, setDraftError] = React.useState<string | null>(null)
  const skipBlurCommitRef = React.useRef(false)
  const selectedFieldId = drawerColumn?.id ?? ""

  React.useEffect(() => {
    setEditingField(null)
    setDraftValue("")
    setDraftError(null)
  }, [drawerRow?.id])

  if (!drawerRow) {
    return null
  }

  const brand = getCompanyBrandPresentation(drawerRow.id, drawerRow.name)
  const companyDetailPath = `/companies/${drawerRow.id}`
  const createdByLabel = getCompanyCreatedBy(drawerRow)
  const updatedByLabel = getCompanyUpdatedBy(drawerRow)
  const accountOwnerLabel = getCompanyAccountOwner(drawerRow)

  const beginEdit = (fieldId: TextEditableFieldId) => {
    skipBlurCommitRef.current = false
    setEditingField(fieldId)
    setDraftValue(toDraftValue(drawerRow, fieldId))
    setDraftError(null)
  }

  const resetEditState = () => {
    setEditingField(null)
    setDraftValue("")
    setDraftError(null)
  }

  const cancelEdit = () => {
    skipBlurCommitRef.current = true
    resetEditState()
  }

  const saveEdit = () => {
    if (!editingField) return

    const validationError = getTextFieldValidationError(editingField, draftValue)
    if (validationError) {
      setDraftError(validationError)
      return
    }

    updateRow(drawerRow.id, (row) => applyTextDraftValue(row, editingField, draftValue))
    skipBlurCommitRef.current = false
    resetEditState()
  }

  const commitFromBlurOrEnter = () => {
    if (skipBlurCommitRef.current) {
      skipBlurCommitRef.current = false
      return
    }
    saveEdit()
  }

  const textFields: TextFieldItem[] = [
    {
      id: "address",
      label: "Address",
      value: drawerRow.address ?? "",
      placeholder: "Add address",
      icon: MapPinpoint01Icon,
      editableFieldId: "address",
    },
    {
      id: "domain",
      label: "Domain",
      value: drawerRow.domain ?? "",
      placeholder: "Add domain",
      icon: Link01Icon,
      editableFieldId: "domain",
    },
    {
      id: "employees",
      label: "Employees",
      value: formatCompanyEmployeeCount(drawerRow.employees),
      placeholder: "Add employee count",
      icon: UserGroupIcon,
      editableFieldId: "employees",
      inputType: "number",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: drawerRow.linkedin ?? "",
      placeholder: "Add LinkedIn",
      icon: Linkedin01Icon,
      editableFieldId: "linkedin",
    },
    {
      id: "creationDate",
      label: "Last update",
      value: formatCompanyCreatedAt(drawerRow.createdAtMinutes),
      placeholder: "",
      icon: Calendar01Icon,
      editableFieldId: null,
    },
  ]

  const relationPeopleOptions = PEOPLE_OPTIONS.map((person) => ({
    id: person.id,
    label: person.name,
  }))

  const peopleOptions = PEOPLE_OPTIONS.filter((person) => person.id !== "system").map((person) => ({
    id: person.id,
    label: person.name,
  }))

  const selectedPeople = (drawerRow.peopleIds ?? []).map((personId) => ({
    id: personId,
    label: getPersonNameById(personId),
    leading: (
      <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
        {getPersonNameById(personId).trim().charAt(0).toUpperCase()}
      </span>
    ),
  }))

  const availablePeople = peopleOptions.filter(
    (person) => !(drawerRow.peopleIds ?? []).includes(person.id)
  )
  const availablePeoplePickerOptions: EntityPickerOption[] = availablePeople.map((person) => ({
    ...person,
    leading: (
      <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
        {person.label.trim().charAt(0).toUpperCase()}
      </span>
    ),
  }))

  const selectedOpportunities: { id: string; label: string; leading?: React.ReactNode }[] = (
    drawerRow.opportunityIds ?? []
  ).reduce<{ id: string; label: string; leading?: React.ReactNode }[]>((accumulator, opportunityId) => {
    const opportunity = getOpportunityById(opportunityId)
    if (!opportunity) return accumulator

    accumulator.push({
      id: opportunity.id,
      label: opportunity.name,
      leading: (
        <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
          {opportunity.name.trim().charAt(0).toUpperCase()}
        </span>
      ),
    })

    return accumulator
  }, [])

  const availableOpportunities = OPPORTUNITY_OPTIONS.filter(
    (item) => !(drawerRow.opportunityIds ?? []).includes(item.id)
  ).map((item) => ({ id: item.id, label: item.name }))
  const availableOpportunitiesPickerOptions: EntityPickerOption[] = availableOpportunities.map((item) => ({
    ...item,
    leading: (
      <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
        {item.label.trim().charAt(0).toUpperCase()}
      </span>
    ),
  }))

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Popup className="translate-x-full data-open:translate-x-0 data-closed:translate-x-full fixed top-0 right-0 z-50 flex h-dvh w-full max-w-[560px] flex-col border-l bg-background shadow-xl ring-foreground/10 ring-1 outline-none transition-transform duration-200">
        <div className="border-b px-2 py-2">
          <div className="flex items-center gap-2 px-1.5">
            <DialogPrimitive.Close
              render={<Button variant="ghost" size="icon-sm" aria-label="Close company drawer" />}
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} className="size-4" />
            </DialogPrimitive.Close>
            <span
              className={cn(
                "inline-flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold",
                brand.className
              )}
            >
              {brand.icon ? (
                <HugeiconsIcon icon={brand.icon} strokeWidth={2} className="size-3.5" />
              ) : (
                brand.fallback
              )}
            </span>
            <Badge variant="outline" className="h-6 rounded-md">
              {drawerRow.name}
            </Badge>
            <span className="text-muted-foreground text-xs">{formatCompanyCreatedAt(drawerRow.createdAtMinutes)}</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto px-1.5">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="h-7 rounded-md"
              >
                {tab.label}
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="h-7 rounded-md">
              +2 More
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "home" ? (
            <>
              <div className="border-b">
                {textFields.map((item) => {
                  const currentEditing =
                    item.editableFieldId !== null && editingField === item.editableFieldId

                  return (
                    <TextFieldRow
                      key={item.id}
                      item={item}
                      selected={item.id === selectedFieldId}
                      isEditing={Boolean(currentEditing)}
                      draftValue={draftValue}
                      draftError={currentEditing ? draftError : null}
                      onStartEdit={() => {
                        if (item.editableFieldId) beginEdit(item.editableFieldId)
                      }}
                      onCancelEdit={cancelEdit}
                      onDraftChange={setDraftValue}
                      onCommitEdit={commitFromBlurOrEnter}
                    />
                  )
                })}

                <RelationPickerRow
                  label="Created by"
                  icon={UserIcon}
                  valueId={drawerRow.createdById}
                  valueLabel={createdByLabel}
                  placeholder="System"
                  options={relationPeopleOptions}
                  selected={selectedFieldId === "createdBy"}
                  onSelect={(personId) => {
                    updateRow(drawerRow.id, (row) => ({
                      ...row,
                      createdById: personId,
                      createdBy: getPersonNameById(personId, row.createdBy),
                    }))
                  }}
                />

                <RelationPickerRow
                  label="Account owner"
                  icon={UserMultipleIcon}
                  valueId={drawerRow.accountOwnerId}
                  valueLabel={accountOwnerLabel}
                  placeholder="Add owner"
                  options={peopleOptions}
                  selected={selectedFieldId === "accountOwner"}
                  allowUnset
                  unsetLabel="Unassigned"
                  onSelect={(personId) => {
                    updateRow(drawerRow.id, (row) => ({
                      ...row,
                      accountOwnerId: personId,
                      accountOwner: personId ? getPersonNameById(personId) : undefined,
                    }))
                  }}
                />

                <RelationPickerRow
                  label="Updated by"
                  icon={UserIcon}
                  valueId={drawerRow.updatedById}
                  valueLabel={updatedByLabel}
                  placeholder="System"
                  options={relationPeopleOptions}
                  selected={false}
                  onSelect={(personId) => {
                    updateRow(drawerRow.id, (row) => ({
                      ...row,
                      updatedById: personId,
                    }))
                  }}
                />
              </div>

              <ChipsSection
                title="People"
                values={selectedPeople}
                emptyPlaceholder="No people linked"
                addLabel="Add person"
                options={availablePeople}
                pickerOptions={availablePeoplePickerOptions}
                onAdd={(personId) => {
                  updateRow(drawerRow.id, (row) => ({
                    ...row,
                    peopleIds: [...(row.peopleIds ?? []), personId],
                  }))
                }}
                onRemove={(personId) => {
                  updateRow(drawerRow.id, (row) => ({
                    ...row,
                    peopleIds: (row.peopleIds ?? []).filter((id) => id !== personId),
                  }))
                }}
              />

              <ChipsSection
                title="Opportunities"
                values={selectedOpportunities}
                emptyPlaceholder="No opportunities yet"
                addLabel="Add opportunity"
                options={availableOpportunities}
                pickerOptions={availableOpportunitiesPickerOptions}
                onAdd={(opportunityId) => {
                  updateRow(drawerRow.id, (row) => ({
                    ...row,
                    opportunityIds: [...(row.opportunityIds ?? []), opportunityId],
                  }))
                }}
                onRemove={(opportunityId) => {
                  updateRow(drawerRow.id, (row) => ({
                    ...row,
                    opportunityIds: (row.opportunityIds ?? []).filter((id) => id !== opportunityId),
                  }))
                }}
              />
            </>
          ) : (
            <div className="text-muted-foreground px-4 py-4 text-sm">
              {activeTab === "tasks" && "No tasks yet. Add the first task from full detail page."}
              {activeTab === "notes" && "No notes yet. Add context notes from full detail page."}
              {activeTab === "files" && "No files attached to this company yet."}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="lg" className="h-8" aria-label="Company options" />}
            >
              <span>Options</span>
              <span className="text-muted-foreground text-xs">⌘O</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <HugeiconsIcon icon={Copy01Icon} strokeWidth={1.6} className="text-muted-foreground size-4" />
                Duplicate
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Archive01Icon} strokeWidth={1.6} className="text-muted-foreground size-4" />
                Archive
                <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.6} className="text-destructive size-4" />
                Delete
                <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href={companyDetailPath}
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "h-8")}
          >
            <span>Open</span>
            <span className="text-primary-foreground/80 text-xs">⌘I</span>
          </Link>
        </div>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}
