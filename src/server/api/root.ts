import { createTRPCRouter } from "@/server/api/trpc"
import { contentRouter } from "@/server/api/routers/content"
import { dashboardRouter } from "@/server/api/routers/dashboard"
import { experimentsRouter } from "@/server/api/routers/experiments"
import { navigationEditorRouter } from "@/server/api/routers/navigation-editor"
import { pagesRouter } from "@/server/api/routers/pages"
import { searchRouter } from "@/server/api/routers/search"
import { settingsRouter } from "@/server/api/routers/settings"
import { siteSettingsRouter } from "@/server/api/routers/site-settings"
import { teamRouter } from "@/server/api/routers/team"
import { tenantRouter } from "@/server/api/routers/tenant"
import { wizardRouter } from "@/server/api/routers/wizard"

export const appRouter = createTRPCRouter({
  wizard: wizardRouter,
  settings: settingsRouter,
  content: contentRouter,
  dashboard: dashboardRouter,
  experiments: experimentsRouter,
  pages: pagesRouter,
  search: searchRouter,
  siteSettings: siteSettingsRouter,
  nav: navigationEditorRouter,
  team: teamRouter,
  tenant: tenantRouter,
})

export type AppRouter = typeof appRouter
