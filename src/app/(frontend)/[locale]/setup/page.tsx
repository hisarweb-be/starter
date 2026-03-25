import { setRequestLocale } from "next-intl/server"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { SetupWizardForm } from "@/components/wizard/setup-wizard-form"
import { isValidLocale } from "@/lib/site"
import { canManageSetup } from "@/lib/server/authorization-server"

export default async function SetupPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const session = await auth()
  const hasAccess = await canManageSetup(session)

  if (!hasAccess) {
    redirect(`/${locale}/login?callbackUrl=${encodeURIComponent(`/${locale}/setup`)}`)
  }

  return <SetupWizardForm />
}
