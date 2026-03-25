import type { FaqBlockData } from "./types"

export function FaqBlockComponent({ title, items }: FaqBlockData) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      {title ? <h2 className="mb-12 text-center text-3xl font-bold">{title}</h2> : null}
      <div className="space-y-4 rounded-3xl border-2 border-dashed py-12 text-center text-muted-foreground">
        <p>FAQ items block ({items?.length ?? 0} items selected)</p>
      </div>
    </section>
  )
}
