import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { auth } from "@/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { isValidLocale } from "@/lib/site"

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    redirect("/nl/admin/clients")
  }

  setRequestLocale(locale)

  const session = await auth()

  if (!session?.user) {
    redirect(`/${locale}/login?callbackUrl=${encodeURIComponent(`/${locale}/admin/clients`)}`)
  }

  const userRole = (session.user as { role?: string })?.role
  if (userRole !== "superadmin" && userRole !== "admin") {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <DashboardShell
      locale={locale}
      siteName="HisarWeb Admin"
      userName={session.user.name ?? "Admin"}
      userEmail={session.user.email ?? ""}
      userRole={userRole}
    >
      {children}
    </DashboardShell>
  )
}
