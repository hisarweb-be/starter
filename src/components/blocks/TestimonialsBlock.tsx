"use client"

import { StaggerChildren, StaggerItem } from "@/components/ui/animated-presence"
import type { TestimonialsBlockData } from "./types"

export function TestimonialsBlockComponent({
  title,
  testimonials,
}: TestimonialsBlockData) {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto w-full max-w-6xl px-4">
        {title ? <h2 className="mb-12 text-center text-3xl font-bold">{title}</h2> : null}
        <StaggerChildren className="grid gap-8 md:grid-cols-2">
          {testimonials?.map((testimonial, index) => (
            <StaggerItem key={`${testimonial.author}-${index}`}>
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <p className="mb-6 text-lg italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
