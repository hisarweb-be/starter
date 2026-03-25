import { expect, test } from "@playwright/test"

import {
  readStoredContactInquiries,
  resetAppData,
  writeInstalledWizardConfig,
} from "./helpers/data"

test.describe.configure({ mode: "serial" })

test.beforeEach(async () => {
  await resetAppData()
})

test("redirects root traffic to the Dutch homepage", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveURL(/\/nl$/)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Een website starter kit die WordPress-gemak combineert met Next\.js 15 power\./,
    })
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "Start setup flow" })).toBeVisible()
})

test("stores a contact inquiry through the public contact form", async ({ page }) => {
  await page.goto("/nl/contact")

  await page.getByLabel("Naam").fill("QA Agent")
  await page.getByLabel("Email").fill("qa@example.com")
  await page.getByLabel("Onderwerp").fill("Playwright intake")
  await page
    .getByLabel("Bericht")
    .fill("Dit is een end-to-end controle voor de contactflow van HisarWeb Starter.")

  await page.getByRole("button", { name: "Verstuur aanvraag" }).click()

  await expect(page.getByText(/Inquiry stored/i)).toBeVisible()

  await expect
    .poll(async () => {
      const inquiries = await readStoredContactInquiries()
      return inquiries[0]?.email ?? null
    })
    .toBe("qa@example.com")
})

test("locks the setup wizard after an installation exists", async ({ page }) => {
  await page.goto("/nl/setup")

  await expect(page.getByText("Configureer jouw starter in 8 stappen")).toBeVisible()

  await writeInstalledWizardConfig()

  await page.goto("/nl/setup")
  await expect(page).toHaveURL(/\/nl\/login\?callbackUrl=%2Fnl%2Fsetup/)
  await expect(page.getByLabel("Email")).toBeVisible()
})

test("redirects anonymous users away from setup when an install already exists", async ({ page }) => {
  await writeInstalledWizardConfig()

  await page.goto("/nl/setup")

  await expect(page).toHaveURL(/\/nl\/login\?callbackUrl=%2Fnl%2Fsetup/)
  await expect(page.getByLabel("Email")).toBeVisible()
})

test("allows admin login into the dashboard with the seeded credentials", async ({ page }) => {
  await writeInstalledWizardConfig()

  await page.goto("/nl/login")
  await page.getByLabel("Email").fill("admin@hisarweb.be")
  await page.getByLabel("Wachtwoord").fill("change-me-now")
  await page.getByRole("button", { name: "Aanmelden" }).click()

  await expect(page).toHaveURL(/\/nl\/dashboard/)
  await expect(page.getByText("Permission matrix")).toBeVisible()
  await expect(page.getByText("setup:manage")).toBeVisible()
})

test("renders tenant-specific runtime branding when x-tenant-id is provided", async ({ browser }) => {
  const context = await browser.newContext({
    extraHTTPHeaders: {
      "x-tenant-id": "growth",
    },
  })
  const page = await context.newPage()

  await page.goto("/en")

  await expect(page.getByText("HisarWeb Growth product foundation")).toBeVisible()
  await expect(page.getByText("Growth tenant active")).toBeVisible()

  await context.close()
})
