import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { API_BASE_URL } from "@/lib/config"

export function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>API connection</CardTitle>
          <CardDescription>
            The data source is the Fastify backend service. Override at runtime
            via the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">VITE_API_BASE_URL</code>{" "}
            environment variable.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="api-base-url">Base URL</Label>
            <Input id="api-base-url" defaultValue={API_BASE_URL} readOnly />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}