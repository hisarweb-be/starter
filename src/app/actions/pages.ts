"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"

type PageRecord = {
  id: string
  organizationId: string
  title: string
  slug: string
  status: string
  locale: string
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  metaOgImage: string | null
  blocks: unknown
  sortOrder: number
  isHomePage: boolean
  scheduledAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

type RevisionRecord = {
  id: string
  pageId: string
  blocks: unknown
  createdBy: string | null
  createdAt: Date
}

const db = prisma as unknown as {
  page: {
    findMany: (args: Record<string, unknown>) => Promise<PageRecord[]>
    findFirst: (args: Record<string, unknown>) => Promise<PageRecord | null>
    create: (args: Record<string, unknown>) => Promise<PageRecord>
    update: (args: Record<string, unknown>) => Promise<PageRecord>
    delete: (args: Record<string, unknown>) => Promise<PageRecord>
  }
  pageRevision: {
    findMany: (args: Record<string, unknown>) => Promise<RevisionRecord[]>
    findFirst: (args: Record<string, unknown>) => Promise<RevisionRecord | null>
  }
}

async function getOrgId() {
  const session = await auth()
  if (!session?.user?.organizationId) throw new Error("Not authenticated")
  return session.user.organizationId
}

export async function listPagesAction() {
  const orgId = await getOrgId()
  return db.page.findMany({
    where: { organizationId: orgId },
    orderBy: { sortOrder: "asc" },
  })
}

export async function getPageAction(id: string) {
  const orgId = await getOrgId()
  return db.page.findFirst({
    where: { id, organizationId: orgId },
  })
}

export async function createPageAction(data: {
  title: string
  slug: string
  locale?: string
  isHomePage?: boolean
}) {
  const orgId = await getOrgId()
  const page = await db.page.create({
    data: {
      organizationId: orgId,
      title: data.title,
      slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      locale: data.locale ?? "nl",
      isHomePage: data.isHomePage ?? false,
      blocks: [],
    },
  })
  revalidatePath("/dashboard/pages")
  return page
}

export async function updatePageBlocksAction(id: string, blocks: Record<string, unknown>[]) {
  try {
    const orgId = await getOrgId()
    const page = await db.page.findFirst({
      where: { id, organizationId: orgId },
    })
    if (!page) return { success: false, message: "Pagina niet gevonden" }
    await db.page.update({
      where: { id },
      data: { blocks },
    })
    revalidatePath("/dashboard/pages")
    return { success: true }
  } catch {
    return { success: false, message: "Opslaan mislukt" }
  }
}

export async function publishPageAction(id: string) {
  const orgId = await getOrgId()
  const page = await db.page.findFirst({
    where: { id, organizationId: orgId },
  })
  if (!page) throw new Error("Page not found")
  await db.page.update({
    where: { id },
    data: { status: "published" },
  })
  revalidatePath("/dashboard/pages")
  return { success: true }
}

export async function unpublishPageAction(id: string) {
  const orgId = await getOrgId()
  const page = await db.page.findFirst({
    where: { id, organizationId: orgId },
  })
  if (!page) throw new Error("Page not found")
  await db.page.update({
    where: { id },
    data: { status: "draft" },
  })
  revalidatePath("/dashboard/pages")
  return { success: true }
}

export async function deletePageAction(id: string) {
  const orgId = await getOrgId()
  const page = await db.page.findFirst({
    where: { id, organizationId: orgId },
  })
  if (!page) throw new Error("Page not found")
  await db.page.delete({ where: { id } })
  revalidatePath("/dashboard/pages")
  return { success: true }
}

export async function duplicatePageAction(id: string) {
  const orgId = await getOrgId()
  const page = await db.page.findFirst({ where: { id, organizationId: orgId } })
  if (!page) throw new Error("Page not found")
  const newPage = await db.page.create({
    data: {
      organizationId: orgId,
      title: `${page.title} (kopie)`,
      slug: `${page.slug}-kopie-${Date.now()}`,
      locale: page.locale,
      status: "draft",
      blocks: page.blocks as Record<string, unknown>[],
      isHomePage: false,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
    },
  })
  revalidatePath("/dashboard/pages")
  return newPage
}

export async function schedulePageAction(id: string, scheduledAt: Date) {
  const orgId = await getOrgId()
  await db.page.update({ where: { id, organizationId: orgId } as Record<string, unknown>, data: { scheduledAt, status: "draft" } })
  revalidatePath("/dashboard/pages")
  return { success: true }
}

export async function updatePageMetaAction(id: string, meta: {
  metaTitle?: string
  metaDescription?: string
  metaOgImage?: string
  metaKeywords?: string
}) {
  try {
    const orgId = await getOrgId()
    const page = await db.page.findFirst({ where: { id, organizationId: orgId } })
    if (!page) return { success: false, message: "Pagina niet gevonden" }
    await db.page.update({ where: { id }, data: meta })
    return { success: true }
  } catch {
    return { success: false, message: "Opslaan mislukt" }
  }
}

export async function listRevisionsAction(pageId: string) {
  const orgId = await getOrgId()
  const page = await db.page.findFirst({ where: { id: pageId, organizationId: orgId } })
  if (!page) throw new Error("Pagina niet gevonden")
  return db.pageRevision.findMany({
    where: { pageId },
    orderBy: { createdAt: "desc" },
  })
}

export async function restoreRevisionAction(revisionId: string) {
  try {
    const orgId = await getOrgId()
    const revision = await db.pageRevision.findFirst({ where: { id: revisionId } })
    if (!revision) return { success: false, message: "Revisie niet gevonden" }
    const page = await db.page.findFirst({ where: { id: revision.pageId, organizationId: orgId } })
    if (!page) return { success: false, message: "Pagina niet gevonden" }
    await db.page.update({
      where: { id: revision.pageId },
      data: { blocks: revision.blocks as Record<string, unknown>[] },
    })
    revalidatePath("/dashboard/pages")
    return { success: true }
  } catch {
    return { success: false, message: "Herstellen mislukt" }
  }
}
