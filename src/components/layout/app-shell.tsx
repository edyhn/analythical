import {
  Activity,
  BarChart3,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/activities", label: "Activities", icon: Activity },
  { to: "/settings", label: "Settings", icon: Settings },
]

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/analytics": "Analytics",
  "/activities": "Activities",
  "/settings": "Settings",
}

function SidebarNav() {
  return (
    <nav className="grid gap-1 px-2">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const currentTitle =
    PAGE_TITLES[location.pathname] ?? "Analythical WEB"

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Analythical
          </span>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <SidebarNav />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">{currentTitle}</h1>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Local
            </span>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  )
}