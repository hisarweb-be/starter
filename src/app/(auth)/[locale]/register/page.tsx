import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { ClientRegisterForm } from "@/components/forms/client-register-form"
import { isValidLocale } from "@/lib/site"

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return <ClientRegisterForm locale={locale} />
}
