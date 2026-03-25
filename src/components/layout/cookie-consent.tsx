"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { hasConsented, acceptAll, rejectAll, setConsent } from "@/lib/cookie-consent"
import { cn } from "@/lib/utils"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (!hasConsented()) {
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!visible) return null

  function handleAcceptAll() {
    acceptAll()
    setVisible(false)
    window.location.reload()
  }

  function handleRejectAll() {
    rejectAll()
    setVisible(false)
  }

  function handleSavePreferences() {
    setConsent({ analytics, marketing })
    setVisible(false)
    if (analytics) window.location.reload()
  }

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg rounded-[1.5rem] border border-border/60 bg-card/95 p-5 shadow-elevated backdrop-blur-xl",
        "animate-in slide-in-from-bottom-4 fade-in duration-300"
      )}
    >
      <div className="space-y-3">
        <div>
          <h3 className="font-display text-sm font-semibold">Cookievoorkeuren</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Wij gebruiken cookies om je ervaring te verbeteren. Je kunt je voorkeuren hieronder aanpassen.
          </p>
        </div>

        {showSettings && (
          <div className="space-y-2 rounded-[1rem] border border-border/40 bg-muted/30 p-3">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium">Noodzakelijk</span>
                <p className="text-[0.65rem] text-muted-foreground">Vereist voor de werking van de site</p>
              </div>
              <input type="checkbox" checked disabled className="accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium">Analytisch</span>
                <p className="text-[0.65rem] text-muted-foreground">Helpt ons de site te verbeteren</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="accent-primary"
              />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium">Marketing</span>
                <p className="text-[0.65rem] text-muted-foreground">Gepersonaliseerde advertenties</p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="accent-primary"
              />
            </label>
          </div>
        )}

        <div className="flex items-center gap-2">
          {showSettings ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1 rounded-full text-xs"
              >
                Terug
              </Button>
              <Button
                size="sm"
                onClick={handleSavePreferences}
                className="flex-1 rounded-full text-xs"
              >
                Opslaan
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRejectAll}
                className="rounded-full text-xs"
              >
                Weigeren
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSettings(true)}
                className="rounded-full text-xs"
              >
                Instellingen
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="flex-1 rounded-full text-xs"
              >
                Alles accepteren
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
