"use client"

import { useState } from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { PageActions } from "@/components/dashboard/page-actions"
import { BulkActionsBar } from "@/components/dashboard/bulk-actions-bar"
import { notify } from "@/lib/toast"

type PageRecord = {
  id: string
  title: string
  slug: string
  status: string
  locale: string
  isHomePage: boolean
  updatedAt: Date
}

type PagesListClientProps = {
  pages: PageRecord[]
  locale: string
}

export function PagesListClient({ pages, locale }: PagesListClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const allSelected = pages.length > 0 && selectedIds.length === pages.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < pages.length

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(pages.map((p) => p.id))
    }
  }

  function handleBulkPublish() {
    notify.info(`${selectedIds.length} pagina('s) worden gepubliceerd...`)
    setSelectedIds([])
  }

  function handleBulkUnpublish() {
    notify.info(`${selectedIds.length} pagina('s) worden gedepubliceerd...`)
    setSelectedIds([])
  }

  function handleBulkDelete() {
    if (!confirm(`Weet je zeker dat je ${selectedIds.length} pagina('s) wilt verwijderen?`)) return
    notify.info(`${selectedIds.length} pagina('s) worden verwijderd...`)
    setSelectedIds([])
  }

  return (
    <>
      {/* Select all header */}
      <div className="flex items-center gap-3 px-4 py-1">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={toggleSelectAll}
        />
        <span className="text-xs text-muted-foreground">
          {selectedIds.length > 0
            ? `${selectedIds.length} van ${pages.length} geselecteerd`
            : "Alles selecteren"}
        </span>
      </div>

      {/* Page list */}
      <div className="space-y-2">
        {pages.map((page) => {
          const isSelected = selectedIds.includes(page.id)

          return (
            <Card
              key={page.id}
              className={`surface-card rounded-[1.5rem] border-0 py-0 transition-colors ${
                isSelected ? "ring-2 ring-primary/30" : ""
              }`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelect(page.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/dashboard/pages/${page.id}/edit`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {page.title}
                      </Link>
                      {page.isHomePage && (
                        <Badge variant="secondary">Startpagina</Badge>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      /{page.slug} &middot; {page.locale}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={page.status === "published" ? "default" : "secondary"}
                  >
                    {page.status === "published" ? "Gepubliceerd" : "Concept"}
                  </Badge>
                  <PageActions pageId={page.id} status={page.status} locale={locale} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Bulk actions bar */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onPublish={handleBulkPublish}
        onUnpublish={handleBulkUnpublish}
        onDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds([])}
      />
    </>
  )
}
