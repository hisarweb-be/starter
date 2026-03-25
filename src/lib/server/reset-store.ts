import "server-only"

import { z } from "zod"

import { getDataPath } from "@/lib/data-dir"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-store"
import { withPersistenceFallback } from "@/lib/server/persistence-fallback"
import { prisma } from "@/lib/server/prisma"

export const resetRequestSchema = z.object({
  email: z.email(),
})

export type ResetRequest = z.infer<typeof resetRequestSchema>
export type StoredResetRequest = ResetRequest & { id: string; createdAt: string }

type ResetRequestRecord = {
  id: string
  email: string
  createdAt: Date
}

const resetStorePath = getDataPath("password-reset-requests.json")

async function getResetRequestsFromFile() {
  return readJsonFile<StoredResetRequest[]>(resetStorePath, [])
}

export async function getResetRequests() {
  return withPersistenceFallback({
    primary: async () => {
      const db = prisma as unknown as {
        passwordResetRequest: {
          findMany: (args: { orderBy: { createdAt: "desc" } }) => Promise<ResetRequestRecord[]>
        }
      }

      const records = await db.passwordResetRequest.findMany({
        orderBy: { createdAt: "desc" },
      })

      return records.map((item) => ({
        id: item.id,
        email: item.email,
        createdAt: item.createdAt.toISOString(),
      }))
    },
    fallback: getResetRequestsFromFile,
  })
}

export async function saveResetRequest(input: ResetRequest) {
  const parsed = resetRequestSchema.parse(input)

  return withPersistenceFallback({
    primary: async () => {
      const db = prisma as unknown as {
        passwordResetRequest: {
          create: (args: { data: ResetRequest }) => Promise<ResetRequestRecord>
        }
      }

      const record = await db.passwordResetRequest.create({
        data: parsed,
      })

      const normalized = {
        ...parsed,
        id: record.id,
        createdAt: record.createdAt.toISOString(),
      }

      const existing = await getResetRequestsFromFile()
      await writeJsonFile(resetStorePath, [normalized, ...existing])
      return normalized
    },
    fallback: async () => {
      const existing = await getResetRequestsFromFile()
      const nextItem = {
        ...parsed,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      await writeJsonFile(resetStorePath, [nextItem, ...existing])
      return nextItem
    },
  })
}
