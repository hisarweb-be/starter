"use client"

import { AlertCircle, ExternalLink, X } from "lucide-react"
import { useState } from "react"

interface UpdateBannerProps {
  currentVersion: string
  latestTag: string
  releaseUrl?: string | null
  changelog?: string | null
}

export function UpdateBanner({
  currentVersion,
  latestTag,
  releaseUrl,
  changelog,
}: UpdateBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  // Clean up version strings (remove 'v' prefix)
  const cleanCurrent = currentVersion.replace(/^v/, "")
  const cleanLatest = latestTag.replace(/^v/, "")

  if (cleanCurrent === cleanLatest) {
    return null
  }

  return (
    <div className="rounded-[1.3rem] border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">
              🆕 Update beschikbaar
            </h3>
            <p className="mt-1 text-sm text-amber-800">
              Versie {cleanLatest} is nu beschikbaar (je hebt momenteel {cleanCurrent}).
            </p>
            {changelog && (
              <p className="mt-2 line-clamp-2 text-xs text-amber-700/80">
                {changelog}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {releaseUrl && (
                <a
                  href={releaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900 underline"
                >
                  Bekijk release
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-amber-600/60 hover:text-amber-600"
          aria-label="Sluit update melding"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
