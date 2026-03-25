"use client"

import { LayoutDashboard, LogOut, Menu, Search } from "lucide-react"
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"

type DashboardHeaderProps = {
  userName: string
  userEmail: string
  onMenuToggle?: () => void
}

export function DashboardHeader({ userName, userEmail, onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="px-4 pt-4 sm:px-6">
      <div className="surface-panel flex items-center justify-between rounded-[1.75rem] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="interactive-border rounded-full p-2 text-muted-foreground hover:bg-white/80 hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-[1rem] bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                Workspace
              </p>
              <span className="text-sm font-semibold text-foreground">Dashboard</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true })
              window.dispatchEvent(event)
            }}
            className="interactive-border hidden items-center gap-2 rounded-full bg-card/65 px-3 py-2 text-sm text-muted-foreground hover:bg-white/80 hover:text-foreground sm:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">Zoeken...</span>
            <kbd className="rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[0.6rem]">
              {"\u2318K"}
            </kbd>
          </button>
          <div className="hidden rounded-[1.1rem] border border-border/60 bg-card/65 px-4 py-2.5 text-right sm:block">
            <div className="text-sm font-medium">{userName}</div>
            <div className="text-xs text-muted-foreground">{userEmail}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="interactive-border gap-2 rounded-full bg-card/65 px-4 text-muted-foreground hover:bg-white/80 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Uitloggen</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
