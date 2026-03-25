import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { auth } from "@/auth"
import { BlockEditor } from "@/components/editor/block-editor"
import { isValidLocale } from "@/lib/site"
import { prisma } from "@/lib/server/prisma"

type PageRecord = {
  id: string
  organizationId: string
  title: string
  slug: string
  status: string
  locale: string
  metaTitle: string | null
  metaDescription: string | null
  metaOgImage: string | null
  metaKeywords: string | null
  blocks: unknown
}

const db = prisma as unknown as {
  page: {
    findFirst: (args: Record<string, unknown>) => Promise<PageRecord | null>
  }
}

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  if (!session?.user?.organizationId) {
    redirect(`/${locale}/login`)
  }

  const page = await db.page.findFirst({
    where: { id, organizationId: session.user.organizationId },
  })

  if (!page) {
    redirect(`/${locale}/dashboard/pages`)
  }

  const blocks = Array.isArray(page.blocks) ? page.blocks : []

  return (
    <div className="-m-6 h-[calc(100vh-3.5rem)] overflow-hidden">
      <BlockEditor
        pageId={page.id}
        pageTitle={page.title}
        pageStatus={page.status}
        initialBlocks={blocks as Array<Record<string, unknown> & { blockType: string }>}
        locale={locale}
        metaTitle={page.metaTitle}
        metaDescription={page.metaDescription}
        metaOgImage={page.metaOgImage}
        metaKeywords={page.metaKeywords}
      />
    </div>
  )
}
