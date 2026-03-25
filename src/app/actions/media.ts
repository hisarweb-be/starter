"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"

type MediaRecord = {
  id: string
  organizationId: string
  filename: string
  url: string
  publicId: string | null
  mimeType: string
  size: number
  width: number | null
  height: number | null
  alt: string | null
  createdAt: Date
}

const db = prisma as unknown as {
  media: {
    findMany: (args: Record<string, unknown>) => Promise<MediaRecord[]>
    create: (args: Record<string, unknown>) => Promise<MediaRecord>
    update: (args: Record<string, unknown>) => Promise<MediaRecord>
    delete: (args: Record<string, unknown>) => Promise<MediaRecord>
    count: (args?: Record<string, unknown>) => Promise<number>
  }
}

async function getOrgId() {
  const session = await auth()
  if (!session?.user?.organizationId) throw new Error("Not authenticated")
  return session.user.organizationId
}

export async function listMediaAction(opts?: { search?: string; mimeType?: string }) {
  const orgId = await getOrgId()
  const where: Record<string, unknown> = { organizationId: orgId }
  if (opts?.search) where.filename = { contains: opts.search, mode: "insensitive" }
  if (opts?.mimeType) where.mimeType = { startsWith: opts.mimeType }

  return db.media.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export async function saveMediaAction(data: {
  filename: string
  url: string
  publicId?: string
  mimeType: string
  size: number
  width?: number
  height?: number
  alt?: string
}) {
  const orgId = await getOrgId()
  return db.media.create({
    data: { ...data, organizationId: orgId },
  })
}

export async function updateMediaAltAction(id: string, alt: string) {
  const orgId = await getOrgId()
  return db.media.update({
    where: { id },
    data: { alt, organizationId: orgId },
  })
}

export async function deleteMediaAction(id: string) {
  const orgId = await getOrgId()
  await db.media.delete({ where: { id, organizationId: orgId } })
  return { success: true }
}
