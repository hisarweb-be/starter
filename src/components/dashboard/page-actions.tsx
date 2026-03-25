"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Eye, EyeOff, Trash2, Copy, Clock } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { publishPageAction, unpublishPageAction, deletePageAction, duplicatePageAction } from "@/app/actions/pages"

type PageActionsProps = {
  pageId: string
  status: string
  locale: string
  scheduledAt?: Date | null
}

export function PageActions({ pageId, status, locale, scheduledAt }: PageActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handlePublish() {
    startTransition(async () => {
      if (status === "published") {
        await unpublishPageAction(pageId)
      } else {
        await publishPageAction(pageId)
      }
      router.refresh()
    })
  }

  function handleDelete() {
    if (!confirm("Weet je zeker dat je deze pagina wilt verwijderen?")) return
    startTransition(async () => {
      await deletePageAction(pageId)
      router.refresh()
    })
  }

  function handleDuplicate() {
    startTransition(async () => {
      await duplicatePageAction(pageId)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1">
      {scheduledAt && (
        <span title={`Ingepland: ${new Date(scheduledAt).toLocaleString("nl-NL")}`}>
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
      )}
      <Link href={`/${locale}/dashboard/pages/${pageId}/edit`}>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handlePublish}
        disabled={isPending}
        title={status === "published" ? "Depubliceren" : "Publiceren"}
      >
        {status === "published" ? (
          <EyeOff className="h-3.5 w-3.5" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleDuplicate}
        disabled={isPending}
        title="Dupliceer"
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        onClick={handleDelete}
        disabled={isPending}
        title="Verwijderen"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
