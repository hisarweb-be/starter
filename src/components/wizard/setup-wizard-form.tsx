"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Database,
  ExternalLink,
  Globe2,
  Layers3,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { saveWizardConfigAction } from "@/app/actions/wizard"
import { LogoUploadField } from "@/components/forms/logo-upload-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { brandPalettes } from "@/lib/colors"
import { localeLabelMap, locales } from "@/lib/site"
import {
  moduleOptions,
  socialProviderOptions,
  wizardConfigSchema,
  wizardDefaultValues,
  type WizardConfigInput,
} from "@/lib/wizard"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "hisarweb-setup-wizard"

const stepDefinitions: Array<{
  id: string
  title: string
  eyebrow: string
  description: string
  fields: Array<keyof WizardConfigInput>
}> = [
  {
    id: "welcome",
    title: "Welkom",
    eyebrow: "Foundation",
    description: "Leg de admin-basis en de projectidentiteit vast.",
    fields: ["siteName", "adminEmail", "adminPassword"],
  },
  {
    id: "database",
    title: "Database",
    eyebrow: "Infrastructure",
    description: "Kies de opslaglaag die past bij jouw delivery-model.",
    fields: ["databaseProvider", "databaseUrl"],
  },
  {
    id: "industry",
    title: "Branche",
    eyebrow: "Positioning",
    description: "Start vanuit een sectorsjabloon voor snellere, slimmere defaults.",
    fields: ["industry"],
  },
  {
    id: "branding",
    title: "Branding",
    eyebrow: "Art direction",
    description: "Bepaal kleur, thema en visuele toon van de starter.",
    fields: ["accentColor", "fontPreset", "themeMode"],
  },
  {
    id: "modules",
    title: "Modules",
    eyebrow: "Feature stack",
    description: "Activeer alleen de blokken die bijdragen aan een strakke scope.",
    fields: ["modules"],
  },
  {
    id: "auth",
    title: "Authenticatie",
    eyebrow: "Access model",
    description: "Definieer registratie en loginflows zonder later te moeten herbedraden.",
    fields: [],
  },
  {
    id: "languages",
    title: "Talen",
    eyebrow: "Localization",
    description: "Zet de juiste marktdekking klaar vanaf dag één.",
    fields: ["defaultLocale", "extraLocales"],
  },
  {
    id: "confirm",
    title: "Bevestigen",
    eyebrow: "Launch ready",
    description: "Controleer de blueprint en schrijf de configuratie weg.",
    fields: [],
  },
]

const databaseOptions = [
  {
    value: "postgresql",
    title: "PostgreSQL",
    description: "De aanbevolen productieroute voor schaal, teams en Payload.",
  },
  {
    value: "sqlite",
    title: "SQLite",
    description: "Lichtgewicht setup voor snelle lokale demo's en eerste validatie.",
  },
] as const

const industryPresets = [
  {
    id: "agency",
    title: "Agency / consultancy",
    description: "Sterke expertise-positionering met services, cases en contact.",
    modules: ["homepage", "services", "about", "contact"] as WizardConfigInput["modules"],
    accentColor: "#1664d8",
    fontPreset: "manrope",
  },
  {
    id: "restaurant",
    title: "Restaurant / hospitality",
    description: "Visuele merkbeleving met menulogica, FAQ en snelle contactroute.",
    modules: ["homepage", "services", "portfolio", "contact"] as WizardConfigInput["modules"],
    accentColor: "#d97706",
    fontPreset: "manrope",
  },
  {
    id: "portfolio",
    title: "Creatief portfolio",
    description: "Minimalistische showcase met veel ruimte voor werk en storytelling.",
    modules: ["homepage", "portfolio", "about", "contact"] as WizardConfigInput["modules"],
    accentColor: "#0d9488",
    fontPreset: "geist",
  },
  {
    id: "saas",
    title: "SaaS / tech",
    description: "Conversiegerichte productsite met pricing, FAQ en multi-locale groei.",
    modules: ["homepage", "services", "pricing", "faq"] as WizardConfigInput["modules"],
    accentColor: "#4f46e5",
    fontPreset: "geist",
  },
  {
    id: "custom",
    title: "Custom starting point",
    description: "Vrije configuratie voor teams die zelf hun mix willen samenstellen.",
    modules: ["homepage", "contact", "about"] as WizardConfigInput["modules"],
    accentColor: "#1664d8",
    fontPreset: "manrope",
  },
] as const

