"use client"

import { useState, useTransition } from "react"
import { useRouter, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/dashboard/page-header"
import { createPageAction } from "@/app/actions/pages"
import { slugify } from "@/lib/slugify"

export default function NewPagePage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) ?? "nl"
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [autoSlug, setAutoSlug] = useState(true)
  const [isPending, startTransition] = useTransition()

  function handleTitleChange(value: string) {
    setTitle(value)
    if (autoSlug) setSlug(slugify(value))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    startTransition(async () => {
      const page = await createPageAction({
        title,
        slug: slug || slugify(title),
        locale,
      })
      router.push(`/${locale}/dashboard/pages/${page.id}/edit`)
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nieuwe pagina"
        description="Maak een nieuwe pagina aan voor je website."
      />

      <form onSubmit={handleSubmit}>
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Pagina details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="bijv. Over ons"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setAutoSlug(false)
                    setSlug(slugify(e.target.value))
                  }}
                  placeholder="over-ons"
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending || !title.trim()}>
              {isPending ? "Aanmaken..." : "Pagina aanmaken"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
