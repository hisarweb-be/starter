import { ClientForgotPasswordForm } from "@/components/forms/forgot-password-form"

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return <ClientForgotPasswordForm locale={locale} />
}
