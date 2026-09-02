import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalyticsPeriod } from "@/lib/api"
import { tooltipStyle } from "./chart-config"
import type { TimePeriodBreakdown } from "./types"

export interface CompletionTimelineProps { data: TimePeriodBreakdown[]; period: AnalyticsPeriod }

export function CompletionTimeline({ data, period }: CompletionTimelineProps) {
  return <Card><CardHeader><CardTitle className="text-base">Completion over time</CardTitle><p className="text-sm text-muted-foreground">Completed tasks against total tasks per {period}</p></CardHeader><CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ left: -16, right: 8 }}><defs><linearGradient id="completionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.26}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3"/><XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={11}/><YAxis tickLine={false} axisLine={false} fontSize={11}/><Tooltip contentStyle={tooltipStyle}/><Area isAnimationActive={false} type="monotone" dataKey="total" stroke="#94a3b8" fill="transparent" strokeWidth={2} name="Total"/><Area isAnimationActive={false} type="monotone" dataKey="completed" stroke="#2563eb" fill="url(#completionFill)" strokeWidth={2.5} name="Completed"/></AreaChart></ResponsiveContainer></div></CardContent></Card>
}
