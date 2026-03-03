import {
  getCompanyAccountOwner,
  type CompanyRecord,
} from "@/lib/companies"
import { getOpportunityById } from "@/lib/opportunities"
import { getPersonNameById } from "@/lib/people"

export type CompanyTaskStatus =
  | "in-progress"
  | "ready-for-review"
  | "blocked"
  | "todo"
  | "done"

export type CompanyTaskItem = {
  id: string
  status: CompanyTaskStatus
  title: string
  subtitle: string
  timeLabel: string
  highlighted?: boolean
}

export const companyTaskStatusOrder: CompanyTaskStatus[] = [
  "in-progress",
  "ready-for-review",
  "blocked",
  "todo",
  "done",
]

export const companyTaskStatusLabel: Record<CompanyTaskStatus, string> = {
  "in-progress": "In progress",
  "ready-for-review": "Ready for review",
  blocked: "Blocked",
  todo: "To do",
  done: "Done",
}

export function formatTaskTimeLabel(minutesAgo: number) {
  if (minutesAgo <= 0) return "now"
  if (minutesAgo < 60) return `${minutesAgo}m`
  const hours = Math.floor(minutesAgo / 60)
  return `${hours}h`
}

export function createCompanyTaskId(companyId: string) {
  return `${companyId}-task-user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function buildCompanyTaskItems(company: CompanyRecord): CompanyTaskItem[] {
  const relatedOpportunities = (company.opportunityIds ?? [])
    .map((opportunityId) => getOpportunityById(opportunityId))
    .filter((item): item is NonNullable<ReturnType<typeof getOpportunityById>> => item !== null)

  const ownerLabel = getCompanyAccountOwner(company) ?? "Unassigned owner"
  const peopleCount = company.peopleIds?.length ?? 0
  const leadPersonLabel = company.peopleIds?.[0]
    ? getPersonNameById(company.peopleIds[0])
    : "No contact linked"
  const domainLabel = company.domain ?? `${company.name.toLowerCase().replaceAll(/\s+/g, "")}.com`
  const primaryOpportunity = relatedOpportunities[0]?.name ?? `${company.name} account plan`
  const secondaryOpportunity = relatedOpportunities[1]?.name ?? `${company.name} renewal track`
  const opportunitySummary =
    relatedOpportunities.length > 0
      ? relatedOpportunities
          .slice(0, 2)
          .map((item) => item.name)
          .join(" · ")
      : "No linked opportunities yet"
  const baseMinutes = company.createdAtMinutes

  return [
    {
      id: `${company.id}-task-analysis`,
      status: "in-progress",
      title: `Analyze account signals for ${company.name}`,
      subtitle: "Collecting timeline activity",
      timeLabel: "now",
    },
    {
      id: `${company.id}-task-plan`,
      status: "in-progress",
      title: `Draft execution plan for ${primaryOpportunity}`,
      subtitle: `Preparing recommendations for ${ownerLabel}`,
      timeLabel: "now",
    },
    {
      id: `${company.id}-task-review-brief`,
      status: "ready-for-review",
      title: `Review next-step brief for ${primaryOpportunity}`,
      subtitle: `Account owner: ${ownerLabel}`,
      timeLabel: formatTaskTimeLabel(baseMinutes + 4),
      highlighted: true,
    },
    {
      id: `${company.id}-task-review-contacts`,
      status: "ready-for-review",
      title: "Validate contact mapping",
      subtitle: peopleCount > 0 ? `${peopleCount} linked contacts` : "No contact linked yet",
      timeLabel: formatTaskTimeLabel(baseMinutes + 8),
    },
    {
      id: `${company.id}-task-review-profile`,
      status: "ready-for-review",
      title: `Review company profile for ${company.name}`,
      subtitle: `Domain: ${domainLabel}`,
      timeLabel: formatTaskTimeLabel(baseMinutes + 13),
    },
    {
      id: `${company.id}-task-blocked-security`,
      status: "blocked",
      title: "Finalize security questionnaire",
      subtitle: "Waiting for legal feedback",
      timeLabel: formatTaskTimeLabel(baseMinutes + 20),
    },
    {
      id: `${company.id}-task-blocked-procurement`,
      status: "blocked",
      title: "Confirm procurement approver",
      subtitle: peopleCount > 0 ? `Need confirmation from ${leadPersonLabel}` : "Missing stakeholder owner",
      timeLabel: formatTaskTimeLabel(baseMinutes + 26),
    },
    {
      id: `${company.id}-task-todo-update`,
      status: "todo",
      title: `Prepare weekly update for ${company.name}`,
      subtitle: `Send recap to ${ownerLabel}`,
      timeLabel: formatTaskTimeLabel(baseMinutes + 34),
    },
    {
      id: `${company.id}-task-todo-meeting`,
      status: "todo",
      title: `Schedule check-in for ${secondaryOpportunity}`,
      subtitle: "Generating plan",
      timeLabel: formatTaskTimeLabel(baseMinutes + 41),
    },
    {
      id: `${company.id}-task-done-profile`,
      status: "done",
      title: "Synced CRM account metadata",
      subtitle: "Address, domain, and LinkedIn verified",
      timeLabel: formatTaskTimeLabel(baseMinutes + 52),
    },
    {
      id: `${company.id}-task-done-opportunities`,
      status: "done",
      title: `Opportunity links refreshed (${relatedOpportunities.length})`,
      subtitle: opportunitySummary,
      timeLabel: formatTaskTimeLabel(baseMinutes + 65),
    },
  ]
}
