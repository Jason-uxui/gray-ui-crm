import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type PageHeaderBreadcrumb = {
  label: string
  href?: string
  icon?: React.ComponentProps<typeof HugeiconsIcon>["icon"]
}

type PageHeaderProps = {
  title?: string
  description?: string
  breadcrumbs?: PageHeaderBreadcrumb[]
  meta?: React.ReactNode
  actions?: React.ReactNode
}

/**
 * Fixed page heading block.
 * Keep this at the top of `PageMain`; body spacing belongs to `PageInset`.
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  meta,
  actions,
}: PageHeaderProps) {
  const breadcrumbItems =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : title
        ? [{ label: title }]
        : []

  if (breadcrumbItems.length > 0) {
    return (
      <div className="shrink-0 border-b pr-2 pl-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1
                  const content = (
                    <span className="inline-flex items-center gap-1.5">
                      {item.icon ? (
                        <HugeiconsIcon
                          icon={item.icon}
                          strokeWidth={1.5}
                          className="size-4 shrink-0 self-center text-muted-foreground"
                        />
                      ) : null}
                      <span className="leading-5">{item.label}</span>
                    </span>
                  )

                  return (
                    <React.Fragment key={`${item.label}-${index}`}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{content}</BreadcrumbPage>
                        ) : item.href ? (
                          <BreadcrumbLink href={item.href}>{content}</BreadcrumbLink>
                        ) : (
                          content
                        )}
                      </BreadcrumbItem>
                      {!isLast ? <BreadcrumbSeparator /> : null}
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {meta || actions ? (
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {meta ? (
                <div className="text-muted-foreground text-sm font-semibold tracking-[0.08em] uppercase">
                  {meta}
                </div>
              ) : null}
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="shrink-0 space-y-0 border-b p-3">
      <div className="flex min-w-0 items-start gap-3">
        <div className="min-w-0 flex-1">
          {title ? <h1 className="text-2xl font-semibold">{title}</h1> : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
