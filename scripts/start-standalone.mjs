import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const serverPath = path.join(process.cwd(), ".next", "standalone", "server.js")

if (!fs.existsSync(serverPath)) {
  console.error(
    '[HisarWeb Starter] Missing standalone build. Run "npm run build" before "npm run start".'
  )
  process.exit(1)
}

process.env.DATA_DIR ??= path.join(process.cwd(), "data")
process.env.NEXT_TELEMETRY_DISABLED ??= "1"

await import(pathToFileURL(serverPath).href)
