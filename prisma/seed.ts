import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { createHash, randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import bcrypt from "bcrypt"

import { getDataDir } from "../src/lib/data-dir"
import { defaultDemoContent } from "../src/lib/demo-content"
import { defaultHomeContent } from "../src/lib/home-content"
import { defaultTenants } from "../src/lib/tenant"

const defaultDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/hisarweb"
const demoPassword = "change-me-now"
const dataDir = getDataDir()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? defaultDatabaseUrl,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

function hashSecret(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

async function writeJson(fileName: string, data: unknown) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(path.join(dataDir, fileName), JSON.stringify(data, null, 2), "utf8")
}

async function seedLocalFallbackFiles() {
  const now = new Date().toISOString()

  await writeJson("wizard-config.json", {
    siteName: defaultDemoContent.globals.siteConfig.siteName,
    adminEmail: "admin@hisarweb.be",
    adminPasswordHash: hashSecret(demoPassword),
    databaseProvider: "postgresql",
    databaseUrl: process.env.DATABASE_URL ?? defaultDatabaseUrl,
    industry: "agency",
    accentColor: "#6d28d9",
    logoUrl: "",
    fontPreset: "geist",
    themeMode: "system",
    modules: ["homepage", "blog", "contact", "services", "portfolio", "pricing", "faq", "about"],
    socialProviders: [],
    allowRegistration: true,
    allowMagicLink: true,
    defaultLocale: "nl",
    extraLocales: ["en", "fr", "de", "tr"],
    updatedAt: now,
  })

  await writeJson("contact-inquiries.json", [
    {
      id: randomUUID(),
      name: "Demo Lead",
      email: "lead@example.com",
      subject: "Website relaunch intake",
      message: "We willen de demo-flow bekijken voor een meertalige relaunch met snelle onboarding.",
      createdAt: now,
    },
    {
      id: randomUUID(),
      name: "Operations Team",
      email: "ops@example.com",
      subject: "Deployment readiness",
      message: "Toon hoe deze starter werkt voor delivery, dashboarding en testbare releases.",
      createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    },
  ])

  await writeJson("registration-requests.json", [
    {
      id: randomUUID(),
      name: "Demo Editor",
      email: "editor@example.com",
      createdAt: now,
    },
  ])

  await writeJson("password-reset-requests.json", [
    {
      id: randomUUID(),
      email: "admin@hisarweb.be",
      createdAt: new Date(Date.now() - 43_200_000).toISOString(),
    },
  ])

  await writeJson("demo-content.json", defaultDemoContent)
  await writeJson("homepage-content.json", defaultHomeContent)
  await writeJson("tenants.json", defaultTenants)
}

type MinimalSeedPayload = {
  find: (args: Record<string, unknown>) => Promise<{ docs: Array<{ id?: string }> }>
  update: (args: Record<string, unknown>) => Promise<unknown>
  create: (args: Record<string, unknown>) => Promise<unknown>
}

async function upsertPayloadDoc(
  payload: MinimalSeedPayload,
  {
    collection,
    uniqueField,
    uniqueValue,
    data,
    extraWhere,
  }: {
    collection: "users" | "pages" | "posts" | "services" | "portfolio" | "faq" | "settings"
    uniqueField: string
    uniqueValue: string
    data: Record<string, unknown>
    extraWhere?: Record<string, unknown>
  }
) {
  const where = {
    and: [
      {
        [uniqueField]: {
          equals: uniqueValue,
        },
      },
      ...(extraWhere ? [extraWhere] : []),
    ],
  }

  const existing = await payload.find({
    collection,
    where,
    limit: 1,
    depth: 0,
  })

  const current = existing.docs[0]

  if (current?.id) {
    return payload.update({
      collection,
      id: current.id,
      data,
      depth: 0,
    })
  }

  return payload.create({
    collection,
    data,
    depth: 0,
  })
}

async function seedDatabaseAndPayload() {
  console.log("🌱 Seeding database-backed demo content...")

  await (prisma as unknown as {
    wizardConfig: {
      upsert: (args: {
        where: { id: string }
        update: Record<string, unknown>
        create: Record<string, unknown>
      }) => Promise<Record<string, unknown>>
    }
  }).wizardConfig.upsert({
    where: { id: "singleton" },
    update: {
      siteName: defaultDemoContent.globals.siteConfig.siteName,
      adminEmail: "admin@hisarweb.be",
      adminPasswordHash: hashSecret(demoPassword),
      databaseProvider: "postgresql",
      databaseUrl: process.env.DATABASE_URL ?? defaultDatabaseUrl,
      industry: "agency",
      accentColor: "#6d28d9",
      logoUrl: null,
      fontPreset: "geist",
      themeMode: "system",
      enabledModules: ["homepage", "blog", "contact", "services", "portfolio", "pricing", "faq", "about"],
      socialProviders: [],
      allowRegistration: true,
      enableMagicLink: true,
      defaultLocale: "nl",
      extraLocales: ["en", "fr", "de", "tr"],
    },
    create: {
      id: "singleton",
      siteName: defaultDemoContent.globals.siteConfig.siteName,
      adminEmail: "admin@hisarweb.be",
      adminPasswordHash: hashSecret(demoPassword),
      databaseProvider: "postgresql",
      databaseUrl: process.env.DATABASE_URL ?? defaultDatabaseUrl,
      industry: "agency",
      accentColor: "#6d28d9",
      logoUrl: null,
      fontPreset: "geist",
      themeMode: "system",
      enabledModules: ["homepage", "blog", "contact", "services", "portfolio", "pricing", "faq", "about"],
      socialProviders: [],
      allowRegistration: true,
      enableMagicLink: true,
      defaultLocale: "nl",
      extraLocales: ["en", "fr", "de", "tr"],
    },
  })

  const payloadModule = await import("payload")
  const payloadConfigModule = (await import("../src/payload/payload.config")) as {
    default: Promise<unknown>
  }

  const payload = await payloadModule.getPayload({
    config: payloadConfigModule.default as never,
  })

  await payload.updateGlobal({
    slug: "site-config",
    data: defaultDemoContent.globals.siteConfig,
  })

  await payload.updateGlobal({
    slug: "navigation",
    data: defaultDemoContent.globals.navigation,
  })

  await payload.updateGlobal({
    slug: "footer",
    data: defaultDemoContent.globals.footer,
  })

  await upsertPayloadDoc(payload as unknown as MinimalSeedPayload, {
    collection: "users",
    uniqueField: "email",
    uniqueValue: "admin@hisarweb.be",
    data: {
      email: "admin@hisarweb.be",
      password: demoPassword,
      name: "HisarWeb Admin",
      role: "admin",
      locale: "nl",
    },
  })

  await upsertPayloadDoc(payload as unknown as MinimalSeedPayload, {
    collection: "users",
    uniqueField: "email",
    uniqueValue: "editor@hisarweb.be",
    data: {
      email: "editor@hisarweb.be",
      password: demoPassword,
      name: "HisarWeb Editor",
      role: "editor",
      locale: "en",
    },
  })

  for (const page of defaultDemoContent.pages) {
    await upsertPayloadDoc(payload as unknown as MinimalSeedPayload, {
      collection: "pages",
      uniqueField: "slug",
      uniqueValue: page.slug,
      extraWhere: {
        locale: {
          equals: page.locale,
        },
      },
      data: page,
    })
  }

  for (const post of defaultDemoContent.posts) {
    await upsertPayloadDoc(payload as unknown as MinimalSeedPayload, {
      collection: "posts",
      uniqueField: "slug",
      uniqueValue: post.slug,
      data: post,
    })
  }

  for (const service of defaultDemoContent.services) {
    await upsertPayloadDoc(payload as unknown as MinimalSeedPayload, {
      collection: "services",
      uniqueField: "slug",
      uniqueValue: service.slug,
      data: service,
    })
  }

  for (const portfolioItem of defaultDemoContent.portfolio) {
    await upsertPayloadDoc(payload as unknown as MinimalSeedPayload, {
      collection: "portfolio",
      uniqueField: "slug",
      uniqueValue: portfolioItem.slug,
      data: portfolioItem,
    })
  }

  for (const faqItem of defaultDemoContent.faq) {
    await upsertPayloadDoc(payload as unknown as MinimalSeedPayload, {
      collection: "faq",
      uniqueField: "question",
      uniqueValue: faqItem.question,
      data: faqItem,
    })
  }

  for (const setting of defaultDemoContent.settings) {
    await upsertPayloadDoc(payload as unknown as MinimalSeedPayload, {
      collection: "settings",
      uniqueField: "key",
      uniqueValue: setting.key,
      data: setting,
    })
  }

  for (const locale of Object.keys(defaultHomeContent) as Array<keyof typeof defaultHomeContent>) {
    await upsertPayloadDoc(payload as unknown as MinimalSeedPayload, {
      collection: "settings",
      uniqueField: "key",
      uniqueValue: `homepage.${locale}`,
      data: {
        key: `homepage.${locale}`,
        value: JSON.stringify(defaultHomeContent[locale]),
        group: "homepage",
      },
    })
  }

  // Demo organization
  const demoOwner = await prisma.user.upsert({
    where: { email: "demo@hisarweb.be" },
    update: {},
    create: {
      email: "demo@hisarweb.be",
      name: "Demo Bakkerij De Korst",
      passwordHash: await bcrypt.hash("demo1234", 10),
      role: "admin",
      emailVerified: true,
    },
  })

  const demoOrg = await prisma.organization.upsert({
    where: { slug: "demo-bakkerij" },
    update: {},
    create: {
      name: "Demo Bakkerij De Korst",
      slug: "demo-bakkerij",
      ownerId: demoOwner.id,
      siteName: "Bakkerij De Korst",
      industry: "restaurant",
      plan: "website-pro",
      status: "active",
      modules: ["homepage", "about", "services", "contact", "team", "testimonials", "faq"],
      settings: { selectedPackages: ["website-pro"], looseModules: [], packageNotes: "Demo account" },
      accentColor: "#d97706",
    },
  })

  await prisma.user.update({
    where: { id: demoOwner.id },
    data: { organizationId: demoOrg.id },
  })

  // Superadmin
  await prisma.user.upsert({
    where: { email: "admin@hisarweb.be" },
    update: {},
    create: {
      email: "admin@hisarweb.be",
      name: "HisarWeb Admin",
      passwordHash: await bcrypt.hash("HisarAdmin2026!", 10),
      role: "superadmin",
      emailVerified: true,
    },
  })

  // Demo Bedrijf BV — new demo tenant
  const demoBedrijfUser = await prisma.user.upsert({
    where: { email: "demo@demo.be" },
    update: {},
    create: {
      email: "demo@demo.be",
      name: "Demo Gebruiker",
      passwordHash: await bcrypt.hash("Demo2026!", 10),
      role: "admin",
      emailVerified: true,
    },
  })

  const demoBedrijfOrg = await (prisma as unknown as {
    organization: {
      upsert: (args: {
        where: { slug: string }
        update: Record<string, unknown>
        create: Record<string, unknown>
      }) => Promise<{ id: string }>
    }
  }).organization.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "Demo Bedrijf BV",
      slug: "demo",
      ownerId: demoBedrijfUser.id,
      plan: "pro",
      status: "active",
      settings: { selectedPackages: ["website-starter", "branding-basis"], looseModules: [] },
      modules: ["pages", "navigation", "appearance", "media", "team", "settings"],
      accentColor: "#6366f1",
      siteName: "Demo Website",
      tagline: "Uw digitale partner",
    },
  })

  await prisma.user.update({
    where: { id: demoBedrijfUser.id },
    data: { organizationId: demoBedrijfOrg.id },
  })

  await (prisma as unknown as {
    page: {
      upsert: (args: {
        where: { organizationId_slug_locale: { organizationId: string; slug: string; locale: string } }
        update: Record<string, unknown>
        create: Record<string, unknown>
      }) => Promise<{ id: string }>
    }
  }).page.upsert({
    where: {
      organizationId_slug_locale: {
        organizationId: demoBedrijfOrg.id,
        slug: "home",
        locale: "nl",
      },
    },
    update: {},
    create: {
      organizationId: demoBedrijfOrg.id,
      title: "Home",
      slug: "home",
      isHomePage: true,
      status: "published",
      locale: "nl",
      publishedAt: new Date(),
      blocks: [
        {
          blockType: "hero",
          _id: "seed-hero",
          title: "Welkom bij Demo Bedrijf",
          subtitle: "Uw betrouwbare digitale partner voor website, branding en meer.",
          ctaText: "Bekijk onze diensten",
          ctaLink: "#diensten",
        },
        {
          blockType: "features",
          _id: "seed-features",
          title: "Onze voordelen",
          features: [
            { title: "Kwaliteit", description: "Wij leveren uitstekende kwaliteit." },
            { title: "Service", description: "Persoonlijke aandacht voor elke klant." },
            { title: "Snelheid", description: "Snelle levering, altijd op tijd." },
          ],
        },
        {
          blockType: "cta",
          _id: "seed-cta",
          title: "Klaar om te starten?",
          description: "Neem vandaag nog contact op voor een vrijblijvend gesprek.",
          buttonText: "Contact opnemen",
          buttonLink: "/contact",
        },
      ],
    },
  })
}

async function main() {
  console.log("🌱 Seeding HisarWeb Starter demo install...")

  await seedLocalFallbackFiles()
  console.log("  ✅ Local demo fallback files written to ./data")

  try {
    await seedDatabaseAndPayload()
    console.log("  ✅ Database and Payload demo content seeded")
  } catch (error) {
    console.warn("  ⚠ Database/Payload seed skipped, local fallback demo content remains available.")
    console.warn(
      error instanceof Error
        ? `  ↳ ${error.name}: ${error.message.split("\n")[0]}`
        : "  ↳ Unknown seed error"
    )
  }

  console.log("  🔐 Demo credentials")
  console.log("     NextAuth admin: admin@hisarweb.be / change-me-now")
  console.log("     Payload admin:  admin@hisarweb.be / change-me-now")
  console.log("     Payload editor: editor@hisarweb.be / change-me-now")
  console.log("🌱 Seeding complete!")
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined)
    await pool.end().catch(() => undefined)
  })
