"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"

const db = prisma as unknown as {
  organization: {
    findUnique: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>
    update: (args: Record<string, unknown>) => Promise<Record<string, unknown>>
  }
}

async function getOrgId() {
  const session = await auth()
  if (!session?.user?.organizationId) throw new Error("Not authenticated")
  return session.user.organizationId
}

export async function updateSiteSettingsAction(data: {
  siteName?: string
  tagline?: string
  accentColor?: string
  logoUrl?: string
  defaultLocale?: string
  industry?: string
  modules?: string[]
  gaTrackingId?: string
}) {
  const orgId = await getOrgId()
  await db.organization.update({
    where: { id: orgId },
    data,
  })
  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function updateThemeAction(data: {
  themeMode?: string
  fontPreset?: string
  accentColor?: string
  customCss?: string | null
  faviconUrl?: string | null
}) {
  const orgId = await getOrgId()
  await db.organization.update({
    where: { id: orgId },
    data,
  })
  revalidatePath("/dashboard/appearance")
  return { success: true }
}

export async function getOrganizationAction() {
  const orgId = await getOrgId()
  return db.organization.findUnique({ where: { id: orgId } })
}
