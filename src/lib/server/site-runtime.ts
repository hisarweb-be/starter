import "server-only"

import { cache } from "react"

import { navigationItems, siteConfig, type AppLocale } from "@/lib/site"
import { getDemoContent } from "@/lib/server/demo-content-store"
import { getSafePayload } from "@/lib/server/payload-safe"
import { prisma } from "@/lib/server/prisma"
import { getActiveTenant, getActiveOrganization } from "@/lib/server/tenant-runtime"
import { getWizardConfig } from "@/lib/server/wizard-store"

type PayloadSiteConfig = {
  siteName?: string
  tagline?: string
  defaultLocale?: AppLocale
  allowRegistration?: boolean
  theme?: {
    borderRadius?: "none" | "rounded" | "full"
    shadows?: "none" | "sm" | "lg"
    primaryColor?: string
  }
}

type PayloadNavigation = {
  items?: Array<{
    label?: string | null
    href?: string | null
  }> | null
}

type PayloadFooter = {
  headline?: string | null
  description?: string | null
  links?: Array<{
    label?: string | null
    href?: string | null
  }> | null
}

export type RuntimeNavigationItem =
  | {
    href: string
    key: (typeof navigationItems)[number]["key"]
    label?: never
  }
  | {
    href: string
    label: string
    key?: never
  }

export type RuntimeFooterLink = {
  href: string
  label: string
}

type OrganizationFooterSettings = {
  tagline?: string
  columns?: Array<{ title: string; links: Array<{ label: string; href: string }> }>
  copyrightText?: string
}

type NavItemRecord = {
  id: string
  organizationId: string
  label: string
  href: string
  sortOrder: number
}

const db = prisma as unknown as {
  navItem: {
    findMany: (args: Record<string, unknown>) => Promise<NavItemRecord[]>
  }
}

const getPayloadGlobals = cache(async () => {
  try {
    const payload = await getSafePayload()
    if (!payload) throw new Error("Payload unavailable")

    const [siteGlobal, navigationGlobal, footerGlobal] = await Promise.all([
      payload.findGlobal({ slug: "site-config", depth: 0 }) as Promise<PayloadSiteConfig>,
      payload.findGlobal({ slug: "navigation", depth: 0 }) as Promise<PayloadNavigation>,
      payload.findGlobal({ slug: "footer", depth: 0 }) as Promise<PayloadFooter>,
    ])

    return {
      siteGlobal,
      navigationGlobal,
      footerGlobal,
    }
  } catch {
    return {
      siteGlobal: null,
      navigationGlobal: null,
      footerGlobal: null,
    }
  }
})

export const getRuntimeSiteSettings = cache(async () => {
  const [{ activeTenant, requestHost }, org, wizardConfig, payloadGlobals, demoContent] = await Promise.all([
    getActiveTenant(),
    getActiveOrganization(),
    getWizardConfig(),
    getPayloadGlobals(),
    getDemoContent(),
  ])

  const computedUrl = requestHost ? `http://${requestHost}` : siteConfig.url

  return {
    tenantId: org?.id ?? activeTenant.id,
    tenantLabel: org?.name ?? activeTenant.label,
    organizationId: org?.id ?? null,
    siteName:
      org?.siteName ??
      activeTenant.siteName ??
      payloadGlobals.siteGlobal?.siteName ??
      wizardConfig?.siteName ??
      demoContent.globals.siteConfig.siteName ??
      siteConfig.name,
    company: org?.name ?? activeTenant.company ?? siteConfig.company,
    url: computedUrl,
    locale:
      (org?.defaultLocale as AppLocale) ??
      activeTenant.defaultLocale ??
      payloadGlobals.siteGlobal?.defaultLocale ??
      wizardConfig?.defaultLocale ??
      demoContent.globals.siteConfig.defaultLocale ??
      "nl",
    extraLocales: org?.extraLocales ?? activeTenant.extraLocales ?? wizardConfig?.extraLocales ?? [],
    modules: org?.modules ?? activeTenant.modules ?? wizardConfig?.modules ?? ["homepage", "services", "contact", "about"],
    themeMode: org?.themeMode ?? wizardConfig?.themeMode ?? "system",
    accentColor: org?.accentColor ?? activeTenant.accentColor ?? wizardConfig?.accentColor ?? "#6d28d9",
    logoUrl: org?.logoUrl ?? wizardConfig?.logoUrl ?? "",
    allowRegistration:
      activeTenant.allowRegistration ??
      payloadGlobals.siteGlobal?.allowRegistration ??
      wizardConfig?.allowRegistration ??
      demoContent.globals.siteConfig.allowRegistration ??
      false,
    tagline:
      org?.tagline ??
      activeTenant.tagline ??
      payloadGlobals.siteGlobal?.tagline ??
      demoContent.globals.siteConfig.tagline ??
      siteConfig.description,
    theme: {
      borderRadius: payloadGlobals.siteGlobal?.theme?.borderRadius ?? "rounded",
      shadows: payloadGlobals.siteGlobal?.theme?.shadows ?? "sm",
      primaryColor: org?.accentColor ?? payloadGlobals.siteGlobal?.theme?.primaryColor ?? wizardConfig?.accentColor ?? "#3b82f6",
    },
  }
})

