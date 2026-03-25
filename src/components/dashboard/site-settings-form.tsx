"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSiteSettingsAction } from "@/app/actions/organization"

type SiteSettingsFormProps = {
  initialData: {
    siteName: string
    tagline: string
    accentColor: string
    logoUrl: string
    industry: string
    gaTrackingId?: string
  }
}

export function SiteSettingsForm({ initialData }: SiteSettingsFormProps) {
  const [data, setData] = useState({
    ...initialData,
    gaTrackingId: initialData.gaTrackingId ?? "",
  })
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(false)
    startTransition(async () => {
      await updateSiteSettingsAction(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="surface-card rounded-[1.9rem] border-0 py-0">
        <CardHeader className="space-y-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="text-2xl">Algemeen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Website naam</Label>
            <Input
              id="siteName"
              value={data.siteName}
              onChange={(e) => setData({ ...data, siteName: e.target.value })}
              placeholder="Mijn Website"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea
              id="tagline"
              value={data.tagline}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              placeholder="Een korte beschrijving van je website"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Branche</Label>
            <Input
              id="industry"
              value={data.industry}
              onChange={(e) => setData({ ...data, industry: e.target.value })}
              placeholder="bijv. Horeca, IT, Retail"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="surface-card rounded-[1.9rem] border-0 py-0">
        <CardHeader className="space-y-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="text-2xl">Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accentkleur</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="accentColor"
                value={data.accentColor}
                onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded border border-border"
              />
              <Input
                value={data.accentColor}
                onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                className="max-w-32"
                placeholder="#6d28d9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={data.logoUrl}
              onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="surface-card rounded-[1.9rem] border-0 py-0">
        <CardHeader className="space-y-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="text-2xl">Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="space-y-2">
            <Label htmlFor="gaTrackingId">Google Analytics ID</Label>
            <Input
              id="gaTrackingId"
              value={data.gaTrackingId}
              onChange={(e) => setData({ ...data, gaTrackingId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground">
              Voer je Google Analytics 4 Measurement ID in (begint met G-).
              Laat leeg om analytics uit te schakelen.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="surface-panel flex flex-col gap-4 rounded-[1.75rem] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-base font-semibold">Site-instellingen opslaan</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Werk basisidentiteit, branding en analytics op één centrale plek bij.
          </p>
        </div>
        <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Opslaan..." : "Opslaan"}
        </Button>
        {saved && (
          <span className="text-sm text-primary">Instellingen opgeslagen!</span>
        )}
        </div>
      </div>
    </form>
  )
}
