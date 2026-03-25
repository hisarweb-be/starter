"use client"

import { FadeIn } from "@/components/ui/animated-presence"
import type { HeroBlockData } from "./types"

export function HeroBlockComponent({
  title,
  subtitle,
  ctaText,
  ctaLink,
}: HeroBlockData) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 text-center lg:py-24">
      <FadeIn>
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">{title}</h1>
      </FadeIn>
      {subtitle ? (
        <FadeIn delay={0.15}>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-8 text-muted-foreground">
            {subtitle}
          </p>
        </FadeIn>
      ) : null}
      {ctaText && ctaLink ? (
        <FadeIn delay={0.3}>
          <a
            href={ctaLink}
            className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {ctaText}
          </a>
        </FadeIn>
      ) : null}
    </section>
  )
}
