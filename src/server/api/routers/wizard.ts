import { z } from "zod"

import { getSessionRole } from "@/lib/server/authorization"
import { canManageSetup } from "@/lib/server/authorization-server"
import { getWizardConfig, saveWizardConfig } from "@/lib/server/wizard-store"
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc"
import { wizardConfigSchema } from "@/lib/wizard"

export const wizardRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    const config = await getWizardConfig()
    return {
      config,
      ready: Boolean(config),
    }
  }),
  save: publicProcedure.input(wizardConfigSchema).mutation(async ({ ctx, input }) => {
    const hasAccess = await canManageSetup(ctx.session)

    if (!hasAccess) {
      return {
        success: false,
        config: null,
        message: "Setup management is locked to admin access once the installation exists.",
      }
    }

    const config = await saveWizardConfig(input)
    return {
      success: true,
      config,
      message: "Setup configuration saved.",
      role: getSessionRole(ctx.session),
    }
  }),
  readiness: publicProcedure.query(async () => {
    const config = await getWizardConfig()

    return {
      ready: Boolean(config),
      siteName: config?.siteName ?? null,
      modules: config?.modules ?? [],
      locale: config?.defaultLocale ?? "nl",
    }
  }),
  loginPreview: publicProcedure
    .input(z.object({ email: z.email() }))
    .query(({ input }) => ({
      canLogin: true,
      email: input.email,
    })),
})
