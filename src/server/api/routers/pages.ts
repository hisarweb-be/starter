import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { prisma } from "@/lib/server/prisma"
import { createTRPCRouter, tenantProcedure } from "@/server/api/trpc"

type RevisionRecord = {
  id: string
  pageId: string
  blocks: unknown
  createdBy: string | null
  createdAt: Date
}

const db = prisma as unknown as {
  page: {
    findMany: (args: Record<string, unknown>) => Promise<PageRecord[]>
    findFirst: (args: Record<string, unknown>) => Promise<PageRecord | null>
    create: (args: Record<string, unknown>) => Promise<PageRecord>
    update: (args: Record<string, unknown>) => Promise<PageRecord>
    delete: (args: Record<string, unknown>) => Promise<PageRecord>
    updateMany: (args: Record<string, unknown>) => Promise<{ count: number }>
  }
  pageRevision: {
    findMany: (args: Record<string, unknown>) => Promise<RevisionRecord[]>
    findFirst: (args: Record<string, unknown>) => Promise<RevisionRecord | null>
  }
}

type PageRecord = {
  id: string
  organizationId: string
  title: string
  slug: string
  status: string
  locale: string
  metaDescription: string | null
  metaKeywords: string | null
  blocks: unknown
  sortOrder: number
  isHomePage: boolean
  createdAt: Date
  updatedAt: Date
}

export const pagesRouter = createTRPCRouter({
  list: tenantProcedure
    .input(z.object({ locale: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = { organizationId: ctx.organizationId }
      if (input?.locale) where.locale = input.locale
      return db.page.findMany({
        where,
        orderBy: { sortOrder: "asc" },
      })
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const page = await db.page.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
      })
      if (!page) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" })
      return page
    }),

  create: tenantProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        locale: z.string().default("nl"),
        isHomePage: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.page.create({
        data: {
          organizationId: ctx.organizationId,
          title: input.title,
          slug: input.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          locale: input.locale,
          isHomePage: input.isHomePage,
          blocks: [],
        },
      })
    }),

  update: tenantProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),
        isHomePage: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      if (data.slug) data.slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
      return db.page.update({
        where: { id },
        data: { ...data, organizationId: ctx.organizationId },
      })
    }),

  updateBlocks: tenantProcedure
    .input(
      z.object({
        id: z.string(),
        blocks: z.array(z.record(z.string(), z.unknown())),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const page = await db.page.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
      })
      if (!page) throw new TRPCError({ code: "NOT_FOUND" })
      return db.page.update({
        where: { id: input.id },
        data: { blocks: input.blocks },
      })
    }),

  publish: tenantProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const page = await db.page.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
      })
      if (!page) throw new TRPCError({ code: "NOT_FOUND" })
      return db.page.update({
        where: { id: input.id },
        data: { status: "published" },
      })
    }),

  unpublish: tenantProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const page = await db.page.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
      })
      if (!page) throw new TRPCError({ code: "NOT_FOUND" })
      return db.page.update({
        where: { id: input.id },
        data: { status: "draft" },
      })
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const page = await db.page.findFirst({
        where: { id: input.id, organizationId: ctx.organizationId },
      })
      if (!page) throw new TRPCError({ code: "NOT_FOUND" })
      return db.page.delete({ where: { id: input.id } })
    }),

  reorder: tenantProcedure
    .input(z.array(z.object({ id: z.string(), sortOrder: z.number() })))
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.map((item) =>
          db.page.updateMany({
            where: { id: item.id, organizationId: ctx.organizationId },
            data: { sortOrder: item.sortOrder },
          })
        )
      )
      return { success: true }
    }),

  listRevisions: tenantProcedure
    .input(z.object({ pageId: z.string() }))
    .query(async ({ ctx, input }) => {
      const page = await db.page.findFirst({
        where: { id: input.pageId, organizationId: ctx.organizationId },
      })
      if (!page) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" })
      return db.pageRevision.findMany({
        where: { pageId: input.pageId },
        orderBy: { createdAt: "desc" },
      })
    }),

  restoreRevision: tenantProcedure
    .input(z.object({ revisionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const revision = await db.pageRevision.findFirst({
        where: { id: input.revisionId },
      })
      if (!revision) throw new TRPCError({ code: "NOT_FOUND", message: "Revision not found" })
      const page = await db.page.findFirst({
        where: { id: revision.pageId, organizationId: ctx.organizationId },
      })
      if (!page) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" })
      return db.page.update({
        where: { id: revision.pageId },
        data: { blocks: revision.blocks as Record<string, unknown>[] },
      })
    }),
})
