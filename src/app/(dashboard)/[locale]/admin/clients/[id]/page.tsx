import { setRequestLocale } from "next-intl/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Globe, Mail, Calendar, Package, ToggleLeft, ToggleRight, LogIn } from "lucide-react"

import { auth } from "@/auth"
import { getClientAction, updateClientStatusAction } from "@/app/actions/admin"
import { startImpersonatingAction } from "@/app/actions/impersonate"
import { isValidLocale } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClientPackagesForm } from "@/components/admin/client-packages-form"
import { hisarPackages, looseModules, dashboardModules } from "@/lib/packages"

type AdminClientDetailPageProps = {
  params: Promise<{ locale: string; id: string }>
}

export default async function AdminClientDetailPage({ params }: AdminClientDetailPageProps) {
  const { locale, id } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "superadmin" && role !== "admin") {
    redirect(`/${locale}/dashboard`)
  }

  const client = await getClientAction(id).catch(() => null)
  if (!client) notFound()

  const settings = (client.settings as Record<string, unknown>) ?? {}
  const selectedPackages = (settings.selectedPackages as string[]) ?? []
  const selectedLoose = (settings.looseModules as string[]) ?? []
  const packageNotes = (settings.packageNotes as string) ?? ""
  const packagesUpdatedAt = settings.packagesUpdatedAt as string | undefined

  const packageNames = selectedPackages
    .map((id) => hisarPackages.find((p) => p.id === id)?.name)
    .filter(Boolean)

  const clientStats = [
    {
      label: "Pagina's",
      value: (client as { _count?: { pages: number } })._count?.pages ?? 0,
    },
    {
      label: "Teamleden",
      value: (client as { _count?: { members: number } })._count?.members ?? 0,
    },
    {
      label: "Actieve modules",
      value: client.modules.length,
    },
    {
      label: "Pakketten",
      value: selectedPackages.length,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="surface-panel flex flex-col gap-4 rounded-[1.9rem] px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex items-start gap-4">
          <Link
            href={`/${locale}/admin/clients`}
            className="interactive-border mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem] hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <Badge variant={client.status === "active" ? "default" : "secondary"}>
                {client.status === "active" ? "Actief" : "Gesuspendeerd"}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                {client.slug}
              </span>
              {client.owner && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {client.owner.email}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Klant sinds {new Date(client.createdAt).toLocaleDateString("nl-BE")}
              </span>
            </div>
          </div>
        </div>

        {/* Actieknoppen */}
        <div className="flex items-center gap-2">
          {/* Inloggen als klant */}
          <form
            action={async () => {
              "use server"
              await startImpersonatingAction(id)
              redirect(`/${locale}/dashboard`)
            }}
          >
            <Button type="submit" variant="outline" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Inloggen als klant
            </Button>
          </form>

          {/* Status toggle */}
          <form
            action={async () => {
              "use server"
              const newStatus = client.status === "active" ? "suspended" : "active"
              await updateClientStatusAction(id, newStatus)
            }}
          >
            <Button
              type="submit"
              variant={client.status === "active" ? "outline" : "default"}
              size="sm"
              className="gap-2"
            >
              {client.status === "active" ? (
                <><ToggleLeft className="h-4 w-4" />Suspenderen</>
              ) : (
                <><ToggleRight className="h-4 w-4" />Activeren</>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {clientStats.map((stat) => (
          <Card key={stat.label} className="surface-card rounded-[1.4rem] border-0 py-0">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current packages overview */}
      {selectedPackages.length > 0 && (
        <Card className="surface-card rounded-[1.8rem] border-0 py-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4 text-primary" />
                Huidige pakketten
              </CardTitle>
              {packagesUpdatedAt && (
                <span className="text-xs text-muted-foreground">
                  Bijgewerkt: {new Date(packagesUpdatedAt).toLocaleDateString("nl-BE")}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {packageNames.map((name) => (
                <Badge key={name} className="text-xs">
                  {name}
                </Badge>
              ))}
              {selectedLoose.map((id) => {
                const mod = looseModules.find((m) => m.id === id)
                return (
                  <Badge key={id} variant="secondary" className="text-xs">
                    + {mod?.name ?? id}
                  </Badge>
                )
              })}
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                Actieve dashboard modules ({client.modules.length}):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {client.modules.map((modId) => {
                  const mod = dashboardModules.find((m) => m.id === modId)
                  return (
                    <Badge key={modId} variant="outline" className="text-xs">
                      {mod?.label ?? modId}
                    </Badge>
                  )
                })}
              </div>
            </div>
            {packageNotes && (
              <div className="rounded-[1rem] bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Notities: </span>
                {packageNotes}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Package assignment form */}
      <Card className="surface-panel rounded-[1.8rem] border-0 py-0">
        <CardHeader>
          <CardTitle>Pakketten & Modules Beheren</CardTitle>
          <CardDescription>
            Selecteer welke HisarWeb pakketten en modules actief zijn voor deze klant.
            Modules worden automatisch ontgrendeld op basis van de geselecteerde pakketten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientPackagesForm
            orgId={id}
            currentPackages={selectedPackages}
            currentLooseModules={selectedLoose}
            currentModules={client.modules}
            currentNotes={packageNotes}
            currentPlan={client.plan}
          />
        </CardContent>
      </Card>
    </div>
  )
}
