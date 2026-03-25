"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
}

export function MobileNav({
  items,
  loginHref,
  setupHref,
  loginLabel,
  setupLabel,
  dashboardHref,
  dashboardLabel,
}: {
  items: NavItem[]
  loginHref: string
  setupHref: string
  loginLabel: string
  setupLabel: string
  dashboardHref?: string
  dashboardLabel?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="interactive-border rounded-full bg-card/80"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      <div
        className={cn(
          "fixed inset-x-0 top-[104px] z-50 px-4 transition-all duration-200",
          open ? "translate-y-0 opacity-100" : "-translate-y-4 pointer-events-none opacity-0"
        )}
      >
        <div className="surface-panel mx-auto max-w-6xl rounded-[1.75rem] p-3">
          <div className="rounded-[1.25rem] border border-border/60 bg-card/55 px-4 py-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
              Navigation
            </p>
          </div>

          <nav className="mt-3 flex flex-col gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[1.25rem] border border-border/60 bg-card/65 px-4 py-3.5 text-sm font-medium text-foreground hover:bg-white/85"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 border-t border-border/60 pt-4">
              {dashboardHref && dashboardLabel ? (
                <Link
                  href={dashboardHref}
                  className="rounded-[1.25rem] bg-foreground px-4 py-3.5 text-center text-sm font-medium text-background shadow-sm"
                  onClick={() => setOpen(false)}
                >
                  {dashboardLabel}
                </Link>
              ) : null}
              <Link
                href={loginHref}
                className="rounded-[1.25rem] border border-border/60 bg-card/65 px-4 py-3.5 text-center text-sm font-medium text-foreground hover:bg-white/85"
                onClick={() => setOpen(false)}
              >
                {loginLabel}
              </Link>
              <Link
                href={setupHref}
                className="rounded-[1.25rem] bg-primary px-4 py-3.5 text-center text-sm font-medium text-primary-foreground shadow-sm"
                onClick={() => setOpen(false)}
              >
                {setupLabel}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
