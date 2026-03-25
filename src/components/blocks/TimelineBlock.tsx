import { Circle } from "lucide-react"

import type { TimelineBlockData } from "./types"

export function TimelineBlockComponent({ title, events }: TimelineBlockData) {
  if (!events?.length) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-16">
        {title && <h2 className="mb-12 text-center font-display text-3xl font-bold">{title}</h2>}
        <div className="rounded-3xl border-2 border-dashed py-12 text-center text-muted-foreground">
          Geen gebeurtenissen beschikbaar
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16">
      {title && <h2 className="mb-12 text-center font-display text-3xl font-bold">{title}</h2>}

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 h-[calc(100%-16px)] w-px bg-border" />

        <div className="space-y-8">
          {events.map((event, index) => (
            <div key={index} className="relative flex gap-6 pl-2">
              {/* Dot */}
              <div className="relative z-10 mt-1.5 flex-shrink-0">
                <Circle
                  className="h-4 w-4 fill-primary text-primary"
                />
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {event.date}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold">{event.title}</h3>
                {event.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
