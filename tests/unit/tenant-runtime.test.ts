import { describe, expect, it } from "vitest"

import { defaultTenants } from "../../src/lib/tenant"
import { resolveTenantFromHost } from "../../src/lib/tenant-resolver"

describe("tenant runtime", () => {
  it("matches tenants by explicit tenant id first", () => {
    const result = resolveTenantFromHost({
      tenants: defaultTenants,
      tenantId: "growth",
      host: "localhost:3000",
    })

    expect(result.id).toBe("growth")
  })

  it("matches tenants by hostname and falls back to primary", () => {
    expect(
      resolveTenantFromHost({
        tenants: defaultTenants,
        host: "alpha.localhost:3000",
      }).id
    ).toBe("alpha")

    expect(
      resolveTenantFromHost({
        tenants: defaultTenants,
        host: "unknown.localhost:3000",
      }).id
    ).toBe("primary")
  })
})