export const getRuntimeNavigation = cache(async (): Promise<RuntimeNavigationItem[]> => {
  const [org, { activeTenant }, { navigationGlobal }, demoContent] = await Promise.all([
    getActiveOrganization(),
    getActiveTenant(),
    getPayloadGlobals(),
    getDemoContent(),
  ])

  if (org?.id) {
    const orgNavItems = await db.navItem.findMany({
      where: { organizationId: org.id },
      orderBy: { sortOrder: "asc" },
    })

    if (orgNavItems.length > 0) {
      return orgNavItems.map((item) => ({
        href: item.href,
        label: item.label,
      }))
    }
  }

  if (activeTenant.navigation && activeTenant.navigation.length > 0) {
    return activeTenant.navigation.map((item) => ({ ...item }))
  }

  const payloadItems =
    navigationGlobal?.items
      ?.filter((item): item is { label: string; href: string } => Boolean(item?.label && item?.href))
      .map((item) => ({ href: item.href, label: item.label })) ?? []

  if (payloadItems.length > 0) {
    return payloadItems
  }

  const demoItems = demoContent.globals.navigation.items.map((item) => ({ ...item }))

  if (demoItems.length > 0) {
    return demoItems
  }

  return navigationItems.map((item) => ({ ...item }))
})

export const getRuntimeFooter = cache(async () => {
  const [org, { activeTenant }, { footerGlobal }, demoContent] = await Promise.all([
    getActiveOrganization(),
    getActiveTenant(),
    getPayloadGlobals(),
    getDemoContent(),
  ])

  const organizationFooter = ((org?.settings as Record<string, unknown> | undefined)?.footer ??
    null) as OrganizationFooterSettings | null
  const organizationFooterLinks =
    organizationFooter?.columns?.flatMap((column) =>
      column.links.filter((link) => link.label && link.href)
    ) ?? []
  const organizationTagline = organizationFooter?.tagline ?? ""
  const organizationCopyrightText = organizationFooter?.copyrightText ?? ""

  if (
    organizationTagline ||
    organizationCopyrightText ||
    organizationFooterLinks.length > 0
  ) {
    return {
      headline: organizationTagline,
      description: organizationTagline,
      links: organizationFooterLinks,
      copyrightText: organizationCopyrightText,
    }
  }

  if (activeTenant.footer) {
    return {
      headline: activeTenant.footer.headline,
      description: activeTenant.footer.description,
      links: activeTenant.footer.links,
      copyrightText: "",
    }
  }

  const links =
    footerGlobal?.links
      ?.filter((item): item is { label: string; href: string } => Boolean(item?.label && item?.href))
      .map((item) => ({ href: item.href, label: item.label })) ?? []

  if (links.length > 0 || footerGlobal?.headline || footerGlobal?.description) {
    return {
      headline: footerGlobal?.headline ?? "",
      description: footerGlobal?.description ?? "",
      links,
      copyrightText: "",
    }
  }

  return {
    headline: demoContent.globals.footer.headline,
    description: demoContent.globals.footer.description,
    links: demoContent.globals.footer.links,
    copyrightText: "",
  }
})
