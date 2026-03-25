"use client"

import { useEffect, useCallback } from "react"

type ShortcutHandler = () => void

type Shortcut = {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  handler: ShortcutHandler
  /** Disable when user is typing in an input/textarea */
  ignoreInput?: boolean
}

function isInputElement(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false
  const tag = el.tagName.toLowerCase()
  return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !shortcut.ctrl
        const metaMatch = shortcut.meta ? e.metaKey : !shortcut.meta
        const shiftMatch = shortcut.shift ? e.shiftKey : !shortcut.shift

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch) {
          if (shortcut.ignoreInput !== false && isInputElement(e.target)) {
            continue
          }
          e.preventDefault()
          shortcut.handler()
          return
        }
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

export type KeyboardShortcutDef = {
  keys: string
  label: string
  category: string
}

export const dashboardShortcuts: KeyboardShortcutDef[] = [
  { keys: "Ctrl+K", label: "Zoekpalet openen", category: "Algemeen" },
  { keys: "?", label: "Sneltoetsen tonen", category: "Algemeen" },
  { keys: "N", label: "Nieuwe pagina", category: "Pagina's" },
  { keys: "E", label: "Pagina bewerken", category: "Pagina's" },
  { keys: "Ctrl+S", label: "Opslaan", category: "Editor" },
  { keys: "Ctrl+Shift+P", label: "Publiceren", category: "Editor" },
  { keys: "Esc", label: "Sluiten", category: "Algemeen" },
]
