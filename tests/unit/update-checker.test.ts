import { describe, expect, it, vi, beforeEach } from "vitest"

describe("update-checker", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("returns the correct release feed URL", async () => {
    vi.stubEnv("GITHUB_REPOSITORY", "hisarweb/hisarweb-starter")
    const { getReleaseFeedUrl } = await import("../../src/lib/update-checker")
    const url = getReleaseFeedUrl()
    expect(url).toContain("github.com")
    expect(url).toContain("hisarweb/hisarweb-starter")
  })

  it("returns updateAvailable=false when fetch fails", async () => {
    vi.stubEnv("GITHUB_REPOSITORY", "hisarweb/hisarweb-starter")
    const fetchSpy = vi.fn().mockRejectedValue(new Error("network"))
    vi.stubGlobal("fetch", fetchSpy)
    const { checkForUpdates } = await import("../../src/lib/update-checker")
    const result = await checkForUpdates()
    expect(result.updateAvailable).toBe(false)
    expect(result.latestVersion).toBeNull()
  })
})
