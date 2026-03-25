import { TRPCError, initTRPC } from "@trpc/server"

import type { TRPCContext } from "@/server/api/context"
import { canManageSystem, hasDashboardAccess } from "@/lib/server/authorization"

export const t = initTRPC.context<TRPCContext>().create()

const requireSession = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required.",
    })
  }

  return next({
    ctx,
  })
})

const requireDashboardAccess = t.middleware(({ ctx, next }) => {
  if (!hasDashboardAccess(ctx.session)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Dashboard access required.",
    })
  }

  return next({
    ctx,
  })
})

const requireSystemAccess = t.middleware(({ ctx, next }) => {
  if (!canManageSystem(ctx.session)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "System management access required.",
    })
  }

  return next({
    ctx,
  })
})

const requireTenantAccess = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user || !ctx.organizationId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Organization access required.",
    })
  }

  return next({
    ctx: {
      ...ctx,
      organizationId: ctx.organizationId,
    },
  })
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(requireSession)
export const staffProcedure = protectedProcedure.use(requireDashboardAccess)
export const adminProcedure = protectedProcedure.use(requireSystemAccess)
export const tenantProcedure = protectedProcedure.use(requireTenantAccess)
