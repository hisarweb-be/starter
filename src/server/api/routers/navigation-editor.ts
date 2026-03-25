import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { prisma } from "@/lib/server/prisma"
import { createTRPCRouter, tenantProcedure } from "@/server/api/trpc"

const db = prisma as unknown as {
  navItem: {
    findMany: (args: Record<string, unknown>) => Promise<NavItemRecord[]>
    findFirst: (args: Record<string, unknown>) => Promise<NavItemRecord | null>
    upsert: (args: Record<string, unknown>) => Promise<NavItemRecord>
    delete: (args: Record<string, unknown>) => Promise<NavItemRecord>
    updateMany: (args: Record<string, unknown>) => Promise<{ count: number }>
  }
}

type NavItemRecord = {
  id: string
  organizationId: string
  label: string
  href: string
  sortOrder: number
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

export const navigationEditorRouter = createTRPCRouter({
  list: tenantProcedure.query(async ({ ctx }) => {
    return db.navItem.findMany({
      where: { organizationId: ctx.organizationId },
      orderBy: { sortOrder: "asc" },
    })
  }),

  upsert: tenantProcedure
    .input(
      z.object({
        id: z.string().optional(),
        label: z.string().min(1),
        href: z.string().min(1),
        sortOrder: z.number().default(0),
        parentId: z.string().nullable().default(null),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      if (id) {
        const existing = await db.navItem.findFirst({
          where: { id, organizationId: ctx.organizationId },
        })
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" })
        return db.navItem.upsert({
          where: { id },
          update: data,
          create: { ...data, organizationId: ctx.organizationId },
        })
      }
      return db.navItem.upsert({
        where: { id: "new-" + Date.now() },
        update: data,
        create: { ...data, organizationId: ctx.organizationId },
      })
    }),

  reorder: tenantProcedure
    .input(z.array(z.object({ id: z.string(), sortOrder: z.number() })))
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.map((item) =>
          db.navItem.updateMany({
            where: { id: item.id, organizationId: ctx.organizationId },
            data: { sortOrder: item.sortOrder },
          })
        )
      )
      return { success: true }
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const item = await db.navItem.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
      })
      if (!item) throw new TRPCError({ code: "NOT_FOUND" })
      return db.navItem.delete({ where: { id: input.id } })
    }),
})
