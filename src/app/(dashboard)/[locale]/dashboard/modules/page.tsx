import { setRequestLocale } from "next-intl/server"
import { Package, Puzzle, CheckCircle2, Lock } from "lucide-react"

import { auth } from "@/auth"
import { isValidLocale } from "@/lib/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/dashboard/page-header"
import { getOrganizationAction } from "@/app/actions/organization"
import {
  hisarPackages,
  looseModules,
  dashboardModules,
  packageCategoryLabels,
  packageCategoryOrder,
} from "@/lib/packages"

export default async function ClientModulesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  if (!session?.user) return null

  const org = await getOrganizationAction().catch(() => null)
  if (!org) return null

  const settings = (org.settings as Record<string, unknown>) ?? {}
  const selectedPackages = (settings.selectedPackages as string[]) ?? []
  const selectedLoose = (settings.looseModules as string[]) ?? []
  const activeModules = org.modules as string[]

  // Groepeer pakketten per categorie
  const grouped = packageCategoryOrder
    .map((cat) => ({
      category: cat,
      label: packageCategoryLabels[cat],
      packages: hisarPackages.filter(
        (p) => p.category === cat && selectedPackages.includes(p.id)
      ),
    }))
    .filter((g) => g.packages.length > 0)

  const activeLoose = looseModules.filter((m) => selectedLoose.includes(m.id))

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mijn Pakketten & Modules"
        description="Een overzicht van alle services en dashboard-functies die actief zijn voor jouw website."
      />

      {/* Active packages */}
      {selectedPackages.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Actieve Pakketten</h2>
          </div>

          {grouped.map(({ category, label, packages }) => (
            <div key={category}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className="surface-card rounded-[1.5rem] border-0 py-0">
                    <CardHeader className="pb-2 pt-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <CardTitle className="text-sm">{pkg.name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">{pkg.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <ul className="space-y-1">
                        {pkg.features.slice(0, 4).map((f) => (
                          <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {f}
                          </li>
                        ))}
                        {pkg.features.length > 4 && (
                          <li className="text-xs text-muted-foreground">
                            +{pkg.features.length - 4} meer...
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-medium">Geen pakketten geselecteerd</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Neem contact op met HisarWeb om pakketten te activeren.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loose modules */}
      {activeLoose.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Actieve Add-ons</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {activeLoose.map((mod) => (
              <Card key={mod.id} className="border-border/60">
              <CardContent className="flex items-center gap-3 p-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                <div>
                    <p className="text-sm font-medium">{mod.name}</p>
                    <p className="text-xs text-muted-foreground">{mod.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard modules grid */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">Dashboard Modules</h2>
        <p className="text-sm text-muted-foreground">
          Welke pagina-types en functies beschikbaar zijn in de editor.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {dashboardModules.map((mod) => {
            const isActive = activeModules.includes(mod.id)
            return (
            <div
              key={mod.id}
              className={`flex items-center gap-3 rounded-[1.2rem] border p-3 ${
                isActive
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                    : "border-border/40 bg-card/40 opacity-50"
                }`}
              >
                {isActive ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                )}
                <div>
                  <p className="text-sm font-medium">{mod.label}</p>
                  {isActive && (
                    <Badge variant="outline" className="mt-0.5 text-xs border-green-200 text-green-700">
                      Actief
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Contact CTA */}
      <Card className="surface-panel rounded-[1.8rem] border-0 bg-gradient-to-br from-primary/5 to-primary/10 py-0">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Extra modules nodig?</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Neem contact op met HisarWeb om pakketten uit te breiden of nieuwe modules te activeren.
            </p>
          </div>
          <a
            href="mailto:info@hisarweb.be"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Contact opnemen
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
