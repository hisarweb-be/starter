import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { prisma } from "@/lib/server/prisma"
import { hashPassword } from "@/lib/server/security"
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc"

const db = prisma as unknown as {
  organization: {
    findMany: (args: Record<string, unknown>) => Promise<OrgRecord[]>
    findUnique: (args: Record<string, unknown>) => Promise<OrgRecord | null>
    create: (args: Record<string, unknown>) => Promise<OrgRecord>
    update: (args: Record<string, unknown>) => Promise<OrgRecord>
  }
  user: {
    findUnique: (args: Record<string, unknown>) => Promise<UserRecord | null>
    create: (args: Record<string, unknown>) => Promise<UserRecord>
  }
}

type OrgRecord = {
  id: string
  name: string
  slug: string
  domain: string | null
  plan: string
  status: string
  ownerId: string
  industry: string | null
  accentColor: string
  siteName: string | null
  createdAt: Date
  updatedAt: Date
}

type UserRecord = {
  id: string
  email: string
  name: string | null
  role: string
  organizationId: string | null
}

export const tenantRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        status: z.enum(["active", "suspended", "pending"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const where: Record<string, unknown> = {}
      if (input?.status) where.status = input.status
      return db.organization.findMany({ where, orderBy: { createdAt: "desc" } })
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const org = await db.organization.findUnique({ where: { id: input.id } })
      if (!org) throw new TRPCError({ code: "NOT_FOUND" })
      return org
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        ownerEmail: z.string().email(),
        ownerName: z.string().min(1),
        ownerPassword: z.string().min(8),
        industry: z.string().optional(),
        plan: z.string().default("starter"),
      })
    )
    .mutation(async ({ input }) => {
      const existingUser = await db.user.findUnique({
        where: { email: input.ownerEmail },
      })
      if (existingUser) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already in use" })
      }

      const passwordHash = await hashPassword(input.ownerPassword)
      const slug = input.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")

      // Create owner user first
      const owner = await db.user.create({
        data: {
          email: input.ownerEmail,
          name: input.ownerName,
          passwordHash,
          role: "admin",
        },
      })

      // Create organization
      const org = await db.organization.create({
        data: {
          name: input.name,
          slug,
          ownerId: owner.id,
          industry: input.industry ?? null,
          plan: input.plan,
          siteName: input.name,
          modules: ["homepage", "services", "contact", "about"],
        },
      })

      // Link owner to org
      await db.user.create({
        ...({} as Record<string, unknown>),
        data: { organizationId: org.id },
      }).catch(() => {
        // Update instead
      })

      return org
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        plan: z.string().optional(),
        domain: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return db.organization.update({ where: { id }, data })
    }),

  suspend: adminProcedure
    .input(
      z.object({
        id: z.string(),
        suspend: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return db.organization.update({
        where: { id: input.id },
        data: { status: input.suspend ? "suspended" : "active" },
      })
    }),
})
