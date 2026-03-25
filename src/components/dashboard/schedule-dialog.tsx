"use client"

import { useState } from "react"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ScheduleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentScheduledAt?: string | null
  onSchedule: (date: string | null) => void
}

export function ScheduleDialog({
  open,
  onOpenChange,
  currentScheduledAt,
  onSchedule,
}: ScheduleDialogProps) {
  const [date, setDate] = useState(
    currentScheduledAt
      ? new Date(currentScheduledAt).toISOString().slice(0, 16)
      : ""
  )

  function handleSchedule() {
    if (!date) return
    onSchedule(new Date(date).toISOString())
    onOpenChange(false)
  }

  function handleRemoveSchedule() {
    onSchedule(null)
    onOpenChange(false)
  }

  const now = new Date().toISOString().slice(0, 16)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-[1.5rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Clock className="h-4 w-4 text-primary" />
            Publicatie inplannen
          </DialogTitle>
          <DialogDescription>
            Kies een datum en tijd waarop deze pagina automatisch gepubliceerd wordt.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="schedule-date" className="text-sm font-medium">
              Datum en tijd
            </Label>
            <Input
              id="schedule-date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={now}
              className="rounded-[0.75rem]"
            />
          </div>

          {currentScheduledAt && (
            <p className="text-xs text-muted-foreground">
              Huidig ingepland:{" "}
              <span className="font-medium text-foreground">
                {new Date(currentScheduledAt).toLocaleString("nl-NL", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </span>
            </p>
          )}

          <div className="flex gap-2">
            {currentScheduledAt && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveSchedule}
                className="rounded-full text-xs"
              >
                Planning verwijderen
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSchedule}
              disabled={!date}
              className="ml-auto rounded-full text-xs"
            >
              Inplannen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
