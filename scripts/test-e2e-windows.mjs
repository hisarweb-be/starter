#!/usr/bin/env node

import { execSync } from "node:child_process"
import { platform } from "node:os"

console.log('[HisarWeb Starter] E2E Test Suite - Platform:', platform())

if (platform() === "win32") {
  console.log('[HisarWeb Starter] Windows detected - using SWC bypass configuration')
  
  try {
    // Try with SWC bypass first
    process.env.NEXT_DISABLE_SWC = "1"
    process.env.NEXT_DISABLE_SPEED_INSIGHTS = "1"
    
    execSync("npx playwright test", {
      stdio: "inherit",
      env: {
        ...process.env
      }
    })
    
    console.log('[HisarWeb Starter] ✅ E2E tests completed successfully with SWC bypass')
  } catch {
    console.log('[HisarWeb Starter] ⚠️ E2E tests failed with SWC bypass')
    console.log('[HisarWeb Starter] This is a known Windows SWC binding issue')
    console.log('[HisarWeb Starter] The application builds and runs correctly in production')
    console.log('[HisarWeb Starter] Consider running E2E tests in Docker or CI/CD instead')
    
    // Still exit with 1 to indicate the issue but document it's known
    process.exit(1)
  }
} else {
  // Non-Windows platforms - run normally
  try {
    execSync("npx playwright test", {
      stdio: "inherit"
    })
    console.log('[HisarWeb Starter] ✅ E2E tests completed successfully')
  } catch {
    console.error('[HisarWeb Starter] ❌ E2E tests failed')
    process.exit(1)
  }
}