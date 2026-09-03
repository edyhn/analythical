import { API_BASE_URL, API_TIMEOUT_MS } from "@/lib/config"
import { api } from "@/lib/api/client"

const apiUrl = (path: string) => `${API_BASE_URL}${path}`

export interface HealthResponse {
  status: string
}

export interface ActivityItem {
  id: string
  name: string
  /** Agent/source that performed the activity, e.g. "OpenCode", "Codex". */
  agent?: string
  kind: string
  occurredAt: string
}

export interface TaskSummary {
  total: number
  done: number
  inProgress: number
  blocked: number
}

export interface AnalyticsSnapshot {
  period: string
  tasks: TaskSummary
  activitiesByDay: { date: string; count: number }[]
  activitiesByAgent: { agent: string; count: number }[]
}

export type AnalyticsPeriod = "day" | "week" | "month"

export interface CompletionBreakdown {
  total: number
  completed: number
  completionRate: number
}

export interface TaskAnalytics {
  filters: { from: string | null; to: string | null; agentId: string | null; priority: string | null; period: AnalyticsPeriod }
  totals: { tasks: number; completed: number; completionRate: number; averageTimeToCompletionSeconds: number | null; blockers: number; blockerFrequency: number }
  byPriority: Array<CompletionBreakdown & { priority: string }>
  byAgent: Array<CompletionBreakdown & { agent: string }>
  byTimePeriod: Array<CompletionBreakdown & { period: string }>
  timeInStatus: Array<{ status: string; transitions: number; average_seconds: number }>
  blockers: { rootCauses: Array<{ category: string; count: number; share: number }> }
  subIssueChains: {
    chains: number; sub_issues: number; completed: number; blocked: number; completionRate: number; blockerFrequency: number
    byStage: Array<{ stage: number; total: number; completed: number; blocked: number; average_completion_seconds: number | null }>
  }
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * Analythical API client.
 *
 * These methods target the Fastify backend service. Contracts are placeholders
 * until the backend endpoints are finalized (ISSUE-XX / Codex track); each
 * method is isolated so endpoint URLs can be adjusted in one place.
 */
export const analythicalApi = {
  async health(): Promise<HealthResponse> {
    return api.get<HealthResponse>(apiUrl("/health"), API_TIMEOUT_MS)
  },

  async getActivities(params?: {
    page?: number
    pageSize?: number
    agent?: string
  }): Promise<Paginated<ActivityItem>> {
    const search = new URLSearchParams()
    if (params?.page) search.set("page", String(params.page))
    if (params?.pageSize) search.set("pageSize", String(params.pageSize))
    if (params?.agent) search.set("agent", params.agent)
    const qs = search.toString()
    return api.get<Paginated<ActivityItem>>(
      apiUrl(qs ? `/activities?${qs}` : "/activities"),
      API_TIMEOUT_MS,
    )
  },

  async getAnalytics(params?: {
    from?: string
    to?: string
  }): Promise<AnalyticsSnapshot> {
    const search = new URLSearchParams()
    if (params?.from) search.set("from", params.from)
    if (params?.to) search.set("to", params.to)
    const qs = search.toString()
    return api.get<AnalyticsSnapshot>(
      apiUrl(qs ? `/analytics?${qs}` : "/analytics"),
      API_TIMEOUT_MS,
    )
  },

  async getTaskAnalytics(params?: { from?: string; to?: string; agentId?: string; priority?: string; period?: AnalyticsPeriod }): Promise<TaskAnalytics> {
    const search = new URLSearchParams()
    if (params?.from) search.set("from", params.from)
    if (params?.to) search.set("to", params.to)
    if (params?.agentId) search.set("agentId", params.agentId)
    if (params?.priority) search.set("priority", params.priority)
    if (params?.period) search.set("period", params.period)
    const qs = search.toString()
    return api.get<TaskAnalytics>(apiUrl(`/api/analytics/tasks${qs ? `?${qs}` : ""}`), API_TIMEOUT_MS)
  },
}
