import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

import { CtaSection } from "@/components/sections/cta-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { HeroSection } from "@/components/sections/hero-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { RenderBlocks } from "@/components/RenderBlocks"
import { isValidLocale } from "@/lib/site"
import { getRuntimeHomeContent } from "@/lib/server/home-runtime"
import { getRuntimeSiteSettings } from "@/lib/server/site-runtime"
import { getSafePayload } from "@/lib/server/payload-safe"
import { prisma } from "@/lib/server/prisma"
import { getActiveOrganization } from "@/lib/server/tenant-runtime"
import type { PageBlockLike } from "@/components/blocks/types"

type OrgPageRecord = {
  id: string
  title: string
  blocks: unknown
}

const db = prisma as unknown as {
  page: {
    findFirst: (args: Record<string, unknown>) => Promise<OrgPageRecord | null>
  }
}

async function getOrgHomePage(locale: string): Promise<OrgPageRecord | null> {
  try {
    const org = await getActiveOrganization()
    if (!org) return null
    return db.page.findFirst({
      where: {
        organizationId: org.id,
        isHomePage: true,
        locale,
        status: "published",
      },
    })
  } catch {
    return null
  }
}

async function getPayloadPage(locale: string) {
  try {
    const payload = await getSafePayload()
    if (!payload) return null

    const result = await payload.find({
      collection: "pages",
      where: {
        slug: { equals: "home" },
        locale: { equals: locale },
      },
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    return {}
  }

  const [page, homeContent, runtimeSettings] = await Promise.all([
    getPayloadPage(locale),
    getRuntimeHomeContent(locale),
    getRuntimeSiteSettings(),
  ])

  return {
    title: page?.title || `Home | ${runtimeSettings.siteName}`,
    description: page?.summary || homeContent.description,
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  // Try org homepage first (from dashboard editor)
  const orgHome = await getOrgHomePage(locale)
  if (orgHome) {
    const blocks = Array.isArray(orgHome.blocks) ? orgHome.blocks : []
    if (blocks.length > 0) {
      const org = await getActiveOrganization()
      return (
        <main>
          <RenderBlocks blocks={blocks as PageBlockLike[]} organizationId={org?.id} />
        </main>
      )
    }
  }

  // Fallback to Payload CMS
  const page = await getPayloadPage(locale)

  if (page?.blocks && page.blocks.length > 0) {
    return (
      <main>
        <RenderBlocks blocks={page.blocks} />
      </main>
    )
  }

  return (
    <>
      <HeroSection locale={locale} />
      <FeaturesSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <CtaSection locale={locale} />
    </>
  )
}
