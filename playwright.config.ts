import path from "node:path"

import { defineConfig, devices } from "@playwright/test"

const port = Number(process.env.PORT ?? 3001)
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`
const dataDir = path.join(process.cwd(), "data")

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run data:reset && npm run build && npm run start:e2e",
    url: baseURL,
    timeout: 300_000, // Extended timeout for Windows SWC issues
    reuseExistingServer: false,
    env: {
      AUTH_TRUST_HOST: "true",
      DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/hisarweb",
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      DATA_DIR: dataDir,
      NEXT_PUBLIC_APP_URL: baseURL,
      NEXTAUTH_URL: baseURL,
      NEXTAUTH_SECRET: "dev-nextauth-secret",
      NEXT_TELEMETRY_DISABLED: "1",
      PAYLOAD_SECRET: "dev-payload-secret",
      // Windows SWC workarounds
      NEXT_DISABLE_SWC: "1",
      NEXT_DISABLE_SPEED_INSIGHTS: "1",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
