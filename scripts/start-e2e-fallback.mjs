import fs from "node:fs"
import path from "node:path"
import { spawn } from "node:child_process"

const serverPath = path.join(process.cwd(), ".next", "standalone", "server.js")

if (!fs.existsSync(serverPath)) {
  console.error(
    '[HisarWeb Starter] Missing standalone build. Run "npm run build" before E2E tests.'
  )
  process.exit(1)
}

// Environment setup
process.env.DATA_DIR ??= path.join(process.cwd(), "data")
process.env.HOSTNAME ??= "127.0.0.1"
process.env.PORT ??= "3001"
process.env.NEXT_TELEMETRY_DISABLED ??= "1"

// Bypass SWC on Windows by using Node.js directly with --no-experimental-wasm-modules
const isWindows = process.platform === "win32"

if (isWindows) {
  console.log('[HisarWeb Starter] Windows detected - using SWC bypass for E2E server')
  
  // Start server with SWC workarounds
  const child = spawn("node", [
    "--no-experimental-wasm-modules",
    "--max-old-space-size=4096", 
    serverPath
  ], {
    stdio: "inherit",
    env: {
      ...process.env,
      // Force disable SWC
      "NEXT_DISABLE_SWC": "1",
      // Use Babel fallback
      "NEXT_DISABLE_SPEED_INSIGHTS": "1"
    }
  })
  
  process.on("SIGINT", () => {
    child.kill("SIGINT")
  })
  
  process.on("SIGTERM", () => {
    child.kill("SIGTERM") 
  })
} else {
  // Non-Windows: use the standard import method
  const { pathToFileURL } = await import("node:url")
  await import(pathToFileURL(serverPath).href)
}