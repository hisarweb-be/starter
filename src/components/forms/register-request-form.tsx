"use client"

import { useState, useTransition } from "react"

import { submitRegistrationRequestAction } from "@/app/actions/register"
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

export function RegisterRequestForm({
  eyebrow,
  title,
  description,
  registrationEnabled,
}: {
  eyebrow: string
  title: string
  description: string
  registrationEnabled: boolean
}) {
  const [result, setResult] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

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
            action={(formData) => {
              startTransition(async () => {
                const response = await submitRegistrationRequestAction({
                  name: String(formData.get("name") ?? ""),
                  email: String(formData.get("email") ?? ""),
                })
                setResult(response.message)
              })
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Naam</Label>
              <Input id="name" name="name" placeholder="Jouw naam" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@company.com" />
            </div>
            {!registrationEnabled ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Registratie staat momenteel uit. Je kan deze flow wel al testen en later activeren via de setup.
              </div>
            ) : null}
            {result ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                {result}
              </div>
            ) : null}
            <Button type="submit" className="w-full" disabled={isPending || !registrationEnabled}>
              {isPending ? "Verwerken..." : "Registratie aanvragen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
