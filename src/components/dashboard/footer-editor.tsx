"use client"

import { useState, useTransition } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { updateFooterAction, type FooterData } from "@/app/actions/footer"
import { cn } from "@/lib/utils"

type FooterColumn = {
  title: string
  links: Array<{ label: string; href: string }>
}

type Props = {
  initialData: FooterData
}

export function FooterEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const [tagline, setTagline] = useState(initialData.tagline ?? "")
  const [columns, setColumns] = useState<FooterColumn[]>(
    initialData.columns ?? []
  )
  const [socialLinks, setSocialLinks] = useState({
    facebook: initialData.socialLinks?.facebook ?? "",
    instagram: initialData.socialLinks?.instagram ?? "",
    linkedin: initialData.socialLinks?.linkedin ?? "",
    twitter: initialData.socialLinks?.twitter ?? "",
  })
  const [copyrightText, setCopyrightText] = useState(initialData.copyrightText ?? "")

  function addColumn() {
    if (columns.length >= 3) return
    setColumns([...columns, { title: "", links: [] }])
  }

  function removeColumn(colIndex: number) {
    setColumns(columns.filter((_, i) => i !== colIndex))
  }

  function updateColumnTitle(colIndex: number, title: string) {
    setColumns(columns.map((col, i) => (i === colIndex ? { ...col, title } : col)))
  }

  function addLink(colIndex: number) {
    setColumns(
      columns.map((col, i) =>
        i === colIndex ? { ...col, links: [...col.links, { label: "", href: "" }] } : col
      )
    )
  }

  function removeLink(colIndex: number, linkIndex: number) {
    setColumns(
      columns.map((col, i) =>
        i === colIndex
          ? { ...col, links: col.links.filter((_, li) => li !== linkIndex) }
          : col
      )
    )
  }

  function updateLink(colIndex: number, linkIndex: number, field: "label" | "href", value: string) {
    setColumns(
      columns.map((col, i) =>
        i === colIndex
          ? {
              ...col,
              links: col.links.map((link, li) =>
                li === linkIndex ? { ...link, [field]: value } : link
              ),
            }
          : col
      )
    )
  }

  function handleSave() {
    setSaved(false)
    startTransition(async () => {
      await updateFooterAction({
        tagline: tagline || undefined,
        columns: columns.length > 0 ? columns : undefined,
        socialLinks: {
          facebook: socialLinks.facebook || undefined,
          instagram: socialLinks.instagram || undefined,
          linkedin: socialLinks.linkedin || undefined,
          twitter: socialLinks.twitter || undefined,
        },
        copyrightText: copyrightText || undefined,
      })
      setSaved(true)
    })
  }

  return (
    <div className="space-y-6">
      {/* Tagline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bedrijfstagline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Jouw slogan of omschrijving..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer columns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Footer kolommen</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={addColumn}
            disabled={columns.length >= 3}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Kolom toevoegen
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {columns.length === 0 && (
            <p className="text-sm text-muted-foreground">Nog geen kolommen. Voeg er maximaal 3 toe.</p>
          )}
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="rounded-md border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <Label>Kolomtitel</Label>
                  <Input
                    value={col.title}
                    onChange={(e) => updateColumnTitle(colIndex, e.target.value)}
                    placeholder="Bijv. Diensten"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-5 h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => removeColumn(colIndex)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                {col.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center gap-2">
                    <Input
                      value={link.label}
                      onChange={(e) => updateLink(colIndex, linkIndex, "label", e.target.value)}
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input
                      value={link.href}
                      onChange={(e) => updateLink(colIndex, linkIndex, "href", e.target.value)}
                      placeholder="URL (bijv. /over-ons)"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeLink(colIndex, linkIndex)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addLink(colIndex)}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Link toevoegen
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Social links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sociale media links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(["facebook", "instagram", "linkedin", "twitter"] as const).map((platform) => (
            <div key={platform} className="space-y-1">
              <Label htmlFor={platform} className="capitalize">{platform}</Label>
              <Input
                id={platform}
                value={socialLinks[platform]}
                onChange={(e) => setSocialLinks({ ...socialLinks, [platform]: e.target.value })}
                placeholder={`https://${platform}.com/jouwpagina`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Copyright */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Copyright</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Label htmlFor="copyright">Copyrightmelding</Label>
            <Input
              id="copyright"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              placeholder={`© ${new Date().getFullYear()} Jouw Bedrijf. Alle rechten voorbehouden.`}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Opslaan..." : "Opslaan"}
        </Button>
        {saved && (
          <span className={cn("text-sm text-green-600")}>Opgeslagen!</span>
        )}
      </div>
    </div>
  )
}
