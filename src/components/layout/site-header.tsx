import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { auth } from "@/auth"
import { SignOutForm } from "@/components/forms/sign-out-form"
import { LocaleSwitcher } from "@/components/layout/locale-switcher"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { type AppLocale, withLocale } from "@/lib/site"
import { hasDashboardAccess } from "@/lib/server/authorization"
import { getRuntimeNavigation, getRuntimeSiteSettings } from "@/lib/server/site-runtime"
import { cn } from "@/lib/utils"

function resolveHref(locale: AppLocale, href: string) {
  return href.startsWith("http://") || href.startsWith("https://") ? href : withLocale(locale, href)
}

export async function SiteHeader({ locale }: { locale: AppLocale }) {
  const session = await auth()
  const [runtimeSettings, runtimeNavigation, t] = await Promise.all([
    getRuntimeSiteSettings(),
    getRuntimeNavigation(),
    getTranslations({ locale }),
  ])

  const showDashboard = hasDashboardAccess(session)

  const mobileItems = runtimeNavigation.map((item) => ({
    href: resolveHref(locale, item.href),
    label: "label" in item && item.label ? item.label : "key" in item ? t(`navigation.${item.key}`) : "",
  }))

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <div className="surface-panel overflow-hidden rounded-[2rem]">
          <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-3 text-xs text-muted-foreground sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                <Sparkles className="size-3.5" />
                {t("header.eyebrow")}
              </span>
              <span className="hidden truncate md:inline">{runtimeSettings.tagline}</span>
            </div>
            <Link
              href={withLocale(locale, "/setup")}
              className="hidden items-center gap-1 font-medium text-foreground md:inline-flex"
            >
              Launch your setup
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="flex items-center justify-between gap-6 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-8">
              <Link href={withLocale(locale)} className="flex items-center gap-3">
                {runtimeSettings.logoUrl ? (
                  <span
                    className="hidden size-12 rounded-[1.35rem] border border-border/70 bg-contain bg-center bg-no-repeat sm:block"
                    style={{ backgroundImage: `url(${runtimeSettings.logoUrl})` }}
                  />
                ) : (
                  <span className="hidden size-12 items-center justify-center rounded-[1.35rem] bg-primary text-lg font-semibold text-primary-foreground shadow-sm sm:inline-flex">
                    {runtimeSettings.siteName.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="flex flex-col">
                  <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Studio system
                  </span>
                  <span className="text-lg font-semibold tracking-tight">{runtimeSettings.siteName}</span>
                </span>
              </Link>
              <nav className="hidden items-center gap-2 lg:flex">
                {runtimeNavigation.map((item) => (
                  <Link
                    key={`${item.href}-${"label" in item ? item.label : item.key}`}
                    href={resolveHref(locale, item.href)}
                    className={cn(
                      "interactive-border rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/70 hover:text-foreground"
                    )}
                  >
                    {"label" in item ? item.label : t(`navigation.${item.key}`)}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden xl:block">
                <LocaleSwitcher locale={locale} />
              </div>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              {showDashboard ? (
                <Link
                  href={withLocale(locale, "/dashboard")}
                  className="hidden rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-sm md:inline-flex"
                >
                  {t("navigation.admin")}
                </Link>
              ) : null}
              {session?.user ? (
                <div className="hidden md:block">
                  <SignOutForm />
                </div>
              ) : (
                <>
                  <Link
                    href={withLocale(locale, "/login")}
                    className="hidden rounded-full border border-border/70 bg-card/70 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/80 md:inline-flex"
                  >
                    {t("navigation.login")}
                  </Link>
                  <Link
                    href={withLocale(locale, "/setup")}
                    className="hidden rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm md:inline-flex"
                  >
                    {t("navigation.setup")}
                  </Link>
                </>
              )}
              <MobileNav
                items={mobileItems}
                loginHref={withLocale(locale, "/login")}
                setupHref={withLocale(locale, "/setup")}
                loginLabel={t("navigation.login")}
                setupLabel={t("navigation.setup")}
                dashboardHref={showDashboard ? withLocale(locale, "/dashboard") : undefined}
                dashboardLabel={showDashboard ? t("navigation.admin") : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
