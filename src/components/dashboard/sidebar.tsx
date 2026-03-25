"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Navigation,
  Palette,
  Image,
  Users,
  ExternalLink,
  ChevronLeft,
  Building2,
  ShieldCheck,
  Package,
  BarChart3,
  Activity,
} from "lucide-react"

import { cn } from "@/lib/utils"

type SidebarProps = {
  locale: string
  siteName: string
  role?: string
  collapsed?: boolean
  onToggle?: () => void
}

const clientNavItems = [
  { href: "/dashboard", label: "Overzicht", icon: LayoutDashboard },
  { href: "/dashboard/pages", label: "Pagina's", icon: FileText },
  { href: "/dashboard/navigation", label: "Navigatie", icon: Navigation },
  { href: "/dashboard/appearance", label: "Uiterlijk", icon: Palette },
  { href: "/dashboard/media", label: "Media", icon: Image },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/modules", label: "Mijn Pakketten", icon: Package },
  { href: "/dashboard/activity", label: "Activiteit", icon: Activity },
  { href: "/dashboard/settings", label: "Instellingen", icon: Settings },
]

const adminNavItems = [
  { href: "/admin", label: "Admin Overzicht", icon: BarChart3 },
  { href: "/admin/clients", label: "Klanten", icon: Building2 },
]

export function DashboardSidebar({ locale, siteName, role, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = role === "superadmin" || role === "admin"

  function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
    const fullHref = `/${locale}${href}`
    const isActive =
      pathname === fullHref ||
      (href !== "/dashboard" && href !== "/admin" && pathname.startsWith(fullHref))

    return (
      <Link
        href={fullHref}
        className={cn(
          "flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary shadow-[0_16px_32px_-24px_rgba(22,100,216,0.65)]"
            : "text-muted-foreground hover:bg-white/80 hover:text-foreground",
          collapsed && "justify-center px-2"
        )}
        title={collapsed ? label : undefined}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "surface-panel m-4 mr-0 flex h-[calc(100vh-2rem)] flex-col rounded-[2rem] transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex min-h-18 items-center justify-between border-b border-border/60 px-4">
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
              Admin space
            </p>
            <span className="mt-1 block truncate text-sm font-semibold">{siteName}</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="interactive-border rounded-full p-1.5 text-muted-foreground hover:bg-white/80 hover:text-foreground"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Client nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {clientNavItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        {/* Admin sectie */}
        {isAdmin && (
          <>
            <div className={cn("my-3 border-t border-border", collapsed && "mx-2")} />
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 py-2">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/60" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Admin
                </span>
              </div>
            )}
            {adminNavItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/60 p-3">
        <Link
          href={`/${locale}`}
          className={cn(
            "flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-white/80 hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Bekijk website" : undefined}
      >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Bekijk website</span>}
        </Link>
      </div>
    </aside>
  )
}
