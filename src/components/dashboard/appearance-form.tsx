"use client"

import { Check, Code2, Palette, Sparkles, Type } from "lucide-react"
import { useState, useTransition } from "react"

import { updateThemeAction } from "@/app/actions/organization"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generatePalette, brandPalettes, fontPresets } from "@/lib/colors"
import { cn } from "@/lib/utils"

type AppearanceFormProps = {
  initialData: {
    themeMode: string
    fontPreset: string
    accentColor: string
    customCss: string | null
    faviconUrl: string | null
  }
}

const themeModes = [
  {
    value: "system",
    label: "Systeem",
    description: "Volgt automatisch de voorkeur van bezoekers.",
  },
  {
    value: "light",
    label: "Licht",
    description: "Helder, editorial en commercieel sterk.",
  },
  {
    value: "dark",
    label: "Donker",
    description: "Meer contrast en een productgevoel.",
  },
] as const

export function AppearanceForm({ initialData }: AppearanceFormProps) {
  const [themeMode, setThemeMode] = useState(initialData.themeMode)
  const [fontPreset, setFontPreset] = useState(initialData.fontPreset)
  const [accentColor, setAccentColor] = useState(initialData.accentColor)
  const [customCss, setCustomCss] = useState(initialData.customCss ?? "")
  const [faviconUrl, setFaviconUrl] = useState(initialData.faviconUrl ?? "")
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const palette = accentColor ? generatePalette(accentColor) : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(false)
    startTransition(async () => {
      await updateThemeAction({
        themeMode,
        fontPreset,
        accentColor,
        customCss: customCss || null,
        faviconUrl: faviconUrl || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="surface-card rounded-[1.9rem] border-0 py-0">
          <CardHeader className="space-y-4 px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-[1rem] bg-primary text-primary-foreground">
                <Palette className="size-5" />
              </span>
              <div>
                <CardTitle className="text-2xl">Theme direction</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Kies hoe het merk visueel aanvoelt, voor bezoekers en editors.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="space-y-3">
              <Label>Thema modus</Label>
              <div className="grid gap-3 md:grid-cols-3">
                {themeModes.map((mode) => (
                  <OptionCard
                    key={mode.value}
                    active={themeMode === mode.value}
                    title={mode.label}
                    description={mode.description}
                    onClick={() => setThemeMode(mode.value)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Lettertype</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {fontPresets.map((font) => (
                  <OptionCard
                    key={font.id}
                    active={fontPreset === font.id}
                    title={font.label}
                    description="Direct toepasbaar in de organisatiebranding."
                    onClick={() => setFontPreset(font.id)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="accentColor">Accentkleur</Label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="color"
                  id="accentColor"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-12 w-16 cursor-pointer rounded-2xl border border-border bg-background p-2"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#1664d8"
                  className="h-11 max-w-40 rounded-2xl bg-background/75 font-mono"
                />
                <div
                  className="h-11 min-w-28 flex-1 rounded-2xl border border-border/60"
                  style={{ backgroundColor: accentColor }}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {brandPalettes.map((paletteItem) => (
                  <button
                    key={paletteItem.color}
                    type="button"
                    onClick={() => setAccentColor(paletteItem.color)}
                    title={paletteItem.name}
                    className={cn(
                      "size-9 rounded-full border-2 border-white/80 shadow-sm transition-transform hover:scale-110",
                      accentColor === paletteItem.color ? "scale-110 ring-4 ring-primary/20" : ""
                    )}
                    style={{ backgroundColor: paletteItem.color }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-[1.9rem] border-0 py-0">
          <CardHeader className="space-y-4 px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-[1rem] bg-secondary text-secondary-foreground">
                <Sparkles className="size-5" />
              </span>
              <div>
                <CardTitle className="text-2xl">Live preview</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Zie meteen hoe kleur, modus en typografie samenkomen.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="rounded-[1.7rem] border border-border/60 bg-background p-5">
              <div
                className="rounded-[1.4rem] px-5 py-6 text-white shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/70">
                  Brand preview
                </p>
                <p className="mt-3 text-3xl font-semibold">
                  {themeMode === "dark" ? "Confident. Focused. Fast." : "Sharp branding, smooth delivery."}
                </p>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/80">
                  Deze combinatie bepaalt hoe je publieke pagina&apos;s en dashboard zich visueel gedragen.
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <PreviewStat label="Theme" value={themeMode} />
                <PreviewStat label="Font" value={fontPreset} />
              </div>
            </div>

            {palette ? (
              <div className="space-y-3">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Generated palette
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Primary", value: palette.primary },
                    { label: "Light", value: palette.primaryLight },
                    { label: "Dark", value: palette.primaryDark },
                    { label: "Accent", value: palette.accent },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[1.2rem] border border-border/60 bg-card/70 p-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="size-8 rounded-full border border-white/70"
                          style={{ backgroundColor: item.value }}
                        />
                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="font-mono text-xs text-muted-foreground">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="surface-card rounded-[1.9rem] border-0 py-0">
          <CardHeader className="space-y-4 px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-[1rem] bg-secondary text-secondary-foreground">
                <Type className="size-5" />
              </span>
              <div>
                <CardTitle className="text-2xl">Identity assets</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Werk favicon en aanvullende merkassets af zodat alles consistent laadt.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="space-y-2">
              <Label htmlFor="faviconUrl">Favicon URL</Label>
              <p className="text-xs leading-6 text-muted-foreground">
                Ondersteunt `.ico`, `.png` of `.svg`. Gebruik idealiter een lichtgewicht 32x32 bron.
              </p>
              <div className="flex items-center gap-3">
                {faviconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={faviconUrl}
                    alt="Favicon voorbeeld"
                    className="size-10 rounded-xl border border-border object-contain bg-background"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : null}
                <Input
                  id="faviconUrl"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="https://example.com/favicon.svg"
                  className="h-11 rounded-2xl bg-background/75"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-[1.9rem] border-0 py-0">
          <CardHeader className="space-y-4 px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-[1rem] bg-secondary text-secondary-foreground">
                <Code2 className="size-5" />
              </span>
              <div>
                <CardTitle className="text-2xl">Custom CSS</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Voor uitzonderingen en merkdetails die bovenop het standaard systeem komen.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-xs leading-6 text-muted-foreground">
              Houd deze laag klein en gericht. Gebruik dit alleen voor bewuste overrides, niet voor een tweede stylesysteem.
            </p>
            <textarea
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              placeholder={`/* Voorbeeld */\n.hero-card {\n  backdrop-filter: blur(20px);\n}\n`}
              rows={10}
              className="w-full rounded-[1.4rem] border border-input bg-background px-4 py-3 font-mono text-xs leading-6 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </CardContent>
        </Card>
      </section>

      <div className="surface-panel flex flex-col gap-4 rounded-[1.75rem] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-base font-semibold">Appearance save point</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sla deze merkkeuzes op zodat de hele organisatie dezelfde visuele basis gebruikt.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {saved ? <span className="text-sm font-medium text-primary">Thema opgeslagen!</span> : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Opslaan..." : "Opslaan"}
          </Button>
        </div>
      </div>
    </form>
  )
}

function OptionCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[1.35rem] border px-4 py-4 text-left transition-all",
        active ? "border-primary bg-primary/7" : "border-border/60 bg-card/65 hover:bg-card/85"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <span
          className={cn(
            "inline-flex size-6 shrink-0 items-center justify-center rounded-full border",
            active ? "border-primary bg-primary text-primary-foreground" : "border-border/70 bg-background"
          )}
        >
          {active ? <Check className="size-3.5" /> : null}
        </span>
      </div>
    </button>
  )
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-border/60 bg-card/70 px-4 py-3">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium capitalize text-foreground">{value}</p>
    </div>
  )
}
