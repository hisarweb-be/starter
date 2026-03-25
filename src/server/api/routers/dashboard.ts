import { getSessionPermissions, getSessionRole } from "@/lib/server/authorization"
import { getDashboardStats } from "@/lib/server/dashboard-runtime"
import { staffProcedure, createTRPCRouter } from "@/server/api/trpc"

export const dashboardRouter = createTRPCRouter({
  overview: staffProcedure.query(async ({ ctx }) => {
    const stats = await getDashboardStats()

    return {
      role: getSessionRole(ctx.session),
      permissions: getSessionPermissions(ctx.session),
      tenant: stats.tenant,
      stats,
    }
  }),
})
