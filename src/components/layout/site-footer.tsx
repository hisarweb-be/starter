import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { type AppLocale, withLocale } from "@/lib/site"
import {
  getRuntimeFooter,
  getRuntimeNavigation,
  getRuntimeSiteSettings,
} from "@/lib/server/site-runtime"

function resolveHref(locale: AppLocale, href: string) {
  return href.startsWith("http://") || href.startsWith("https://") ? href : withLocale(locale, href)
}

export async function SiteFooter({ locale }: { locale: AppLocale }) {
  const [runtimeSettings, runtimeNavigation, runtimeFooter, t] = await Promise.all([
    getRuntimeSiteSettings(),
    getRuntimeNavigation(),
    getRuntimeFooter(),
    getTranslations({ locale }),
  ])

  const footerLinks = runtimeFooter.links.length > 0 ? runtimeFooter.links : runtimeNavigation

  return (
    <footer className="px-4 pb-6 pt-12 sm:pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="surface-panel rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="eyebrow-label">Built to launch and scale</span>
                <p className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {runtimeFooter.headline || t("footer.title")}
                </p>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {runtimeFooter.description || runtimeSettings.tagline || t("footer.description")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={withLocale(locale, "/setup")}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm"
                >
                  Start setup
                  <ArrowUpRight className="size-4" />
                </Link>
                <Link
                  href={withLocale(locale, "/contact")}
                  className="inline-flex rounded-full border border-border/70 bg-card/70 px-5 py-3 text-sm font-medium text-foreground hover:bg-white/80"
                >
                  Contact team
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="surface-card rounded-[1.5rem] px-4 py-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                    Site
                  </p>
                  <p className="mt-2 text-base font-semibold">{runtimeSettings.siteName}</p>
                </div>
                <div className="surface-card rounded-[1.5rem] px-4 py-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                    Company
                  </p>
                  <p className="mt-2 text-base font-semibold">{runtimeSettings.company}</p>
                </div>
                <div className="surface-card rounded-[1.5rem] px-4 py-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                    Runtime
                  </p>
                  <p className="mt-2 text-base font-semibold">{runtimeSettings.url}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-4">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
                  Navigation
                </p>
                <div className="space-y-2">
                  {runtimeNavigation.map((item) => (
                    <Link
                      key={`${item.href}-${"label" in item ? item.label : item.key}`}
                      href={resolveHref(locale, item.href)}
                      className="block text-sm text-muted-foreground hover:text-foreground"
                    >
                      {"label" in item ? item.label : t(`navigation.${item.key}`)}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
                  Resources
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {footerLinks.map((item) => (
                    <Link
                      key={`${item.href}-${"label" in item ? item.label : item.key}`}
                      href={resolveHref(locale, item.href)}
                      className="block hover:text-foreground"
                    >
                      {"label" in item ? item.label : t(`navigation.${item.key}`)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{runtimeFooter.copyrightText || t("footer.rights")}</p>
            <p>{runtimeSettings.url}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
