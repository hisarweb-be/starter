import { describe, expect, it } from "vitest"

import { defaultLocale, isValidLocale, withLocale } from "../../src/lib/site"

describe("site helpers", () => {
  it("exposes the expected default locale", () => {
    expect(defaultLocale).toBe("nl")
  })

  it("validates supported locales", () => {
    expect(isValidLocale("nl")).toBe(true)
    expect(isValidLocale("en")).toBe(true)
    expect(isValidLocale("fr")).toBe(true)
    expect(isValidLocale("de")).toBe(true)
    expect(isValidLocale("tr")).toBe(true)
    expect(isValidLocale("es")).toBe(false)
  })

  it("builds locale-aware paths", () => {
    expect(withLocale("nl")).toBe("/nl")
    expect(withLocale("en", "/about")).toBe("/en/about")
    expect(withLocale("fr", "/contact")).toBe("/fr/contact")
  })
})
