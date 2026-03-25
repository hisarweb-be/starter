import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { ContentPreviewGrid } from "@/components/marketing/content-preview-grid"
import { PageBodySection } from "@/components/marketing/page-body-section"
import { PageShell } from "@/components/marketing/page-shell"
import { isValidLocale, type AppLocale } from "@/lib/site"
import { getServicePreviewItems } from "@/lib/server/content-runtime"
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
    slug: "services",
    namespace: "pages.services",
  })
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const [content, items] = await Promise.all([
    getMarketingPageContent({
      locale: locale as AppLocale,
      slug: "services",
      namespace: "pages.services",
    }),
    getServicePreviewItems(),
  ])

  return (
    <div className="pb-8">
      <PageShell {...content} locale={locale} />
      <PageBodySection title="Service-overzicht" paragraphs={content.body} />
      <ContentPreviewGrid
        title="Services preview"
        description="Leest live service-items uit Payload zodra de collection data aanwezig is."
        items={items}
      />
    </div>
  )
}
