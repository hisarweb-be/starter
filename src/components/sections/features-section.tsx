import { Layers3, Languages, Rocket, Workflow } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type AppLocale } from "@/lib/site"
import { getRuntimeHomeContent } from "@/lib/server/home-runtime"
import { FeaturesStaggerGrid, FeaturesStaggerCard } from "./features-section-animations"

const icons = [Rocket, Languages, Layers3, Workflow]

export async function FeaturesSection({ locale }: { locale: AppLocale }) {
  const homeContent = await getRuntimeHomeContent(locale)

  return (
    <section className="px-4 py-8 sm:py-10">
      <div className="surface-panel mx-auto max-w-6xl rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-4">
            <span className="eyebrow-label">Operational pillars</span>
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {homeContent.features.title}
            </h2>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              {homeContent.features.description}
            </p>
            <div className="rounded-[1.5rem] border border-border/60 bg-card/65 p-5">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                Strategy note
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Every block in this starter now pulls in the same direction: stronger first
                impression, clearer conversion path and a setup flow that feels productized
                instead of improvised.
              </p>
            </div>
          </div>

          <FeaturesStaggerGrid className="grid gap-4 md:grid-cols-2">
          {homeContent.features.items.map((item, index) => {
            const Icon = icons[index % icons.length]

            return (
              <FeaturesStaggerCard key={item.title}>
                <Card
                  className="surface-card rounded-[1.75rem] border-0 py-0"
                >
                  <CardHeader className="space-y-4 px-5 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex size-12 items-center justify-center rounded-[1.1rem] bg-secondary text-secondary-foreground">
                        <Icon className="size-5" />
                      </div>
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                        Pillar {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 text-sm leading-7 text-muted-foreground">
                    {item.body}
                  </CardContent>
                </Card>
              </FeaturesStaggerCard>
            )
          })}
          </FeaturesStaggerGrid>
        </div>
      </div>
    </section>
  )
}
