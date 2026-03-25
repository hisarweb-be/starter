"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"
import { getModulesForPackages } from "@/lib/packages"

type OrgRecord = {
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
  siteName: string | null
  tagline: string | null
  modules: string[]
  settings: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  owner: { id: string; email: string; name: string | null } | null
  _count?: { pages: number; members: number }
}

const db = prisma as unknown as {
  organization: {
    findMany: (args: Record<string, unknown>) => Promise<OrgRecord[]>
    findFirst: (args: Record<string, unknown>) => Promise<OrgRecord | null>
    update: (args: Record<string, unknown>) => Promise<OrgRecord>
    count: (args?: Record<string, unknown>) => Promise<number>
  }
  page: {
    count: (args?: Record<string, unknown>) => Promise<number>
  }
}

async function requireSuperAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error("Niet ingelogd")
  const role = (session.user as { role?: string }).role
  if (role !== "superadmin" && role !== "admin") {
    throw new Error("Geen toegang: alleen admins")
  }
  return session
}

/** Haal alle klant-organisaties op met paginainfo */
export async function listClientsAction(opts?: {
  status?: string
  search?: string
}) {
  await requireSuperAdmin()

  const where: Record<string, unknown> = {}
  if (opts?.status) where.status = opts.status
  if (opts?.search) {
    where.OR = [
      { name: { contains: opts.search, mode: "insensitive" } },
      { slug: { contains: opts.search, mode: "insensitive" } },
    ]
  }

  return db.organization.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, email: true, name: true } },
      _count: { select: { pages: true, members: true } },
    },
  })
}

/** Haal één klant op */
export async function getClientAction(id: string) {
  await requireSuperAdmin()
  return db.organization.findFirst({
    where: { id },
    include: {
      owner: { select: { id: true, email: true, name: true } },
      _count: { select: { pages: true, members: true } },
    },
  })
}

/** Wijs pakketten toe aan een klant + update modules automatisch */
export async function assignPackagesAction(
  orgId: string,
  data: {
    packages: string[]
    looseModules?: string[]
    plan?: string
    notes?: string
    manualModules?: string[]
  }
) {
  await requireSuperAdmin()

  const org = await db.organization.findFirst({ where: { id: orgId } })
  if (!org) throw new Error("Organisatie niet gevonden")

  // Bepaal welke dashboard-modules ontgrendeld worden op basis van pakketten
  const autoModules = getModulesForPackages(data.packages)

  // Combineer automatische + handmatige modules + losse modules
  const allModules = Array.from(
    new Set([
      ...autoModules,
      ...(data.manualModules ?? []),
    ])
  )

  // Sla op in settings (JSON veld) voor pakket-info + update modules array
  const currentSettings = (org.settings as Record<string, unknown>) ?? {}
  const updatedSettings: Record<string, unknown> = {
    ...currentSettings,
    selectedPackages: data.packages,
    looseModules: data.looseModules ?? [],
    packageNotes: data.notes ?? "",
    packagesUpdatedAt: new Date().toISOString(),
  }

  await db.organization.update({
    where: { id: orgId },
    data: {
      modules: allModules,
      settings: updatedSettings,
      ...(data.plan ? { plan: data.plan } : {}),
    },
  })

  return {
    success: true,
    message: `Pakketten bijgewerkt. ${allModules.length} modules geactiveerd.`,
    activatedModules: allModules,
  }
}

/** Haal platform-brede statistieken op voor het admin overzicht */
export async function getAdminStatsAction() {
  await requireSuperAdmin()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalOrgs, activeOrgs, suspendedOrgs, totalPublishedPages, newThisMonth, recentOrgs] =
    await Promise.all([
      db.organization.count({}),
      db.organization.count({ where: { status: "active" } }),
      db.organization.count({ where: { status: "suspended" } }),
      db.page.count({ where: { status: "published" } }),
      db.organization.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.organization.findMany({
        where: {},
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { owner: { select: { email: true } } },
      }),
    ])

  return {
    totalOrgs,
    activeOrgs,
    suspendedOrgs,
    totalPublishedPages,
    newThisMonth,
    recentOrgs,
  }
}

/** Snel status wijzigen (actief / gesuspendeerd) */
export async function updateClientStatusAction(orgId: string, status: "active" | "suspended") {
  await requireSuperAdmin()
  await db.organization.update({
    where: { id: orgId },
    data: { status },
  })
  return { success: true }
}
