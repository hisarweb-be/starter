"use client"

import { Globe, EyeOff, Trash2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type BulkActionsBarProps = {
  selectedCount: number
  onPublish: () => void
  onUnpublish: () => void
  onDelete: () => void
  onClearSelection: () => void
}

export function BulkActionsBar({
  selectedCount,
  onPublish,
  onUnpublish,
  onDelete,
  onClearSelection,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
        "animate-in slide-in-from-bottom-4 fade-in duration-200"
      )}
    >
      <div className="surface-panel flex items-center gap-3 rounded-[1.5rem] border border-border/60 px-5 py-3 shadow-lg">
        <span className="text-sm font-medium">
          {selectedCount} geselecteerd
        </span>

        <div className="mx-1 h-5 w-px bg-border/60" />

        <Button size="sm" className="gap-1.5" onClick={onPublish}>
          <Globe className="h-3.5 w-3.5" />
          Publiceren
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onUnpublish}
        >
          <EyeOff className="h-3.5 w-3.5" />
          Depubliceren
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="gap-1.5"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Verwijderen
        </Button>

        <div className="mx-1 h-5 w-px bg-border/60" />

        <button
          onClick={onClearSelection}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Deselecteren
        </button>
      </div>
    </div>
  )
}
