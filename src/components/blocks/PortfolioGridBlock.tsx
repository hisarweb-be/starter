import type { PortfolioGridBlockData } from "./types"

export function PortfolioGridBlockComponent({
  title,
  items,
}: PortfolioGridBlockData) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      {title ? <h2 className="mb-12 text-center text-3xl font-bold">{title}</h2> : null}
      <div className="grid items-center justify-center gap-4 rounded-3xl border-2 border-dashed py-12 sm:grid-cols-2 lg:grid-cols-3">
        <p className="col-span-full text-center text-muted-foreground">
          Portfolio grid block ({items?.length ?? 0} items selected)
        </p>
      </div>
    </section>
  )
}
