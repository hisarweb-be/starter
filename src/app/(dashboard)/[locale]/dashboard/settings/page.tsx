import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { auth } from "@/auth"
import { PageHeader } from "@/components/dashboard/page-header"
import { SiteSettingsForm } from "@/components/dashboard/site-settings-form"
import { isValidLocale } from "@/lib/site"
import { prisma } from "@/lib/server/prisma"

const db = prisma as unknown as {
  organization: {
    findUnique: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>
  }
}

export default async function SettingsPage({
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

  const org = await db.organization.findUnique({
    where: { id: session.user.organizationId },
  })

  if (!org) {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site instellingen"
        description="Pas de basisinformatie van je website aan."
      />
      <SiteSettingsForm
        initialData={{
          siteName: (org.siteName as string) ?? "",
          tagline: (org.tagline as string) ?? "",
          accentColor: (org.accentColor as string) ?? "#6d28d9",
          logoUrl: (org.logoUrl as string) ?? "",
          industry: (org.industry as string) ?? "",
          gaTrackingId: (org.gaTrackingId as string) ?? "",
        }}
      />
    </div>
  )
}
