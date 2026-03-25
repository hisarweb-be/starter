import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { auth } from "@/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { isValidLocale } from "@/lib/site"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    redirect("/nl/dashboard")
  }

  setRequestLocale(locale)

  const session = await auth()

  if (!session?.user) {
    redirect(`/${locale}/login?callbackUrl=${encodeURIComponent(`/${locale}/dashboard`)}`)
  }

  const userRole = (session.user as { role?: string })?.role

  // Lees impersonatie-cookies (server-side)
  const cookieStore = await cookies()
  const impersonateOrgId = cookieStore.get("x-impersonate-org")?.value
  const impersonateOrgName = cookieStore.get("x-impersonate-org-name")?.value
  const isImpersonating = !!impersonateOrgId

  return (
    <DashboardShell
      locale={locale}
      siteName={session.user.name ?? "Mijn Website"}
      userName={session.user.name ?? "Gebruiker"}
      userEmail={session.user.email ?? ""}
      userRole={userRole}
      isImpersonating={isImpersonating}
      impersonateOrgName={impersonateOrgName}
    >
      {children}
    </DashboardShell>
  )
}
