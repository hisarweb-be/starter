import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { Activity, FileText, Image, Settings, Users, Globe, Trash2, LogIn, UserPlus } from "lucide-react"

import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/page-header"
import { isValidLocale } from "@/lib/site"
import { getActivities, type ActivityLogRecord } from "@/lib/server/activity-log"

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "page.created": FileText,
  "page.updated": FileText,
  "page.published": Globe,
  "page.unpublished": Globe,
  "page.deleted": Trash2,
  "media.uploaded": Image,
  "media.deleted": Image,
  "settings.updated": Settings,
  "user.invited": UserPlus,
  "user.joined": Users,
  "user.login": LogIn,
}

const ACTION_LABELS: Record<string, string> = {
  "page.created": "Pagina aangemaakt",
  "page.updated": "Pagina bewerkt",
  "page.published": "Pagina gepubliceerd",
  "page.unpublished": "Pagina gedepubliceerd",
  "page.deleted": "Pagina verwijderd",
  "media.uploaded": "Media geupload",
  "media.deleted": "Media verwijderd",
  "settings.updated": "Instellingen gewijzigd",
  "user.invited": "Gebruiker uitgenodigd",
  "user.joined": "Gebruiker toegetreden",
  "user.login": "Ingelogd",
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

function groupByDate(items: ActivityLogRecord[]): Map<string, ActivityLogRecord[]> {
  const groups = new Map<string, ActivityLogRecord[]>()
  for (const item of items) {
    const key = formatDate(item.createdAt)
    const existing = groups.get(key)
    if (existing) {
      existing.push(item)
    } else {
      groups.set(key, [item])
    }
  }
  return groups
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  if (!session?.user?.organizationId) {
    redirect(`/${locale}/login`)
  }

  const { items } = await getActivities({
    organizationId: session.user.organizationId,
    limit: 100,
  })

  const grouped = groupByDate(items)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activiteit"
        description="Bekijk recente activiteiten binnen je organisatie."
      />

      {items.length === 0 ? (
        <Card className="surface-card rounded-[1.5rem] border-0 py-0">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-[1rem] bg-primary/10 p-3">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-4 font-medium">Nog geen activiteiten</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Activiteiten verschijnen hier zodra er wijzigingen worden gemaakt.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([date, activities]) => (
            <div key={date} className="space-y-2">
              <p className="px-1 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                {date}
              </p>
              <div className="space-y-2">
                {activities.map((activity) => {
                  const Icon = ACTION_ICONS[activity.action] ?? Activity
                  const label = ACTION_LABELS[activity.action] ?? activity.action

                  return (
                    <Card
                      key={activity.id}
                      className="surface-card rounded-[1.5rem] border-0 py-0"
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="rounded-[0.75rem] bg-primary/10 p-2">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.userName ?? "Systeem"}
                            {activity.entityType && (
                              <span className="text-muted-foreground/60">
                                {" "}&middot; {activity.entityType}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatTime(activity.createdAt)}
                        </span>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
