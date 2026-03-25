import { redirect } from "next/navigation"
import Link from "next/link"
import { Building2, CheckCircle2, FileText, TrendingUp } from "lucide-react"
import { setRequestLocale } from "next-intl/server"

import { auth } from "@/auth"
import { getAdminStatsAction } from "@/app/actions/admin"
import { isValidLocale } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "superadmin" && role !== "admin") {
    redirect(`/${locale}/dashboard`)
  }

  const stats = await getAdminStatsAction().catch(() => null)

  const statCards = [
    {
      label: "Totaal klanten",
      value: stats?.totalOrgs ?? 0,
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Actief",
      value: stats?.activeOrgs ?? 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      label: "Nieuw deze maand",
      value: stats?.newThisMonth ?? 0,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Gepubliceerde pagina's",
      value: stats?.totalPublishedPages ?? 0,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Overzicht"
        description="Platformstatistieken, recente klantgroei en snelle toegang tot beheeracties."
      />

      {/* Statistieken */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="surface-card rounded-[1.5rem] border-0 py-0">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-[1rem] p-3 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recente registraties */}
      {stats?.recentOrgs && stats.recentOrgs.length > 0 && (
        <Card className="surface-panel rounded-[1.8rem] border-0 py-0">
          <CardHeader>
            <CardTitle className="text-base">Recente Registraties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOrgs.map((org) => (
                <Link
                  key={org.id}
                  href={`/${locale}/admin/clients/${org.id}`}
                  className="flex items-center justify-between rounded-[1rem] p-3 transition-colors hover:bg-card/70"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[1rem] bg-primary/10 text-primary text-xs font-bold">
                      {org.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(org.owner as { email?: string } | null)?.email ?? ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(org.createdAt).toLocaleDateString("nl-BE")}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Link href={`/${locale}/admin/clients`}>
          <Button>Alle klanten bekijken</Button>
        </Link>
      </div>
    </div>
  )
}
