import { NextResponse, type NextRequest } from "next/server"

import { prisma } from "@/lib/server/prisma"

const db = prisma as unknown as {
  page: {
    findMany: (args: Record<string, unknown>) => Promise<ScheduledPage[]>
    updateMany: (args: Record<string, unknown>) => Promise<{ count: number }>
  }
}

type ScheduledPage = {
  id: string
  title: string
  scheduledAt: Date
}

export async function GET(request: NextRequest) {
  // Verify cron secret for Vercel Cron Jobs
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 })
  }

  const now = new Date()

  // Find pages scheduled for publishing
  const pages = await db.page.findMany({
    where: {
      status: "draft",
      scheduledAt: { lte: now },
    },
  })

  if (pages.length === 0) {
    return NextResponse.json({ published: 0 })
  }

  // Publish all scheduled pages
  const result = await db.page.updateMany({
    where: {
      id: { in: pages.map((p) => p.id) },
    },
    data: {
      status: "published",
      publishedAt: now,
      scheduledAt: null,
    },
  })

  return NextResponse.json({
    published: result.count,
    pages: pages.map((p) => ({ id: p.id, title: p.title })),
  })
}
