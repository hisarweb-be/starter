"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TabsBlockData } from "./types"

export function TabsBlockComponent({ title, tabs }: TabsBlockData) {
  if (!tabs?.length) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-16">
        {title && <h2 className="mb-12 text-center font-display text-3xl font-bold">{title}</h2>}
        <div className="rounded-3xl border-2 border-dashed py-12 text-center text-muted-foreground">
          Geen tabbladen beschikbaar
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      {title && <h2 className="mb-12 text-center font-display text-3xl font-bold">{title}</h2>}

      <Tabs defaultValue="tab-0" className="w-full">
        <TabsList className="mb-6 flex flex-wrap gap-2 bg-transparent">
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={`tab-${index}`}
              className="rounded-full border border-border/60 bg-card/65 px-5 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab, index) => (
          <TabsContent
            key={index}
            value={`tab-${index}`}
            className="surface-card rounded-[1.5rem] p-6"
          >
            <div className="prose prose-sm max-w-none text-foreground">
              {tab.content}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
