"use client"

import type { ReactNode } from "react"
import { FadeIn } from "@/components/ui/animated-presence"

export function HeroTitle({ children }: { children: ReactNode }) {
  return <FadeIn>{children}</FadeIn>
}

export function HeroDescription({ children }: { children: ReactNode }) {
  return <FadeIn delay={0.15}>{children}</FadeIn>
}

export function HeroCta({ children, className }: { children: ReactNode; className?: string }) {
  return <FadeIn delay={0.3} className={className}>{children}</FadeIn>
}

export function HeroStats({ children, className }: { children: ReactNode; className?: string }) {
  return <FadeIn delay={0.4} className={className}>{children}</FadeIn>
}
