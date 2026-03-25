import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { prisma } from "@/lib/server/prisma"
import { hashPassword } from "@/lib/server/security"
import { createTRPCRouter, tenantProcedure } from "@/server/api/trpc"

const db = prisma as unknown as {
  user: {
    findMany: (args: Record<string, unknown>) => Promise<UserRecord[]>
    findUnique: (args: Record<string, unknown>) => Promise<UserRecord | null>
    create: (args: Record<string, unknown>) => Promise<UserRecord>
    update: (args: Record<string, unknown>) => Promise<UserRecord>
    delete: (args: Record<string, unknown>) => Promise<UserRecord>
  }
}

type UserRecord = {
  id: string
  email: string
  name: string | null
  role: string
  organizationId: string | null
  createdAt: Date
  updatedAt: Date
}

export const teamRouter = createTRPCRouter({
  list: tenantProcedure.query(async ({ ctx }) => {
    return db.user.findMany({
      where: { organizationId: ctx.organizationId },
    })
  }),

  invite: tenantProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
        role: z.enum(["admin", "editor", "user"]).default("editor"),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await db.user.findUnique({
        where: { email: input.email },
      })
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already in use" })
      }
      const passwordHash = await hashPassword(input.password)
      return db.user.create({
        data: {
          email: input.email,
          name: input.name,
          role: input.role,
          passwordHash,
          organizationId: ctx.organizationId,
        },
      })
    }),

  updateRole: tenantProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["admin", "editor", "user"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.user.findUnique({ where: { id: input.userId } })
      if (!user || user.organizationId !== ctx.organizationId) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      return db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      })
    }),

  remove: tenantProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await db.user.findUnique({ where: { id: input.userId } })
      if (!user || user.organizationId !== ctx.organizationId) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      // Don't allow removing the org owner
      if (ctx.session?.user?.id === input.userId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot remove yourself" })
      }
      return db.user.delete({ where: { id: input.userId } })
    }),
})
