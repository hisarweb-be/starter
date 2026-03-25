import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { auth } from "@/auth"
import { PageHeader } from "@/components/dashboard/page-header"
import { AppearanceForm } from "@/components/dashboard/appearance-form"
import { isValidLocale } from "@/lib/site"
import { prisma } from "@/lib/server/prisma"

const db = prisma as unknown as {
  organization: {
    findUnique: (args: Record<string, unknown>) => Promise<{
      themeMode: string | null
      fontPreset: string | null
      accentColor: string | null
      customCss: string | null
      faviconUrl: string | null
    } | null>
  }
}

export default async function AppearancePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  if (!session?.user?.organizationId) redirect(`/${locale}/login`)

  const org = await db.organization.findUnique({
    where: { id: session.user.organizationId },
  })
  if (!org) redirect(`/${locale}/dashboard`)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Uiterlijk"
        description="Stuur het merkgevoel van je website aan met thema, typografie, kleur en verfijnde overrides."
      />
      <AppearanceForm
        initialData={{
          themeMode: org.themeMode ?? "system",
          fontPreset: org.fontPreset ?? "manrope",
          accentColor: org.accentColor ?? "#1664d8",
          customCss: org.customCss ?? null,
          faviconUrl: org.faviconUrl ?? null,
        }}
      />
    </div>
  )
}
