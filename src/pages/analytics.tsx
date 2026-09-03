import { useState } from "react"
import { AlertTriangle, CheckCircle2, Clock3, GitBranch, RefreshCw } from "lucide-react"

import { BlockerRootCauses, BreakdownChart, CompletionTimeline, StageEffectiveness, TimeInStatus, formatDuration, formatPercent } from "@/components/analytics"
import { AsyncStates } from "@/components/states"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useFetch } from "@/hooks/use-fetch"
import { analythicalApi, type AnalyticsPeriod } from "@/lib/api"

interface MetricCardProps { title: string; value: string; detail: string; icon: typeof CheckCircle2; tone: string }

function MetricCard({ title, value, detail, icon: Icon, tone }: MetricCardProps) {
  return <Card className="overflow-hidden"><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm text-muted-foreground">{title}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div><div className={`rounded-xl p-2.5 ${tone}`}><Icon className="h-5 w-5" /></div></CardContent></Card>
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("month")
  const { data, error, isLoading, isRefreshing, refresh } = useFetch(() => analythicalApi.getTaskAnalytics({ period }), [period])
  const retry = () => void refresh().catch(() => undefined)
  const rankedAgents = data ? [...data.byAgent].sort((left, right) =>
    right.completed - left.completed || right.completionRate - left.completionRate ||
    right.total - left.total || left.agent.localeCompare(right.agent),
  ).slice(0, 8) : undefined

  return <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="mb-2 flex items-center gap-2"><Badge variant="secondary">Task lifecycle</Badge><span className="text-xs text-muted-foreground">Live API metrics</span></div><h2 className="text-2xl font-semibold tracking-tight">Delivery performance</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Understand throughput, cycle time, blockers, and stage health across your workspace.</p></div>
      <div className="flex items-center gap-2"><select aria-label="Aggregation period" value={period} onChange={(event) => setPeriod(event.target.value as AnalyticsPeriod)} className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring"><option value="day">Daily</option><option value="week">Weekly</option><option value="month">Monthly</option></select><Button variant="outline" size="sm" onClick={retry} disabled={isRefreshing}><RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />Refresh</Button></div>
    </div>

    <AsyncStates isLoading={isLoading} error={error} hasData={Boolean(data?.totals.tasks)} onRetry={retry} loadingLabel="Calculating task analytics…" emptyTitle="No task data yet" emptyDescription="Collect workspace tasks to unlock completion, timing, and blocker insights.">
      {data && <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Completion rate" value={formatPercent(data.totals.completionRate)} detail={`${data.totals.completed} of ${data.totals.tasks} tasks completed`} icon={CheckCircle2} tone="bg-emerald-500/10 text-emerald-600" />
          <MetricCard title="Avg. completion time" value={formatDuration(data.totals.averageTimeToCompletionSeconds)} detail="From task creation to completion" icon={Clock3} tone="bg-blue-500/10 text-blue-600" />
          <MetricCard title="Blocker frequency" value={formatPercent(data.totals.blockerFrequency)} detail={`${data.totals.blockers} blocked tasks observed`} icon={AlertTriangle} tone="bg-amber-500/10 text-amber-600" />
          <MetricCard title="Sub-issue chains" value={String(data.subIssueChains.chains)} detail={`${formatPercent(data.subIssueChains.completionRate)} sub-issue completion`} icon={GitBranch} tone="bg-violet-500/10 text-violet-600" />
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]"><CompletionTimeline data={data.byTimePeriod} period={period} /><BlockerRootCauses data={data.blockers.rootCauses} /></div>
        <div className="grid gap-4 lg:grid-cols-2"><BreakdownChart title="Completion by priority" data={data.byPriority} category="priority" color="#2563eb" /><BreakdownChart title="Completion by agent" data={rankedAgents ?? []} category="agent" color="#7c3aed" /></div>
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]"><TimeInStatus data={data.timeInStatus} /><StageEffectiveness data={data.subIssueChains.byStage} /></div>
      </>}
    </AsyncStates>
  </div>
}
