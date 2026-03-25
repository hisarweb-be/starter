import { env } from "@/lib/env"

export const databaseConfig = {
  provider: env.databaseUrl.startsWith("file:") ? "sqlite" : "postgresql",
  url: env.databaseUrl,
}
