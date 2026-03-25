"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"
import { revalidatePath } from "next/cache"

export type FooterData = {
  tagline?: string
  columns?: Array<{ title: string; links: Array<{ label: string; href: string }> }>
  socialLinks?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
  copyrightText?: string
}

const db = prisma as unknown as {
  organization: {
    findFirst: (args: Record<string, unknown>) => Promise<{ id: string; settings: unknown } | null>
    update: (args: Record<string, unknown>) => Promise<unknown>
  }
}

async function getOrgId() {
  const session = await auth()
  const orgId = (session?.user as { organizationId?: string })?.organizationId
  if (!orgId) throw new Error("Not authenticated")
  return orgId
}

export async function getFooterAction(): Promise<FooterData> {
  const orgId = await getOrgId()
  const org = await db.organization.findFirst({ where: { id: orgId } })
  const settings = (org?.settings as Record<string, unknown>) ?? {}
  return (settings.footer as FooterData) ?? {}
}

export async function updateFooterAction(data: FooterData) {
  const orgId = await getOrgId()
  const org = await db.organization.findFirst({ where: { id: orgId } })
  const settings = (org?.settings as Record<string, unknown>) ?? {}
  await db.organization.update({
    where: { id: orgId },
    data: { settings: { ...settings, footer: data } },
  })
  revalidatePath("/dashboard/navigation")
  return { success: true }
}
