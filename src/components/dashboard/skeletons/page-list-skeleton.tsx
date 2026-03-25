import { Skeleton } from "@/components/ui/skeleton"

export function PageListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* Page rows */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-[1.5rem] bg-card p-4"
          >
            <div className="flex items-center gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-40" />
                  {i === 0 && <Skeleton className="h-5 w-20 rounded-full" />}
                </div>
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-24 rounded-full" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-8 w-8 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
