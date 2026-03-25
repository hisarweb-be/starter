"use client"

import { useTransition, useState } from "react"
import { ImageIcon, Search, X } from "lucide-react"

import { listMediaAction } from "@/app/actions/media"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type MediaItem = {
  id: string
  url: string
  filename: string
  alt: string | null
}

type ImagePickerProps = {
  value?: string
  onChange: (url: string) => void
  label?: string
}

export function ImagePicker({ value, onChange, label = "Afbeelding" }: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()

  function loadMedia() {
    startTransition(async () => {
      const items = await listMediaAction()
      setMedia(items)
    })
  }

  function handleOpen() {
    setOpen(true)
    loadMedia()
  }

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium">{label}</label>

      {value ? (
        <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Geselecteerde afbeelding"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="sm" onClick={handleOpen} variant="secondary">
              Wijzigen
            </Button>
            <Button
              size="sm"
              onClick={() => onChange("")}
              variant="destructive"
              className="gap-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ImageIcon className="h-8 w-8 opacity-40" />
          <span>Klik om afbeelding te kiezen</span>
        </button>
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Afbeelding kiezen</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Sluiten"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoeken..."
                className="pl-9"
              />
            </div>

            {isPending ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Laden...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center text-muted-foreground">
                <ImageIcon className="mb-2 h-8 w-8 opacity-30" />
                <p className="text-sm">
                  Geen afbeeldingen gevonden. Upload eerst bestanden in Media.
                </p>
              </div>
            ) : (
              <div className="grid max-h-80 grid-cols-4 gap-2 overflow-y-auto">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.url)
                      setOpen(false)
                    }}
                    className="group aspect-square overflow-hidden rounded-lg border border-border transition-all hover:border-primary"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt ?? item.filename}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
