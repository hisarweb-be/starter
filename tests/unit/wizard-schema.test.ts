import { describe, expect, it } from "vitest"

import { wizardConfigSchema, wizardDefaultValues } from "../../src/lib/wizard"

describe("wizard config schema", () => {
  it("accepts the default values", () => {
    const parsed = wizardConfigSchema.safeParse(wizardDefaultValues)
    expect(parsed.success).toBe(true)
  })

  it("rejects invalid passwords", () => {
    const parsed = wizardConfigSchema.safeParse({
      ...wizardDefaultValues,
      adminPassword: "123",
    })

    expect(parsed.success).toBe(false)
  })
})
