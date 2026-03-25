"use client"

import { ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SignatureResponse = {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string | null
  publicId: string | null
  error?: string
}

type UploadResponse = {
  secure_url?: string
  error?: {
    message?: string
  }
}

export function LogoUploadField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(file: File) {
    setError(null)
    setIsUploading(true)

    try {
      const signatureResponse = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folder: "hisarweb-starter/setup",
          publicId: `logo-${Date.now()}`,
        }),
      })

      const signatureData = (await signatureResponse.json()) as SignatureResponse

      if (!signatureResponse.ok) {
        throw new Error(signatureData.error ?? "Kon geen upload-handtekening ophalen.")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", signatureData.apiKey)
      formData.append("timestamp", String(signatureData.timestamp))
      formData.append("signature", signatureData.signature)

      if (signatureData.folder) {
        formData.append("folder", signatureData.folder)
      }

      if (signatureData.publicId) {
        formData.append("public_id", signatureData.publicId)
      }

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      const uploadData = (await uploadResponse.json()) as UploadResponse

      if (!uploadResponse.ok || !uploadData.secure_url) {
        throw new Error(uploadData.error?.message ?? "Upload naar Cloudinary is mislukt.")
      }

      onChange(uploadData.secure_url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload mislukt.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-3xl border border-dashed border-border/70 bg-muted/30 p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) {
            return
          }

          void handleUpload(file)
          event.currentTarget.value = ""
        }}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium">Logo upload</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Upload direct naar Cloudinary via de signed endpoint of plak handmatig een bestaand
            logo-URL in.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <UploadCloud className="mr-2 size-4" />}
            {isUploading ? "Uploaden..." : "Upload logo"}
          </Button>
          {value ? (
            <Button type="button" variant="ghost" onClick={() => onChange("")}>
              <Trash2 className="mr-2 size-4" /> Verwijder
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-border/70 bg-background">
          {value ? (
            <div
              className="h-28 w-28 rounded-2xl border border-border/70 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${value})` }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="size-8" />
              <span>Geen logo gekozen</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://..."
          />
          <p className="text-xs leading-5 text-muted-foreground">
            Laat dit veld leeg als je voorlopig geen logo wilt tonen. Bij actieve Cloudinary-config
            kan je hierboven rechtstreeks uploaden.
          </p>
          {error ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
