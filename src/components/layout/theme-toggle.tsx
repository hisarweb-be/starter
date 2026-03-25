"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? resolvedTheme : "system"

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card/80 p-1 backdrop-blur">
      <Button
        size="icon-sm"
        variant={currentTheme === "light" ? "default" : "ghost"}
        onClick={() => setTheme("light")}
      >
        <Sun className="size-4" />
      </Button>
      <Button
        size="icon-sm"
        variant={currentTheme === "dark" ? "default" : "ghost"}
        onClick={() => setTheme("dark")}
      >
        <Moon className="size-4" />
      </Button>
      <Button
        size="icon-sm"
        variant={currentTheme === "system" ? "default" : "ghost"}
        onClick={() => setTheme("system")}
      >
        <Monitor className="size-4" />
      </Button>
    </div>
  )
}
