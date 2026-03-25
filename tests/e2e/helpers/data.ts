import { createHash } from "node:crypto"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

import { getDataDir } from "@/lib/data-dir"

const dataDir = getDataDir()

function hashSecret(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export async function resetAppData() {
  await rm(dataDir, { recursive: true, force: true })
  await mkdir(dataDir, { recursive: true })
}

export async function writeInstalledWizardConfig() {
  const filePath = path.join(dataDir, "wizard-config.json")

  const config = {
    siteName: "HisarWeb Starter",
    adminEmail: "admin@hisarweb.be",
    adminPasswordHash: hashSecret("change-me-now"),
    databaseProvider: "postgresql",
    databaseUrl: "postgresql://postgres:postgres@localhost:5432/hisarweb",
    industry: "agency",
    accentColor: "#6d28d9",
    logoUrl: "",
    fontPreset: "geist",
    themeMode: "system",
    modules: ["homepage", "services", "contact", "about"],
    socialProviders: [],
    allowRegistration: false,
    allowMagicLink: true,
    defaultLocale: "nl",
    extraLocales: ["en"],
    updatedAt: new Date().toISOString(),
  }

  await mkdir(dataDir, { recursive: true })
  await writeFile(filePath, JSON.stringify(config, null, 2), "utf8")
}

export async function readStoredContactInquiries() {
  const filePath = path.join(dataDir, "contact-inquiries.json")

  try {
    const raw = await readFile(filePath, "utf8")
    return JSON.parse(raw) as Array<{
      id: string
      name: string
      email: string
      subject: string
      message: string
      createdAt: string
    }>
  } catch {
    return []
  }
}
