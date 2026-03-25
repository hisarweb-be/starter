import fs from "node:fs"
import path from "node:path"

const rootDataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data")
const standaloneDataDir = path.join(process.cwd(), ".next", "standalone", "data")

for (const target of [rootDataDir, standaloneDataDir]) {
  fs.rmSync(target, { recursive: true, force: true })
}
