import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { tooltipStyle } from "./chart-config"
import { formatLabel, formatPercent } from "./formatters"
import type { BreakdownDatum } from "./types"

export interface BreakdownChartProps { title: string; data: BreakdownDatum[]; category: "priority" | "agent"; color: string }

export function BreakdownChart({ title, data, category, color }: BreakdownChartProps) {
  return <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 6 }}><CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="3 3"/><XAxis type="number" domain={[0, 1]} tickFormatter={formatPercent} tickLine={false} axisLine={false} fontSize={11}/><YAxis type="category" dataKey={category} tickFormatter={formatLabel} tickLine={false} axisLine={false} width={86} fontSize={11}/><Tooltip formatter={(value: number) => formatPercent(value)} contentStyle={tooltipStyle}/><Bar isAnimationActive={false} dataKey="completionRate" fill={color} radius={[0, 5, 5, 0]} barSize={20} name="Completion rate"/></BarChart></ResponsiveContainer></div></CardContent></Card>
}
