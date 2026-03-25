import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { ThemeStyles } from "@/components/layout/ThemeStyles"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { isValidLocale, locales, siteConfig } from "@/lib/site"
import { getActiveOrganization } from "@/lib/server/tenant-runtime"
import { JsonLd, organizationLd, webSiteLd } from "@/lib/structured-data"
import { CookieConsent } from "@/components/layout/cookie-consent"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  const org = await getActiveOrganization()
  const gaTrackingId = org?.gaTrackingId ?? null
  const customCss = org?.customCss ?? null

  const siteName = org?.siteName ?? org?.name ?? siteConfig.name
  const siteUrl = siteConfig.url

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeStyles />
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}
      <GoogleAnalytics trackingId={gaTrackingId} />
      <JsonLd data={organizationLd({ name: siteName, url: siteUrl, logo: org?.logoUrl })} />
      <JsonLd data={webSiteLd({ name: siteName, url: siteUrl })} />
      <div className="flex min-h-screen flex-col">
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} />
      </div>
      <CookieConsent />
    </NextIntlClientProvider>
  )
}
