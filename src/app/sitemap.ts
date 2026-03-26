import type { MetadataRoute } from "next"
import { prisma } from "@/lib/server/prisma"

const db = prisma as unknown as {
  page: {
    findMany: (args: Record<string, unknown>) => Promise<Array<{
      slug: string; locale: string; updatedAt: Date; isHomePage: boolean;
      organization: { slug: string; domain: string | null }
    }>>
  }
}

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://hisarweb.nl"

  // Static platform pages (always available)
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/nl`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/nl/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  // Dynamic tenant pages (may fail if DB is unavailable)
  try {
    const pages = await db.page.findMany({
      where: { status: "published" },
      include: { organization: { select: { slug: true, domain: true } } },
    })

    const tenantUrls: MetadataRoute.Sitemap = pages.map((page) => {
      const host = page.organization.domain ?? `${page.organization.slug}.hisarweb.nl`
      const path = page.isHomePage ? "" : `/${page.locale}/${page.slug}`
      return {
        url: `https://${host}${path}`,
        lastModified: page.updatedAt,
        changeFrequency: "weekly",
        priority: page.isHomePage ? 1.0 : 0.8,
      }
    })

    return [...staticUrls, ...tenantUrls]
  } catch {
    return staticUrls
  }
}
