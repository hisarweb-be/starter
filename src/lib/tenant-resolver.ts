import { defaultTenants, type TenantDefinition } from "@/lib/tenant"

function normalizeHost(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").split(":")[0]
}

export function resolveTenantFromHost({
  tenants,
  host,
  tenantId,
}: {
  tenants: TenantDefinition[]
  host?: string | null
  tenantId?: string | null
}) {
  const requestedTenant = tenantId?.trim().toLowerCase()

  if (requestedTenant) {
    const matchedById = tenants.find((tenant) => tenant.id === requestedTenant)
    if (matchedById) {
      return matchedById
    }
  }

  const normalizedHost = host ? normalizeHost(host) : null

  if (normalizedHost) {
    const matchedByHost = tenants.find((tenant) =>
      tenant.hostnames.some((hostname) => normalizeHost(hostname) === normalizedHost)
    )

    if (matchedByHost) {
      return matchedByHost
    }
  }

  return tenants[0] ?? defaultTenants[0]
}
