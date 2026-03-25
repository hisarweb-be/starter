"use client"

import { useEffect, useState, useTransition } from "react"
import { Clock, RotateCcw } from "lucide-react"

import { listRevisionsAction, restoreRevisionAction } from "@/app/actions/pages"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Revision = {
  id: string
  pageId: string
  blocks: unknown
  createdBy: string | null
  createdAt: Date
}

type PageRevisionsProps = {
  pageId: string
  currentBlocks: unknown
  onRestore: (revisionId: string) => void
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return "zojuist"
  if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? "minuut" : "minuten"} geleden`
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "uur" : "uur"} geleden`
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "dag" : "dagen"} geleden`

  return new Date(date).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function countBlockChanges(revisionBlocks: unknown, currentBlocks: unknown): number {
  const revArr = Array.isArray(revisionBlocks) ? revisionBlocks : []
  const curArr = Array.isArray(currentBlocks) ? currentBlocks : []

  const maxLen = Math.max(revArr.length, curArr.length)
  let changes = 0

  for (let i = 0; i < maxLen; i++) {
    if (i >= revArr.length || i >= curArr.length) {
      changes++
    } else if (JSON.stringify(revArr[i]) !== JSON.stringify(curArr[i])) {
      changes++
    }
  }

  return changes
}

export function PageRevisions({ pageId, currentBlocks, onRestore }: PageRevisionsProps) {
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listRevisionsAction(pageId)
      .then((data) => {
        if (!cancelled) setRevisions(data)
      })
      .catch(() => {
        if (!cancelled) setRevisions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [pageId])

  function handleRestore(revisionId: string) {
    if (!confirm("Weet je zeker dat je deze revisie wilt herstellen?")) return
    startTransition(async () => {
      const result = await restoreRevisionAction(revisionId)
      if (result.success) {
        onRestore(revisionId)
      }
    })
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Revisies laden...</span>
        </div>
      </div>
    )
  }

  if (revisions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Geen revisies</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="h-4 w-4" />
        <span>Revisiegeschiedenis</span>
      </div>
      <div className="space-y-2">
        {revisions.map((revision) => {
          const blockChanges = countBlockChanges(revision.blocks, currentBlocks)
          return (
            <div
              key={revision.id}
              className={cn(
                "flex items-center justify-between rounded-lg border bg-card p-3 text-card-foreground"
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {formatRelativeTime(revision.createdAt)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {revision.createdBy ?? "Onbekend"}
                  {" \u2014 "}
                  {blockChanges === 0
                    ? "Geen wijzigingen t.o.v. huidig"
                    : `${blockChanges} ${blockChanges === 1 ? "blok" : "blokken"} gewijzigd`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 shrink-0"
                onClick={() => handleRestore(revision.id)}
                disabled={isPending}
                title="Herstellen"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Herstellen
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
