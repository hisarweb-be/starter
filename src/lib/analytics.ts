import { env } from "@/lib/env"

export type AnalyticsProvider = "google-analytics" | "plausible"

export function getAnalyticsConfig() {
  const googleAnalyticsId = env.googleAnalyticsId
  const plausibleDomain = env.plausibleDomain

  return {
    googleAnalyticsId,
    plausibleDomain,
    enabledProviders: [
      ...(googleAnalyticsId ? (["google-analytics"] as const) : []),
      ...(plausibleDomain ? (["plausible"] as const) : []),
    ] as AnalyticsProvider[],
  }
}

export function hasAnalytics() {
  return getAnalyticsConfig().enabledProviders.length > 0
}
