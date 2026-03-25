"use client"

import { useState, type ReactNode } from "react"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ImpersonationBanner } from "@/components/dashboard/impersonation-banner"
import { CommandPalette } from "@/components/dashboard/command-palette"
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { KeyboardShortcutsDialog } from "@/components/dashboard/keyboard-shortcuts-dialog"
import { Sheet, SheetContent } from "@/components/ui/sheet"

type DashboardShellProps = {
  locale: string
  siteName: string
  userName: string
  userEmail: string
  userRole?: string
  isImpersonating?: boolean
  impersonateOrgName?: string
  children: ReactNode
}

export function DashboardShell({
  locale,
  siteName,
  userName,
  userEmail,
  userRole,
  isImpersonating,
  impersonateOrgName,
  children,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          locale={locale}
          siteName={siteName}
          role={userRole}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 border-r-0 bg-transparent p-0 shadow-none">
          <DashboardSidebar
            locale={locale}
            siteName={siteName}
            role={userRole}
            collapsed={false}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {isImpersonating && impersonateOrgName && (
          <ImpersonationBanner orgName={impersonateOrgName} />
        )}
        <DashboardHeader
          userName={userName}
          userEmail={userEmail}
          onMenuToggle={() => setMobileOpen(true)}
        />
        <div className="px-4 pt-3 sm:px-6">
          <Breadcrumbs locale={locale} />
        </div>
        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6">
          {children}
        </main>
        <CommandPalette locale={locale} />
        <KeyboardShortcutsDialog />
      </div>
    </div>
  )
}
