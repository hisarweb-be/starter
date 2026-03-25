import "server-only"

import { getAnalyticsConfig } from "@/lib/analytics"
import { experimentCatalog, getExperimentAssignments } from "@/lib/experiments"
import { checkForUpdates } from "@/lib/update-checker"
import { getContactInquiries } from "@/lib/server/contact-store"
import { getDemoContent } from "@/lib/server/demo-content-store"
import { getSafePayload } from "@/lib/server/payload-safe"
import { getRegistrationRequests } from "@/lib/server/registration-store"
import { getResetRequests } from "@/lib/server/reset-store"
import { getRuntimeSiteSettings } from "@/lib/server/site-runtime"
import { getActiveTenant } from "@/lib/server/tenant-runtime"
import { getWizardConfig } from "@/lib/server/wizard-store"

type CollectionCount = {
  totalDocs?: number
}

async function getCollectionTotal(collection: "pages" | "posts" | "services" | "portfolio" | "faq") {
  try {
    const payload = await getSafePayload()
    if (!payload) throw new Error("Payload unavailable")
    const result = (await payload.find({
      collection,
      limit: 1,
      depth: 0,
    })) as CollectionCount

    return result.totalDocs ?? 0
  } catch {
    return 0
  }
}

function formatRelativeDate(value?: string | null) {
  if (!value) {
    return "Nog geen activiteit"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Onbekende datum"
  }

  return new Intl.DateTimeFormat("nl-BE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export async function getDashboardStats() {
  const [
    tenantRuntime,
    runtimeSettings,
    wizardConfig,
    demoContent,
    contactInquiries,
    registrationRequests,
    resetRequests,
    rawPageCount,
    rawPostCount,
    rawServiceCount,
    rawPortfolioCount,
    rawFaqCount,
    updates,
  ] = await Promise.all([
    getActiveTenant(),
    getRuntimeSiteSettings(),
    getWizardConfig(),
    getDemoContent(),
    getContactInquiries(),
    getRegistrationRequests(),
    getResetRequests(),
    getCollectionTotal("pages"),
    getCollectionTotal("posts"),
    getCollectionTotal("services"),
    getCollectionTotal("portfolio"),
    getCollectionTotal("faq"),
    checkForUpdates(),
  ])

  const pageCount = rawPageCount || demoContent.pages.length
  const postCount = rawPostCount || demoContent.posts.length
  const serviceCount = rawServiceCount || demoContent.services.length
  const portfolioCount = rawPortfolioCount || demoContent.portfolio.length
  const faqCount = rawFaqCount || demoContent.faq.length

  const contentItems = pageCount + postCount + serviceCount + portfolioCount + faqCount
  const latestLead = contactInquiries[0]
  const latestRegistration = registrationRequests[0]
  const latestReset = resetRequests[0]
  const locales = [runtimeSettings.locale, ...(wizardConfig?.extraLocales ?? [])]
  const uniqueLocales = [...new Set(locales)]
  const analytics = getAnalyticsConfig()
  const experimentAssignments = getExperimentAssignments(wizardConfig?.adminEmail ?? "anonymous")

  return {
    siteName: runtimeSettings.siteName,
    tenant: {
      id: tenantRuntime.activeTenant.id,
      label: tenantRuntime.activeTenant.label,
      description: tenantRuntime.activeTenant.description,
      hostnames: tenantRuntime.activeTenant.hostnames,
      requestHost: tenantRuntime.requestHost,
    },
    currentVersion: updates.currentVersion,
    latestVersion: updates.latestVersion,
    updateAvailable: updates.updateAvailable,
    releaseUrl: updates.releaseUrl,
    metrics: {
      activeModules: runtimeSettings.modules.length,
      enabledLocales: uniqueLocales.length,
      contentItems,
      contactInquiries: contactInquiries.length,
      registrationRequests: registrationRequests.length,
      resetRequests: resetRequests.length,
      tenantCount: tenantRuntime.tenants.length,
      analyticsProviders: analytics.enabledProviders.length,
      experiments: experimentCatalog.length,
    },
    collections: [
      { label: "Pagina's", value: pageCount },
      { label: "Posts", value: postCount },
      { label: "Services", value: serviceCount },
      { label: "Portfolio items", value: portfolioCount },
      { label: "FAQ items", value: faqCount },
    ],
    recentActivity: [
      {
        label: "Laatste contactaanvraag",
        value: latestLead ? `${latestLead.name} · ${latestLead.subject}` : "Nog geen contactaanvragen",
        meta: formatRelativeDate(latestLead?.createdAt),
      },
      {
        label: "Laatste registratieaanvraag",
        value: latestRegistration
          ? `${latestRegistration.name} · ${latestRegistration.email}`
          : "Nog geen registratieaanvragen",
        meta: formatRelativeDate(latestRegistration?.createdAt),
      },
      {
        label: "Laatste wachtwoordreset",
        value: latestReset ? latestReset.email : "Nog geen resetaanvragen",
        meta: formatRelativeDate(latestReset?.createdAt),
      },
    ],
    setup: {
      industry: wizardConfig?.industry ?? "Niet ingesteld",
      defaultLocale: wizardConfig?.defaultLocale ?? runtimeSettings.locale,
      registrationEnabled: runtimeSettings.allowRegistration,
      themeMode: runtimeSettings.themeMode,
    },
    analytics,
    experiments: {
      catalog: experimentCatalog,
      assignments: experimentAssignments,
    },
  }
}
