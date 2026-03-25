import { describe, expect, it } from "vitest"

import {
  canManageContent,
  canManageSystem,
  canManageUsers,
  canViewRequests,
  getSessionPermissions,
  getSessionRole,
  hasDashboardAccess,
  hasSetupAccess,
} from "../../src/lib/server/authorization"

describe("authorization helpers", () => {
  it("defaults unknown or missing roles to user", () => {
    expect(getSessionRole(null)).toBe("user")
    expect(getSessionRole({ user: { role: "admin" } } as never)).toBe("admin")
    expect(getSessionRole({ user: { role: "something-else" } } as never)).toBe("user")
  })

  it("grants dashboard access only to admin and editor roles", () => {
    expect(hasDashboardAccess({ user: { role: "admin" } } as never)).toBe(true)
    expect(hasDashboardAccess({ user: { role: "editor" } } as never)).toBe(true)
    expect(hasDashboardAccess({ user: { role: "user" } } as never)).toBe(false)
  })

  it("maps permissions by role", () => {
    expect(getSessionPermissions({ user: { role: "admin" } } as never)).toContain("system:manage")
    expect(canManageContent({ user: { role: "editor" } } as never)).toBe(true)
    expect(canViewRequests({ user: { role: "editor" } } as never)).toBe(true)
    expect(canManageUsers({ user: { role: "editor" } } as never)).toBe(false)
    expect(canManageSystem({ user: { role: "admin" } } as never)).toBe(true)
  })

  it("keeps setup open before first install but locks it down afterwards", () => {
    expect(hasSetupAccess(null, false)).toBe(true)
    expect(hasSetupAccess({ user: { role: "admin" } } as never, true)).toBe(true)
    expect(hasSetupAccess({ user: { role: "editor" } } as never, true)).toBe(false)
    expect(hasSetupAccess(null, true)).toBe(false)
  })
})
