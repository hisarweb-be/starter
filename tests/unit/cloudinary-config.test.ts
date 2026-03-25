import { describe, expect, it, vi, beforeEach } from "vitest"

describe("cloudinary config", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("hasCloudinaryConfig returns false when env is empty", async () => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "")
    vi.stubEnv("CLOUDINARY_API_KEY", "")
    vi.stubEnv("CLOUDINARY_API_SECRET", "")
    const { hasCloudinaryConfig } = await import("../../src/lib/cloudinary")
    expect(hasCloudinaryConfig()).toBe(false)
  })

  it("hasCloudinaryConfig returns true when all env vars are set", async () => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "test-cloud")
    vi.stubEnv("CLOUDINARY_API_KEY", "123456")
    vi.stubEnv("CLOUDINARY_API_SECRET", "secret")
    const { hasCloudinaryConfig } = await import("../../src/lib/cloudinary")
    expect(hasCloudinaryConfig()).toBe(true)
  })
})
