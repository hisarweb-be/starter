"use client"

import type { ReactNode } from "react"
import { StaggerChildren, StaggerItem } from "@/components/ui/animated-presence"

export function TestimonialsStaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <StaggerChildren className={className}>{children}</StaggerChildren>
}

export function TestimonialsStaggerCard({ children, className }: { children: ReactNode; className?: string }) {
  return <StaggerItem className={className}>{children}</StaggerItem>
}
