import { describe, expect, it } from "vitest"

import { wizardConfigSchema, wizardDefaultValues } from "../../src/lib/wizard"

describe("wizard config schema", () => {
  it("accepts the default values with a valid password", () => {
    const parsed = wizardConfigSchema.safeParse({
      ...wizardDefaultValues,
      adminPassword: "securepassword123",
    })
    expect(parsed.success).toBe(true)
  })

  it("rejects empty password from form defaults", () => {
    const parsed = wizardConfigSchema.safeParse(wizardDefaultValues)
    expect(parsed.success).toBe(false)
  })

  it("rejects invalid passwords", () => {
    const parsed = wizardConfigSchema.safeParse({
      ...wizardDefaultValues,
      adminPassword: "123",
    })

    expect(parsed.success).toBe(false)
  })
})
