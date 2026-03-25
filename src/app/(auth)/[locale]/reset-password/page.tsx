import { ResetPasswordForm } from "@/components/forms/reset-password-form"

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const token = typeof resolvedSearchParams.token === "string" ? resolvedSearchParams.token : ""

  return <ResetPasswordForm locale={locale} token={token} />
}
