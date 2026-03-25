"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, ChevronDown, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { TipTapEditor } from "@/components/editor/tiptap-editor"
import { cn } from "@/lib/utils"
import type { BlockStyle } from "@/lib/block-style"

type BlockData = Record<string, unknown> & { blockType: string }

type BlockConfigPanelProps = {
  block: BlockData
  onChange: (data: Partial<BlockData>) => void
}

const blockTypeLabels: Record<string, string> = {
  hero: "Hero",
  features: "Features",
  testimonials: "Testimonials",
  cta: "Call to Action",
  "services-block": "Services",
  "portfolio-grid": "Portfolio",
  pricing: "Prijzen",
  "faq-block": "FAQ",
  "rich-text": "Tekst",
  "contact-form": "Contactformulier",
}

export function BlockConfigPanel({ block, onChange }: BlockConfigPanelProps) {
  const label = blockTypeLabels[block.blockType] ?? block.blockType
  const [showStyle, setShowStyle] = useState(false)
  const currentStyle = (block._style as BlockStyle) ?? {}

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-primary">{label} bewerken</h3>

      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setShowStyle(!showStyle)}
          className="flex items-center justify-between w-full p-2 text-sm hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium text-xs">Blok stijl</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showStyle && "rotate-180")} />
        </button>
        {showStyle && (
          <div className="p-3 border-t">
            <BlockStylePanel
              style={currentStyle}
              onChange={(s) => onChange({ _style: s })}
            />
          </div>
        )}
      </div>

      {block.blockType === "hero" && (
        <HeroEditor block={block} onChange={onChange} />
      )}
      {block.blockType === "features" && (
        <FeaturesEditor block={block} onChange={onChange} />
      )}
      {block.blockType === "testimonials" && (
        <TestimonialsEditor block={block} onChange={onChange} />
      )}
      {block.blockType === "cta" && (
        <CtaEditor block={block} onChange={onChange} />
      )}
      {block.blockType === "pricing" && (
        <PricingEditor block={block} onChange={onChange} />
      )}
      {block.blockType === "rich-text" && (
        <RichTextEditor block={block} onChange={onChange} />
      )}
      {block.blockType === "faq-block" && (
        <FaqEditor block={block} onChange={onChange} />
      )}
      {block.blockType === "services-block" && (
        <ServicesEditor block={block} onChange={onChange} />
      )}
      {block.blockType === "portfolio-grid" && (
        <GenericTitleEditor block={block} onChange={onChange} />
      )}
      {block.blockType === "contact-form" && (
        <ContactFormEditor block={block} onChange={onChange} />
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  )
}

function HeroEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Titel">
        <Input value={String(block.title ?? "")} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      <Field label="Ondertitel">
        <Textarea value={String(block.subtitle ?? "")} onChange={(e) => onChange({ subtitle: e.target.value })} rows={2} />
      </Field>
      <Field label="Knoptekst">
        <Input value={String(block.ctaText ?? "")} onChange={(e) => onChange({ ctaText: e.target.value })} />
      </Field>
      <Field label="Knoplink">
        <Input value={String(block.ctaLink ?? "")} onChange={(e) => onChange({ ctaLink: e.target.value })} />
      </Field>
    </div>
  )
}

function FeaturesEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  const features = (block.features as Array<{ title: string; description?: string }>) ?? []

  function updateFeature(index: number, field: string, value: string) {
    const updated = features.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    onChange({ features: updated })
  }

  function addFeature() {
    onChange({ features: [...features, { title: "Nieuwe feature", description: "" }] })
  }

  function removeFeature(index: number) {
    onChange({ features: features.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-3">
      <Field label="Sectie titel">
        <Input value={String(block.title ?? "")} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      <div className="space-y-2">
        <Label className="text-xs">Features</Label>
        {features.map((f, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="space-y-2 p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={f.title}
                  onChange={(e) => updateFeature(i, "title", e.target.value)}
                  placeholder="Feature titel"
                  className="text-sm"
                />
                <Button variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0 text-destructive" onClick={() => removeFeature(i)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Textarea
                value={f.description ?? ""}
                onChange={(e) => updateFeature(i, "description", e.target.value)}
                placeholder="Beschrijving"
                rows={2}
                className="text-sm"
              />
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" size="sm" onClick={addFeature} className="w-full gap-2">
          <Plus className="h-3 w-3" /> Feature toevoegen
        </Button>
      </div>
    </div>
  )
}

function TestimonialsEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  const testimonials = (block.testimonials as Array<{ quote: string; author: string; role?: string }>) ?? []

  function updateTestimonial(index: number, field: string, value: string) {
    const updated = testimonials.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    onChange({ testimonials: updated })
  }

  function addTestimonial() {
    onChange({ testimonials: [...testimonials, { quote: "", author: "" }] })
  }

  function removeTestimonial(index: number) {
    onChange({ testimonials: testimonials.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-3">
      <Field label="Sectie titel">
        <Input value={String(block.title ?? "")} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      {testimonials.map((t, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="space-y-2 p-3">
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1.5">
                <Input value={t.author} onChange={(e) => updateTestimonial(i, "author", e.target.value)} placeholder="Naam" className="text-sm" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0 text-destructive" onClick={() => removeTestimonial(i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Input value={t.role ?? ""} onChange={(e) => updateTestimonial(i, "role", e.target.value)} placeholder="Functie" className="text-sm" />
            <Textarea value={t.quote} onChange={(e) => updateTestimonial(i, "quote", e.target.value)} placeholder="Quote" rows={2} className="text-sm" />
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addTestimonial} className="w-full gap-2">
        <Plus className="h-3 w-3" /> Testimonial toevoegen
      </Button>
    </div>
  )
}

function CtaEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Titel">
        <Input value={String(block.title ?? "")} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      <Field label="Beschrijving">
        <Textarea value={String(block.description ?? "")} onChange={(e) => onChange({ description: e.target.value })} rows={2} />
      </Field>
      <Field label="Knoptekst">
        <Input value={String(block.buttonText ?? "")} onChange={(e) => onChange({ buttonText: e.target.value })} />
      </Field>
      <Field label="Knoplink">
        <Input value={String(block.buttonLink ?? "")} onChange={(e) => onChange({ buttonLink: e.target.value })} />
      </Field>
    </div>
  )
}

function PricingEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  const plans = (block.plans as Array<{ name: string; price: string; features?: Array<{ feature?: string }> }>) ?? []

  function updatePlan(index: number, field: string, value: unknown) {
    const updated = plans.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    onChange({ plans: updated })
  }

  function addPlan() {
    onChange({ plans: [...plans, { name: "Plan", price: "0", features: [] }] })
  }

  function removePlan(index: number) {
    onChange({ plans: plans.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-3">
      <Field label="Sectie titel">
        <Input value={String(block.title ?? "")} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      {plans.map((plan, i) => (
        <Card key={i} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-2">
            <CardTitle className="text-sm">Plan {i + 1}</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => removePlan(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <Input value={plan.name} onChange={(e) => updatePlan(i, "name", e.target.value)} placeholder="Plan naam" className="text-sm" />
            <Input value={plan.price} onChange={(e) => updatePlan(i, "price", e.target.value)} placeholder="Prijs" className="text-sm" />
            <Textarea
              value={(plan.features ?? []).map((f) => f.feature ?? "").join("\n")}
              onChange={(e) =>
                updatePlan(i, "features", e.target.value.split("\n").map((f) => ({ feature: f })))
              }
              placeholder="Features (1 per regel)"
              rows={3}
              className="text-sm"
            />
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addPlan} className="w-full gap-2">
        <Plus className="h-3 w-3" /> Plan toevoegen
      </Button>
    </div>
  )
}

function RichTextEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Inhoud</Label>
      <TipTapEditor
        content={typeof block.content === "string" ? block.content : ""}
        onChange={(html) => onChange({ content: html })}
        placeholder="Schrijf je tekst hier..."
      />
    </div>
  )
}

function FaqEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  const items = (block.items as Array<{ question: string; answer: string }>) ?? []

  function updateItem(index: number, field: string, value: string) {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onChange({ items: updated })
  }

  function addItem() {
    onChange({ items: [...items, { question: "Nieuwe vraag?", answer: "Antwoord hier." }] })
  }

  function removeItem(index: number) {
    onChange({ items: items.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-3">
      <Field label="Sectie titel">
        <Input value={String(block.title ?? "")} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      {items.map((item, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="space-y-2 p-3">
            <div className="flex items-start gap-2">
              <Input
                value={item.question}
                onChange={(e) => updateItem(i, "question", e.target.value)}
                placeholder="Vraag"
                className="text-sm"
              />
              <Button variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0 text-destructive" onClick={() => removeItem(i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              value={item.answer}
              onChange={(e) => updateItem(i, "answer", e.target.value)}
              placeholder="Antwoord"
              rows={2}
              className="text-sm"
            />
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full gap-2">
        <Plus className="h-3 w-3" /> Vraag toevoegen
      </Button>
    </div>
  )
}

function ServicesEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  const services = (block.services as Array<{ title: string; description?: string; icon?: string }>) ?? []

  function updateService(index: number, field: string, value: string) {
    const updated = services.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    onChange({ services: updated })
  }

  function addService() {
    onChange({ services: [...services, { title: "Nieuwe dienst", description: "" }] })
  }

  function removeService(index: number) {
    onChange({ services: services.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-3">
      <Field label="Sectie titel">
        <Input value={String(block.title ?? "")} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      {services.map((s, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="space-y-2 p-3">
            <div className="flex items-center gap-2">
              <Input
                value={s.title}
                onChange={(e) => updateService(i, "title", e.target.value)}
                placeholder="Dienst naam"
                className="text-sm"
              />
              <Button variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0 text-destructive" onClick={() => removeService(i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              value={s.description ?? ""}
              onChange={(e) => updateService(i, "description", e.target.value)}
              placeholder="Beschrijving"
              rows={2}
              className="text-sm"
            />
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addService} className="w-full gap-2">
        <Plus className="h-3 w-3" /> Dienst toevoegen
      </Button>
    </div>
  )
}

function GenericTitleEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  return (
    <Field label="Sectie titel">
      <Input value={String(block.title ?? "")} onChange={(e) => onChange({ title: e.target.value })} />
    </Field>
  )
}

function ContactFormEditor({ block, onChange }: { block: BlockData; onChange: (d: Partial<BlockData>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Titel">
        <Input value={String(block.title ?? "")} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      <Field label="Ondertitel">
        <Input value={String(block.subtitle ?? "")} onChange={(e) => onChange({ subtitle: e.target.value })} />
      </Field>
      <Field label="Knoptekst">
        <Input value={String(block.buttonText ?? "Versturen")} onChange={(e) => onChange({ buttonText: e.target.value })} />
      </Field>
      <Field label="Succesbericht">
        <Textarea value={String(block.successMessage ?? "")} onChange={(e) => onChange({ successMessage: e.target.value })} rows={2} />
      </Field>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Block Style Panel
// ---------------------------------------------------------------------------

const COLOR_SWATCHES: Array<{ label: string; value: string; bg: string }> = [
  { label: "Wit", value: "#ffffff", bg: "bg-white border border-gray-200" },
  { label: "Lichtgrijs", value: "#f3f4f6", bg: "bg-gray-100" },
  { label: "Grijs", value: "#e5e7eb", bg: "bg-gray-200" },
  { label: "Donkergrijs", value: "#374151", bg: "bg-gray-700" },
  { label: "Zwart", value: "#111827", bg: "bg-gray-900" },
  { label: "Blauw", value: "#3b82f6", bg: "bg-blue-500" },
  { label: "Indigo", value: "#6366f1", bg: "bg-indigo-500" },
  { label: "Groen", value: "#22c55e", bg: "bg-green-500" },
  { label: "Geel", value: "#eab308", bg: "bg-yellow-500" },
  { label: "Rood", value: "#ef4444", bg: "bg-red-500" },
]

const PADDING_OPTIONS: Array<{ label: string; value: BlockStyle["paddingY"] }> = [
  { label: "Geen", value: "none" },
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
  { label: "XL", value: "xl" },
]

const BORDER_RADIUS_OPTIONS: Array<{ label: string; value: BlockStyle["borderRadius"] }> = [
  { label: "Geen", value: "none" },
  { label: "S", value: "sm" },
  { label: "L", value: "lg" },
  { label: "Rond", value: "full" },
]

function BlockStylePanel({
  style,
  onChange,
}: {
  style: BlockStyle
  onChange: (s: BlockStyle) => void
}) {
  const [hexInput, setHexInput] = useState(style.bgColor ?? "")

  function update<K extends keyof BlockStyle>(key: K, value: BlockStyle[K]) {
    onChange({ ...style, [key]: value })
  }

  function handleHexChange(value: string) {
    setHexInput(value)
    if (/^#([0-9a-fA-F]{3}){1,2}$/.test(value)) {
      update("bgColor", value)
    }
  }

  function handleSwatchClick(hex: string) {
    setHexInput(hex)
    update("bgColor", hex)
  }

  return (
    <div className="space-y-3">
      {/* Background color */}
      <div className="space-y-1.5">
        <Label className="text-xs">Achtergrond kleur</Label>
        <div className="flex flex-wrap gap-1.5">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              title={swatch.label}
              onClick={() => handleSwatchClick(swatch.value)}
              className={cn(
                "h-5 w-5 rounded-sm ring-offset-1 transition-all",
                swatch.bg,
                style.bgColor === swatch.value && "ring-2 ring-primary",
              )}
            />
          ))}
          <button
            title="Geen kleur"
            onClick={() => { setHexInput(""); update("bgColor", undefined) }}
            className={cn(
              "h-5 w-5 rounded-sm border border-dashed border-muted-foreground/50 ring-offset-1 transition-all text-muted-foreground flex items-center justify-center text-[10px]",
              !style.bgColor && "ring-2 ring-primary",
            )}
          >
            ✕
          </button>
        </div>
        <Input
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#ffffff"
          className="h-7 text-xs font-mono"
        />
      </div>

      {/* Padding Y */}
      <div className="space-y-1.5">
        <Label className="text-xs">Ruimte (padding)</Label>
        <div className="flex gap-1">
          {PADDING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("paddingY", opt.value)}
              className={cn(
                "flex-1 rounded border px-1 py-1 text-[10px] font-medium transition-colors",
                style.paddingY === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background hover:bg-muted",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text alignment */}
      <div className="space-y-1.5">
        <Label className="text-xs">Tekst uitlijning</Label>
        <div className="flex gap-1">
          {(
            [
              { value: "left", Icon: AlignLeft, label: "Links" },
              { value: "center", Icon: AlignCenter, label: "Midden" },
              { value: "right", Icon: AlignRight, label: "Rechts" },
            ] as const
          ).map(({ value, Icon, label }) => (
            <button
              key={value}
              title={label}
              onClick={() => update("textAlign", style.textAlign === value ? undefined : value)}
              className={cn(
                "flex flex-1 items-center justify-center rounded border py-1 transition-colors",
                style.textAlign === value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background hover:bg-muted",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Border radius */}
      <div className="space-y-1.5">
        <Label className="text-xs">Afronding (hoeken)</Label>
        <div className="flex gap-1">
          {BORDER_RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("borderRadius", opt.value)}
              className={cn(
                "flex-1 rounded border px-1 py-1 text-[10px] font-medium transition-colors",
                style.borderRadius === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background hover:bg-muted",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dark background */}
      <div className="flex items-center gap-2">
        <input
          id="dark-bg-toggle"
          type="checkbox"
          checked={style.darkBg ?? false}
          onChange={(e) => update("darkBg", e.target.checked)}
          className="h-3.5 w-3.5 rounded border-border accent-primary"
        />
        <Label htmlFor="dark-bg-toggle" className="text-xs cursor-pointer">
          Donkere achtergrond
        </Label>
      </div>
    </div>
  )
}
