"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  eyebrow,
  title,
  description,
  callbackUrl,
  providers = [],
}: {
  eyebrow: string
  title: string
  description: string
  callbackUrl: string
  providers?: Array<"google" | "github">
}) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl border border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            {eyebrow}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">{title}</CardTitle>
            <CardDescription className="text-base leading-7">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault()
              setError(null)
              setIsLoading(true)

              const formData = new FormData(event.currentTarget)
              const response = await signIn("credentials", {
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                redirect: false,
                callbackUrl,
              })

              setIsLoading(false)

              if (response?.error) {
                setError("Ongeldige admin gegevens. Voltooi eerst de setup wizard of gebruik de opgeslagen credentials.")
                return
              }

              window.location.href = callbackUrl
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@hisarweb.be" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" />
            </div>
            {error ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Aanmelden..." : "Aanmelden"}
            </Button>
          </form>

          {providers.length > 0 ? (
            <div className="mt-6 space-y-3 border-t pt-6">
              <p className="text-sm text-muted-foreground">Of meld aan met een externe provider</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {providers.map((provider) => (
                  <Button
                    key={provider}
                    variant="outline"
                    onClick={() => void signIn(provider, { callbackUrl })}
                  >
                    Continue with {provider}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
