"use client"

import {
  Sparkles,
  LayoutGrid,
  MessageSquareQuote,
  MousePointerClick,
  Briefcase,
  Image,
  CreditCard,
  HelpCircle,
  FileText,
  X,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { blockRegistry, type BlockDefinition } from "@/lib/block-registry"

// Map icon names → Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  LayoutGrid,
  MessageSquareQuote,
  MousePointerClick,
  Briefcase,
  Image,
  CreditCard,
  HelpCircle,
  FileText,
}

const categoryLabels: Record<BlockDefinition["category"], string> = {
  content: "Content",
  layout: "Layout",
  media: "Media",
  commerce: "Commerce",
  social: "Sociaal",
}

const categoryOrder: BlockDefinition["category"][] = ["content", "social", "commerce", "media", "layout"]

type BlockToolbarProps = {
  onSelect: (blockType: string) => void
  onCancel: () => void
}

export function BlockToolbar({ onSelect, onCancel }: BlockToolbarProps) {
  // Group blocks by category
  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      blocks: blockRegistry.filter((b) => b.category === cat),
    }))
    .filter((g) => g.blocks.length > 0)

  return (
    <Card className="border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Block toevoegen</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">{blockRegistry.length} block types beschikbaar</p>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {grouped.map((group) => (
          <div key={group.category}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              {group.label}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {group.blocks.map((block) => {
                const Icon = iconMap[block.icon] ?? Sparkles
                return (
                  <button
                    key={block.type}
                    onClick={() => onSelect(block.type)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-center transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                    title={block.description}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-xs font-medium leading-tight">{block.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
