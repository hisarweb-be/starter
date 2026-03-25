import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type AppLocale, withLocale } from "@/lib/site"

type PageShellProps = {
  locale: AppLocale
  eyebrow: string
  title: string
  description: string
  highlights: string[]
  ctaTitle: string
  ctaDescription: string
  body?: string[]
}

export function PageShell({
  locale,
  eyebrow,
  title,
  description,
  highlights,
  ctaTitle,
  ctaDescription,
}: PageShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:py-16">
      <section className="surface-panel grid gap-8 rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-5">
          <Badge className="rounded-full px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em]">
            {eyebrow}
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((highlight, index) => (
              <div key={highlight} className="surface-card rounded-[1.35rem] px-4 py-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Point {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="surface-card rounded-[1.75rem] border-0 py-0">
          <CardHeader className="space-y-3 px-5 pt-5">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
              Next action
            </span>
            <CardTitle className="text-2xl">{ctaTitle}</CardTitle>
            <CardDescription className="text-sm leading-7">{ctaDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5">
            <div className="space-y-3 rounded-[1.25rem] border border-border/60 bg-muted/45 p-4">
              {[
                "Consistent UX across all public routes",
                "Setup-first conversion path for prospects",
                "Ready to evolve with live CMS content",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
            <Link
              href={withLocale(locale, "/setup")}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              Open setup wizard
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
