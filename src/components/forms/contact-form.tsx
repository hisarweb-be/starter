"use client"

import type { FormEvent } from "react"
import { useState, useTransition } from "react"

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
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [result, setResult] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    }

    setResult(null)

    startTransition(async () => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as {
        success: boolean
        message: string
      }

      setResult(result.message)

      if (result.success) {
        form.reset()
      }
    })
  }

  return (
    <Card className="border border-border/70 bg-card/95">
      <CardHeader>
        <CardTitle>Neem contact op</CardTitle>
        <CardDescription>
          Laat je gegevens achter. De aanvraag wordt opgeslagen en kan later via Resend verzonden worden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Naam</Label>
              <Input id="name" name="name" placeholder="Jouw naam" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@company.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Onderwerp</Label>
            <Input id="subject" name="subject" placeholder="Waar wil je hulp mee?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Bericht</Label>
            <Textarea id="message" name="message" rows={6} placeholder="Omschrijf kort je project of vraag" />
          </div>
          {result ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              {result}
            </div>
          ) : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Verzenden..." : "Verstuur aanvraag"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
