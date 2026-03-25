import type { AppLocale } from "@/lib/site"
import { defaultHomeContent, type RuntimeHomeContent } from "@/lib/home-content"

export type TenantId = "primary" | "alpha" | "growth"

export type TenantDefinition = {
  id: TenantId
  label: string
  description: string
  hostnames: string[]
  siteName: string
  tagline: string
  company?: string
  defaultLocale: AppLocale
  extraLocales: AppLocale[]
  allowRegistration: boolean
  accentColor: string
  modules: string[]
  navigation?: Array<{ label: string; href: string }>
  footer?: {
    headline: string
    description: string
    links: Array<{ label: string; href: string }>
  }
  homeContent?: RuntimeHomeContent
}

export const defaultTenants: TenantDefinition[] = [
  {
    id: "primary",
    label: "Primary",
    description: "Default HisarWeb starter instance for local development and generic deployments.",
    hostnames: ["localhost", "127.0.0.1", "primary.localhost"],
    siteName: "HisarWeb Starter",
    tagline: "Deploy-ready website starter met setup wizard, meertalige frontend en Payload-first architectuur.",
    company: "HisarWeb Design",
    defaultLocale: "nl",
    extraLocales: ["en", "fr", "de", "tr"],
    allowRegistration: true,
    accentColor: "#6d28d9",
    modules: ["homepage", "blog", "contact", "services", "portfolio", "pricing", "faq", "about"],
  },
  {
    id: "alpha",
    label: "Alpha Agency",
    description: "Tenant tuned for agency-style positioning with strong portfolio and service messaging.",
    hostnames: ["alpha.localhost", "alpha.hisarweb.test"],
    siteName: "HisarWeb Alpha",
    tagline: "Agency-first starter met focus op cases, services en snelle klantonboarding.",
    company: "HisarWeb Alpha Studio",
    defaultLocale: "nl",
    extraLocales: ["en"],
    allowRegistration: false,
    accentColor: "#0f766e",
    modules: ["homepage", "services", "portfolio", "pricing", "faq", "about", "contact"],
    homeContent: {
      ...defaultHomeContent.nl,
      badge: "Alpha agency instance",
      title: "Een tenant-specifieke agency starter voor cases, proposities en snelle oplevering.",
      description:
        "Deze tenant toont hoe HisarWeb per klantsegment een eigen positionering, moduleset en onboardingverhaal kan leveren.",
      features: {
        ...defaultHomeContent.nl.features,
        title: "Waarom Alpha anders gepositioneerd is",
      },
      cta: {
        ...defaultHomeContent.nl.cta,
        title: "Klaar om agency delivery tenant-aware te maken",
      },
    },
  },
  {
    id: "growth",
    label: "Growth Ops",
    description: "Tenant tuned for lead generation, onboarding and operational dashboarding.",
    hostnames: ["growth.localhost", "growth.hisarweb.test"],
    siteName: "HisarWeb Growth",
    tagline: "Lead-driven starter voor intakeflows, dashboards en schaalbare deliveryprocessen.",
    company: "HisarWeb Growth Ops",
    defaultLocale: "en",
    extraLocales: ["nl"],
    allowRegistration: true,
    accentColor: "#9333ea",
    modules: ["homepage", "blog", "contact", "services", "pricing", "faq", "dashboard", "about"],
    homeContent: {
      ...defaultHomeContent.en,
      badge: "Growth tenant active",
      title: "A lead-focused tenant that combines conversion flows with operational visibility.",
      description:
        "This tenant demonstrates how HisarWeb can tune messaging, modules and dashboard behavior per instance without splitting the product foundation.",
      testimonials: {
        ...defaultHomeContent.en.testimonials,
        title: "Why Growth tenants matter",
      },
      cta: {
        ...defaultHomeContent.en.cta,
        title: "Ready to run a tenant-aware growth instance",
      },
    },
  },
]
