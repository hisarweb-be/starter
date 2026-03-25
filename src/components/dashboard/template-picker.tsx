"use client"

import { useState } from "react"
import { FileText, Layout, Briefcase, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { blockTemplates, type BlockTemplate } from "@/lib/block-templates"
import { cn } from "@/lib/utils"

type TemplatePickerProps = {
  onSelect: (template: BlockTemplate) => void
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Marketing: Sparkles,
  Bedrijf: Briefcase,
  Basis: FileText,
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(blockTemplates.map((t) => t.category))]
  const filtered = selectedCategory
    ? blockTemplates.filter((t) => t.category === selectedCategory)
    : blockTemplates

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold">Kies een template</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start met een voorgedefinieerd template of begin met een lege pagina.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            !selectedCategory
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/60 text-muted-foreground hover:border-primary/40"
          )}
        >
          Alles
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              selectedCategory === category
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/40"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((template) => {
          const Icon = categoryIcons[template.category] ?? Layout
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className="surface-card group flex flex-col gap-3 rounded-[1.25rem] p-4 text-left transition-all hover:shadow-elevated"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-[0.75rem] bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold">{template.name}</h4>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                    {template.blocks.length} {template.blocks.length === 1 ? "blok" : "blokken"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
