import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDuration, formatLabel } from "./formatters"
import type { TimeInStatusEntry } from "./types"

export interface TimeInStatusProps { data: TimeInStatusEntry[] }

export function TimeInStatus({ data }: TimeInStatusProps) {
  const maximumDuration = Math.max(...data.map((entry) => entry.average_seconds), 1)
  return <Card><CardHeader><CardTitle className="text-base">Average time in status</CardTitle><p className="text-sm text-muted-foreground">Where tasks spend their lifecycle</p></CardHeader><CardContent><div className="space-y-4">{data.map((item) => <div key={item.status}><div className="mb-1.5 flex justify-between text-sm"><span>{formatLabel(item.status)}</span><span className="font-medium tabular-nums">{formatDuration(item.average_seconds)}</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-cyan-600" style={{ width: `${Math.max((item.average_seconds / maximumDuration) * 100, 3)}%` }}/></div></div>)}</div></CardContent></Card>
}
