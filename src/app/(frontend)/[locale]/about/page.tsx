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
    slug: "about",
    namespace: "pages.about",
  })
}

export default async function AboutPage({
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
    slug: "about",
    namespace: "pages.about",
  })

  return (
    <div className="pb-8">
      <PageShell {...content} locale={locale} />
      <PageBodySection title="Over deze pagina" paragraphs={content.body} />
    </div>
  )
}
