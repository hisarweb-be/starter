import type { VideoEmbedBlockData } from "./types"

function getEmbedUrl(url: string, autoplay?: boolean | null): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    const params = autoplay ? "?autoplay=1&mute=1" : ""
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}${params}`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    const params = autoplay ? "?autoplay=1&muted=1" : ""
    return `https://player.vimeo.com/video/${vimeoMatch[1]}${params}`
  }

  return null
}

export function VideoEmbedBlockComponent({ title, url, caption, autoplay }: VideoEmbedBlockData) {
  const embedUrl = getEmbedUrl(url, autoplay)

  if (!embedUrl) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-16">
        <div className="rounded-3xl border-2 border-dashed py-12 text-center text-muted-foreground">
          Ongeldige video URL
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      {title && <h2 className="mb-8 text-center font-display text-3xl font-bold">{title}</h2>}

      <div className="relative overflow-hidden rounded-[1.5rem] border border-border/40 shadow-soft">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={title ?? "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
        </div>
      </div>

      {caption && (
        <p className="mt-4 text-center text-sm text-muted-foreground">{caption}</p>
      )}
    </section>
  )
}
