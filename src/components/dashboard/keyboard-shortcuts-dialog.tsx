"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useKeyboardShortcuts, dashboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false)

  useKeyboardShortcuts([
    {
      key: "?",
      handler: () => setOpen(true),
    },
  ])

  const categories = dashboardShortcuts.reduce<Record<string, typeof dashboardShortcuts>>(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) acc[shortcut.category] = []
      acc[shortcut.category].push(shortcut)
      return acc
    },
    {}
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-[1.5rem]">
        <DialogHeader>
          <DialogTitle className="font-display">Sneltoetsen</DialogTitle>
          <DialogDescription>
            Navigeer sneller door het dashboard met toetsenbordcombinaties.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {Object.entries(categories).map(([category, shortcuts]) => (
            <div key={category}>
              <h4 className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                {category}
              </h4>
              <div className="space-y-1">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.keys}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5"
                  >
                    <span className="text-sm">{shortcut.label}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.split("+").map((key) => (
                        <kbd
                          key={key}
                          className="inline-flex min-w-[1.5rem] items-center justify-center rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                        >
                          {key === "Ctrl" ? (typeof navigator !== "undefined" && navigator.platform?.includes("Mac") ? "\u2318" : "Ctrl") : key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
