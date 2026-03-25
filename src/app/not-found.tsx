import Link from "next/link"
import { Home } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="surface-card flex w-full max-w-lg flex-col items-center rounded-[2rem] px-8 py-14 text-center shadow-lg">
        {/* Inline SVG compass illustration */}
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
          {/* Compass needle */}
          <polygon
            points="40,18 44,40 40,44 36,40"
            className="fill-primary/80"
          />
          <polygon
            points="40,62 36,40 40,36 44,40"
            className="fill-muted-foreground/30"
          />
          {/* Center dot */}
          <circle cx="40" cy="40" r="3" className="fill-primary" />
          {/* Cardinal marks */}
          <circle cx="40" cy="12" r="1.5" className="fill-muted-foreground/40" />
          <circle cx="68" cy="40" r="1.5" className="fill-muted-foreground/40" />
          <circle cx="40" cy="68" r="1.5" className="fill-muted-foreground/40" />
          <circle cx="12" cy="40" r="1.5" className="fill-muted-foreground/40" />
        </svg>

        {/* Gradient 404 number */}
        <p
          className="font-display text-7xl font-bold tracking-tight"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--muted-foreground)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </p>

        <h1 className="font-display mt-3 text-2xl font-semibold tracking-tight">
          Pagina niet gevonden
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          De pagina die je zoekt bestaat niet of is verplaatst. Controleer de URL of ga terug naar
          de startpagina.
        </p>

        {/* Suggested links */}
        <div className="mt-6 w-full max-w-xs">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Populaire pagina&apos;s
          </p>
          <nav className="flex flex-col gap-1.5">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              Startpagina
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              Blog
            </Link>
          </nav>
        </div>

        {/* Action button */}
        <div className="mt-8">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Terug naar home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
