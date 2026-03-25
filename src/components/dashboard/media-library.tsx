"use client"

import { useRef, useState, useTransition } from "react"
import { Check, Image as ImageIcon, Loader2, Search, Trash2, Upload } from "lucide-react"

import { deleteMediaAction, saveMediaAction } from "@/app/actions/media"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type MediaItem = {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  width: number | null
  height: number | null
  alt: string | null
  createdAt: Date
}

type MediaLibraryProps = {
  initialMedia: MediaItem[]
  mode?: "manage" | "picker"
  onSelect?: (url: string, alt?: string) => void
}

export function MediaLibrary({ initialMedia, mode = "manage", onSelect }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  )

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = (await res.json()) as {
        url?: string
        publicId?: string
        width?: number
        height?: number
        error?: string
      }

      if (data.url) {
        const saved = await saveMediaAction({
          filename: file.name,
          url: data.url,
          publicId: data.publicId,
          mimeType: file.type,
          size: file.size,
          width: data.width,
          height: data.height,
        })
        setMedia((prev) => [saved, ...prev])
      } else {
        console.error("Upload mislukt:", data.error)
      }
    } catch (error) {
      console.error("Upload mislukt:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMediaAction(id)
      setMedia((prev) => prev.filter((m) => m.id !== id))
      if (selected === id) setSelected(null)
    })
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="surface-panel flex items-center gap-3 rounded-[1.5rem] px-4 py-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek bestanden..."
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          size="sm"
          className="shrink-0 gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploaden...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Picker confirmation bar */}
      {mode === "picker" && selected && (
        <div className="flex items-center justify-between rounded-[1.2rem] border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-sm">1 afbeelding geselecteerd</span>
          <Button
            size="sm"
            onClick={() => {
              const item = media.find((m) => m.id === selected)
              if (item && onSelect) onSelect(item.url, item.alt ?? item.filename)
            }}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Selecteren
          </Button>
        </div>
      )}

      {/* Media grid */}
      {filtered.length === 0 ? (
        <div className="surface-card flex flex-col items-center justify-center rounded-[1.8rem] border-dashed py-16 text-center">
          <ImageIcon className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm font-medium">Geen bestanden gevonden</p>
          <p className="mt-1 text-xs text-muted-foreground">Upload je eerste afbeelding</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                mode === "picker" &&
                setSelected(item.id === selected ? null : item.id)
              }
              className={`group relative aspect-square overflow-hidden rounded-[1.1rem] border transition-all ${
                selected === item.id
                  ? "border-primary ring-2 ring-primary"
                  : "border-border/60 hover:border-primary/30"
              } ${mode === "picker" ? "cursor-pointer" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.alt ?? item.filename}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />

              {/* Selected indicator */}
              {selected === item.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}

              {/* Hover overlay with info and delete */}
              {mode === "manage" && (
                <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="truncate text-xs text-white">{formatSize(item.size)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item.id)
                    }}
                    disabled={isPending}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/80 text-white hover:bg-red-600 disabled:opacity-50"
                    aria-label="Verwijderen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
