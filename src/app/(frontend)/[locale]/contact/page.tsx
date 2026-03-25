import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { ContactForm } from "@/components/forms/contact-form"
import { PageShell } from "@/components/marketing/page-shell"
import { isValidLocale, type AppLocale } from "@/lib/site"
import {
  getMarketingPageContent,
  getMarketingPageMetadata,
} from "@/lib/server/marketing-page-runtime"

const defaultContactParagraphs = [
  "Gebruik dit formulier om een intake of projectaanvraag te versturen.",
  "Met een actieve RESEND_API_KEY wordt ook een e-mailnotificatie verzonden.",
  "Aanvragen worden veilig opgeslagen en zijn klaar om later te koppelen aan CRM of e-mail.",
]

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
    slug: "contact",
    namespace: "pages.contact",
  })
}

export default async function ContactPage({
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
    slug: "contact",
    namespace: "pages.contact",
  })

  const paragraphs = content.body.length > 0 ? content.body : defaultContactParagraphs

  return (
    <div className="pb-16">
      <PageShell {...content} locale={locale} />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-border/70 bg-muted/40 p-6 text-sm leading-7 text-muted-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">HisarWeb intake</p>
          <div className="mt-4 space-y-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}
