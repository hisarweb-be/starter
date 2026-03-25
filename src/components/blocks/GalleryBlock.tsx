"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import type { GalleryBlockData } from "./types"
import { cn } from "@/lib/utils"

export function GalleryBlockComponent({ title, columns = 3, images }: GalleryBlockData) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const cols = columns ?? 3

  if (!images?.length) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        {title && <h2 className="mb-12 text-center font-display text-3xl font-bold">{title}</h2>}
        <div className="rounded-3xl border-2 border-dashed py-12 text-center text-muted-foreground">
          Geen afbeeldingen beschikbaar
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      {title && <h2 className="mb-12 text-center font-display text-3xl font-bold">{title}</h2>}

      <div
        className={cn(
          "grid gap-4",
          cols === 2 && "grid-cols-1 sm:grid-cols-2",
          cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          cols === 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-border/40"
          >
            <Image
              src={image.url}
              alt={image.alt ?? ""}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8">
                <p className="text-sm font-medium text-white">{image.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-h-[85vh] max-w-[90vw]">
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt ?? ""}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}
