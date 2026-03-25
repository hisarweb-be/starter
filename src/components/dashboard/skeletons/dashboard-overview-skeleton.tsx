import { Skeleton } from "@/components/ui/skeleton"

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stat kaarten (4 stuks, 2 kolommen) */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-row items-center gap-4 rounded-[1.6rem] bg-card p-6"
          >
            <Skeleton className="h-10 w-10 rounded-[1rem]" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>

      {/* Recente activiteit / Aan de slag sectie */}
      <div className="rounded-[1.8rem] bg-card p-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[1.3rem] border border-border/60 bg-card/70 p-4"
            >
              <Skeleton className="h-3 w-12" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
