import { getSessionPermissions, getSessionRole } from "@/lib/server/authorization"
import { createTRPCRouter, publicProcedure, staffProcedure } from "@/server/api/trpc"

export const contentRouter = createTRPCRouter({
  overview: publicProcedure.query(() => ({
    collections: ["pages", "posts", "media", "services", "portfolio", "faq"],
    status: "payload-scaffolded",
  })),
  management: staffProcedure.query(({ ctx }) => ({
    role: getSessionRole(ctx.session),
    permissions: getSessionPermissions(ctx.session),
    editableCollections: ["pages", "posts", "services", "portfolio", "faq", "settings"],
  })),
})
