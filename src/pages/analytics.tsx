import { useState } from "react"
import { AlertTriangle, CheckCircle2, Clock3, GitBranch, RefreshCw } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { AsyncStates } from "@/components/states"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFetch } from "@/hooks/use-fetch"
import { analythicalApi, type AnalyticsPeriod } from "@/lib/api"

const tooltipStyle = { borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }
const colors = ["#2563eb", "#7c3aed", "#0891b2", "#d97706", "#dc2626", "#64748b"]
const label = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase())
const percent = (value: number) => `${Math.round(value * 100)}%`
const duration = (seconds: number | null) => {
  if (seconds === null || !Number.isFinite(seconds)) return "—"
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`
  return `${(seconds / 86400).toFixed(1)}d`
}

function MetricCard({ title, value, detail, icon: Icon, tone }: { title: string; value: string; detail: string; icon: typeof CheckCircle2; tone: string }) {
  return <Card className="overflow-hidden"><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm text-muted-foreground">{title}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div><div className={`rounded-xl p-2.5 ${tone}`}><Icon className="h-5 w-5" /></div></CardContent></Card>
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("month")
  const { data, error, isLoading, isRefreshing, refresh } = useFetch(() => analythicalApi.getTaskAnalytics({ period }), [period])
  const retry = () => void refresh().catch(() => undefined)

  return <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="mb-2 flex items-center gap-2"><Badge variant="secondary">Task lifecycle</Badge><span className="text-xs text-muted-foreground">Live API metrics</span></div><h2 className="text-2xl font-semibold tracking-tight">Delivery performance</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Understand throughput, cycle time, blockers, and stage health across your workspace.</p></div>
      <div className="flex items-center gap-2"><select aria-label="Aggregation period" value={period} onChange={(event) => setPeriod(event.target.value as AnalyticsPeriod)} className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring"><option value="day">Daily</option><option value="week">Weekly</option><option value="month">Monthly</option></select><Button variant="outline" size="sm" onClick={retry} disabled={isRefreshing}><RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />Refresh</Button></div>
    </div>

    <AsyncStates isLoading={isLoading} error={error} hasData={Boolean(data?.totals.tasks)} onRetry={retry} loadingLabel="Calculating task analytics…" emptyTitle="No task data yet" emptyDescription="Collect workspace tasks to unlock completion, timing, and blocker insights.">
      {data && <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Completion rate" value={percent(data.totals.completionRate)} detail={`${data.totals.completed} of ${data.totals.tasks} tasks completed`} icon={CheckCircle2} tone="bg-emerald-500/10 text-emerald-600" />
          <MetricCard title="Avg. completion time" value={duration(data.totals.averageTimeToCompletionSeconds)} detail="From task creation to completion" icon={Clock3} tone="bg-blue-500/10 text-blue-600" />
          <MetricCard title="Blocker frequency" value={percent(data.totals.blockerFrequency)} detail={`${data.totals.blockers} blocked tasks observed`} icon={AlertTriangle} tone="bg-amber-500/10 text-amber-600" />
          <MetricCard title="Sub-issue chains" value={String(data.subIssueChains.chains)} detail={`${percent(data.subIssueChains.completionRate)} sub-issue completion`} icon={GitBranch} tone="bg-violet-500/10 text-violet-600" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
          <Card><CardHeader><CardTitle className="text-base">Completion over time</CardTitle><p className="text-sm text-muted-foreground">Completed tasks against total tasks per {period}</p></CardHeader><CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.byTimePeriod} margin={{ left: -16, right: 8 }}><defs><linearGradient id="completionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.26}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3"/><XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={11}/><YAxis tickLine={false} axisLine={false} fontSize={11}/><Tooltip contentStyle={tooltipStyle}/><Area isAnimationActive={false} type="monotone" dataKey="total" stroke="#94a3b8" fill="transparent" strokeWidth={2} name="Total"/><Area isAnimationActive={false} type="monotone" dataKey="completed" stroke="#2563eb" fill="url(#completionFill)" strokeWidth={2.5} name="Completed"/></AreaChart></ResponsiveContainer></div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Blocker root causes</CardTitle><p className="text-sm text-muted-foreground">What most often slows delivery</p></CardHeader><CardContent>{data.blockers.rootCauses.length ? <div className="grid items-center gap-3 sm:grid-cols-[1fr_1.1fr] xl:grid-cols-1 2xl:grid-cols-[1fr_1.1fr]"><div className="h-44"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie isAnimationActive={false} data={data.blockers.rootCauses} dataKey="count" nameKey="category" innerRadius={46} outerRadius={70} paddingAngle={3}>{data.blockers.rootCauses.map((item, index) => <Cell key={item.category} fill={colors[index % colors.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/></PieChart></ResponsiveContainer></div><div className="space-y-3">{data.blockers.rootCauses.map((item, index) => <div key={item.category} className="flex items-center gap-3 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[index % colors.length] }}/><span className="flex-1 text-muted-foreground">{label(item.category)}</span><span className="font-medium tabular-nums">{percent(item.share)}</span></div>)}</div></div> : <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">No blockers in this period — nice work.</div>}</CardContent></Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <BreakdownChart title="Completion by priority" data={data.byPriority} category="priority" color="#2563eb" />
          <BreakdownChart title="Completion by agent" data={data.byAgent.slice(0, 8)} category="agent" color="#7c3aed" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <Card><CardHeader><CardTitle className="text-base">Average time in status</CardTitle><p className="text-sm text-muted-foreground">Where tasks spend their lifecycle</p></CardHeader><CardContent><div className="space-y-4">{data.timeInStatus.map((item) => { const max = Math.max(...data.timeInStatus.map((entry) => entry.average_seconds), 1); return <div key={item.status}><div className="mb-1.5 flex justify-between text-sm"><span>{label(item.status)}</span><span className="font-medium tabular-nums">{duration(item.average_seconds)}</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-cyan-600" style={{ width: `${Math.max((item.average_seconds / max) * 100, 3)}%` }}/></div></div>})}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Stage effectiveness</CardTitle><p className="text-sm text-muted-foreground">Sub-issue outcomes by workflow stage</p></CardHeader><CardContent>{data.subIssueChains.byStage.length ? <div className="divide-y">{data.subIssueChains.byStage.map((stage) => <div key={stage.stage} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 first:pt-0"><div><p className="text-sm font-medium">Stage {stage.stage}</p><p className="text-xs text-muted-foreground">{stage.total} tasks · {duration(stage.average_completion_seconds)} average</p></div><div className="text-right"><p className="text-sm font-medium text-emerald-600">{stage.completed}</p><p className="text-[11px] text-muted-foreground">done</p></div><div className="text-right"><p className="text-sm font-medium text-amber-600">{stage.blocked}</p><p className="text-[11px] text-muted-foreground">blocked</p></div></div>)}</div> : <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No staged sub-issues in this period.</div>}</CardContent></Card>
        </div>
      </>}
    </AsyncStates>
  </div>
}

function BreakdownChart({ title, data, category, color }: { title: string; data: Array<{ completionRate: number; total: number; completed: number; priority?: string; agent?: string }>; category: "priority" | "agent"; color: string }) {
  return <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 6 }}><CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="3 3"/><XAxis type="number" domain={[0, 1]} tickFormatter={percent} tickLine={false} axisLine={false} fontSize={11}/><YAxis type="category" dataKey={category} tickFormatter={label} tickLine={false} axisLine={false} width={86} fontSize={11}/><Tooltip formatter={(value: number) => percent(value)} contentStyle={tooltipStyle}/><Bar isAnimationActive={false} dataKey="completionRate" fill={color} radius={[0, 5, 5, 0]} barSize={20} name="Completion rate"/></BarChart></ResponsiveContainer></div></CardContent></Card>
}
