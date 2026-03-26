import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { RenderBlocks } from "@/components/RenderBlocks"
import { isValidLocale } from "@/lib/site"
import { getSafePayload } from "@/lib/server/payload-safe"
import { prisma } from "@/lib/server/prisma"
import { getActiveOrganization } from "@/lib/server/tenant-runtime"
import type { PageBlockLike } from "@/components/blocks/types"

export const dynamic = "force-dynamic"

type PageRecord = {
  id: string
  title: string
  slug: string
  status: string
  locale: string
  metaDescription: string | null
  blocks: unknown
}

const db = prisma as unknown as {
  page: {
    findFirst: (args: Record<string, unknown>) => Promise<PageRecord | null>
  }
}

async function getOrgPage(slug: string, locale: string): Promise<PageRecord | null> {
  try {
    const org = await getActiveOrganization()
    if (!org) return null
    return db.page.findFirst({
      where: {
        organizationId: org.id,
        slug,
        locale,
        status: "published",
      },
    })
  } catch {
    return null
  }
}

async function getPayloadPage(slug: string, locale: string) {
  try {
    const payload = await getSafePayload()
    if (!payload) return null
    const result = await payload.find({
      collection: "pages",
      where: {
        slug: { equals: slug },
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
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params

  if (!isValidLocale(locale)) return {}

  // Try org page first
  const orgPage = await getOrgPage(slug, locale)
  if (orgPage) {
    return {
      title: orgPage.title,
      description: orgPage.metaDescription ?? undefined,
    }
  }

  // Fallback to Payload
  const payloadPage = await getPayloadPage(slug, locale)
  if (payloadPage) {
    return {
      title: payloadPage.title,
      description: payloadPage.summary,
    }
  }

  return { title: "Page Not Found" }
}

export default async function CMSPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  // Try org page first (from dashboard block editor)
  const orgPage = await getOrgPage(slug, locale)
  if (orgPage) {
    const blocks = Array.isArray(orgPage.blocks) ? orgPage.blocks : []
    const org = await getActiveOrganization()
    return (
      <main>
        <RenderBlocks blocks={blocks as PageBlockLike[]} organizationId={org?.id} />
      </main>
    )
  }

  // Fallback to Payload CMS
  const payloadPage = await getPayloadPage(slug, locale)
  if (!payloadPage) {
    notFound()
  }

  return (
    <main>
      <RenderBlocks blocks={payloadPage.blocks} />
    </main>
  )
}
