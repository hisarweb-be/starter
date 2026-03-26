import "server-only"

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
  prismaPool?: Pool
}

const pool =
  globalForPrisma.prismaPool ??
  (new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/hisarweb",
    connectionTimeoutMillis: 5000,
    max: 3,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any)

// Prevent uncaught pool errors from crashing the process (e.g. during CI builds)
pool.on("error", () => {
  // Silently handled — connection errors are caught by withPersistenceFallback
})

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaPool = pool
}

export async function isPrismaAvailable() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
