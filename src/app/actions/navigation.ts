"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"

export type NavigationItemData = {
  id?: string
  label: string
  href: string
  sortOrder: number
}

type NavItemRecord = {
  id: string
  organizationId: string
  label: string
  href: string
  sortOrder: number
  parentId: string | null
}

const db = prisma as unknown as {
  navItem: {
    findMany: (args: Record<string, unknown>) => Promise<NavItemRecord[]>
    deleteMany: (args: Record<string, unknown>) => Promise<{ count: number }>
    createMany: (args: Record<string, unknown>) => Promise<{ count: number }>
  }
}

async function getOrgId() {
  const session = await auth()
  if (!session?.user?.organizationId) throw new Error("Not authenticated")
  return session.user.organizationId
}

export async function getNavigationAction(): Promise<NavigationItemData[]> {
  const orgId = await getOrgId()
  const items = await db.navItem.findMany({
    where: { organizationId: orgId },
    orderBy: { sortOrder: "asc" },
  })

  return items.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    sortOrder: item.sortOrder,
  }))
}

export async function updateNavigationAction(items: NavigationItemData[]) {
  const orgId = await getOrgId()
  const cleanedItems = items
    .map((item, index) => ({
      label: item.label.trim(),
      href: item.href.trim(),
      sortOrder: index,
    }))
    .filter((item) => item.label.length > 0 && item.href.length > 0)

  await db.navItem.deleteMany({
    where: { organizationId: orgId },
  })

  if (cleanedItems.length > 0) {
    await db.navItem.createMany({
      data: cleanedItems.map((item) => ({
        organizationId: orgId,
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
      })),
    })
  }

  revalidatePath("/", "layout")
  revalidatePath("/dashboard/navigation")

  return { success: true, count: cleanedItems.length }
}
