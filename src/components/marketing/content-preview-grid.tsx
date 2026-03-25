import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PreviewItem = {
  title: string
  description: string
  meta?: string
}

export function ContentPreviewGrid({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: PreviewItem[]
}) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl space-y-2">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
            Live content preview
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-balance">{title}</h2>
          <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        <div className="surface-card rounded-[1.3rem] px-4 py-3">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
            Loaded items
          </p>
          <p className="mt-1 text-xl font-semibold">{items.length}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card
            key={`${item.title}-${item.meta ?? "meta"}`}
            className="surface-card rounded-[1.6rem] border-0 py-0"
          >
            <CardHeader className="space-y-3 px-5 pt-5">
              <CardDescription className="font-mono text-[0.68rem] uppercase tracking-[0.2em]">
                {item.meta ?? "Preview item"}
              </CardDescription>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 text-sm leading-7 text-muted-foreground">
              {item.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
