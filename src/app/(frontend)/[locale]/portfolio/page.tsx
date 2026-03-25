import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { PageBodySection } from "@/components/marketing/page-body-section"
import { PageShell } from "@/components/marketing/page-shell"
import { isValidLocale, type AppLocale } from "@/lib/site"
import {
  getMarketingPageContent,
  getMarketingPageMetadata,
} from "@/lib/server/marketing-page-runtime"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  return getMarketingPageMetadata({
    locale,
    slug: "portfolio",
    namespace: "pages.portfolio",
  })
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const content = await getMarketingPageContent({
    locale: locale as AppLocale,
    slug: "portfolio",
    namespace: "pages.portfolio",
  })

  return (
    <div className="pb-8">
      <PageShell {...content} locale={locale} />
      <PageBodySection title="Projectdetails" paragraphs={content.body} />
    </div>
  )
}
