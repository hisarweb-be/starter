import { setRequestLocale } from "next-intl/server"
import { FileText, Settings, Palette, Users } from "lucide-react"
import Link from "next/link"

import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/page-header"
import { UpdateBanner } from "@/components/dashboard/update-banner"
import { getLatestReleaseInfo, formatChangelog } from "@/lib/server/release-checker"
import { isValidLocale } from "@/lib/site"

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  const name = session?.user?.name ?? "daar"

  // Get latest release info for update banner
  const latestRelease = await getLatestReleaseInfo()
  const currentVersion = "1.0.0" // From package.json

  const quickActions = [
    {
      href: `/${locale}/dashboard/pages`,
      icon: FileText,
      label: "Pagina's beheren",
      description: "Maak en bewerk pagina's met de visuele editor",
    },
    {
      href: `/${locale}/dashboard/settings`,
      icon: Settings,
      label: "Site instellingen",
      description: "Sitenaam, logo en basisinformatie",
    },
    {
      href: `/${locale}/dashboard/appearance`,
      icon: Palette,
      label: "Uiterlijk aanpassen",
      description: "Kleuren, lettertype en thema",
    },
    {
      href: `/${locale}/dashboard/team`,
      icon: Users,
      label: "Team beheren",
      description: "Nodig teamleden uit en beheer rollen",
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welkom, ${name}!`}
        description="Beheer content, branding en modules vanuit een consistente premium workspace."
      />

      {latestRelease && (
        <UpdateBanner
          currentVersion={currentVersion}
          latestTag={latestRelease.tag}
          releaseUrl={latestRelease.releaseUrl}
          changelog={formatChangelog(latestRelease.releaseNotes)}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="surface-card h-full rounded-[1.6rem] border-0 py-0 transition-transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-[1rem] bg-primary/10 p-2.5">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{action.label}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="surface-panel rounded-[1.8rem] border-0 py-0">
        <CardHeader>
          <CardTitle>Aan de slag</CardTitle>
          <CardDescription>
            Volg deze stappen om je website in te richten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                label: "01",
                body: <>Pas je <Link href={`/${locale}/dashboard/settings`} className="text-primary underline">site instellingen</Link> aan voor naam, logo en basisinfo.</>,
              },
              {
                label: "02",
                body: <>Kies je <Link href={`/${locale}/dashboard/appearance`} className="text-primary underline">thema en kleuren</Link> zodat branding meteen goed staat.</>,
              },
              {
                label: "03",
                body: <>Maak je eerste <Link href={`/${locale}/dashboard/pages/new`} className="text-primary underline">pagina</Link> aan in de editor.</>,
              },
              {
                label: "04",
                body: <>Werk je <Link href={`/${locale}/dashboard/navigation`} className="text-primary underline">navigatie</Link> en footer af voor een nette launch.</>,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.3rem] border border-border/60 bg-card/70 p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Step {item.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
