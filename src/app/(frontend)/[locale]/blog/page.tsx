import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { ContentPreviewGrid } from "@/components/marketing/content-preview-grid"
import { PageBodySection } from "@/components/marketing/page-body-section"
import { PageShell } from "@/components/marketing/page-shell"
import { isValidLocale, type AppLocale } from "@/lib/site"
import { getBlogPreviewItems } from "@/lib/server/content-runtime"
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
    slug: "blog",
    namespace: "pages.blog",
  })
}

export default async function BlogPage({
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
      slug: "blog",
      namespace: "pages.blog",
    }),
    getBlogPreviewItems(),
  ])

  return (
    <div className="pb-8">
      <PageShell {...content} locale={locale} />
      <PageBodySection title="Blogintro" paragraphs={content.body} />
      <ContentPreviewGrid
        title="Recente publicaties"
        description="Deze sectie laat zien hoe artikelen, inzichten en updates straks als doorlopende contentstroom op de site landen."
        items={items}
      />
    </div>
  )
}
