"use client"

import { useState, useTransition } from "react"

import { Loader2 } from "lucide-react"
import Link from "next/link"

import { forgotPasswordAction } from "@/app/actions/forgot-password"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ClientForgotPasswordFormProps = {
  locale: string
}

export function ClientForgotPasswordForm({ locale }: ClientForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const response = await forgotPasswordAction(email)
      setResult(response)
    })
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl border border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            Wachtwoord vergeten
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">Wachtwoord opnieuw instellen</CardTitle>
            <CardDescription className="text-base leading-7">
              Vul je e-mailadres in en we sturen je een link om je wachtwoord opnieuw in te stellen.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {result?.success ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                {result.message}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                <Link href={`/${locale}/login`} className="text-primary underline">
                  Terug naar inloggen
                </Link>
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
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

              {result && !result.success && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {result.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isPending || !email}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verwerken...
                  </>
                ) : (
                  "Reset-link versturen"
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Wachtwoord herinnerd?{" "}
                <Link href={`/${locale}/login`} className="text-primary underline">
                  Inloggen
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Keep backward compat export for any existing usage
export { ClientForgotPasswordForm as ForgotPasswordForm }
