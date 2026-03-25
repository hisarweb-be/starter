import { z } from "zod"

import { locales } from "@/lib/site"

export const moduleOptions = [
  "homepage",
  "blog",
  "contact",
  "services",
  "portfolio",
  "pricing",
  "faq",
  "about",
] as const

export const socialProviderOptions = ["google", "github"] as const

export const wizardConfigSchema = z.object({
  siteName: z.string().min(2, "Site name is required"),
  adminEmail: z.email("Valid admin email is required"),
  adminPassword: z
    .string()
    .min(8, "Password must contain at least 8 characters"),
  supabaseProjectId: z.string().optional(),
  databaseConfigured: z.boolean().default(false),
  industry: z.string().min(2, "Industry is required"),
  accentColor: z.string().min(4, "Accent color is required"),
  accentColorDark: z.string().optional().default(""),
  logoUrl: z.string().optional().default(""),
  fontPreset: z.string().min(2, "Font preset is required"),
  themeMode: z.enum(["light", "dark", "system"]),
  modules: z.array(z.enum(moduleOptions)).min(1, "Select at least one module"),
  allowRegistration: z.boolean(),
  socialProviders: z.array(z.enum(socialProviderOptions)),
  allowMagicLink: z.boolean(),
  defaultLocale: z.enum(locales),
  extraLocales: z.array(z.enum(locales)).default([]),
})

export type WizardConfigInput = z.input<typeof wizardConfigSchema>
export type WizardConfig = z.output<typeof wizardConfigSchema>

/** Form defaults — NOT a valid config (password is empty until user fills it in) */
export const wizardDefaultValues: WizardConfigInput = {
  siteName: "HisarWeb Starter",
  adminEmail: "admin@hisarweb.be",
  adminPassword: "",
  supabaseProjectId: "",
  databaseConfigured: false,
  industry: "agency",
  accentColor: "#1664d8",
  accentColorDark: "#3b82f6",
  logoUrl: "",
  fontPreset: "manrope",
  themeMode: "system",
  modules: ["homepage", "services", "contact", "about"],
  allowRegistration: false,
  socialProviders: [],
  allowMagicLink: true,
  defaultLocale: "nl",
  extraLocales: ["en", "fr", "de", "tr"],
}

export const wizardStepOrder = [
  "welcome",
  "database",
  "industry",
  "branding",
  "confirm",
] as const
