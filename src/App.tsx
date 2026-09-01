import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"

import { AppShell } from "@/components/layout/app-shell"
import { LoadingState } from "@/components/states"
import { NotFoundPage } from "@/pages/not-found"

const DashboardPage = lazy(() =>
  import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage })),
)
const AnalyticsPage = lazy(() =>
  import("@/pages/analytics").then((m) => ({ default: m.AnalyticsPage })),
)
const ActivitiesPage = lazy(() =>
  import("@/pages/activities").then((m) => ({ default: m.ActivitiesPage })),
)
const SettingsPage = lazy(() =>
  import("@/pages/settings").then((m) => ({ default: m.SettingsPage })),
)

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingState label="Loading page…" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          element={
            <AppShell>
              <DashboardPage />
            </AppShell>
          }
          path="/"
        />
        <Route
          element={
            <AppShell>
              <AnalyticsPage />
            </AppShell>
          }
          path="/analytics"
        />
        <Route
          element={
            <AppShell>
              <ActivitiesPage />
            </AppShell>
          }
          path="/activities"
        />
        <Route
          element={
            <AppShell>
              <SettingsPage />
            </AppShell>
          }
          path="/settings"
        />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Suspense>
  )
}