import { describe, expect, it } from "vitest"

import { defaultDemoContent } from "../../src/lib/demo-content"

describe("demo content", () => {
  it("contains localized page entries for Dutch and English", () => {
    const locales = new Set(defaultDemoContent.pages.map((page) => page.locale))
    expect(locales.has("nl")).toBe(true)
    expect(locales.has("en")).toBe(true)
  })

  it("ships with representative seeded collection content", () => {
    expect(defaultDemoContent.posts.length).toBeGreaterThan(0)
    expect(defaultDemoContent.services.length).toBeGreaterThan(0)
    expect(defaultDemoContent.portfolio.length).toBeGreaterThan(0)
    expect(defaultDemoContent.faq.length).toBeGreaterThan(0)
  })
})
