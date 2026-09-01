import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SAMPLE_ACTIVITY = [
  { date: "Mon", tasks: 18, runs: 12 },
  { date: "Tue", tasks: 26, runs: 18 },
  { date: "Wed", tasks: 14, runs: 9 },
  { date: "Thu", tasks: 31, runs: 22 },
  { date: "Fri", tasks: 22, runs: 15 },
  { date: "Sat", tasks: 9, runs: 6 },
  { date: "Sun", tasks: 11, runs: 8 },
]

const SAMPLE_AGENTS = [
  { agent: "OpenCode", count: 148 },
  { agent: "Codex", count: 122 },
  { agent: "Hermes", count: 88 },
  { agent: "Mika", count: 56 },
]

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid hsl(var(--border))",
  fontSize: 12,
}

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workload trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SAMPLE_ACTIVITY}>
                  <defs>
                    <linearGradient id="tasksFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
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
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="hsl(var(--primary))"
                    fill="url(#tasksFill)"
                    strokeWidth={2}
                    name="Tasks"
                  />
                  <Area
                    type="monotone"
                    dataKey="runs"
                    stroke="hsl(var(--muted-foreground))"
                    fill="transparent"
                    strokeWidth={2}
                    name="Agent runs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity by agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SAMPLE_AGENTS} layout="vertical">
                  <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="agent"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                    barSize={18}
                    name="Activities"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}