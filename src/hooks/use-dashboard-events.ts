"use client"

import { useEffect, useState, useRef } from "react"

export type DashboardStats = {
  pages: number
  media: number
  inquiries: number
  timestamp: number
}

export function useDashboardEvents() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [connected, setConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const es = new EventSource("/api/dashboard/events")
    eventSourceRef.current = es

    es.onopen = () => setConnected(true)

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as DashboardStats
        setStats(data)
      } catch {
        // Ignore malformed messages
      }
    }

    es.onerror = () => {
      setConnected(false)
    }

    return () => {
      es.close()
      eventSourceRef.current = null
      setConnected(false)
    }
  }, [])

  return { stats, connected }
}
