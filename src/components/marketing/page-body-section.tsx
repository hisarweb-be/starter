import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PageBodySection({
  title = "Page content",
  paragraphs,
}: {
  title?: string
  paragraphs: string[]
}) {
  if (paragraphs.length === 0) {
    return null
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-8">
      <Card className="surface-panel rounded-[2rem] border-0 py-0">
        <CardHeader className="space-y-3 px-6 pt-6 sm:px-8 sm:pt-8">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
            Deep dive
          </p>
          <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 px-6 pb-6 sm:px-8 sm:pb-8">
          {paragraphs.map((paragraph, index) => (
            <div
              key={paragraph}
              className="rounded-[1.4rem] border border-border/60 bg-card/70 px-5 py-5"
            >
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                Chapter {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                {paragraph}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
