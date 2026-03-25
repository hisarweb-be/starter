import { NextResponse, type NextRequest } from "next/server"

import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"
import { toCsv, csvResponse } from "@/lib/server/export"

const db = prisma as unknown as {
  page: {
    findMany: (args: Record<string, unknown>) => Promise<PageRecord[]>
  }
}

type PageRecord = {
  id: string
  title: string
  slug: string
  status: string
  locale: string
  createdAt: Date
  updatedAt: Date
}

export async function GET(_request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 })
  }

  const orgId = (session.user as { organizationId?: string }).organizationId
  if (!orgId) {
    return NextResponse.json({ error: "Geen organisatie" }, { status: 400 })
  }

  const pages = await db.page.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  })

  const rows = pages.map((p) => ({
    Titel: p.title,
    Slug: p.slug,
    Status: p.status,
    Taal: p.locale,
    Aangemaakt: p.createdAt.toISOString(),
    Bijgewerkt: p.updatedAt.toISOString(),
  }))

  const csv = toCsv(rows)
  return csvResponse(csv, `paginas-${new Date().toISOString().slice(0, 10)}.csv`)
}
