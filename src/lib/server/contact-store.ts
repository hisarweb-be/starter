import "server-only"

import { z } from "zod"

import { getDataPath } from "@/lib/data-dir"
import { sanitizeInput, sanitizeEmail, escapeHtml } from "@/lib/server/input-sanitizer"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-store"
import { withPersistenceFallback } from "@/lib/server/persistence-fallback"
import { prisma } from "@/lib/server/prisma"

// Enhanced schema with stricter validation
export const contactInquirySchema = z.object({
  name: z
    .string()
    .min(2, "Naam moet minimaal 2 tekens zijn")
    .max(100, "Naam mag maximaal 100 tekens zijn")
    .transform((val) => sanitizeInput(val, { maxLength: 100 }) ?? "")
    .refine((val) => val.length >= 2, "Naam is ongeldig"),
  email: z
    .string()
    .email("Ongeldig e-mailadres")
    .max(254, "E-mailadres te lang")
    .transform((val) => sanitizeEmail(val) ?? "")
    .refine((val) => val.length > 0, "E-mailadres is ongeldig"),
  subject: z
    .string()
    .min(2, "Onderwerp moet minimaal 2 tekens zijn")
    .max(200, "Onderwerp mag maximaal 200 tekens zijn")
    .transform((val) => sanitizeInput(val, { maxLength: 200 }) ?? "")
    .refine((val) => val.length >= 2, "Onderwerp is ongeldig"),
  message: z
    .string()
    .min(10, "Bericht moet minimaal 10 tekens zijn")
    .max(5000, "Bericht mag maximaal 5000 tekens zijn")
    .transform((val) => sanitizeInput(val, { maxLength: 5000, normalizeWhitespace: false }) ?? "")
    .refine((val) => val.length >= 10, "Bericht is ongeldig"),
})

export type ContactInquiry = z.infer<typeof contactInquirySchema>
export type StoredContactInquiry = ContactInquiry & { id: string; createdAt: string }

type ContactInquiryRecord = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
}

const inquiryStorePath = getDataPath("contact-inquiries.json")

async function getContactInquiriesFromFile() {
  return readJsonFile<StoredContactInquiry[]>(inquiryStorePath, [])
}

export async function getContactInquiries() {
  return withPersistenceFallback({
    primary: async () => {
      const db = prisma as unknown as {
        contactInquiry: {
          findMany: (args: { orderBy: { createdAt: "desc" } }) => Promise<ContactInquiryRecord[]>
        }
      }

      const records = await db.contactInquiry.findMany({
        orderBy: { createdAt: "desc" },
      })

      return records.map((item) => ({
        id: item.id,
        name: escapeHtml(item.name),
        email: item.email,
        subject: escapeHtml(item.subject),
        message: escapeHtml(item.message),
        createdAt: item.createdAt.toISOString(),
      }))
    },
    fallback: async () => {
      const items = await getContactInquiriesFromFile()
      // Escape on read for safety
      return items.map((item) => ({
        ...item,
        name: escapeHtml(item.name),
        subject: escapeHtml(item.subject),
        message: escapeHtml(item.message),
      }))
    },
  })
}

export async function saveContactInquiry(input: ContactInquiry) {
  const parsed = contactInquirySchema.parse(input)

  return withPersistenceFallback({
    primary: async () => {
      const db = prisma as unknown as {
        contactInquiry: {
          create: (args: { data: ContactInquiry }) => Promise<ContactInquiryRecord>
        }
      }

      const record = await db.contactInquiry.create({
        data: parsed,
      })

      const normalized = {
        ...parsed,
        id: record.id,
        createdAt: record.createdAt.toISOString(),
      }

      const existing = await getContactInquiriesFromFile()
      await writeJsonFile(inquiryStorePath, [normalized, ...existing])
      return normalized
    },
    fallback: async () => {
      const existing = await getContactInquiriesFromFile()
      const nextItem = {
        ...parsed,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      await writeJsonFile(inquiryStorePath, [nextItem, ...existing])
      return nextItem
    },
  })
}
