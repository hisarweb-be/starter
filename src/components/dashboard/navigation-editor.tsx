"use client"

import { useState, useTransition } from "react"
import { Check, GripVertical, Plus, Trash2 } from "lucide-react"

import { type FooterData } from "@/app/actions/footer"
import { updateNavigationAction, type NavigationItemData } from "@/app/actions/navigation"
import { FooterEditor } from "@/components/dashboard/footer-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type Props = {
  initialFooter: FooterData
  initialNavigation: NavigationItemData[]
}

const defaultNavItems: NavigationItemData[] = [
  { label: "Home", href: "/", sortOrder: 0 },
  { label: "Over ons", href: "/about", sortOrder: 1 },
  { label: "Diensten", href: "/services", sortOrder: 2 },
  { label: "Contact", href: "/contact", sortOrder: 3 },
]

export function NavigationEditor({ initialFooter, initialNavigation }: Props) {
  const [navItems, setNavItems] = useState<NavigationItemData[]>(
    initialNavigation.length > 0 ? initialNavigation : defaultNavItems
  )
  const [isPending, startTransition] = useTransition()
  const [navSaved, setNavSaved] = useState(false)
  const [navMessage, setNavMessage] = useState<string | null>(null)

  function addNavItem() {
    setNavSaved(false)
    setNavMessage(null)
    setNavItems([...navItems, { label: "", href: "", sortOrder: navItems.length }])
  }

  function removeNavItem(index: number) {
    setNavSaved(false)
    setNavMessage(null)
    setNavItems(navItems.filter((_, i) => i !== index))
  }

  function updateNavItem(index: number, field: "label" | "href", value: string) {
    setNavSaved(false)
    setNavMessage(null)
    setNavItems(navItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  function handleNavSave() {
    setNavSaved(false)
    startTransition(async () => {
      try {
        const result = await updateNavigationAction(
          navItems.map((item, index) => ({
            ...item,
            sortOrder: index,
          }))
        )
        setNavSaved(true)
        setNavMessage(
          result.count > 0
            ? `${result.count} menu-items opgeslagen en live beschikbaar voor deze organisatie.`
            : "Navigatie geleegd. De frontend valt nu terug op de standaardruntime."
        )
      } catch (error) {
        setNavSaved(false)
        setNavMessage(error instanceof Error ? error.message : "Opslaan van navigatie is mislukt.")
      }
    })
  }

  return (
    <Tabs defaultValue="navigation" className="space-y-4">
      <TabsList className="rounded-full border border-border/60 bg-card/70 p-1">
        <TabsTrigger value="navigation">Navigatie</TabsTrigger>
        <TabsTrigger value="footer">Footer</TabsTrigger>
      </TabsList>

      <TabsContent value="navigation" className="space-y-4">
        <Card className="surface-card rounded-[1.8rem] border-0 py-0">
          <CardContent className="space-y-3 px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
            <div className="grid gap-4 rounded-[1.4rem] border border-border/60 bg-card/70 p-4 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold text-foreground">Primary navigation</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Deze links sturen header, mobiele navigatie en footer aan zodra de organisatie-runtime actief is.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-border/60 bg-background/80 px-4 py-3">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Richtlijn
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  Houd het menu compact: 4 tot 6 items werkt meestal het best voor conversie en scanbaarheid.
                </p>
              </div>
            </div>

            {navItems.map((item, index) => (
              <div
                key={item.id ?? index}
                className="flex items-center gap-2 rounded-[1.2rem] border border-border/60 bg-background/70 p-3"
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/80 text-muted-foreground">
                  <GripVertical className="size-4" />
                </span>
                <Input
                  value={item.label}
                  onChange={(e) => updateNavItem(index, "label", e.target.value)}
                  placeholder="Label"
                  className="flex-1"
                />
                <Input
                  value={item.href}
                  onChange={(e) => updateNavItem(index, "href", e.target.value)}
                  placeholder="URL (bijv. /over-ons)"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => removeNavItem(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={addNavItem}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Item toevoegen
            </Button>
          </CardContent>
        </Card>

        <div className="surface-panel flex items-center gap-3 rounded-[1.5rem] px-5 py-4">
          <Button onClick={handleNavSave} disabled={isPending}>
            {isPending ? "Opslaan..." : "Opslaan"}
          </Button>
          {navMessage ? (
            <span
              className={cn(
                "text-sm",
                navSaved ? "text-primary" : "text-destructive"
              )}
            >
              {navSaved ? <Check className="mr-1 inline size-4" /> : null}
              {navMessage}
            </span>
          ) : null}
        </div>
      </TabsContent>

      <TabsContent value="footer">
        <FooterEditor initialData={initialFooter} />
      </TabsContent>
    </Tabs>
  )
}
