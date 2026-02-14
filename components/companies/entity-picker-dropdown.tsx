"use client"

import * as React from "react"

import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import { cn } from "@/lib/utils"

export type EntityPickerOption = {
  id: string
  label: string
  leading?: React.ReactNode
}

type EntityPickerDropdownProps = {
  trigger: "badge" | "plus"
  options: EntityPickerOption[]
  placeholder: string
  valueId?: string
  valueLabel?: string
  allowUnset?: boolean
  unsetLabel?: string
  onSelect: (id?: string) => void
  onOpen?: () => void
  searchPlaceholder?: string
  emptySearchLabel?: string
  emptyOptionsLabel?: string
  maxVisible?: number
  contentClassName?: string
  align?: "start" | "center" | "end"
  showAvatarFallback?: boolean
}

function getAvatarText(label: string) {
  return label.trim().charAt(0).toUpperCase()
}

export function EntityPickerDropdown({
  trigger,
  options,
  placeholder,
  valueId,
  valueLabel,
  allowUnset = false,
  unsetLabel,
  onSelect,
  onOpen,
  searchPlaceholder = "Search...",
  emptySearchLabel = "No results found.",
  emptyOptionsLabel = "No items available",
  maxVisible = 5,
  contentClassName = "w-56",
  align = "start",
  showAvatarFallback = false,
}: EntityPickerDropdownProps) {
  const [searchValue, setSearchValue] = React.useState("")
  const hasValue = Boolean(valueLabel)
  const hasSelectableOptions = options.length > 0 || allowUnset

  const selectedOption = React.useMemo(
    () => options.find((option) => option.id === valueId) ?? null,
    [options, valueId]
  )

  const pickerOptions = React.useMemo(() => {
    if (!allowUnset) return options
    return [{ id: "__unset__", label: unsetLabel ?? placeholder }, ...options]
  }, [allowUnset, options, placeholder, unsetLabel])

  const limitedOptions = React.useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase()
    const filtered = normalizedQuery
      ? pickerOptions.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
      : pickerOptions
    return filtered.slice(0, maxVisible)
  }, [pickerOptions, searchValue, maxVisible])

  const renderOption = (option: EntityPickerOption) => {
    if (option.id === "__unset__") {
      return <span className="text-muted-foreground">{option.label}</span>
    }

    if (option.leading) {
      return (
        <span className="inline-flex items-center gap-1.5">
          {option.leading}
          <span>{option.label}</span>
        </span>
      )
    }

    if (showAvatarFallback) {
      return (
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
            {getAvatarText(option.label)}
          </span>
          <span>{option.label}</span>
        </span>
      )
    }

    return option.label
  }

  return (
    <Combobox<EntityPickerOption>
      items={limitedOptions}
      value={selectedOption}
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.id}
      isItemEqualToValue={(item, selectedValue) => item.id === selectedValue.id}
      onInputValueChange={(nextValue) => setSearchValue(nextValue)}
      onOpenChange={(open) => {
        if (open) {
          onOpen?.()
          return
        }
        setSearchValue("")
      }}
      onValueChange={(nextValue) => {
        if (!nextValue) return
        if (nextValue.id === "__unset__") {
          onSelect(undefined)
          return
        }
        onSelect(nextValue.id)
      }}
    >
      {trigger === "badge" ? (
        <ComboboxTrigger className="hover:bg-muted/60 rounded-md px-1 py-0.5 text-left transition-colors [&>svg:last-child]:hidden">
          {hasValue ? (
            <span className="bg-muted inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm">
              {showAvatarFallback ? (
                <span className="bg-muted-foreground/15 text-muted-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
                  {getAvatarText(valueLabel ?? "")}
                </span>
              ) : null}
              <span>{valueLabel}</span>
            </span>
          ) : (
            <span className="text-muted-foreground inline-flex items-center px-1 py-1 text-sm">
              {placeholder}
            </span>
          )}
        </ComboboxTrigger>
      ) : (
        <ComboboxTrigger
          disabled={!hasSelectableOptions}
          aria-label={placeholder}
          className="text-muted-foreground hover:bg-muted inline-flex size-6 items-center justify-center rounded-md transition-colors [&>svg:last-child]:hidden disabled:opacity-50"
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={1.6} className="size-4" />
        </ComboboxTrigger>
      )}

      <ComboboxContent align={align} className={cn(contentClassName)}>
        {hasSelectableOptions ? (
          <>
            <ComboboxInput placeholder={searchPlaceholder} showTrigger={false} showClear />
            <ComboboxEmpty>{emptySearchLabel}</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.id} value={item}>
                  {renderOption(item)}
                </ComboboxItem>
              )}
            </ComboboxList>
          </>
        ) : (
          <div className="text-muted-foreground px-2 py-2 text-sm">{emptyOptionsLabel}</div>
        )}
      </ComboboxContent>
    </Combobox>
  )
}
