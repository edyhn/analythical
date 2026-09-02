import type { TaskAnalytics } from "@/lib/api"

export type PriorityBreakdown = TaskAnalytics["byPriority"][number]
export type AgentBreakdown = TaskAnalytics["byAgent"][number]
export type TimePeriodBreakdown = TaskAnalytics["byTimePeriod"][number]
export type TimeInStatusEntry = TaskAnalytics["timeInStatus"][number]
export type BlockerRootCause = TaskAnalytics["blockers"]["rootCauses"][number]
export type StageEffectivenessEntry = TaskAnalytics["subIssueChains"]["byStage"][number]
export type BreakdownDatum = PriorityBreakdown | AgentBreakdown
