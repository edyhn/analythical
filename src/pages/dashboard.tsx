import {
  Activity,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AsyncStates } from "@/components/states"
import { useFetch } from "@/hooks/use-fetch"
import { analythicalApi } from "@/lib/api"

const SAMPLE_DAILY = [
  { date: "Mon", count: 12 },
  { date: "Tue", count: 18 },
  { date: "Wed", count: 9 },
  { date: "Thu", count: 22 },
  { date: "Fri", count: 15 },
  { date: "Sat", count: 6 },
  { date: "Sun", count: 8 },
]

const STATS = [
  {
    label: "Total tasks",
    value: "128",
    icon: CheckCircle2,
    tone: "text-primary",
  },
  {
    label: "In progress",
    value: "14",
    icon: Clock,
    tone: "text-amber-500",
  },
  {
    label: "Completed",
    value: "92",
    icon: TrendingUp,
    tone: "text-emerald-500",
  },
  {
    label: "Activities today",
    value: "37",
    icon: Activity,
    tone: "text-violet-500",
  },
]

export function DashboardPage() {
  // Backend may be offline during Phase 1 (standalone scaffold); demo data
  // renders the dashboard's visual shell. Contract hook stays wired for Phase 2.
  void analythicalApi
  const { data, error, isLoading, refresh } = useFetch(
    () => analythicalApi.health(),
    [],
    { enabled: false },
  )

  void data

  return (
    <div className="flex flex-col gap-6">
      <AsyncStates
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        // The demo content below is the primary shell; only gate on real data
        // in Phase 2 when the backend contract is finalized.
        hasData={true}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className={`h-5 w-5 ${stat.tone}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SAMPLE_DAILY}>
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      width={28}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))" }}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid hsl(var(--border))",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    name: "Agent run completed",
                    detail: "Codex · ISSUE-12 task review",
                    time: "2m ago",
                  },
                  {
                    name: "Screenshot captured",
                    detail: "OpenCode · ISSUE-6 scaffold",
                    time: "18m ago",
                  },
                  {
                    name: "Issue moved to review",
                    detail: "Hermes · ISSUE-9 QA",
                    time: "1h ago",
                  },
                  {
                    name: "Backend build passed",
                    detail: "CI · main branch",
                    time: "3h ago",
                  },
                ].map((item) => (
                  <li key={item.name} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </AsyncStates>
    </div>
  )
}