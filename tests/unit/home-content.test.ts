import { describe, expect, it } from "vitest"

import { defaultHomeContent } from "../../src/lib/home-content"

describe("home content", () => {
  it("ships localized homepage content for Dutch and English", () => {
    expect(defaultHomeContent.nl.title.length).toBeGreaterThan(10)
    expect(defaultHomeContent.en.title.length).toBeGreaterThan(10)
    expect(defaultHomeContent.nl.features.items.length).toBe(4)
    expect(defaultHomeContent.en.testimonials.items.length).toBe(3)
  })

  it("keeps CTA labels available in both locales", () => {
    expect(defaultHomeContent.nl.cta.primary).toBeTruthy()
    expect(defaultHomeContent.en.cta.secondary).toBeTruthy()
  })
})
