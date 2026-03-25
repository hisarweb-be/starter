"use client"

import { useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { registerClientAction } from "@/app/actions/client-register"
import { hisarPackages, packageCategoryLabels, packageCategoryOrder } from "@/lib/packages"

type ClientRegisterFormProps = {
  locale: string
}

const steps = ["Bedrijf", "Pakket", "Account"] as const
type Step = 0 | 1 | 2

export function ClientRegisterForm({ locale }: ClientRegisterFormProps) {
  const [step, setStep] = useState<Step>(0)
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const industries = [
    { value: "", label: "Selecteer branche..." },
    { value: "agency", label: "Agency / Bureau" },
    { value: "restaurant", label: "Horeca / Restaurant" },
    { value: "retail", label: "Retail / Winkel" },
    { value: "it", label: "IT / Technologie" },
    { value: "healthcare", label: "Gezondheidszorg" },
    { value: "education", label: "Onderwijs" },
    { value: "finance", label: "Financiële dienstverlening" },
    { value: "other", label: "Anders" },
  ]

  function togglePackage(id: string) {
    setSelectedPackages((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  function canProceedStep0() {
    return companyName.trim().length >= 2
  }

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await registerClientAction({
        companyName,
        email,
        password,
        industry: industry || undefined,
        selectedPackages,
      })

      if (!result.success) {
        setError(result.message)
        return
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.ok) {
        window.location.href = `/${locale}/dashboard`
      } else {
        window.location.href = `/${locale}/login?registered=true`
      }
    })
  }

  // ── Stap indicator ──────────────────────────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
              i < step
                ? "bg-primary text-primary-foreground"
                : i === step
                  ? "border-2 border-primary text-primary"
                  : "border-2 border-muted text-muted-foreground"
            }`}
          >
            {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
          <span
            className={`hidden text-xs font-medium sm:inline ${
              i === step ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-8 transition-all ${
                i < step ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-2xl border border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            Gratis starten
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">Maak je website</CardTitle>
            <CardDescription className="text-base leading-7">
              Registreer je bedrijf en begin direct met het bouwen van je professionele website.
            </CardDescription>
          </div>
          <StepIndicator />
        </CardHeader>

        <CardContent>
          {/* ── Stap 0: Bedrijfsgegevens ── */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Bedrijfsnaam</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Jouw bedrijfsnaam"
                  required
                  minLength={2}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Branche</Label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {industries.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                className="w-full gap-2"
                onClick={() => setStep(1)}
                disabled={!canProceedStep0()}
              >
                Volgende: Pakket kiezen
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* ── Stap 1: Pakket kiezen ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                <span className="font-medium">Kies je pakketten</span>
                <span className="ml-1 text-muted-foreground">
                  — Je kunt ook later pakketten toevoegen of wijzigen.
                </span>
              </div>

              {packageCategoryOrder.map((cat) => {
                const catPackages = hisarPackages.filter((p) => p.category === cat)
                if (catPackages.length === 0) return null
                return (
                  <div key={cat}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {packageCategoryLabels[cat]}
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {catPackages.map((pkg) => {
                        const isSelected = selectedPackages.includes(pkg.id)
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => togglePackage(pkg.id)}
                            className={`relative flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border/60 hover:border-primary/30 hover:bg-accent/20"
                            }`}
                          >
                            {pkg.popular && (
                              <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                Populair
                              </span>
                            )}
                            <div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold">{pkg.name}</p>
                              <p className="text-xs text-muted-foreground">{pkg.shortDescription}</p>
                              <p className="mt-1 text-xs font-semibold text-primary">{pkg.priceLabel}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {selectedPackages.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-muted-foreground">Geselecteerd:</span>
                  {selectedPackages.map((id) => {
                    const pkg = hisarPackages.find((p) => p.id === id)
                    return (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {pkg?.name ?? id}
                      </Badge>
                    )
                  })}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Terug
                </Button>
                <Button className="flex-1 gap-2" onClick={() => setStep(2)}>
                  {selectedPackages.length === 0
                    ? "Overslaan & account aanmaken"
                    : `Doorgaan met ${selectedPackages.length} pakket${selectedPackages.length !== 1 ? "ten" : ""}`}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Stap 2: Account gegevens ── */}
          {step === 2 && (
            <div className="space-y-4">
              {selectedPackages.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Jouw pakketten:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPackages.map((id) => {
                      const pkg = hisarPackages.find((p) => p.id === id)
                      return (
                        <Badge key={id} variant="secondary" className="text-xs">
                          {pkg?.name ?? id}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimaal 8 tekens"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2" disabled={isPending}>
                  <ArrowLeft className="h-4 w-4" />
                  Terug
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleSubmit}
                  disabled={isPending || !email || password.length < 8}
                >
                  {isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Account aanmaken...</>
                  ) : (
                    "Gratis account aanmaken"
                  )}
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Al een account?{" "}
                <a href={`/${locale}/login`} className="text-primary underline">
                  Inloggen
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
