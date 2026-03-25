export const locales = ["nl", "en", "fr", "de", "tr"] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = "nl"

export const localeLabelMap: Record<AppLocale, string> = {
  nl: "Nederlands",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  tr: "Türkçe",
}

export const siteConfig = {
  name: "HisarWeb Starter",
  shortName: "HisarWeb",
  description:
    "Deploy-ready website starter met setup wizard, meertalige frontend en Payload-first architectuur.",
  company: "HisarWeb Design",
  url: "https://www.hisarweb.be",
}

export const navigationItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/pricing", key: "pricing" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const

export function isValidLocale(locale: string): locale is AppLocale {
  return locales.includes(locale as AppLocale)
}

export function withLocale(locale: AppLocale, path = "/") {
  if (path === "/") return `/${locale}`
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`
}
