"use client"

import { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

const TabsContext = createContext<{ active: string; setActive: (v: string) => void }>({
  active: "",
  setActive: () => {},
})

export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string
  children: React.ReactNode
  className?: string
}) {
  const [active, setActive] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex border-b border-border", className)}>{children}</div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { active, setActive } = useContext(TabsContext)
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
        active === value
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { active } = useContext(TabsContext)
  if (active !== value) return null
  return <div className={className}>{children}</div>
}
