"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Home, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[HisarWeb] Unhandled error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="surface-card flex w-full max-w-lg flex-col items-center rounded-[2rem] px-8 py-14 text-center shadow-lg">
        {/* Inline SVG warning illustration */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-6"
          aria-hidden="true"
        >
          <circle cx="40" cy="40" r="38" className="stroke-muted-foreground/20" strokeWidth="4" />
          <circle cx="40" cy="40" r="28" className="stroke-muted-foreground/10" strokeWidth="2" />
          <path
            d="M40 22L54.5 50H25.5L40 22Z"
            className="fill-destructive/10 stroke-destructive"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="40" y1="32" x2="40" y2="41" className="stroke-destructive" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="40" cy="45.5" r="1.5" className="fill-destructive" />
        </svg>

        {/* Gradient 500 number */}
        <p
          className="font-display text-7xl font-bold tracking-tight"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--destructive)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          500
        </p>

        <h1 className="font-display mt-3 text-2xl font-semibold tracking-tight">
          Er is iets misgegaan
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Een onverwachte fout heeft zich voorgedaan. Probeer het opnieuw of ga terug naar de
          startpagina.
        </p>

        {/* Error digest for bug reporting */}
        {error.digest && (
          <p className="mt-4 rounded-lg bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
            Foutcode: {error.digest}
          </p>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex items-center gap-3">
          <Button onClick={reset} size="lg" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Probeer opnieuw
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Terug naar home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
