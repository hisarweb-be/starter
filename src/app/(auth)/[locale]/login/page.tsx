import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { LoginForm } from "@/components/forms/login-form"
import { getEnabledSocialProviders } from "@/lib/server/auth-helpers"
import { isValidLocale } from "@/lib/site"

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "auth.login" })
  const providers = getEnabledSocialProviders()
  const resolvedSearchParams = await searchParams
  const callbackCandidate = resolvedSearchParams.callbackUrl
  const callbackUrl =
    typeof callbackCandidate === "string" && callbackCandidate.startsWith("/")
      ? callbackCandidate
      : `/${locale}/dashboard`

  return (
    <LoginForm
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      callbackUrl={callbackUrl}
      providers={providers}
    />
  )
}
