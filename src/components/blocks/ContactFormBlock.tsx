"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"

export type ContactFormBlockData = {
  blockType: "contact-form"
  title?: string | null
  subtitle?: string | null
  namePlaceholder?: string | null
  emailPlaceholder?: string | null
  messagePlaceholder?: string | null
  buttonText?: string | null
  successMessage?: string | null
  organizationId?: string | null
}

type ContactFormBlockProps = ContactFormBlockData

export function ContactFormBlock({
  title = "Neem contact op",
  subtitle,
  namePlaceholder = "Uw naam",
  emailPlaceholder = "uw@email.nl",
  messagePlaceholder = "Uw bericht...",
  buttonText = "Versturen",
  successMessage = "Bedankt! We nemen zo snel mogelijk contact op.",
  organizationId,
}: ContactFormBlockProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, organizationId }),
      })
      const data = await res.json() as { success: boolean; message?: string }

      if (data.success) {
        setSent(true)
      } else {
        setError(data.message ?? "Er is een fout opgetreden.")
      }
    })
  }

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          {title && <h2 className="text-3xl font-bold">{title}</h2>}
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>

        {sent ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950/20">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-green-800 dark:text-green-200">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Naam</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={namePlaceholder ?? "Uw naam"}
                  required
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={emailPlaceholder ?? "uw@email.nl"}
                  required
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bericht</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={messagePlaceholder ?? "Uw bericht..."}
                required
                rows={5}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Versturen...
                </>
              ) : (
                (buttonText ?? "Versturen")
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
