import Link from "next/link"

import { type AppLocale, withLocale } from "@/lib/site"
import { getRuntimeHomeContent } from "@/lib/server/home-runtime"

export async function CtaSection({ locale }: { locale: AppLocale }) {
  const homeContent = await getRuntimeHomeContent(locale)
  const quickWins = homeContent.features.items.slice(0, 3).map((item) => item.title)

  return (
    <section className="px-4 pb-20 pt-4">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_90%,#0b1220)_0%,color-mix(in_srgb,var(--primary)_55%,#10243f)_52%,#08111d_100%)] px-6 py-10 text-primary-foreground shadow-[0_32px_90px_-42px_rgba(15,23,42,0.7)] sm:px-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-white/70">
              Next level delivery
            </span>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {homeContent.cta.title}
            </h2>
            <p className="max-w-3xl text-lg leading-8 text-primary-foreground/78">
              {homeContent.cta.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={withLocale(locale, "/setup")}
                className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-primary"
              >
                {homeContent.cta.primary}
              </Link>
              <Link
                href={withLocale(locale, "/contact")}
                className="inline-flex rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white"
              >
                {homeContent.cta.secondary}
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {quickWins.map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur"
              >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/60">
                  Included
                </p>
                <p className="mt-2 text-base font-medium text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
