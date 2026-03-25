import "server-only"

import { headers } from "next/headers"

import { type TenantId } from "@/lib/tenant"
import { resolveTenantFromHost } from "@/lib/tenant-resolver"
import { prisma } from "@/lib/server/prisma"
import { getStoredTenants } from "@/lib/server/tenant-store"

export type OrganizationRecord = {
  id: string
  name: string
  slug: string
  domain: string | null
  plan: string
  status: string
  ownerId: string
  industry: string | null
  accentColor: string
  logoUrl: string | null
  faviconUrl: string | null
  siteName: string | null
  tagline: string | null
  themeMode: string
  fontPreset: string
  customCss: string | null
  gaTrackingId: string | null
  defaultLocale: string
  extraLocales: string[]
  modules: string[]
  settings: unknown
}

export async function getActiveOrganization(): Promise<OrganizationRecord | null> {
  try {
    const requestHeaders = await headers()

    // Check for an explicit tenant slug forwarded by the middleware (subdomain or dev param)
    const tenantSlug = requestHeaders.get("x-tenant-slug")

    const forwardedHost = requestHeaders.get("x-forwarded-host")
    const host = forwardedHost ?? requestHeaders.get("host")
    if (!tenantSlug && !host) return null

    const db = prisma as unknown as {
      organization: {
        findFirst: (args: {
          where:
            | { slug: string; status: string }
            | { OR: Array<Record<string, unknown>>; status: string }
        }) => Promise<OrganizationRecord | null>
      }
    }

    if (tenantSlug) {
      // Resolve directly by slug (fastest path)
      return await db.organization.findFirst({
        where: { slug: tenantSlug, status: "active" },
      })
    }

    // Fallback: resolve by custom domain or subdomain slug from host header
    const normalized = (host ?? "")
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split(":")[0]

    const parts = normalized.split(".")
    const slug = parts.length >= 2 ? parts[0] : null

    return await db.organization.findFirst({
      where: {
        OR: [
          { domain: normalized },
          ...(slug && slug !== "www" ? [{ slug }] : []),
        ],
        status: "active",
      },
    })
  } catch {
    return null
  }
}

export async function getActiveTenant() {
  const [requestHeaders, tenants] = await Promise.all([headers(), getStoredTenants()])
  const tenantId = requestHeaders.get("x-tenant-id")
  const forwardedHost = requestHeaders.get("x-forwarded-host")
  const host = forwardedHost ?? requestHeaders.get("host")
  const activeTenant = resolveTenantFromHost({ tenants, host, tenantId })

  return {
    activeTenant,
    tenants,
    requestHost: host ?? null,
    tenantId: activeTenant.id as TenantId,
  }
}
