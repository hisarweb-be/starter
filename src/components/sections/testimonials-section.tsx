import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type AppLocale } from "@/lib/site"
import { getRuntimeHomeContent } from "@/lib/server/home-runtime"
import { StaggerChildren, StaggerItem } from "@/components/ui/animated-presence"

export async function TestimonialsSection({ locale }: { locale: AppLocale }) {
  const homeContent = await getRuntimeHomeContent(locale)

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <span className="eyebrow-label">Proof and positioning</span>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {homeContent.testimonials.title}
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            {homeContent.testimonials.description}
          </p>
        </div>
        <div className="surface-card rounded-[1.5rem] px-5 py-4 lg:max-w-xs">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
            What this signals
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            The starter now communicates credibility before a prospect reaches the setup wizard.
          </p>
        </div>
      </div>

      <StaggerChildren className="grid gap-4 lg:grid-cols-3">
        {homeContent.testimonials.items.map((item, index) => {
          const initials = item.author
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()

          return (
            <StaggerItem key={item.quote} className={index === 1 ? "lg:-translate-y-3" : ""}>
              <Card className="surface-card rounded-[1.75rem] border-0 py-0">
                <CardHeader className="space-y-4 px-5 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {initials}
                    </span>
                    <div>
                      <CardDescription className="text-xs uppercase tracking-[0.18em]">
                        {item.role}
                      </CardDescription>
                      <p className="text-sm font-medium">{item.author}</p>
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-8 text-balance">&ldquo;{item.quote}&rdquo;</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 text-sm leading-7 text-muted-foreground">
                  {item.body}
                </CardContent>
              </Card>
            </StaggerItem>
          )
        })}
      </StaggerChildren>
    </section>
  )
}
