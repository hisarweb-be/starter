import "server-only"

import { getDataPath } from "@/lib/data-dir"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-store"
import { withPersistenceFallback } from "@/lib/server/persistence-fallback"
import { prisma } from "@/lib/server/prisma"
import { hashPassword, verifyPassword } from "@/lib/server/security"
import { type AppLocale } from "@/lib/site"
import { wizardConfigSchema, type WizardConfig } from "@/lib/wizard"

const wizardStorePath = getDataPath("wizard-config.json")

export type PersistedWizardConfig = Omit<WizardConfig, "adminPassword"> & {
  adminPasswordHash: string
  updatedAt: string
}

type WizardConfigRecord = {
  siteName: string
  adminEmail: string
  adminPasswordHash: string
  databaseProvider: string
  databaseUrl: string
  industry: string
  accentColor: string
  accentColorDark: string | null
  logoUrl: string | null
  fontPreset: string
  themeMode: string
  enabledModules: string[]
  socialProviders: string[]
  allowRegistration: boolean
  enableMagicLink: boolean
  defaultLocale: string
  extraLocales: string[]
  updatedAt: Date
}

function normalizeWizardRecord(record: {
  siteName: string
  adminEmail: string
  adminPasswordHash: string
  databaseProvider: string
  databaseUrl: string
  industry: string
  accentColor: string
  accentColorDark?: string | null
  logoUrl: string | null
  fontPreset: string
  themeMode: string
  enabledModules: string[]
  socialProviders: string[]
  allowRegistration: boolean
  enableMagicLink: boolean
  defaultLocale: string
  extraLocales: string[]
  updatedAt: Date | string
}): PersistedWizardConfig {
  return {
    siteName: record.siteName,
    adminEmail: record.adminEmail,
    adminPasswordHash: record.adminPasswordHash,
    databaseProvider: record.databaseProvider as "sqlite" | "postgresql",
    databaseUrl: record.databaseUrl,
    industry: record.industry,
    accentColor: record.accentColor,
    accentColorDark: record.accentColorDark ?? "",
    logoUrl: record.logoUrl ?? "",
    fontPreset: record.fontPreset,
    themeMode: record.themeMode as "light" | "dark" | "system",
    modules: record.enabledModules as WizardConfig["modules"],
    socialProviders: record.socialProviders as WizardConfig["socialProviders"],
    allowRegistration: record.allowRegistration,
    allowMagicLink: record.enableMagicLink,
    defaultLocale: record.defaultLocale as AppLocale,
    extraLocales: record.extraLocales as WizardConfig["extraLocales"],
    updatedAt:
      typeof record.updatedAt === "string"
        ? record.updatedAt
        : record.updatedAt.toISOString(),
  }
}

async function getWizardConfigFromFile() {
  return readJsonFile<PersistedWizardConfig | null>(wizardStorePath, null)
}

export async function getWizardConfig() {
  return withPersistenceFallback({
    primary: async () => {
      const db = prisma as unknown as {
        wizardConfig: {
          findUnique: (args: { where: { id: "singleton" } }) => Promise<WizardConfigRecord | null>
        }
      }

      const record = await db.wizardConfig.findUnique({
        where: { id: "singleton" },
      })

      return record ? normalizeWizardRecord(record) : null
    },
    fallback: getWizardConfigFromFile,
  })
}

export async function saveWizardConfig(input: WizardConfig) {
  const parsed = wizardConfigSchema.parse(input)

  // Use bcrypt for secure password hashing
  const passwordHash = await hashPassword(parsed.adminPassword)

  const persisted: PersistedWizardConfig = {
    ...parsed,
    adminPasswordHash: passwordHash,
    updatedAt: new Date().toISOString(),
  }

  return withPersistenceFallback({
    primary: async () => {
      const db = prisma as unknown as {
        wizardConfig: {
          upsert: (args: {
            where: { id: "singleton" }
            update: Record<string, unknown>
            create: Record<string, unknown>
          }) => Promise<WizardConfigRecord>
        }
      }

      const record = await db.wizardConfig.upsert({
        where: { id: "singleton" },
        update: {
          siteName: persisted.siteName,
          adminEmail: persisted.adminEmail,
          adminPasswordHash: persisted.adminPasswordHash,
          databaseProvider: persisted.databaseProvider,
          databaseUrl: persisted.databaseUrl,
          industry: persisted.industry,
          accentColor: persisted.accentColor,
          accentColorDark: persisted.accentColorDark ?? null,
          logoUrl: persisted.logoUrl,
          fontPreset: persisted.fontPreset,
          themeMode: persisted.themeMode,
          enabledModules: persisted.modules,
          socialProviders: persisted.socialProviders,
          allowRegistration: persisted.allowRegistration,
          enableMagicLink: persisted.allowMagicLink,
          defaultLocale: persisted.defaultLocale,
          extraLocales: persisted.extraLocales,
        },
        create: {
          id: "singleton",
          siteName: persisted.siteName,
          adminEmail: persisted.adminEmail,
          adminPasswordHash: persisted.adminPasswordHash,
          databaseProvider: persisted.databaseProvider,
          databaseUrl: persisted.databaseUrl,
          industry: persisted.industry,
          accentColor: persisted.accentColor,
          accentColorDark: persisted.accentColorDark ?? null,
          logoUrl: persisted.logoUrl,
          fontPreset: persisted.fontPreset,
          themeMode: persisted.themeMode,
          enabledModules: persisted.modules,
          socialProviders: persisted.socialProviders,
          allowRegistration: persisted.allowRegistration,
          enableMagicLink: persisted.allowMagicLink,
          defaultLocale: persisted.defaultLocale,
          extraLocales: persisted.extraLocales,
        },
      })

      await writeJsonFile(wizardStorePath, normalizeWizardRecord(record))
      return normalizeWizardRecord(record)
    },
    fallback: async () => {
      await writeJsonFile(wizardStorePath, persisted)
      return persisted
    },
  })
}

export async function verifyAdminCredentials(email: string, password: string) {
  const config = await getWizardConfig()

  if (!config) {
    return null
  }

  // Verify email first (constant time not critical for email check)
  if (config.adminEmail !== email) {
    // Still perform password check to prevent timing attacks
    await verifyPassword(password, "$2b$12$invalidhashtopreventtiming")
    return null
  }

  // Use bcrypt's constant-time comparison
  const isValid = await verifyPassword(password, config.adminPasswordHash)

  if (!isValid) {
    return null
  }

  return {
    id: "owner-admin",
    email: config.adminEmail,
    name: config.siteName,
    role: "admin",
  }
}
