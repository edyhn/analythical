import { RefreshCw, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { EmptyState, LoadingState } from "@/components/states"

const SAMPLE_ACTIVITIES = [
  {
    id: "1",
    agent: "OpenCode",
    event: "Scaffolded React + Vite app",
    time: "2 minutes ago",
    badge: "Frontend",
  },
  {
    id: "2",
    agent: "Codex",
    event: "Published Fastify API contract",
    time: "18 minutes ago",
    badge: "Backend",
  },
  {
    id: "3",
    agent: "Hermes",
    event: "Kicked off Phase 1 build",
    time: "1 hour ago",
    badge: "Product",
  },
  {
    id: "4",
    agent: "Mika",
    event: "Created ISSUE-6 · Project scaffold",
    time: "3 hours ago",
    badge: "Ops",
  },
]

export function ActivitiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent activity feed</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col">
            {SAMPLE_ACTIVITIES.map((item, index) => (
              <li key={item.id}>
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-1 flex-wrap items-start gap-2">
                    <p className="min-w-0 flex-1 text-sm">
                      <span className="font-medium">{item.agent}</span>{" "}
                      <span className="text-muted-foreground">
                        {item.event}
                      </span>
                    </p>
                    <Badge variant="secondary">{item.badge}</Badge>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>
                {index < SAMPLE_ACTIVITIES.length - 1 && (
                  <Separator className="my-4" />
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Legacy events</CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Users}
            title="No historical events"
            description="Older activity records will appear here once the Fastify backend is connected."
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <LoadingState label="Syncing with the API…" />
        </Card>
        <Card className="flex flex-col items-center justify-center gap-3 p-6">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Waiting for data source
          </CardTitle>
        </Card>
      </div>
    </div>
  )
}