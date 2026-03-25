"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  pages: "Pagina's",
  navigation: "Navigatie",
  appearance: "Uiterlijk",
  media: "Media",
  team: "Team",
  settings: "Instellingen",
  modules: "Modules",
  admin: "Admin",
  clients: "Klanten",
  new: "Nieuw",
  edit: "Bewerken",
  activity: "Activiteit",
  billing: "Facturatie",
  sessions: "Sessies",
  security: "Beveiliging",
  webhooks: "Webhooks",
}

type BreadcrumbsProps = {
  locale: string
}

export function Breadcrumbs({ locale }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Remove locale prefix
  const withoutLocale = pathname.replace(`/${locale}`, "")
  const segments = withoutLocale.split("/").filter(Boolean)

  if (segments.length <= 1) return null

  const crumbs = segments.map((segment, index) => {
    const href = `/${locale}/${segments.slice(0, index + 1).join("/")}`
    const label = segmentLabels[segment] ?? segment
    const isLast = index === segments.length - 1

    return { href, label, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href={`/${locale}/dashboard`}
        className="text-muted-foreground hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
