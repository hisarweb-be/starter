import Link from "next/link"
import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { FileText, Plus } from "lucide-react"

import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { PagesListClient } from "@/components/dashboard/pages-list-client"
import { isValidLocale } from "@/lib/site"
import { prisma } from "@/lib/server/prisma"

type PageRecord = {
  id: string
  title: string
  slug: string
  status: string
  locale: string
  isHomePage: boolean
  updatedAt: Date
}

const db = prisma as unknown as {
  page: {
    findMany: (args: Record<string, unknown>) => Promise<PageRecord[]>
  }
}

export default async function PagesListPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  if (!session?.user?.organizationId) {
    redirect(`/${locale}/login`)
  }

  const pages = await db.page.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { sortOrder: "asc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagina's"
        description="Beheer de pagina's van je website."
        actions={
          <Link href={`/${locale}/dashboard/pages/new`}>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nieuwe pagina
            </Button>
          </Link>
        }
      />

      {pages.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nog geen pagina's"
          description="Maak je eerste pagina aan om te beginnen."
          action={{ label: "Nieuwe pagina", href: `/${locale}/dashboard/pages/new` }}
        />
      ) : (
        <PagesListClient pages={pages} locale={locale} />
      )}
    </div>
  )
}
