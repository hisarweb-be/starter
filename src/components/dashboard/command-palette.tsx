"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Navigation,
  Palette,
  Image,
  Users,
  Settings,
  Plus,
  Upload,
  Search,
  Activity,
  Package,
} from "lucide-react"

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"

type CommandPaletteProps = {
  locale: string
}

const navItems = [
  { href: "/dashboard", label: "Overzicht", icon: LayoutDashboard, shortcut: "" },
  { href: "/dashboard/pages", label: "Pagina's", icon: FileText, shortcut: "" },
  { href: "/dashboard/navigation", label: "Navigatie", icon: Navigation, shortcut: "" },
  { href: "/dashboard/appearance", label: "Uiterlijk", icon: Palette, shortcut: "" },
  { href: "/dashboard/media", label: "Media", icon: Image, shortcut: "" },
  { href: "/dashboard/team", label: "Team", icon: Users, shortcut: "" },
  { href: "/dashboard/activity", label: "Activiteit", icon: Activity, shortcut: "" },
  { href: "/dashboard/modules", label: "Modules", icon: Package, shortcut: "" },
  { href: "/dashboard/settings", label: "Instellingen", icon: Settings, shortcut: "" },
]

const actions = [
  { href: "/dashboard/pages/new", label: "Nieuwe pagina", icon: Plus, shortcut: "N" },
  { href: "/dashboard/media", label: "Media uploaden", icon: Upload, shortcut: "" },
]

export function CommandPalette({ locale }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function navigate(href: string) {
    router.push(`/${locale}${href}`)
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Zoek pagina's, acties, instellingen..." />
      <CommandList>
        <CommandEmpty>Geen resultaten gevonden.</CommandEmpty>

        <CommandGroup heading="Acties">
          {actions.map((item) => (
            <CommandItem key={item.href} onSelect={() => navigate(item.href)}>
              <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              {item.label}
              {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Navigatie">
          {navItems.map((item) => (
            <CommandItem key={item.href} onSelect={() => navigate(item.href)}>
              <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
