export type MarketingPageContent = {
  eyebrow: string
  title: string
  description: string
  highlights: string[]
  ctaTitle: string
  ctaDescription: string
  body: string[]
}

export type MarketingPageSource = {
  title?: string | null
  summary?: string | null
  content?: string | null
}

function splitLines(value?: string | null) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function splitContentParagraphs(value?: string | null) {
  return (value ?? "")
    .split(/\r?\n\s*\r?\n/g)
    .map((item) => item.replace(/\r?\n/g, " ").trim())
    .filter(Boolean)
}

export function mergeMarketingPageContent({
  fallback,
  source,
}: {
  fallback: MarketingPageContent
  source?: MarketingPageSource | null
}): MarketingPageContent {
  if (!source) {
    return fallback
  }

  const summaryLines = splitLines(source.summary)
  const description = summaryLines[0] ?? fallback.description
  const highlightLines = summaryLines.slice(1)

  return {
    eyebrow: fallback.eyebrow,
    title: source.title?.trim() || fallback.title,
    description,
    highlights: highlightLines.length > 0 ? highlightLines.slice(0, 3) : fallback.highlights,
    ctaTitle: fallback.ctaTitle,
    ctaDescription: fallback.ctaDescription,
    body: splitContentParagraphs(source.content),
  }
}
