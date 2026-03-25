import { Skeleton } from "@/components/ui/skeleton"

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Formulier velden */}
      <div className="space-y-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}

        {/* Kleurpicker veld */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Logo upload veld */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>

        {/* Opslaan knop */}
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
    </div>
  )
}
