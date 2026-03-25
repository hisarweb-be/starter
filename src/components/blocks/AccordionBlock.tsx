"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { AccordionBlockData } from "./types"

export function AccordionBlockComponent({ title, items }: AccordionBlockData) {
  if (!items?.length) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-16">
        {title && <h2 className="mb-12 text-center font-display text-3xl font-bold">{title}</h2>}
        <div className="rounded-3xl border-2 border-dashed py-12 text-center text-muted-foreground">
          Geen items beschikbaar
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16">
      {title && <h2 className="mb-12 text-center font-display text-3xl font-bold">{title}</h2>}

      <Accordion className="space-y-3">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="surface-card rounded-[1.25rem] border px-5"
          >
            <AccordionTrigger className="py-4 text-left font-semibold hover:no-underline">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
