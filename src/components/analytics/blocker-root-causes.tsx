import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { chartColors, tooltipStyle } from "./chart-config"
import { formatLabel, formatPercent } from "./formatters"
import type { BlockerRootCause } from "./types"

export interface BlockerRootCausesProps { data: BlockerRootCause[] }

export function BlockerRootCauses({ data }: BlockerRootCausesProps) {
  return <Card><CardHeader><CardTitle className="text-base">Blocker root causes</CardTitle><p className="text-sm text-muted-foreground">What most often slows delivery</p></CardHeader><CardContent>{data.length ? <div className="grid items-center gap-3 sm:grid-cols-[1fr_1.1fr] xl:grid-cols-1 2xl:grid-cols-[1fr_1.1fr]"><div className="h-44"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie isAnimationActive={false} data={data} dataKey="count" nameKey="category" innerRadius={46} outerRadius={70} paddingAngle={3}>{data.map((item, index) => <Cell key={item.category} fill={chartColors[index % chartColors.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/></PieChart></ResponsiveContainer></div><div className="space-y-3">{data.map((item, index) => <div key={item.category} className="flex items-center gap-3 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{ background: chartColors[index % chartColors.length] }}/><span className="flex-1 text-muted-foreground">{formatLabel(item.category)}</span><span className="font-medium tabular-nums">{formatPercent(item.share)}</span></div>)}</div></div> : <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">No blockers in this period — nice work.</div>}</CardContent></Card>
}
