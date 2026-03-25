import "server-only"

import { z } from "zod"

import { getDataPath } from "@/lib/data-dir"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-store"
import { withPersistenceFallback } from "@/lib/server/persistence-fallback"
import { prisma } from "@/lib/server/prisma"

export const registrationRequestSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
})

export type RegistrationRequest = z.infer<typeof registrationRequestSchema>
export type StoredRegistrationRequest = RegistrationRequest & {
  id: string
  createdAt: string
}

type RegistrationRequestRecord = {
  id: string
  name: string
  email: string
  createdAt: Date
}

const registrationStorePath = getDataPath("registration-requests.json")

async function getRegistrationRequestsFromFile() {
  return readJsonFile<StoredRegistrationRequest[]>(registrationStorePath, [])
}

export async function getRegistrationRequests() {
  return withPersistenceFallback({
    primary: async () => {
      const db = prisma as unknown as {
        registrationRequest: {
          findMany: (args: { orderBy: { createdAt: "desc" } }) => Promise<RegistrationRequestRecord[]>
        }
      }

      const records = await db.registrationRequest.findMany({
        orderBy: { createdAt: "desc" },
      })

      return records.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        createdAt: item.createdAt.toISOString(),
      }))
    },
    fallback: getRegistrationRequestsFromFile,
  })
}

export async function saveRegistrationRequest(input: RegistrationRequest) {
  const parsed = registrationRequestSchema.parse(input)

  return withPersistenceFallback({
    primary: async () => {
      const db = prisma as unknown as {
        registrationRequest: {
          create: (args: { data: RegistrationRequest }) => Promise<RegistrationRequestRecord>
        }
      }

      const record = await db.registrationRequest.create({
        data: parsed,
      })

      const normalized = {
        ...parsed,
        id: record.id,
        createdAt: record.createdAt.toISOString(),
      }

      const existing = await getRegistrationRequestsFromFile()
      await writeJsonFile(registrationStorePath, [normalized, ...existing])
      return normalized
    },
    fallback: async () => {
      const existing = await getRegistrationRequestsFromFile()
      const nextItem = {
        ...parsed,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      await writeJsonFile(registrationStorePath, [nextItem, ...existing])
      return nextItem
    },
  })
}
