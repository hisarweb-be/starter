"use client"

import { useTransition } from "react"
import { AlertTriangle, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { stopImpersonatingAction } from "@/app/actions/impersonate"

export function ImpersonationBanner({ orgName }: { orgName: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleStop() {
    startTransition(async () => {
      await stopImpersonatingAction()
      router.push("/nl/admin/clients")
    })
  }

  return (
    <div className="flex items-center justify-between bg-amber-500 px-4 py-2 text-amber-950 text-sm font-medium">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>
          Je bekijkt het dashboard van: <strong>{orgName}</strong>
        </span>
      </div>
      <button
        onClick={handleStop}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1 text-xs text-white hover:bg-amber-700 disabled:opacity-50"
      >
        <X className="h-3 w-3" />
        {isPending ? "Stoppen..." : "Stoppen"}
      </button>
    </div>
  )
}
