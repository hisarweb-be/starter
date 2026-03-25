import { setRequestLocale } from "next-intl/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Building2, Plus, Search, Users, Globe, CheckCircle2, PauseCircle } from "lucide-react"

import { auth } from "@/auth"
import { listClientsAction } from "@/app/actions/admin"
import { isValidLocale } from "@/lib/site"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { hisarPackages } from "@/lib/packages"

export default async function AdminClientsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ search?: string; status?: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "superadmin" && role !== "admin") {
    redirect(`/${locale}/dashboard`)
  }

  const { search, status } = await searchParams
  const clients = await listClientsAction({ search, status }).catch(() => [])

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    suspended: clients.filter((c) => c.status === "suspended").length,
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Klantenbeheer"
        description="Beheer klanten, pakketten en status vanuit één centraal overzicht."
        actions={
          <Link href={`/${locale}/register`}>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nieuwe klant
            </Button>
          </Link>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="surface-card rounded-[1.5rem] border-0 py-0">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Totaal klanten</p>
            </div>
          </CardContent>
        </Card>
        <Card className="surface-card rounded-[1.5rem] border-0 py-0">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-green-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Actief</p>
            </div>
          </CardContent>
        </Card>
        <Card className="surface-card rounded-[1.5rem] border-0 py-0">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <PauseCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">{stats.suspended}</p>
              <p className="text-xs text-muted-foreground">Gesuspendeerd</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & filter */}
      <form method="GET" className="surface-panel flex gap-3 rounded-[1.6rem] px-4 py-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Zoek op naam of slug..."
            className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? ""}
          className="flex h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Alle statussen</option>
          <option value="active">Actief</option>
          <option value="suspended">Gesuspendeerd</option>
        </select>
        <Button type="submit" variant="outline" size="sm" className="h-10">
          Zoeken
        </Button>
      </form>

      {/* Clients table */}
      {clients.length === 0 ? (
        <Card className="surface-panel rounded-[1.8rem] border-dashed py-0">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm font-medium">Geen klanten gevonden</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search ? "Probeer een andere zoekterm." : "Registreer de eerste klant via de knop hierboven."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => {
            const settings = (client.settings as Record<string, unknown>) ?? {}
            const selectedPackages = (settings.selectedPackages as string[]) ?? []
            const packageNames = selectedPackages
              .map((id) => hisarPackages.find((p) => p.id === id)?.name)
              .filter(Boolean)

            return (
              <Link
                key={client.id}
                href={`/${locale}/admin/clients/${client.id}`}
                className="block"
              >
                <Card className="surface-card rounded-[1.5rem] border-0 py-0 transition-all hover:-translate-y-0.5">
                  <CardContent className="flex items-center gap-4 p-4">
                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-primary/10 text-primary font-semibold text-sm">
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{client.name}</span>
                        <Badge
                          variant={client.status === "active" ? "default" : "secondary"}
                          className="shrink-0 text-xs"
                        >
                          {client.status === "active" ? "Actief" : "Gesuspendeerd"}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {client.slug}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {(client as { _count?: { pages: number; members: number } })._count?.members ?? 0} leden
                        </span>
                        <span>{(client as { _count?: { pages: number; members: number } })._count?.pages ?? 0} pagina&apos;s</span>
                        {client.owner && (
                          <span className="truncate">{client.owner.email}</span>
                        )}
                      </div>
                    </div>

                    {/* Packages */}
                    <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
                      {packageNames.length > 0 ? (
                        <div className="flex flex-wrap justify-end gap-1">
                          {packageNames.slice(0, 3).map((name) => (
                            <Badge key={name} variant="secondary" className="text-xs">
                              {name}
                            </Badge>
                          ))}
                          {packageNames.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{packageNames.length - 3}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">Geen pakketten</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {client.modules.length} modules actief
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
