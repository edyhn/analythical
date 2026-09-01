import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/layout/app-shell"

export function NotFoundPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </AppShell>
  )
}