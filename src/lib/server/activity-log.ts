import "server-only"

import { prisma } from "@/lib/server/prisma"

type LogActivityParams = {
  organizationId?: string | null
  userId?: string | null
  userName?: string | null
  action: string
  entityType?: string
  entityId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string | null
}

const db = prisma as unknown as {
  activityLog: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>
    findMany: (args: Record<string, unknown>) => Promise<ActivityLogRecord[]>
    count: (args: Record<string, unknown>) => Promise<number>
  }
}

export type ActivityLogRecord = {
  id: string
  organizationId: string | null
  userId: string | null
  userName: string | null
  action: string
  entityType: string | null
  entityId: string | null
  metadata: Record<string, unknown>
  ipAddress: string | null
  createdAt: Date
}

export async function logActivity({
  organizationId,
  userId,
  userName,
  action,
  entityType,
  entityId,
  metadata = {},
  ipAddress,
}: LogActivityParams): Promise<void> {
  try {
    await db.activityLog.create({
      data: {
        organizationId: organizationId ?? undefined,
        userId: userId ?? undefined,
        userName: userName ?? undefined,
        action,
        entityType,
        entityId,
        metadata,
        ipAddress: ipAddress ?? undefined,
      },
    })
  } catch (err) {
    console.error("[ActivityLog] Failed to log activity:", err)
  }
}

type GetActivitiesParams = {
  organizationId?: string
  userId?: string
  action?: string
  limit?: number
  offset?: number
}

export async function getActivities({
  organizationId,
  userId,
  action,
  limit = 50,
  offset = 0,
}: GetActivitiesParams = {}): Promise<{
  items: ActivityLogRecord[]
  total: number
}> {
  const where: Record<string, unknown> = {}
  if (organizationId) where.organizationId = organizationId
  if (userId) where.userId = userId
  if (action) where.action = action

  const [items, total] = await Promise.all([
    db.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.activityLog.count({ where }),
  ])

  return { items, total }
}
