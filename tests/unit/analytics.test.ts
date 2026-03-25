import { beforeEach, describe, expect, it, vi } from "vitest"

describe("analytics config", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("reports no enabled providers by default", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "")
    vi.stubEnv("NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "")
    const { hasAnalytics, getAnalyticsConfig } = await import("../../src/lib/analytics")
    expect(hasAnalytics()).toBe(false)
    expect(getAnalyticsConfig().enabledProviders).toEqual([])
  })

  it("detects configured analytics providers", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST123")
    vi.stubEnv("NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "demo.hisarweb.test")
    const { getAnalyticsConfig } = await import("../../src/lib/analytics")
    expect(getAnalyticsConfig().enabledProviders).toContain("google-analytics")
    expect(getAnalyticsConfig().enabledProviders).toContain("plausible")
  })
})
