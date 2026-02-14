export type OpportunityOption = {
  id: string
  name: string
}

export const OPPORTUNITY_OPTIONS: OpportunityOption[] = [
  { id: "enterprise-plan-upgrade", name: "Enterprise Plan Upgrade" },
  { id: "renewal-fy26", name: "Renewal FY26" },
  { id: "new-region-rollout", name: "New Region Rollout" },
  { id: "security-addon", name: "Security Add-on" },
  { id: "multi-year-commit", name: "Multi-year Commitment" },
]

const OPPORTUNITY_BY_ID = new Map(OPPORTUNITY_OPTIONS.map((item) => [item.id, item]))

export function getOpportunityById(opportunityId: string) {
  return OPPORTUNITY_BY_ID.get(opportunityId) ?? null
}
