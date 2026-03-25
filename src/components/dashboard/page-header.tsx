import type { ReactNode } from "react"

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="surface-panel flex items-start justify-between gap-4 rounded-[1.75rem] px-5 py-5 sm:px-6">
      <div className="space-y-2">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
          Dashboard control
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
