import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { prisma } from "@/lib/server/prisma"
import { createTRPCRouter, tenantProcedure } from "@/server/api/trpc"

const db = prisma as unknown as {
  organization: {
    findUnique: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>
    update: (args: Record<string, unknown>) => Promise<Record<string, unknown>>
  }
}

export const siteSettingsRouter = createTRPCRouter({
  get: tenantProcedure.query(async ({ ctx }) => {
    const org = await db.organization.findUnique({
      where: { id: ctx.organizationId },
    })
    if (!org) throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" })
    return {
      siteName: org.siteName as string | null,
      tagline: org.tagline as string | null,
      accentColor: org.accentColor as string,
      logoUrl: org.logoUrl as string | null,
      themeMode: org.themeMode as string,
      fontPreset: org.fontPreset as string,
      defaultLocale: org.defaultLocale as string,
      extraLocales: org.extraLocales as string[],
      modules: org.modules as string[],
      industry: org.industry as string | null,
      name: org.name as string,
      slug: org.slug as string,
    }
  }),

  update: tenantProcedure
    .input(
      z.object({
        siteName: z.string().min(1).optional(),
        tagline: z.string().optional(),
        accentColor: z.string().optional(),
        logoUrl: z.string().optional(),
        defaultLocale: z.string().optional(),
        extraLocales: z.array(z.string()).optional(),
        modules: z.array(z.string()).optional(),
        industry: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.organization.update({
        where: { id: ctx.organizationId },
        data: input,
      })
    }),

  updateTheme: tenantProcedure
    .input(
      z.object({
        themeMode: z.enum(["light", "dark", "system"]).optional(),
        fontPreset: z.enum(["geist", "inter", "manrope"]).optional(),
        accentColor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.organization.update({
        where: { id: ctx.organizationId },
        data: input,
      })
    }),
})
