import { NextResponse } from "next/server"
import { prisma } from "@/lib/server/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const start = Date.now()
  let dbStatus: "ok" | "error" = "ok"

  try {
    await (prisma as unknown as { $queryRaw: (query: TemplateStringsArray) => Promise<unknown> }).$queryRaw`SELECT 1`
  } catch {
    dbStatus = "error"
  }

  const status = dbStatus === "ok" ? "ok" : "degraded"
  const responseTime = Date.now() - start

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "1.0.0",
      responseTimeMs: responseTime,
      checks: { database: dbStatus },
    },
    { status: status === "ok" ? 200 : 503 }
  )
}
