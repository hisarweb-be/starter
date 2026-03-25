import { describe, expect, it, vi, beforeEach } from "vitest"

describe("email config", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("canSendEmail returns false when RESEND_API_KEY is empty", async () => {
    vi.stubEnv("RESEND_API_KEY", "")
    const { canSendEmail } = await import("../../src/lib/email")
    expect(canSendEmail()).toBe(false)
  })

  it("canSendEmail returns true when RESEND_API_KEY is set", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_123")
    const { canSendEmail } = await import("../../src/lib/email")
    expect(canSendEmail()).toBe(true)
  })
})
