"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { locales, type AppLocale } from "@/lib/site"
import { cn } from "@/lib/utils"

function stripLocale(pathname: string) {
  const pattern = new RegExp(`^\/(${locales.join("|")})(?=\/|$)`)
  const match = pathname.match(pattern)
  if (!match) return pathname || "/"
  const stripped = pathname.slice(match[0].length)
  return stripped.length === 0 ? "/" : stripped
}

export function LocaleSwitcher({ locale }: { locale: AppLocale }) {
  const pathname = usePathname()
  const currentPath = stripLocale(pathname || "/")

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card/80 p-1 text-xs font-medium backdrop-blur">
      {locales.map((item) => {
        const href = currentPath === "/" ? `/${item}` : `/${item}${currentPath}`

        return (
          <Link
            key={item}
            href={href}
            className={cn(
              "rounded-full px-3 py-1.5 uppercase transition-colors",
              item === locale
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item}
          </Link>
        )
      })}
    </div>
  )
}
