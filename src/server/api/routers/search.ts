import { z } from "zod"

import { prisma } from "@/lib/server/prisma"
import { createTRPCRouter, tenantProcedure } from "@/server/api/trpc"

type PageResult = {
  id: string
  title: string
  slug: string
  status: string
}

type MediaResult = {
  id: string
  filename: string
  url: string
}

type UserResult = {
  id: string
  name: string | null
  email: string
}

const db = prisma as unknown as {
  page: {
    findMany: (args: Record<string, unknown>) => Promise<PageResult[]>
  }
  media: {
    findMany: (args: Record<string, unknown>) => Promise<MediaResult[]>
  }
  user: {
    findMany: (args: Record<string, unknown>) => Promise<UserResult[]>
  }
}

export const searchRouter = createTRPCRouter({
  search: tenantProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const query = input.query

      const [pages, media, users] = await Promise.all([
        db.page.findMany({
          where: {
            organizationId: ctx.organizationId,
            title: { contains: query, mode: "insensitive" },
          },
          select: { id: true, title: true, slug: true, status: true },
          take: 5,
        }),
        db.media.findMany({
          where: {
            organizationId: ctx.organizationId,
            OR: [
              { filename: { contains: query, mode: "insensitive" } },
              { alt: { contains: query, mode: "insensitive" } },
            ],
          },
          select: { id: true, filename: true, url: true },
          take: 5,
        }),
        db.user.findMany({
          where: {
            organizationId: ctx.organizationId,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
          select: { id: true, name: true, email: true },
          take: 5,
        }),
      ])

      return { pages, media, users }
    }),
})
