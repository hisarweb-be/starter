import type { MapBlockData } from "./types"

export function MapBlockComponent({ title, latitude, longitude, zoom = 14, caption }: MapBlockData) {
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}&zoom=${zoom}`

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      {title && <h2 className="mb-8 text-center font-display text-3xl font-bold">{title}</h2>}

      <div className="overflow-hidden rounded-[1.5rem] border border-border/40 shadow-soft">
        <div className="aspect-[16/9]">
          <iframe
            src={embedUrl}
            title={title ?? "Kaart"}
            className="h-full w-full"
            loading="lazy"
            style={{ border: 0 }}
          />
        </div>
      </div>

      {caption && (
        <p className="mt-4 text-center text-sm text-muted-foreground">{caption}</p>
      )}
    </section>
  )
}
