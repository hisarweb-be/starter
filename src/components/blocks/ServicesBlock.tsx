import type { ServicesBlockData } from "./types"

export function ServicesBlockComponent({
  title,
  services,
}: ServicesBlockData) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      {title ? <h2 className="mb-12 text-center text-3xl font-bold">{title}</h2> : null}
      <div className="rounded-3xl border-2 border-dashed py-12 text-center text-muted-foreground">
        <p>Services listing block ({services?.length ?? 0} items selected)</p>
      </div>
    </section>
  )
}
