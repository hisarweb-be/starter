import { getRequestConfig } from "next-intl/server"

import { defaultLocale, locales } from "@/i18n/config"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = (locales.includes(requested as (typeof locales)[number])
    ? requested
    : defaultLocale) as (typeof locales)[number]

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
