import Link from "next/link"
import { ArrowRight, CheckCircle2, Globe2, Layers3, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type AppLocale, withLocale } from "@/lib/site"
import { getRuntimeHomeContent } from "@/lib/server/home-runtime"
import { getRuntimeSiteSettings } from "@/lib/server/site-runtime"
import { HeroTitle, HeroDescription, HeroCta, HeroStats } from "./hero-section-animations"

export async function HeroSection({ locale }: { locale: AppLocale }) {
  const [runtimeSettings, homeContent] = await Promise.all([
    getRuntimeSiteSettings(),
    getRuntimeHomeContent(locale),
  ])

  const activeLocales = [runtimeSettings.locale, ...runtimeSettings.extraLocales]
  const blueprintItems = homeContent.features.items.slice(0, 4)
  const stats = [
    { value: homeContent.stats.modulesValue, label: homeContent.stats.modulesLabel },
    { value: homeContent.stats.languagesValue, label: homeContent.stats.languagesLabel },
    { value: homeContent.stats.deliveryValue, label: homeContent.stats.deliveryLabel },
  ]

  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-8 sm:pb-10 sm:pt-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-5">
            <HeroTitle>
              <span className="eyebrow-label">
                <Sparkles className="size-3.5" />
                {homeContent.badge}
              </span>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl xl:text-[4.4rem]">
                  {homeContent.title}
                </h1>
              </div>
            </HeroTitle>
            <HeroDescription>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
                {homeContent.description}
              </p>
            </HeroDescription>
          </div>

          <HeroCta className="flex flex-wrap gap-3">
            <Link
              href={withLocale(locale, "/setup")}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-sm"
            >
              {homeContent.primaryCta}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={withLocale(locale, "/about")}
              className="inline-flex rounded-full border border-border/70 bg-card/75 px-6 py-3.5 text-sm font-medium text-foreground hover:bg-white/85"
            >
              {homeContent.secondaryCta}
            </Link>
          </HeroCta>

          <HeroStats className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="surface-card rounded-[1.5rem] px-4 py-4">
                <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </HeroStats>

          <div className="flex flex-wrap gap-2">
            {runtimeSettings.modules.slice(0, 4).map((module) => (
              <span
                key={module}
                className="rounded-full border border-border/60 bg-card/60 px-3 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground"
              >
                {module}
              </span>
            ))}
          </div>
        </div>

        <Card className="surface-panel hero-grid relative overflow-hidden rounded-[2rem] border-0 py-0">
          <div className="absolute inset-x-6 top-0 h-32 rounded-b-full bg-primary/10 blur-3xl" />
          <CardHeader className="space-y-4 px-6 pb-0 pt-6 sm:px-8 sm:pt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em]"
              >
                {runtimeSettings.tagline}
              </Badge>
              <span className="rounded-full border border-border/60 bg-card/65 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                Launch blueprint
              </span>
            </div>
            <CardTitle className="max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {runtimeSettings.siteName} turns setup, content and delivery into one polished
              system.
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 pb-6 pt-6 sm:px-8 sm:pb-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              {blueprintItems.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.4rem] border border-border/60 bg-card/72 px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="space-y-1">
                      <p className="text-base font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="surface-card rounded-[1.5rem] px-5 py-5">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Delivery rails
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-[1rem] bg-muted/70 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Globe2 className="size-4 text-primary" />
                      Active locales
                    </span>
                    <span className="font-semibold">{activeLocales.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[1rem] bg-muted/70 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Layers3 className="size-4 text-primary" />
                      Core modules
                    </span>
                    <span className="font-semibold">{runtimeSettings.modules.length}</span>
                  </div>
                </div>
              </div>

              <div className="surface-card rounded-[1.5rem] px-5 py-5">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Quality signals
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Premium visual baseline across public pages",
                    "Runtime-ready structure for Payload and tenants",
                    "Clear CTA flow from marketing to setup",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeLocales.slice(0, 5).map((entry) => (
                  <span
                    key={entry}
                    className="rounded-full border border-border/60 bg-card/70 px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {entry.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