const wizardFontOptions = [
  {
    value: "manrope",
    label: "Manrope",
    description: "Heldere, premium body-typografie voor commerciële flows.",
  },
  {
    value: "geist",
    label: "Geist",
    description: "Strakke product-esthetiek voor tech- en dashboardgedreven merken.",
  },
  {
    value: "inter",
    label: "Inter",
    description: "Neutrale fallback voor teams die al een minimalistisch systeem hebben.",
  },
] as const

const themeModes = [
  { value: "system", label: "Systeem", description: "Volgt automatisch de voorkeur van de gebruiker." },
  { value: "light", label: "Licht", description: "Kiest voor een heldere, editorial first impression." },
  { value: "dark", label: "Donker", description: "Meer contrast en een meer uitgesproken productgevoel." },
] as const

const fontVariableMap: Record<string, string> = {
  manrope: "var(--font-manrope), system-ui, sans-serif",
  geist: "var(--font-geist-sans), system-ui, sans-serif",
  inter: "var(--font-inter), system-ui, sans-serif",
}

const stepIcons = [Sparkles, Database, Wand2, Palette, Layers3, ShieldCheck, Globe2, Rocket]

export function SetupWizardForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const [resultState, setResultState] = useState<"success" | "error" | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<WizardConfigInput>({
    resolver: zodResolver(wizardConfigSchema),
    defaultValues: wizardDefaultValues,
  })

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      form.reset({ ...wizardDefaultValues, ...JSON.parse(raw) })
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [form])

  useEffect(() => {
    const subscription = form.watch((nextValues) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValues))
    })

    return () => subscription.unsubscribe()
  }, [form])

  const values = form.watch()
  const currentStepConfig = stepDefinitions[currentStep]
  const progress = Math.round((currentStep / (stepDefinitions.length - 1)) * 100)
  const completedSteps = currentStep
  const selectedModules = values.modules ?? []
  const selectedProviders = values.socialProviders ?? []
  const activeLocales = Array.from(new Set([values.defaultLocale, ...(values.extraLocales ?? [])]))
  const selectedPreset =
    industryPresets.find((preset) => preset.id === values.industry) ??
    industryPresets.find((preset) => preset.id === "custom")!

  const recommendedModules = selectedPreset.modules
  const isRecommendedSet =
    recommendedModules.length > 0 &&
    recommendedModules.every((module) => selectedModules.includes(module))

  const launchSummary = useMemo(
    () => [
      { label: "Site", value: values.siteName || "Starter" },
      { label: "Modules", value: String(selectedModules.length || 0) },
      { label: "Talen", value: String(activeLocales.length || 1) },
    ],
    [activeLocales.length, selectedModules.length, values.siteName]
  )

  async function handleNextStep() {
    const fields = currentStepConfig.fields
    const isValid = fields.length === 0 ? true : await form.trigger(fields)
    if (!isValid) return

    setCurrentStep((step) => Math.min(stepDefinitions.length - 1, step + 1))
  }

  async function handleJumpToStep(nextStep: number) {
    if (nextStep <= currentStep) {
      setCurrentStep(nextStep)
      return
    }

    const fields = currentStepConfig.fields
    const isValid = fields.length === 0 ? true : await form.trigger(fields)
    if (isValid) {
      setCurrentStep(nextStep)
    }
  }

  function applyIndustryPreset(presetId: (typeof industryPresets)[number]["id"]) {
    const preset = industryPresets.find((item) => item.id === presetId)
    if (!preset) return

    form.setValue("industry", preset.id, { shouldDirty: true, shouldValidate: true })
    form.setValue("modules", [...preset.modules], { shouldDirty: true, shouldValidate: true })
    form.setValue("accentColor", preset.accentColor, { shouldDirty: true, shouldValidate: true })
    form.setValue("fontPreset", preset.fontPreset, { shouldDirty: true, shouldValidate: true })
  }

  function toggleModule(module: (typeof moduleOptions)[number]) {
    const next = new Set(selectedModules)

    if (next.has(module)) {
      next.delete(module)
    } else {
      next.add(module)
    }

    form.setValue("modules", Array.from(next) as WizardConfigInput["modules"], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function toggleProvider(provider: (typeof socialProviderOptions)[number]) {
    const next = new Set(selectedProviders)

    if (next.has(provider)) {
      next.delete(provider)
    } else {
      next.add(provider)
    }

    form.setValue("socialProviders", Array.from(next) as WizardConfigInput["socialProviders"], {
      shouldDirty: true,
    })
  }

  function toggleExtraLocale(locale: (typeof locales)[number]) {
    const next = new Set(values.extraLocales ?? [])

    if (next.has(locale)) {
      next.delete(locale)
    } else {
      next.add(locale)
    }

    form.setValue("extraLocales", Array.from(next) as WizardConfigInput["extraLocales"], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const generatePassword = useCallback(() => {
    const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*"
    let pw = ""
    const array = new Uint32Array(16)
    crypto.getRandomValues(array)
    for (let i = 0; i < 16; i++) pw += chars[array[i] % chars.length]
    form.setValue("adminPassword", pw, { shouldDirty: true, shouldValidate: true })
  }, [form])

  async function handleSubmit(submittedValues: WizardConfigInput) {
    startTransition(async () => {
      try {
        const result = await saveWizardConfigAction(submittedValues)
        setResultMessage(result.message)
        setResultState(result.success ? "success" : "error")

        if (result.success) {
          window.localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        setResultMessage(
          "Er ging iets mis bij het opslaan. Controleer de databaseverbinding en probeer opnieuw."
        )
        setResultState("error")
      }
    })
  }

  if (resultState === "success") {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:py-14">
        <section className="surface-panel rounded-[2rem] px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-8 text-primary" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              Setup voltooid!
            </h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              De configuratie is opgeslagen. Volg onderstaande stappen om je site live te zetten.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <SetupNextStep
              step={1}
              title="Stel de environment variable in"
              description="Ga naar Vercel → Project Settings → Environment Variables en voeg toe:"
            >
              <CopyableCode value="NEXT_PUBLIC_SETUP_COMPLETE=true" />
            </SetupNextStep>

            <SetupNextStep
              step={2}
              title="Redeploy de applicatie"
              description="Na het instellen van de env var, klik op Redeploy in Vercel zodat de wijziging actief wordt."
            />

            <SetupNextStep
              step={3}
              title="Login als admin"
              description="Gebruik je admin credentials om in te loggen op het dashboard:"
            >
              <div className="mt-2 space-y-1.5">
                <CopyableCode value={values.adminEmail} label="Email" />
                <p className="text-xs text-muted-foreground">
                  Wachtwoord: het wachtwoord dat je in stap 1 hebt ingesteld.
                </p>
              </div>
            </SetupNextStep>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() => {
                setResultState(null)
                setResultMessage(null)
              }}
            >
              <ChevronLeft className="mr-2 size-4" />
              Terug naar wizard
            </Button>
            <Link
              href="/nl/login"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Naar login
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:py-14">
      <section className="surface-panel grid gap-6 rounded-[2rem] px-5 py-5 sm:px-6 sm:py-6 lg:grid-cols-[0.84fr_1.16fr]">
        <aside className="space-y-5">
          <div className="space-y-4 rounded-[1.75rem] border border-border/60 bg-card/70 p-5">
            <span className="eyebrow-label">Setup orchestration</span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-balance">
                Configureer een starter die er meteen productwaardig uitziet.
              </h1>
              <p className="text-sm leading-7 text-muted-foreground">
                Deze wizard bewaart voortgang lokaal, valideert stap per stap en zet de juiste
                defaults klaar voor branding, modules, auth en talen.
              </p>
            </div>

            <div className="space-y-3 rounded-[1.35rem] border border-border/60 bg-muted/45 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Launch progress</span>
                <span className="font-mono text-muted-foreground">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-background/80">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {launchSummary.map((item) => (
                  <div key={item.label}>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {stepDefinitions.map((step, index) => {
              const Icon = stepIcons[index]
              const isActive = index === currentStep
              const isComplete = index < completedSteps

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => void handleJumpToStep(index)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-[1.5rem] border px-4 py-4 text-left transition-all",
                    isActive
                      ? "border-primary bg-primary/7 shadow-[0_20px_50px_-35px_rgba(22,100,216,0.55)]"
                      : "border-border/60 bg-card/60 hover:bg-card/85",
                    index > currentStep ? "opacity-70" : ""
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-[1rem]",
                      isActive || isComplete
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isComplete ? <Check className="size-4" /> : <Icon className="size-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Stap {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block text-base font-semibold text-foreground">
                      {step.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="surface-card rounded-[1.6rem] p-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
              Current blueprint
            </p>
            <div className="mt-4 space-y-3">
              <SummaryPreview label="Sector" value={selectedPreset.title} />
              <SummaryPreview label="Kleur" value={values.accentColor} />
              <SummaryPreview label="Auth" value={values.allowRegistration ? "Open" : "Admin-first"} />
            </div>
          </div>
        </aside>

        <Card className="surface-card rounded-[1.9rem] border-0 py-0">
          <CardHeader className="space-y-4 px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
                  {currentStepConfig.eyebrow}
                </p>
                <CardTitle className="mt-2 text-3xl">{currentStepConfig.title}</CardTitle>
              </div>
              <div className="rounded-full border border-border/60 bg-muted/45 px-4 py-2 text-sm text-muted-foreground">
                Stap {currentStep + 1} van {stepDefinitions.length}
              </div>
            </div>
            <CardDescription className="max-w-3xl text-sm leading-7">
              {currentStepConfig.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {currentStep === 0 ? (
                <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <Field>
                      <Label htmlFor="siteName">Website naam</Label>
                      <Input
                        id="siteName"
                        {...form.register("siteName")}
                        className="h-11 rounded-2xl bg-background/75"
                      />
                      <FieldError message={form.formState.errors.siteName?.message} />
                    </Field>
                    <Field>
                      <Label htmlFor="adminEmail">Admin email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        {...form.register("adminEmail")}
                        className="h-11 rounded-2xl bg-background/75"
                      />
                      <FieldError message={form.formState.errors.adminEmail?.message} />
                    </Field>
                    <Field>
                      <Label htmlFor="adminPassword">Admin wachtwoord</Label>
                      <div className="flex gap-2">
                        <Input
                          id="adminPassword"
                          type="text"
                          placeholder="Minimaal 8 tekens"
                          {...form.register("adminPassword")}
                          className="h-11 flex-1 rounded-2xl bg-background/75"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 shrink-0 rounded-2xl"
                          onClick={generatePassword}
                        >
                          <Wand2 className="mr-2 size-4" />
                          Genereer
                        </Button>
                      </div>
                      <FieldError message={form.formState.errors.adminPassword?.message} />
                    </Field>
                  </div>

                  <div className="rounded-[1.5rem] border border-border/60 bg-muted/40 p-5">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Why this matters
                    </p>
                    <div className="mt-4 space-y-3">
                      {[
                        "Een duidelijke sitenaam voorkomt rommel in metadata en dashboardlabels.",
                        "Dit admin-account wordt het ankerpunt voor setup lock en beheer.",
                        "De wizard onthoudt je invoer lokaal, dus je kan veilig itereren.",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep === 1 ? (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    {databaseOptions.map((option) => (
                      <OptionCard
                        key={option.value}
                        active={values.databaseProvider === option.value}
                        onClick={() =>
                          form.setValue("databaseProvider", option.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        title={option.title}
                        description={option.description}
                      />
                    ))}
                  </div>
                  <Field>
                    <Label htmlFor="databaseUrl">Database connectie</Label>
                    <Textarea
                      id="databaseUrl"
                      rows={5}
                      {...form.register("databaseUrl")}
                      className="rounded-[1.5rem] bg-background/75 font-mono text-sm"
                    />
                    <FieldError message={form.formState.errors.databaseUrl?.message} />
                  </Field>
                </div>
              ) : null}

              {currentStep === 2 ? (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    {industryPresets.map((preset) => (
                      <OptionCard
                        key={preset.id}
                        active={values.industry === preset.id}
                        onClick={() => applyIndustryPreset(preset.id)}
                        title={preset.title}
                        description={preset.description}
                        badge={`${preset.modules.length} modules`}
                      />
                    ))}
                  </div>

                  <div className="rounded-[1.6rem] border border-border/60 bg-muted/40 p-5">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Suggested stack
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {recommendedModules.map((module) => (
                        <span
                          key={module}
                          className="rounded-full border border-border/60 bg-card/80 px-3 py-2 text-sm text-muted-foreground"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      De preset zet ook meteen een passende kleur en font-voorkeur klaar, zodat je
                      sneller tot een coherente starter komt.
                    </p>
                  </div>
                </div>
              ) : null}

              {currentStep === 3 ? (
                <div className="space-y-6">
                  {/* — Live Preview — */}
                  <div className="rounded-[1.6rem] border border-border/60 bg-card/70 p-5">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Live preview
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {/* Light preview */}
                      <div className="rounded-[1.25rem] border border-border/40 bg-white p-4">
                        <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-zinc-400">
                          Light mode
                        </p>
                        <div
                          className="rounded-xl px-4 py-4 text-white shadow-sm"
                          style={{
                            backgroundColor: values.accentColor,
                            fontFamily: fontVariableMap[values.fontPreset] ?? fontVariableMap.manrope,
                          }}
                        >
                          <p className="text-lg font-semibold">
                            {values.siteName || "Starter"}
                          </p>
                          <p className="mt-1 text-sm text-white/80">
                            Premium starter, klaar voor launch.
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="size-3 rounded-full" style={{ backgroundColor: values.accentColor }} />
                          <span className="font-mono text-xs text-zinc-500">{values.accentColor}</span>
                          <span className="ml-auto text-xs text-zinc-400">{values.fontPreset}</span>
                        </div>
                      </div>
                      {/* Dark preview */}
                      <div className="rounded-[1.25rem] border border-zinc-700/60 bg-zinc-950 p-4">
                        <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-zinc-500">
                          Dark mode
                        </p>
                        <div
                          className="rounded-xl px-4 py-4 text-white shadow-sm"
                          style={{
                            backgroundColor: values.accentColorDark || values.accentColor,
                            fontFamily: fontVariableMap[values.fontPreset] ?? fontVariableMap.manrope,
                          }}
                        >
                          <p className="text-lg font-semibold">
                            {values.siteName || "Starter"}
                          </p>
                          <p className="mt-1 text-sm text-white/80">
                            Premium starter, klaar voor launch.
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className="size-3 rounded-full"
                            style={{ backgroundColor: values.accentColorDark || values.accentColor }}
                          />
                          <span className="font-mono text-xs text-zinc-500">
                            {values.accentColorDark || values.accentColor}
                          </span>
                          <span className="ml-auto text-xs text-zinc-500">{values.fontPreset}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* — Accent kleuren — */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field>
                      <Label htmlFor="accentColor">Accent kleur (licht)</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="accentColor"
                          type="color"
                          {...form.register("accentColor")}
                          className="h-11 w-14 rounded-2xl bg-background/75 p-1.5"
                        />
                        <Input
                          value={values.accentColor}
                          onChange={(event) =>
                            form.setValue("accentColor", event.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          className="h-11 rounded-2xl bg-background/75 font-mono"
                        />
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {brandPalettes.map((palette) => (
                          <button
                            key={palette.color}
                            type="button"
                            onClick={() =>
                              form.setValue("accentColor", palette.color, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                            className={cn(
                              "size-8 rounded-full border-2 border-white/80 shadow-sm transition-transform",
                              values.accentColor === palette.color ? "scale-110 ring-4 ring-primary/20" : ""
                            )}
                            style={{ backgroundColor: palette.color }}
                            aria-label={palette.name}
                          />
                        ))}
                      </div>
                      <FieldError message={form.formState.errors.accentColor?.message} />
                    </Field>

                    <Field>
                      <Label htmlFor="accentColorDark">Accent kleur (donker)</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="accentColorDark"
                          type="color"
                          value={values.accentColorDark || values.accentColor}
                          onChange={(event) =>
                            form.setValue("accentColorDark", event.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          className="h-11 w-14 rounded-2xl bg-background/75 p-1.5"
                        />
                        <Input
                          value={values.accentColorDark || values.accentColor}
                          onChange={(event) =>
                            form.setValue("accentColorDark", event.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          className="h-11 rounded-2xl bg-background/75 font-mono"
                        />
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {brandPalettes.map((palette) => (
                          <button
                            key={`dark-${palette.color}`}
                            type="button"
                            onClick={() =>
                              form.setValue("accentColorDark", palette.color, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                            className={cn(
                              "size-8 rounded-full border-2 border-white/80 shadow-sm transition-transform",
                              (values.accentColorDark || values.accentColor) === palette.color
                                ? "scale-110 ring-4 ring-primary/20"
                                : ""
                            )}
                            style={{ backgroundColor: palette.color }}
                            aria-label={`Dark: ${palette.name}`}
                          />
                        ))}
                      </div>
                      <FieldError message={form.formState.errors.accentColorDark?.message} />
                    </Field>
                  </div>

                  {/* — Thema modus — */}
                  <div className="space-y-3">
                    <Label>Thema modus</Label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {themeModes.map((mode) => (
                        <OptionCard
                          key={mode.value}
                          active={values.themeMode === mode.value}
                          onClick={() =>
                            form.setValue("themeMode", mode.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          title={mode.label}
                          description={mode.description}
                        />
                      ))}
                    </div>
                  </div>

                  {/* — Font preset — */}
                  <div className="space-y-3">
                    <Label>Font preset</Label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {wizardFontOptions.map((font) => (
                        <OptionCard
                          key={font.value}
                          active={values.fontPreset === font.value}
                          onClick={() =>
                            form.setValue("fontPreset", font.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          title={font.label}
                          description={font.description}
                        />
                      ))}
                    </div>
                  </div>

                  {/* — Logo — */}
                  <Field>
                    <Label htmlFor="logoUrl">Logo</Label>
                    <LogoUploadField
                      value={values.logoUrl ?? ""}
                      onChange={(nextValue) => {
                        form.setValue("logoUrl", nextValue, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }}
                    />
                  </Field>
                </div>
              ) : null}

              {currentStep === 4 ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        form.setValue("modules", [...recommendedModules], {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      Gebruik sector-aanbeveling
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {isRecommendedSet
                        ? "De aanbevolen modulemix is actief."
                        : "Je kan de sector-aanbeveling als basis gebruiken en daarna verfijnen."}
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {moduleOptions.map((module) => {
                      const isActive = selectedModules.includes(module)
                      const isRecommended = recommendedModules.includes(module)

                      return (
                        <button
                          key={module}
                          type="button"
                          onClick={() => toggleModule(module)}
                          className={cn(
                            "rounded-[1.4rem] border px-4 py-4 text-left transition-all",
                            isActive
                              ? "border-primary bg-primary/7"
                              : "border-border/60 bg-card/65 hover:bg-card/85"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-base font-semibold capitalize">{module}</span>
                            <span
                              className={cn(
                                "inline-flex size-6 items-center justify-center rounded-full border",
                                isActive
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border/70 bg-background"
                              )}
                            >
                              {isActive ? <Check className="size-3.5" /> : null}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {isRecommended
                              ? "Aanbevolen voor de gekozen sector."
                              : "Beschikbaar als optionele uitbreiding in de starter."}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                  <FieldError message={form.formState.errors.modules?.message} />
                </div>
              ) : null}

              {currentStep === 5 ? (
                <div className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <ToggleCard
                      title="Openbare registratie"
                      description="Laat bezoekers zelf een account aanmaken."
                      checked={values.allowRegistration}
                      onChange={(checked) =>
                        form.setValue("allowRegistration", checked, { shouldDirty: true })
                      }
                    />
                    <ToggleCard
                      title="Magic link login"
                      description="Bied passwordless login via e-mail aan."
                      checked={values.allowMagicLink}
                      onChange={(checked) =>
                        form.setValue("allowMagicLink", checked, { shouldDirty: true })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Social providers</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {socialProviderOptions.map((provider) => (
                        <OptionCard
                          key={provider}
                          active={selectedProviders.includes(provider)}
                          onClick={() => toggleProvider(provider)}
                          title={provider.charAt(0).toUpperCase() + provider.slice(1)}
                          description="Kan later verder worden afgewerkt met client ID en secret."
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep === 6 ? (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label>Standaard taal</Label>
                    <div className="grid gap-3 md:grid-cols-3">
                      {locales.map((locale) => (
                        <OptionCard
                          key={locale}
                          active={values.defaultLocale === locale}
                          onClick={() =>
                            form.setValue("defaultLocale", locale, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          title={localeLabelMap[locale]}
                          description={`Primaire route: /${locale}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Extra talen</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {locales.map((locale) => (
                        <ToggleCard
                          key={locale}
                          title={localeLabelMap[locale]}
                          description={`Activeer ${locale.toUpperCase()} als extra locale.`}
                          checked={(values.extraLocales ?? []).includes(locale)}
                          onChange={() => toggleExtraLocale(locale)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-border/60 bg-muted/40 p-5">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Launch coverage
                    </p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Deze starter zal live klaarstaan in {activeLocales.length} taal
                      {activeLocales.length === 1 ? "" : "en"}: {activeLocales.join(", ")}.
                    </p>
                  </div>
                </div>
              ) : null}

              {currentStep === 7 ? (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <SummaryItem label="Site" value={values.siteName} />
                    <SummaryItem label="Admin" value={values.adminEmail} />
                    <SummaryItem
                      label="Database"
                      value={`${values.databaseProvider} · ${values.databaseUrl}`}
                    />
                    <SummaryItem label="Sector" value={selectedPreset.title} />
                    <SummaryItem label="Branding" value={`${values.fontPreset} · ${values.themeMode}`} />
                    <SummaryItem
                      label="Accent"
                      value={
                        values.accentColorDark
                          ? `${values.accentColor} / ${values.accentColorDark}`
                          : values.accentColor
                      }
                    />
                    <SummaryItem
                      label="Modules"
                      value={selectedModules.length > 0 ? selectedModules.join(", ") : "Geen"}
                    />
                    <SummaryItem label="Talen" value={activeLocales.join(", ")} />
                  </div>

                  <div className="rounded-[1.6rem] border border-primary/20 bg-primary/7 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          Klaar om de configuratie op te slaan.
                        </p>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          Na opslaan wordt deze blueprint gebruikt als runtime basis voor site-instellingen,
                          auth-voorkeuren en locale-setup.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isPending}
                        className="shrink-0 rounded-2xl"
                      >
                        <Rocket className="mr-2 size-4" />
                        {isPending ? "Opslaan..." : "Website genereren"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              {resultMessage && resultState === "error" ? (
                <div className="rounded-[1.5rem] border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {resultMessage}
                </div>
              ) : null}

              <div className="flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Voortgang wordt lokaal bewaard terwijl je werkt.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
                    disabled={currentStep === 0 || isPending}
                  >
                    <ChevronLeft className="size-4" />
                    Vorige
                  </Button>

                  {currentStep < stepDefinitions.length - 1 ? (
                    <Button type="button" onClick={() => void handleNextStep()} disabled={isPending}>
                      Volgende
                      <ChevronRight className="size-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Opslaan..." : "Website genereren"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function Field({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("space-y-2", className)}>{children}</div>
}

function FieldError({
  message,
  className,
}: {
  message?: string
  className?: string
}) {
  if (!message) return null
  return <p className={cn("text-sm text-destructive", className)}>{message}</p>
}

function OptionCard({
  active,
  title,
  description,
  badge,
  onClick,
}: {
  active: boolean
  title: string
  description: string
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[1.4rem] border px-4 py-4 text-left transition-all",
        active ? "border-primary bg-primary/7" : "border-border/60 bg-card/65 hover:bg-card/85"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <span
          className={cn(
            "inline-flex size-6 shrink-0 items-center justify-center rounded-full border",
            active ? "border-primary bg-primary text-primary-foreground" : "border-border/70 bg-background"
          )}
        >
          {active ? <Check className="size-3.5" /> : null}
        </span>
      </div>
      {badge ? (
        <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
          {badge}
        </p>
      ) : null}
    </button>
  )
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center justify-between gap-4 rounded-[1.4rem] border px-4 py-4 text-left transition-all",
        checked ? "border-primary bg-primary/7" : "border-border/60 bg-card/65 hover:bg-card/85"
      )}
    >
      <div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <span
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </span>
    </button>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-border/60 bg-card/70 px-4 py-4">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-foreground">{value || "—"}</p>
    </div>
  )
}

function SummaryPreview({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-border/60 bg-background/70 px-4 py-3">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

function SetupNextStep({
  step,
  title,
  description,
  children,
}: {
  step: number
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex gap-4 rounded-[1.5rem] border border-border/60 bg-card/70 p-5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {step}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  )
}

function CopyableCode({ value, label }: { value: string; label?: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/50 px-3 py-2">
      {label ? (
        <span className="shrink-0 text-xs text-muted-foreground">{label}:</span>
      ) : null}
      <code className="flex-1 truncate font-mono text-sm text-foreground">{value}</code>
      <button
        type="button"
        onClick={() => void navigator.clipboard.writeText(value)}
        className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        aria-label="Kopieer"
      >
        <Copy className="size-3.5" />
      </button>
    </div>
  )
}
