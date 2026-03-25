"use server"

import { z } from "zod"

import { Resend } from "resend"

import { WelcomeEmail } from "@/emails/welcome"
import { prisma } from "@/lib/server/prisma"
import { hashPassword } from "@/lib/server/security"
import { getDefaultBlocks } from "@/lib/onboarding"
import { getModulesForPackages } from "@/lib/packages"

const registerSchema = z.object({
  companyName: z.string().min(2, "Bedrijfsnaam is te kort"),
  email: z.string().email("Ongeldig emailadres"),
  password: z.string().min(8, "Wachtwoord moet minimaal 8 tekens zijn"),
  industry: z.string().optional(),
  selectedPackages: z.array(z.string()).optional(),
})

type UserRecord = {
  id: string
  email: string
}

type OrgRecord = {
  id: string
  slug: string
}

const db = prisma as unknown as {
  user: {
    findUnique: (args: Record<string, unknown>) => Promise<UserRecord | null>
    create: (args: Record<string, unknown>) => Promise<UserRecord>
    update: (args: Record<string, unknown>) => Promise<UserRecord>
  }
  organization: {
    create: (args: Record<string, unknown>) => Promise<OrgRecord>
  }
  page: {
    create: (args: Record<string, unknown>) => Promise<unknown>
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 40)
}

export async function registerClientAction(input: {
  companyName: string
  email: string
  password: string
  industry?: string
  selectedPackages?: string[]
}) {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Ongeldige invoer" }
  }

  const { companyName, email, password, industry, selectedPackages = [] } = parsed.data

  try {
    // Check if email is already in use
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return { success: false, message: "Dit emailadres is al in gebruik." }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name: companyName,
        passwordHash,
        role: "admin",
      },
    })

    // Bepaal modules op basis van geselecteerde pakketten
    // Minimaal basis modules altijd inbegrepen
    const packageModules = getModulesForPackages(selectedPackages)
    const baseModules = ["homepage", "about", "services", "contact"]
    const allModules = Array.from(new Set([...baseModules, ...packageModules]))

    // Sla pakket-selectie op in settings
    const settings = {
      selectedPackages,
      looseModules: [],
      packageNotes: "Zelfregistratie via website",
      packagesUpdatedAt: new Date().toISOString(),
    }

    // Create organization
    const slug = slugify(companyName) || `org-${Date.now()}`
    const org = await db.organization.create({
      data: {
        name: companyName,
        slug,
        ownerId: user.id,
        siteName: companyName,
        industry: industry ?? null,
        modules: allModules,
        settings,
        plan: selectedPackages.length > 0 ? selectedPackages[0] : "starter",
      },
    })

    // Link user to organization
    await db.user.update({
      where: { id: user.id },
      data: { organizationId: org.id },
    })

    // Create default homepage based on industry
    const defaultBlocks = getDefaultBlocks(industry ?? "general", companyName)
    await db.page.create({
      data: {
        organizationId: org.id,
        title: "Home",
        slug: "home",
        status: "published",
        locale: "nl",
        isHomePage: true,
        blocks: defaultBlocks,
      },
    })

    // Send welcome email (non-blocking)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "HisarWeb <noreply@hisarweb.be>",
        to: email,
        subject: "Welkom bij HisarWeb!",
        react: WelcomeEmail({
          name: companyName,
          dashboardUrl: `${process.env.NEXTAUTH_URL}/nl/dashboard`,
        }),
      })
    } catch (e) {
      console.error("[WELCOME_EMAIL]", e)
    }

    return {
      success: true,
      message: "Account succesvol aangemaakt! Je wordt doorgestuurd naar het dashboard.",
      organizationId: org.id,
    }
  } catch (error) {
    console.error("[REGISTRATION] Error:", error)
    return { success: false, message: "Er is een fout opgetreden. Probeer het opnieuw." }
  }
}
