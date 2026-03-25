import path from "node:path"
import { defineConfig, devices } from "@playwright/test"

const port = Number(process.env.PORT ?? 3003)
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
    // Use dev server for Windows SWC compatibility
    command: "npm run dev",
    url: baseURL,
    timeout: 120_000, // Reduced timeout for dev server
    reuseExistingServer: false,
    env: {
      AUTH_TRUST_HOST: "true",
      DATABASE_URL: "postgresql://fake@localhost:5432/fake",
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      DATA_DIR: dataDir,
      NEXT_PUBLIC_APP_URL: baseURL,
      NEXTAUTH_URL: baseURL,
      NEXTAUTH_SECRET: "dev-nextauth-secret",
      NEXT_TELEMETRY_DISABLED: "1",
      PAYLOAD_SECRET: "dev-payload-secret",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
