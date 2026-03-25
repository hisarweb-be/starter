import "server-only"

import { type DemoFaqItem, type DemoPost, type DemoService } from "@/lib/demo-content"
import { type AppLocale } from "@/lib/site"
import { getDemoContent } from "@/lib/server/demo-content-store"
import { getSafePayload } from "@/lib/server/payload-safe"

type PreviewItem = {
  title: string
  description: string
  meta?: string
}

type PayloadPreviewDoc = {
  title?: string
  excerpt?: string
  content?: string
  publishedAt?: string
  summary?: string
  featured?: boolean
  question?: string
  answer?: string
  category?: string
}

type PayloadPageDoc = {
  title?: string
  slug?: string
  locale?: AppLocale
  summary?: string
  content?: string
}

const fallbackContent = {
  blog: [
    {
      title: "Waarom HisarWeb Starter als product is opgezet",
      description:
        "Een starter kit levert meer op wanneer onboarding, updates en contentbeheer vanaf dag één productmatig zijn ontworpen.",
      meta: "Fallback article",
    },
    {
      title: "Meertalige websites sneller uitleveren",
      description:
        "NL/EN routing, setup-wizard keuzes en modulaire templates verkorten de weg van intake tot lancering.",
      meta: "Fallback article",
    },
  ],
  services: [
    {
      title: "Website foundations",
      description:
        "Snelle start voor agency-, service- en portfolio-websites met consistente structuur.",
      meta: "Fallback service",
    },
    {
      title: "Setup wizard onboarding",
      description:
        "Begeleid klanten door branding, modules, talen en basisinstellingen zonder losse handmatige setup.",
      meta: "Fallback service",
    },
  ],
  faq: [
    {
      title: "Kan ik deze starter per klant hergebruiken?",
      description: "Ja. De architectuur is opgezet als productbasis voor meerdere instanties.",
      meta: "Fallback FAQ",
    },
    {
      title: "Ondersteunt het project updates?",
      description: "Ja, de updatechecker en release-architectuur zijn onderdeel van de productrichting.",
      meta: "Fallback FAQ",
    },
  ],
}

async function safePayloadFindCollection(collection: "posts" | "services" | "faq") {
  try {
    const payload = await getSafePayload()
    if (!payload) throw new Error("Payload unavailable")
    const result = await payload.find({
      collection,
      limit: 6,
      depth: 0,
      sort: "-updatedAt",
    })

    return result.docs as PayloadPreviewDoc[]
  } catch {
    return null
  }
}

function mapDemoPosts(posts: DemoPost[]): PreviewItem[] {
  return posts.map((post) => ({
    title: post.title,
    description: post.excerpt ?? post.content,
    meta: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Demo article",
  }))
}

function mapDemoServices(services: DemoService[]): PreviewItem[] {
  return services.map((service) => ({
    title: service.title,
    description: service.summary,
    meta: service.featured ? "Featured service" : "Demo service",
  }))
}

function mapDemoFaq(items: DemoFaqItem[]): PreviewItem[] {
  return items.map((item) => ({
    title: item.question,
    description: item.answer,
    meta: item.category,
  }))
}

export async function getRuntimePageDocument({
  slug,
  locale,
}: {
  slug: string
  locale: AppLocale
}) {
  try {
    const payload = await getSafePayload()
    if (!payload) throw new Error("Payload unavailable")
    const result = await payload.find({
      collection: "pages",
      limit: 1,
      depth: 0,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            locale: {
              equals: locale,
            },
          },
        ],
      },
    })

    const payloadDoc = (result.docs[0] as PayloadPageDoc | undefined) ?? null

    if (payloadDoc) {
      return payloadDoc
    }
  } catch {
    // fall through to demo content
  }

  const demoContent = await getDemoContent()
  return demoContent.pages.find((page) => page.slug === slug && page.locale === locale) ?? null
}

export async function getBlogPreviewItems(): Promise<PreviewItem[]> {
  const docs = await safePayloadFindCollection("posts")

  if (docs?.length) {
    return docs.map((doc) => ({
      title: doc.title ?? "Untitled post",
      description: doc.excerpt ?? doc.content ?? "No summary available.",
      meta: doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString() : "Payload post",
    }))
  }

  const demoContent = await getDemoContent()

  if (demoContent.posts.length > 0) {
    return mapDemoPosts(demoContent.posts)
  }

  return fallbackContent.blog
}

export async function getServicePreviewItems(): Promise<PreviewItem[]> {
  const docs = await safePayloadFindCollection("services")

  if (docs?.length) {
    return docs.map((doc) => ({
      title: doc.title ?? "Untitled service",
      description: doc.summary ?? "No summary available.",
      meta: doc.featured ? "Featured service" : "Payload service",
    }))
  }

  const demoContent = await getDemoContent()

  if (demoContent.services.length > 0) {
    return mapDemoServices(demoContent.services)
  }

  return fallbackContent.services
}

export async function getFaqPreviewItems(): Promise<PreviewItem[]> {
  const docs = await safePayloadFindCollection("faq")

  if (docs?.length) {
    return docs.map((doc) => ({
      title: doc.question ?? "Untitled FAQ",
      description: doc.answer ?? "No answer available.",
      meta: doc.category ?? "Payload FAQ",
    }))
  }

  const demoContent = await getDemoContent()

  if (demoContent.faq.length > 0) {
    return mapDemoFaq(demoContent.faq)
  }

  return fallbackContent.faq
}
