import { experimentCatalog, getExperimentAssignments } from "@/lib/experiments"
import { staffProcedure, createTRPCRouter } from "@/server/api/trpc"

export const experimentsRouter = createTRPCRouter({
  catalog: staffProcedure.query(({ ctx }) => ({
    experiments: experimentCatalog,
    assignments: getExperimentAssignments(ctx.session?.user?.email ?? "anonymous"),
  })),
})
