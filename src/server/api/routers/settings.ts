import { z } from "zod"

import { locales } from "@/lib/site"
import { getRuntimeHomeContent } from "@/lib/server/home-runtime"
import { getRuntimeSiteSettings } from "@/lib/server/site-runtime"
import { getActiveTenant } from "@/lib/server/tenant-runtime"
import { publicProcedure, createTRPCRouter } from "@/server/api/trpc"

export const settingsRouter = createTRPCRouter({
  site: publicProcedure.query(async () => {
    const [settings, tenantRuntime] = await Promise.all([
      getRuntimeSiteSettings(),
      getActiveTenant(),
    ])

    return {
      siteName: settings.siteName,
      themeMode: settings.themeMode,
      defaultLocale: settings.locale,
      enabledModules: settings.modules,
      allowRegistration: settings.allowRegistration,
      accentColor: settings.accentColor,
      logoUrl: settings.logoUrl,
      tagline: settings.tagline,
      tenant: {
        id: tenantRuntime.activeTenant.id,
        label: tenantRuntime.activeTenant.label,
      },
    }
  }),
  homepage: publicProcedure
    .input(z.object({ locale: z.enum(locales) }))
    .query(async ({ input }) => getRuntimeHomeContent(input.locale)),
})
