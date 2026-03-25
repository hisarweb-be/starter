import "server-only"

import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { mergeMarketingPageContent } from "@/lib/page-content"
import { type AppLocale, siteConfig } from "@/lib/site"
import { getRuntimePageDocument } from "@/lib/server/content-runtime"

export async function getMarketingPageContent({
  locale,
  slug,
  namespace,
}: {
  locale: AppLocale
  slug: string
  namespace: string
}) {
  const t = await getTranslations({ locale, namespace })
  const runtimePage = await getRuntimePageDocument({ slug, locale })

  return mergeMarketingPageContent({
    fallback: {
      eyebrow: t("eyebrow"),
      title: t("title"),
      description: t("description"),
      highlights: [t("highlights.one"), t("highlights.two"), t("highlights.three")],
      ctaTitle: t("ctaTitle"),
      ctaDescription: t("ctaDescription"),
      body: [],
    },
    source: runtimePage,
  })
}

export async function getMarketingPageMetadata(input: {
  locale: AppLocale
  slug: string
  namespace: string
}): Promise<Metadata> {
  const content = await getMarketingPageContent(input)

  return {
    title: `${content.title} | ${siteConfig.name}`,
    description: content.description,
  }
}
