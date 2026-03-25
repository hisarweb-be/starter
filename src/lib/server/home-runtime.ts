import "server-only"

import { cache } from "react"

import { z } from "zod"
import { defaultHomeContent } from "@/lib/home-content"
import { type AppLocale } from "@/lib/site"
import { getStoredHomeContent } from "@/lib/server/home-content-store"
import { getSafePayload } from "@/lib/server/payload-safe"
import { getRuntimeSiteSettings } from "@/lib/server/site-runtime"
import { getActiveTenant } from "@/lib/server/tenant-runtime"
import { getWizardConfig } from "@/lib/server/wizard-store"

const homeFeatureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  body: z.string(),
})

const homeTestimonialItemSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  body: z.string(),
})

const runtimeHomeContentSchema = z.object({
  badge: z.string(),
  title: z.string(),
  description: z.string(),
  primaryCta: z.string(),
  secondaryCta: z.string(),
  stats: z.object({
    modulesLabel: z.string(),
    languagesLabel: z.string(),
    deliveryLabel: z.string(),
  }),
  features: z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(homeFeatureItemSchema).min(1),
  }),
  testimonials: z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(homeTestimonialItemSchema).min(1),
  }),
  cta: z.object({
    title: z.string(),
    description: z.string(),
    primary: z.string(),
    secondary: z.string(),
  }),
})

const getPayloadHomepageSetting = cache(async (locale: AppLocale) => {
  try {
    const payload = await getSafePayload()
    if (!payload) throw new Error("Payload unavailable")
    const result = await payload.find({
      collection: "settings",
      limit: 1,
      depth: 0,
      where: {
        and: [
          {
            key: {
              equals: `homepage.${locale}`,
            },
          },
          {
            group: {
              equals: "homepage",
            },
          },
        ],
      },
    })

    const rawValue = (result.docs[0] as { value?: string | null } | undefined)?.value

    if (!rawValue) {
      return null
    }

    const parsedJson = JSON.parse(rawValue)
    const parsed = runtimeHomeContentSchema.safeParse(parsedJson)

    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
})

export const getRuntimeHomeContent = cache(async (locale: AppLocale) => {
  const [{ activeTenant }, runtimeSettings, wizardConfig, payloadContent, storedHomeContent] = await Promise.all([
    getActiveTenant(),
    getRuntimeSiteSettings(),
    getWizardConfig(),
    getPayloadHomepageSetting(locale),
    getStoredHomeContent(),
  ])

  const fallback =
    activeTenant.homeContent ??
    storedHomeContent[locale] ??
    storedHomeContent.en ??
    defaultHomeContent[locale] ??
    defaultHomeContent.en
  const content = activeTenant.homeContent ?? payloadContent ?? fallback
  const localeCount = new Set([runtimeSettings.locale, ...(wizardConfig?.extraLocales ?? [])]).size

  return {
    ...content,
    stats: {
      ...content.stats,
      modulesValue: String(runtimeSettings.modules.length || 0),
      languagesValue: String(localeCount || 1),
      deliveryValue: runtimeSettings.siteName,
    },
  }
})

export type ResolvedRuntimeHomeContent = Awaited<ReturnType<typeof getRuntimeHomeContent>>
