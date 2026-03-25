"use client"

import { useState, useTransition } from "react"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { resetPasswordAction } from "@/app/actions/reset-password"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ResetPasswordFormProps = {
  locale: string
  token: string
}

export function ResetPasswordForm({ locale, token }: ResetPasswordFormProps) {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-4 py-16">
        <Card className="w-full max-w-xl border border-border/70 bg-card/90 shadow-sm">
          <CardContent className="pt-6">
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Ongeldige of ontbrekende reset-link. Vraag een nieuwe aan via{" "}
              <Link href={`/${locale}/forgot-password`} className="underline">
                wachtwoord vergeten
              </Link>
              .
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.")
      return
    }

    if (newPassword.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens zijn.")
      return
    }

    startTransition(async () => {
      const result = await resetPasswordAction(token, newPassword)
      if (result.success) {
        router.push(`/${locale}/login?reset=true`)
      } else {
        setError(result.message ?? "Er is een fout opgetreden.")
      }
    })
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl border border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            Nieuw wachtwoord
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">Wachtwoord opnieuw instellen</CardTitle>
            <CardDescription className="text-base leading-7">
              Kies een nieuw wachtwoord voor je account. Minimaal 8 tekens.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimaal 8 tekens"
                required
                minLength={8}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Wachtwoord bevestigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Herhaal je wachtwoord"
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isPending || !newPassword || !confirmPassword}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opslaan...
                </>
              ) : (
                "Wachtwoord opslaan"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              <Link href={`/${locale}/login`} className="text-primary underline">
                Terug naar inloggen
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
