import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDuration } from "./formatters"
import type { StageEffectivenessEntry } from "./types"

export interface StageEffectivenessProps { data: StageEffectivenessEntry[] }

export function StageEffectiveness({ data }: StageEffectivenessProps) {
  return <Card><CardHeader><CardTitle className="text-base">Stage effectiveness</CardTitle><p className="text-sm text-muted-foreground">Sub-issue outcomes by workflow stage</p></CardHeader><CardContent>{data.length ? <div className="divide-y">{data.map((stage) => <div key={stage.stage} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 first:pt-0"><div><p className="text-sm font-medium">Stage {stage.stage}</p><p className="text-xs text-muted-foreground">{stage.total} tasks · {formatDuration(stage.average_completion_seconds)} average</p></div><div className="text-right"><p className="text-sm font-medium text-emerald-600">{stage.completed}</p><p className="text-[11px] text-muted-foreground">done</p></div><div className="text-right"><p className="text-sm font-medium text-amber-600">{stage.blocked}</p><p className="text-[11px] text-muted-foreground">blocked</p></div></div>)}</div> : <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No staged sub-issues in this period.</div>}</CardContent></Card>
}
