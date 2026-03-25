"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Package, Puzzle, FileText, Loader2, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { assignPackagesAction } from "@/app/actions/admin"
import {
  hisarPackages,
  looseModules,
  dashboardModules,
  getModulesForPackages,
  packageCategoryLabels,
  packageCategoryOrder,
  type HisarPackage,
} from "@/lib/packages"

type ClientPackagesFormProps = {
  orgId: string
  currentPackages: string[]
  currentLooseModules: string[]
  currentModules: string[]
  currentNotes: string
  currentPlan: string
}

const categoryColors: Record<HisarPackage["category"], string> = {
  websites: "border-violet-200 bg-violet-50 dark:bg-violet-950/20",
  branding: "border-amber-200 bg-amber-50 dark:bg-amber-950/20",
  marketing: "border-green-200 bg-green-50 dark:bg-green-950/20",
  technologie: "border-cyan-200 bg-cyan-50 dark:bg-cyan-950/20",
  modules: "border-slate-200 bg-slate-50 dark:bg-slate-950/20",
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const categoryBadgeColors: Record<HisarPackage["category"], string> = {
  websites: "bg-violet-100 text-violet-700 border-violet-200",
  branding: "bg-amber-100 text-amber-700 border-amber-200",
  marketing: "bg-green-100 text-green-700 border-green-200",
  technologie: "bg-cyan-100 text-cyan-700 border-cyan-200",
  modules: "bg-slate-100 text-slate-700 border-slate-200",
}

export function ClientPackagesForm({
  orgId,
  currentPackages,
  currentLooseModules,
  currentModules,
  currentNotes,
  currentPlan,
}: ClientPackagesFormProps) {
  const [selectedPackages, setSelectedPackages] = useState<string[]>(currentPackages)
  const [selectedLoose, setSelectedLoose] = useState<string[]>(currentLooseModules)
  const [manualModules, setManualModules] = useState<string[]>(
    // Manual modules = modules that are NOT covered by auto-packages
    currentModules.filter((m) => {
      const autoMods = getModulesForPackages(currentPackages)
      return !autoMods.includes(m)
    })
  )
  const [notes, setNotes] = useState(currentNotes)
  const [plan, setPlan] = useState(currentPlan || "starter")
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(packageCategoryOrder)
  )
  const router = useRouter()

  // Preview: welke modules worden ontgrendeld
  const previewModules = Array.from(
    new Set([...getModulesForPackages(selectedPackages), ...manualModules])
  )

  function togglePackage(id: string) {
    setSelectedPackages((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  function toggleLoose(id: string) {
    setSelectedLoose((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  function toggleManualModule(id: string) {
    setManualModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  function handleSave() {
    startTransition(async () => {
      const res = await assignPackagesAction(orgId, {
        packages: selectedPackages,
        looseModules: selectedLoose,
        plan,
        notes,
        manualModules,
      })
      setResult(res)
      router.refresh()
    })
  }

  const grouped = packageCategoryOrder.map((cat) => ({
    category: cat,
    label: packageCategoryLabels[cat],
    packages: hisarPackages.filter((p) => p.category === cat),
  }))

  return (
    <div className="space-y-8">
      {/* ── Pakketten ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">HisarWeb Pakketten</h2>
          <Badge variant="secondary" className="ml-1">{selectedPackages.length} geselecteerd</Badge>
        </div>

        {grouped.map(({ category, label, packages }) => (
          <div key={category} className="overflow-hidden rounded-[1.4rem] border border-border/60">
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50 ${categoryColors[category]}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-xs text-muted-foreground">
                  ({packages.filter((p) => selectedPackages.includes(p.id)).length}/{packages.length} geselecteerd)
                </span>
              </div>
              {expandedCategories.has(category) ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {expandedCategories.has(category) && (
              <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
                {packages.map((pkg) => {
                  const isSelected = selectedPackages.includes(pkg.id)
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => togglePackage(pkg.id)}
                      className={`group relative flex flex-col gap-2 rounded-[1.2rem] border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/60 hover:border-primary/30 hover:bg-accent/20"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                          Populair
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{pkg.name}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                            {pkg.shortDescription}
                          </p>
                          <p className="mt-1.5 text-xs font-semibold text-primary">
                            {pkg.priceLabel}
                          </p>
                        </div>
                      </div>
                      {isSelected && pkg.includedModules.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1 pl-8">
                          {pkg.includedModules.map((mod) => (
                            <span key={mod} className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                              +{mod}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Losse Modules ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Puzzle className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Losse Modules (Add-ons)</h2>
          <Badge variant="secondary" className="ml-1">{selectedLoose.length} geselecteerd</Badge>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {looseModules.map((mod) => {
            const isSelected = selectedLoose.includes(mod.id)
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => toggleLoose(mod.id)}
              className={`flex items-center gap-3 rounded-[1.2rem] border p-3 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border/60 hover:border-primary/30 hover:bg-accent/20"
                }`}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{mod.name}</p>
                  <p className="text-xs text-muted-foreground">{mod.priceLabel}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Handmatige Module Override ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Dashboard Modules (Handmatig)</h2>
          <span className="text-xs text-muted-foreground">Extra modules los van pakketten</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {dashboardModules.map((mod) => {
            const isAutoEnabled = getModulesForPackages(selectedPackages).includes(mod.id)
            const isManual = manualModules.includes(mod.id)
            const isActive = isAutoEnabled || isManual

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => !isAutoEnabled && toggleManualModule(mod.id)}
                disabled={isAutoEnabled}
                className={`flex items-center gap-2 rounded-[1.2rem] border p-2.5 text-left transition-all ${
                  isAutoEnabled
                    ? "cursor-default border-green-200 bg-green-50 dark:bg-green-950/20"
                    : isManual
                      ? "border-primary bg-primary/5"
                      : "border-border/60 hover:border-primary/30"
                }`}
              >
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isActive
                      ? "border-green-500 bg-green-500"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isActive && <CheckCircle2 className="h-3 w-3 text-white" />}
                </div>
                <span className="text-xs font-medium leading-tight">{mod.label}</span>
                {isAutoEnabled && (
                  <span className="ml-auto text-xs text-green-600">auto</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Preview ── */}
      {previewModules.length > 0 && (
        <Card className="surface-card rounded-[1.6rem] border-0 bg-primary/5 py-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Preview: Actieve Dashboard Modules</CardTitle>
            <CardDescription className="text-xs">
              Deze {previewModules.length} modules worden ingeschakeld voor de klant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {previewModules.map((modId) => {
                const mod = dashboardModules.find((m) => m.id === modId)
                return (
                  <Badge key={modId} variant="secondary" className="text-xs">
                    {mod?.label ?? modId}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Plan & Notities ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Plan / Tier</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="starter">Starter (Gratis)</option>
            <option value="website">Website</option>
            <option value="website-pro">Website Pro</option>
            <option value="webshop">Webshop</option>
            <option value="marketing">Marketing</option>
            <option value="enterprise">Enterprise</option>
            <option value="custom">Op maat</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Interne notities</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notities over offerte, afspraken, projectscope..."
            rows={3}
            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* ── Save ── */}
      {result && (
        <div
          className={`rounded-[1.2rem] border px-4 py-3 text-sm ${
            result.success
              ? "border-green-200 bg-green-50 text-green-800 dark:bg-green-950/20"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="surface-panel flex flex-col gap-4 rounded-[1.6rem] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Geselecteerde pakketten sturen automatisch modules, plan en unlocks voor deze klant aan.
        </p>
        <Button onClick={handleSave} disabled={isPending} className="gap-2 w-full sm:w-auto">
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Opslaan...</>
        ) : (
          "Pakketten & modules opslaan"
        )}
        </Button>
      </div>
    </div>
  )
}
