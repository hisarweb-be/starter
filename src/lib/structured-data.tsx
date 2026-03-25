import { siteConfig } from "@/lib/site"

type OrganizationLdProps = {
  name?: string
  url?: string
  logo?: string | null
  description?: string
}

export function organizationLd({
  name = siteConfig.name,
  url = siteConfig.url,
  logo,
  description = siteConfig.description,
}: OrganizationLdProps = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo ? { logo } : {}),
    description,
  }
}

type WebSiteLdProps = {
  name?: string
  url?: string
  description?: string
  searchUrl?: string
}

export function webSiteLd({
  name = siteConfig.name,
  url = siteConfig.url,
  description = siteConfig.description,
  searchUrl,
}: WebSiteLdProps = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    ...(searchUrl
      ? {
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: searchUrl },
            "query-input": "required name=search_term_string",
          },
        }
      : {}),
  }
}

type WebPageLdProps = {
  name: string
  description?: string
  url: string
  datePublished?: string
  dateModified?: string
}

export function webPageLd({
  name,
  description,
  url,
  datePublished,
  dateModified,
}: WebPageLdProps) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url,
    ...(description ? { description } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  }
}

type BreadcrumbItem = {
  name: string
  url: string
}

export function breadcrumbLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

type FaqItem = {
  question: string
  answer: string
}

export function faqPageLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

/**
 * Renders a JSON-LD script tag for use in page components.
 * Usage: <JsonLd data={organizationLd()} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
