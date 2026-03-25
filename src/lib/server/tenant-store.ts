import "server-only"

import { getDataPath } from "@/lib/data-dir"
import { defaultTenants, type TenantDefinition } from "@/lib/tenant"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-store"

const tenantStorePath = getDataPath("tenants.json")

function cloneTenants() {
  return JSON.parse(JSON.stringify(defaultTenants)) as TenantDefinition[]
}

export async function getStoredTenants() {
  return readJsonFile<TenantDefinition[]>(tenantStorePath, cloneTenants())
}

export async function writeStoredTenants(tenants = cloneTenants()) {
  await writeJsonFile(tenantStorePath, tenants)
  return tenants
}

export { tenantStorePath }
